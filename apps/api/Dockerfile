# syntax=docker/dockerfile:1.7

# 1) Install only what API (and its internal workspace deps) need
FROM node:20-bookworm-slim AS deps
WORKDIR /app
ENV PNPM_HOME=/root/.local/share/pnpm
ENV PATH=$PNPM_HOME:$PATH
RUN corepack enable

# Copy lockfiles and package manifests used to resolve deps
COPY pnpm-lock.yaml package.json pnpm-workspace.yaml ./
COPY apps/api/package.json apps/api/
# If API imports internal workspace packages at runtime, copy their package.json too:
COPY packages/env-node/package.json packages/env-node/
COPY packages/constants/package.json packages/constants/
COPY packages/types/package.json packages/types/
# Install ONLY api and its transitive workspace deps
RUN pnpm install --filter @errorferret/api... --frozen-lockfile

# 2) Build API (tsc)
FROM node:20-bookworm-slim AS build
WORKDIR /app
ENV PNPM_HOME=/root/.local/share/pnpm
ENV PATH=$PNPM_HOME:$PATH
RUN corepack enable
# Bring node_modules from deps stage (so tsc can resolve everything)
COPY --from=deps /app/node_modules ./node_modules
# Bring full repo sources for building
COPY . .
# Build only API (and any internal packages it depends on)
RUN pnpm -r --filter @errorferret/api... run build

# 3) Runtime image: copy dist + node_modules
FROM node:20-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
# Put built JS exactly under /app/dist
COPY --from=build /app/apps/api/dist ./dist
# Copy production node_modules from deps
COPY --from=deps /app/apps/api/node_modules ./node_modules
# Minimal package file (not strictly required, but handy)
COPY apps/api/package.json ./
EXPOSE 3000
CMD ["node", "dist/index.js"]