# build stage
FROM node:22.16.0-alpine AS build

WORKDIR /app
RUN rm -rf node_modules
COPY . .
RUN yarn install
RUN yarn build

# run stage
FROM nginx:alpine

COPY --from=build /app/build /run 
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80 
CMD ["nginx", "-g", "daemon off;"] 
