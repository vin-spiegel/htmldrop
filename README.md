# htmldrop

**Publish HTML for agents — one API call, MCP server included.**

htmldrop turns any HTML artifact into a shareable link in seconds. Reports,
dashboards, charts, demos — anything an agent (or a human) creates. No git, no
build, no dashboard.

**Hosted service: [htmldrop.link](https://htmldrop.link)** — drag & drop an
HTML file, paste HTML source, or POST to the API.

## How it works

```bash
curl -X POST https://htmldrop.link/publish \
  -H "Content-Type: application/json" \
  -d '{"html":"<h1>Hello agents</h1>","title":"Demo"}'
```

```json
{
  "url": "https://happy-otter-42.htmldrop.link",
  "id": "...",
  "subdomain": "happy-otter-42",
  "expires_at": "2026-07-17T00:00:00.000Z"
}
```

Every link gets its own subdomain, an auto-generated Open Graph preview card,
and a TTL — shared artifacts don't live forever.

## MCP server

Connect any MCP client over Server-Sent Events:

```json
{
  "mcpServers": {
    "htmldrop": {
      "url": "https://htmldrop.link/mcp"
    }
  }
}
```

The server exposes one tool, `publish_html`:

| Argument | Type | Description |
|----------|------|-------------|
| `html` | string | HTML content to publish (or use `url`) |
| `url` | string | Remote HTML page to fetch and publish |
| `title` | string | Optional title for metadata and social cards |
| `ttl_days` | number | Days until the artifact expires |
| `password` | string | Optional password protection |
| `owner_key` | string | Optional key for higher limits and longer TTL |

Full agent-facing docs live in [AGENTS.md](AGENTS.md), also served at
[htmldrop.link/agents.md](https://htmldrop.link/agents.md).

## REST API

| Endpoint | Body | Notes |
|----------|------|-------|
| `POST /publish` | JSON `{ html, title, ttl_days, password, url }` | Primary endpoint |
| `POST /publish/raw` | raw `text/html` body | Title via `x-htmldrop-title` header or `?title=` |
| `POST /publish/from-url` | JSON `{ url, title, ttl_days, password }` | Fetches and republishes a page |

Pass an owner key in the `x-htmldrop-key` header for higher rate limits and a
longer default TTL. (`x-pin-key` is still accepted for backwards compatibility.)

## Self-hosting

```bash
git clone https://github.com/vin-spiegel/htmldrop.git
cd htmldrop
pnpm install
cp .env.example .env   # defaults work out of the box
pnpm dev               # http://localhost:3000
```

Storage falls back to the local filesystem when Cloudflare R2 is not
configured — no database, scales horizontally.

### Environment variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3000` | HTTP port |
| `BASE_DOMAIN` | `localhost` | Base domain for artifact subdomains |
| `CLOUDFLARE_R2_*` | — | Optional R2 storage (endpoint, keys, bucket) |
| `ANON_TTL_DAYS` | `7` | TTL for anonymous publishes |
| `KEY_TTL_DAYS` | `30` | TTL for keyed publishes |
| `MAX_HTML_SIZE_BYTES` | `26214400` | Upload cap (25 MB) |
| `RATE_LIMIT_ANON_PER_MINUTE` | `10` | Per-IP rate limit |
| `RATE_LIMIT_KEY_PER_MINUTE` | `60` | Per-key rate limit |

Production needs a wildcard DNS record (`*.your-domain`) pointing at the
server so artifact subdomains resolve.

### Deploy to Railway

```bash
railway login
railway init --name htmldrop
railway up
```

Then set `BASE_DOMAIN` and (optionally) the R2 variables in the Railway
dashboard, and attach your domain plus its wildcard.

## Safety defaults

- Artifacts are served with `X-Robots-Tag: noindex, nofollow, noarchive`
- Per-IP and per-key rate limits
- Everything expires via TTL
- Optional password protection per artifact

See [SECURITY.md](SECURITY.md) for vulnerability and abuse reporting.

## Development

```bash
pnpm dev        # run with tsx
pnpm test       # vitest
pnpm run build  # tsc -> dist/
```

## License

[MIT](LICENSE)
