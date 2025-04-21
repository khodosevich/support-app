FROM node:20.5.0 as build

WORKDIR /app

WORKDIR /usr/app
COPY . /usr/app
RUN npm i
RUN npm run build

FROM nginx:alpine

COPY --from=build /usr/app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
