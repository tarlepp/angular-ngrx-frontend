# Stage 1: Dependencies
FROM node:24.3.0-bullseye AS dependencies

WORKDIR /app

COPY package.json yarn.lock version.js ./

RUN yarn install

# Stage 2: Development
FROM node:24.3.0-slim AS development

# Let's use bash as a default shell with login each time
SHELL ["/bin/bash", "--login", "-c"]

# Update package list and install necessary libraries
RUN apt-get update \
    && apt-get install -y \
        bash \
        bash-completion \
        curl \
        fish \
        git \
        jq \
        locales \
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

ENV LANG en_US.UTF-8
ENV LANGUAGE en_US:en
ENV LC_ALL en_US.UTF-8

WORKDIR /app

# Copy source code to container
COPY . .

# Add necessary stuff to bash autocomplete
RUN echo 'source /usr/share/bash-completion/bash_completion' >> /etc/bash.bashrc \
    && curl https://raw.githubusercontent.com/dsifford/yarn-completion/master/yarn-completion.bash >> /etc/bash.bashrc \
    && printf '\nNG_COMMANDS="add build config doc e2e generate help lint new run serve test update version xi18n"\ncomplete -W "$NG_COMMANDS" ng\n' >> /etc/bash.bashrc

# Link `ng` command, set entrypoint with `x` mark and install `ncu` and `mversion` tools
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

RUN fish -c 'curl -sL git.io/fisher | source && fisher install jorgebucaran/fisher' \
    && fish -c 'fisher install jorgebucaran/nvm.fish'

COPY ./docker/fish /home/node/.config/fish/

USER root

RUN chmod 777 -R /home/node /tmp \
    && rm -rf /tmp/fish.node

USER node

# Add necessary stuff to bash autocomplete
ENV PATH "$PATH:/home/node/.local/bin"
ENV XDG_RUNTIME_PATH /home/node/.tmp

RUN echo 'eval "$(thefuck --alias)"' >> /home/node/.bashrc

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
FROM nginx:mainline-alpine-slim AS production

# Copy nginx configuration and build application inside the final container
COPY --from=builder /app/docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist/angular-frontend /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

# Final stage selection based on build argument
FROM ${TARGET:-development}
