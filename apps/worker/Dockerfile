FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json apps/api/
RUN corepack enable && pnpm install --filter @errorferret/api...

FROM node:20-alpine AS build
WORKDIR /app
COPY . .
RUN corepack enable && pnpm -r build

FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/apps/api/dist ./dist
COPY apps/api/package.json ./
CMD ["node", "dist/index.js"]