FROM node:13.6.0 as build

RUN npm install -g @angular/cli@8.3.23

COPY ./ /src/

WORKDIR /src/

RUN yarn && \
    ng build --prod --build-optimizer --configuration=production

FROM nginx:mainline-alpine

COPY --from=build /src/docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /src/dist/angular-frontend /usr/share/nginx/html
