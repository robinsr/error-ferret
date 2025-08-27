FROM node:20-alpine AS build
WORKDIR /app
COPY . .
RUN corepack enable && pnpm -r build

FROM nginx:alpine
COPY apps/web/dist/ /usr/share/nginx/html/