ARG TARGET=production

# Stage 1: Dependencies
FROM node:26.2.0-bullseye AS dependencies

WORKDIR /app

COPY package.json yarn.lock .yarnrc.yml version.js ./
COPY .yarn ./.yarn

ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0

RUN npm install -g corepack \
    && corepack enable \
    && corepack prepare "$(node -p "require('./package.json').packageManager")" --activate \
    && yarn install --immutable

# Stage 2: Development
FROM node:26.2.0-slim AS development

# Let's use bash as a default shell with login each time
SHELL ["/bin/bash", "--login", "-c"]

# Update package list and install necessary libraries
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        bash \
        bash-completion \
        curl \
        fish \
        git \
        jq \
        locales \
        make \
        nano \
        python3-dev \
        python3-pip \
        python3-setuptools \
        sudo \
        unzip \
    && rm -rf /var/lib/apt/lists/*

# Set the locale
RUN sed -i '/en_US.UTF-8/s/^# //g' /etc/locale.gen \
    && locale-gen

ENV LANG=en_US.UTF-8
ENV LANGUAGE=en_US:en
ENV LC_ALL=en_US.UTF-8
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0

RUN npm install -g corepack \
    && corepack enable

WORKDIR /app

# Copy source code to container
COPY . .

RUN corepack prepare "$(node -p "require('./package.json').packageManager")" --activate

# Add necessary stuff to bash autocomplete
RUN echo 'source /usr/share/bash-completion/bash_completion' >> /etc/bash.bashrc \
    && curl https://raw.githubusercontent.com/dsifford/yarn-completion/master/yarn-completion.bash >> /etc/bash.bashrc \
    && printf '\nNG_COMMANDS="add build config doc e2e generate help lint new run serve test update version xi18n"\ncomplete -W "$NG_COMMANDS" ng\n' >> /etc/bash.bashrc

# Link `ng` command and set entrypoint with executable permissions
RUN ln -s /app/node_modules/.bin/ng /usr/local/bin/ng \
    && chmod +x docker-entrypoint-dev.sh

# Add node user to sudo group and set password to `node`
RUN usermod -a -G sudo node \
    && usermod -p $(perl -e 'print crypt($ARGV[0], "password")' 'node') node \
    && echo 'node ALL=(ALL) ALL' >> /etc/sudoers

RUN mkdir -p /home/node/.config/fish/completions \
    && mkdir -p /home/node/.config/fish/functions \
    && mkdir -p /home/node/.local/share \
    && chmod 777 -R /home/node

USER node

RUN pip3 install thefuck --user --no-warn-script-location --break-system-packages

# thefuck 3.32 still imports deprecated `imp`; patch it for Python 3.13.
RUN python3 - <<'PY'
from pathlib import Path
import site

base = Path(site.getusersitepackages()) / 'thefuck'
compat = """from importlib.util import module_from_spec, spec_from_file_location

def load_source(name, path):
    spec = spec_from_file_location(name, path)
    if spec is None or spec.loader is None:
        raise ImportError(f\"Cannot load module {name!r} from {path!r}\")
    module = module_from_spec(spec)
    spec.loader.exec_module(module)
    return module

"""

for filename in ('conf.py', 'types.py'):
    path = base / filename
    if not path.exists():
        raise FileNotFoundError(path)
    text = path.read_text()
    if 'from imp import load_source\n' not in text:
        raise RuntimeError(f'Missing expected import in {path}')
    text = text.replace('from imp import load_source\n', compat, 1)
    path.write_text(text)
PY

RUN fish -c 'curl -sL git.io/fisher | source && fisher install jorgebucaran/fisher' \
    && fish -c 'fisher install jorgebucaran/nvm.fish'

COPY ./docker/fish /home/node/.config/fish/

USER root

RUN chmod 777 -R /home/node /tmp \
    && rm -rf /tmp/fish.node

USER node

# User environment
ENV PATH="$PATH:/home/node/.local/bin"
ENV XDG_RUNTIME_PATH=/home/node/.tmp

RUN echo 'if command -v thefuck >/dev/null 2>&1; then eval "$(thefuck --alias 2>/dev/null)" || true; fi' >> /home/node/.bashrc

# Expose port 4200 outside
EXPOSE 4200

# Set custom entrypoint for dev container
ENTRYPOINT ["/app/docker-entrypoint-dev.sh"]

# Stage 3: Builder
FROM dependencies AS builder

WORKDIR /app

# Copy source code
COPY . .

# Build the application
RUN yarn build-prod

# Stage 4: Production
FROM nginx:1.31.1-alpine-slim AS production

RUN apk update \
    && apk add --no-cache libcrypto3=3.5.7-r0 \
    && rm -rf /var/cache/apk/*

# Copy nginx configuration and build application inside the final container
COPY --from=builder /app/docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist/angular-frontend/browser /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
