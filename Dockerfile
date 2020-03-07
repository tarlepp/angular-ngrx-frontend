FROM node:13.10.1 as build

RUN npm install -g @angular/cli@9.0.5

COPY ./ /src/

WORKDIR /src/

RUN yarn \
    && yarn build-prod

FROM nginx:mainline-alpine

COPY --from=build /src/docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /src/dist/angular-frontend /usr/share/nginx/html
