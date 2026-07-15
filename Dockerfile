# Builds htmldrop. Railway deploys this image and starts the web server via the
# railway.toml startCommand (`pnpm start` -> dist/index.js); Glama's MCP
# inspector uses the default CMD (dist/mcp-server.js). Both run from the same
# compiled dist/, which the build fills with the server, the static Astro
# landing (dist/landing), and AGENTS.md.
FROM node:22-slim AS build
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY tsconfig.json astro.config.mjs AGENTS.md ./
COPY src ./src
COPY web ./web
COPY scripts ./scripts
RUN pnpm run build

FROM node:22-slim
WORKDIR /app
ENV NODE_ENV=production
RUN corepack enable
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod
COPY --from=build /app/dist ./dist
CMD ["node", "dist/mcp-server.js"]
