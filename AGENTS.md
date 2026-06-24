# Pin — Agent-native HTML publishing layer

You are contributing to Pin: a service that lets AI agents publish HTML artifacts to public URLs with a single tool call.

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

- `src/index.ts` — HTTP server
- `src/mcp-server.ts` — MCP server (stdio transport), exposes `pin_publish`
- `src/routes.ts` — Express routes
- `src/publish.ts` — publishing logic
- `src/storage.ts` — Storage abstraction with R2 and filesystem backends
- `src/config.ts` — environment config

## MCP usage

When running the MCP server, agents can call:

```json
{
  "name": "pin_publish",
  "arguments": {
    "html": "<h1>...</h1>",
    "title": "My report",
    "ttl_days": 14,
    "password": "secret",
    "owner_key": "owner-key"
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
