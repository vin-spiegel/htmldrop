# Builds the htmldrop MCP server (stdio transport) for registry inspection
# (e.g. Glama). The htmldrop.link web service deploys via Nixpacks per
# railway.json, so this Dockerfile does not affect Railway.
FROM node:20-slim AS build
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY tsconfig.json ./
COPY src ./src
RUN pnpm run build

FROM node:20-slim
WORKDIR /app
ENV NODE_ENV=production
RUN corepack enable
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod
COPY --from=build /app/dist ./dist
CMD ["node", "dist/mcp-server.js"]
