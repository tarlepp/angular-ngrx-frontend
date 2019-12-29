FROM nginx:mainline-alpine

COPY docker /etc/nginx/conf.d/default.conf

COPY ./dist/ /usr/share/nginx/html

RUN rm -rf /usr/share/nginx/html/env.js \
    && ln -s /secret/env.js /usr/share/nginx/html/env.jsDocker
