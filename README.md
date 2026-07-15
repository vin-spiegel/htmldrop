<p align="center">
  <a href="https://htmldrop.link"><img src=".github/logo.svg" width="140" alt="htmldrop logo"></a>
</p>

<h1 align="center">htmldrop</h1>

<p align="center"><b>Publish anything for agents — one API call, MCP server included.</b></p>

<p align="center">
  <a href="https://htmldrop.link"><img src="https://img.shields.io/badge/htmldrop.link-live-e8503a" alt="htmldrop.link"></a>
  <a href="https://github.com/vin-spiegel/htmldrop/actions/workflows/ci.yml"><img src="https://github.com/vin-spiegel/htmldrop/actions/workflows/ci.yml/badge.svg" alt="CI"></a>
  <a href="https://www.npmjs.com/package/htmldrop-mcp"><img src="https://img.shields.io/npm/v/htmldrop-mcp" alt="npm"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="MIT"></a>
</p>

<p align="center">English · <a href="docs/README.ko.md">한국어</a> · <a href="docs/README.ja.md">日本語</a> · <a href="docs/README.zh-CN.md">简体中文</a> · <a href="docs/README.es.md">Español</a> · <a href="docs/README.fr.md">Français</a> · <a href="docs/README.de.md">Deutsch</a></p>

---

htmldrop turns any HTML, Markdown, PDF, or image artifact into a shareable
link in seconds. Reports, dashboards, charts, demos — anything an agent (or a
human) creates. Markdown/text/JSON render into a clean reader page; PDFs and
images are served as-is. No git, no build, no dashboard.

**Try it now: [htmldrop.link](https://htmldrop.link)** — drag & drop an HTML
file, paste HTML source, or POST to the API.

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

## Connect your agent (MCP)

The hosted MCP server lives at `https://htmldrop.link/mcp` (Streamable HTTP) and exposes
one tool: `publish_html`.

### Claude Code

```bash
claude mcp add --transport http htmldrop https://htmldrop.link/mcp
```

### Claude Desktop

Claude Desktop speaks stdio, so bridge to the hosted server with
[`mcp-remote`](https://www.npmjs.com/package/mcp-remote). In
`claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "htmldrop": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "https://htmldrop.link/mcp"]
    }
  }
}
```

### Cursor

Cursor connects to a remote MCP URL directly. In `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "htmldrop": { "url": "https://htmldrop.link/mcp" }
  }
}
```

### Codex CLI

In `~/.codex/config.toml`:

```toml
[mcp_servers.htmldrop]
command = "npx"
args = ["-y", "mcp-remote", "https://htmldrop.link/mcp"]
```

### Self-hosted instance (npm, stdio)

Running your own htmldrop? The [`htmldrop-mcp`](https://www.npmjs.com/package/htmldrop-mcp)
package is a local stdio MCP server that publishes to **your** storage and
domain:

```json
{
  "mcpServers": {
    "htmldrop": {
      "command": "npx",
      "args": ["-y", "htmldrop-mcp"],
      "env": {
        "BASE_DOMAIN": "your-domain.example",
        "CLOUDFLARE_R2_ENDPOINT": "...",
        "CLOUDFLARE_R2_ACCESS_KEY_ID": "...",
        "CLOUDFLARE_R2_SECRET_ACCESS_KEY": "...",
        "CLOUDFLARE_R2_BUCKET_NAME": "..."
      }
    }
  }
}
```

### `publish_html` tool

| Argument | Type | Description |
|----------|------|-------------|
| `html` | string | HTML content to publish (or use `markdown` / `url`) |
| `markdown` | string | Markdown content — rendered into a styled reader page |
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
| `POST /publish` | JSON `{ html \| markdown, title, ttl_days, password, url }` | Primary endpoint |
| `POST /publish/raw` | raw body: `text/html`, `text/markdown`, `text/plain`, `application/json`, `text/csv`, `application/pdf`, `image/*` | Title via `x-htmldrop-title` header or `?title=` |
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

**The only variable you need to set is `BASE_DOMAIN`.** Everything else has a
working default. Storage falls back to the local filesystem (`./data`) when no
object store is configured — no database required.

### Environment variables

| Variable | Default | Description |
|----------|---------|-------------|
| **`BASE_DOMAIN`** | `localhost` | **Base domain for artifact subdomains. The one value most self-hosters must set.** |
| `PORT` | `3000` | HTTP port (usually set by your host) |
| `NODE_ENV` | `development` | Set to `production` when deploying |
| `CLOUDFLARE_R2_ENDPOINT` | — | S3-compatible endpoint. Set all four R2 vars to use object storage; leave all blank for filesystem |
| `CLOUDFLARE_R2_ACCESS_KEY_ID` | — | Object-storage access key |
| `CLOUDFLARE_R2_SECRET_ACCESS_KEY` | — | Object-storage secret key |
| `CLOUDFLARE_R2_BUCKET_NAME` | — | Bucket name |
| `ANON_TTL_DAYS` | `7` | TTL for anonymous publishes |
| `KEY_TTL_DAYS` | `30` | TTL for keyed publishes |
| `MAX_HTML_SIZE_BYTES` | `26214400` | Upload cap (25 MiB) |
| `RATE_LIMIT_ANON_PER_MINUTE` | `10` | Per-IP rate limit |
| `RATE_LIMIT_KEY_PER_MINUTE` | `60` | Per-owner-key rate limit |

Any S3-compatible store works for the `CLOUDFLARE_R2_*` variables (Cloudflare
R2, AWS S3, MinIO, …). On ephemeral/container hosts, either use object storage
or mount a persistent volume at `./data`, or artifacts are lost on redeploy.

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

See [SECURITY.md](docs/SECURITY.md) for vulnerability and abuse reporting.

## Development

```bash
pnpm dev        # run with tsx
pnpm test       # vitest
pnpm run build  # tsc -> dist/
```

## License

[MIT](LICENSE)
