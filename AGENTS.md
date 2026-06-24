# Pin — Agent-native HTML publishing layer

You are contributing to Pin: a service that lets AI agents publish HTML artifacts to public URLs with a single tool call.

## Live service

- Landing page: https://pin-publish-production.up.railway.app/
- API base: https://pin-publish-production.up.railway.app
- HTTP MCP endpoint: `GET/POST https://pin-publish-production.up.railway.app/mcp`
- `agents.md`: https://pin-publish-production.up.railway.app/agents.md

## Project purpose

Pin fills the gap between AI agents generating rich HTML reports/dashboards and the consumption layer (Slack, email, chat) that cannot render HTML. Agents call Pin and get back a public URL.

Key principles:
- Zero config for the agent: POST html → receive URL
- Volatile by default: TTL-based expiration
- Guessable-URL privacy via random-word subdomains
- Optional password protection, owner keys, and rate limiting
- `noindex/nofollow/noarchive` headers

## Architecture

```
agent --(MCP / API)--> Pin API
                          ├── HTTP server (Express, subdomain-based serving)
                          ├── Storage: Cloudflare R2 when configured, else filesystem
                          └── Metadata: id, subdomain, expiresAt, ownerKey, password
```

## Entry points

- `src/index.ts` — HTTP server (landing page + wires MCP + API router)
- `src/mcp-server.ts` — MCP server (stdio transport), exposes `pin_publish`
- `src/mcp-sse.ts` — HTTP/SSE MCP transport at `/mcp`
- `src/mcp-handlers.ts` — Shared `pin_publish` tool implementation
- `src/routes.ts` — Express routes
- `src/publish.ts` — Publishing logic
- `src/storage.ts` — Storage abstraction with R2 and filesystem backends
- `src/config.ts` — Environment config

## MCP usage

### stdio transport

When running `src/mcp-server.ts`, agents can call:

```json
{
  "name": "pin_publish",
  "arguments": {
    "html": "<h1>...</h1>",
    "title": "My report",
    "ttl_days": 14
  }
}
```

### HTTP/SSE transport

Connect an SSE client to `GET https://<base>/mcp`. The server responds with:

```
event: endpoint
data: /mcp?sessionId=<uuid>
```

Then POST JSON-RPC requests to `POST https://<base>/mcp?sessionId=<uuid>`:

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/list"
}
```

Or call the tool:

```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "tools/call",
  "params": {
    "name": "pin_publish",
    "arguments": {
      "html": "<h1>Report</h1>",
      "title": "Report"
    }
  }
}
```

The tool returns a public URL, artifact ID, and expiration timestamp.

## Environment variables

See `.env.example`. Notable:

- `BASE_DOMAIN` — apex domain used in returned URLs (e.g. `pin.app`)
- `CLOUDFLARE_R2_*` — R2 credentials; leave empty to use local filesystem
- `ANON_TTL_DAYS` / `KEY_TTL_DAYS` — default TTL tiers
- `RATE_LIMIT_ANON_PER_MINUTE` / `RATE_LIMIT_KEY_PER_MINUTE`

## Coding conventions

- TypeScript, CommonJS output, strict mode
- Prefer explicit error messages
- Keep the MCP tool schema minimal and self-describing
- Don't store secrets in code

## Testing

```bash
npm run build
npm test
```

## Deployment targets

- Railway (primary)
- Cloudflare R2 for object storage (optional; filesystem fallback available)
