# Pin — Agent-native HTML publishing

Pin lets any AI agent publish an HTML artifact to a public URL with a single tool call. No git, no build, no dashboard.

## What it does

- `POST /publish { html, title, ttl_days, password } -> { url, id, expires_at }`
- Returns a random-word subdomain like `happy-otter-42.pin.app`
- Built-in TTL, password protection, noindex headers, anonymous + key-holder tiers

## Quickstart for agents

Use the MCP server to publish directly from a compatible agent:

```json
{
  "mcpServers": {
    "pin-publish": {
      "command": "npx",
      "args": ["-y", "pin-publish@vin-spiegel/pin-publish", "dist/mcp-server.js"]
    }
  }
}
```

Or run the HTTP server:

```bash
git clone https://github.com/vin-spiegel/pin-publish.git
cd pin-publish
npm install
npm run build
npm start
```

Then POST to `http://localhost:3000/publish`.

## MCP tool

### `pin_publish`

Input:

```json
{
  "html": "<h1>My report</h1><p>...</p>",
  "title": "Optional title",
  "ttl_days": 14,
  "password": "optional-secret",
  "owner_key": "optional-owner-key"
}
```

Output:

```
Published!

URL: https://happy-otter-42.pin.app
ID: <uuid>
Expires: 2025-01-14T00:00:00.000Z
```

## Configuration

Copy `.env.example` to `.env` and set the values:

```bash
PORT=3000
BASE_DOMAIN=pin.app

# Cloudflare R2 (optional, falls back to filesystem if not set)
CLOUDFLARE_R2_ENDPOINT=https://<accountid>.r2.cloudflarestorage.com
CLOUDFLARE_R2_ACCESS_KEY_ID=<access-key>
CLOUDFLARE_R2_SECRET_ACCESS_KEY=<secret>
CLOUDFLARE_R2_BUCKET_NAME=pin-artifacts
CLOUDFLARE_R2_PUBLIC_URL=https://pub-<hash>.r2.dev

# Cloudflare API (for DNS automation)
CLOUDFLARE_API_TOKEN=<token>

# Tier settings
ANON_TTL_DAYS=7
KEY_TTL_DAYS=30
MAX_HTML_SIZE_BYTES=26214400
RATE_LIMIT_ANON_PER_MINUTE=10
RATE_LIMIT_KEY_PER_MINUTE=60
```

## Agents.md

This repo is shipped with an `agents.md` file. Load it in any agent that supports project instructions to give it the full context and MCP usage pattern.

## Deploy to Railway

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template?template=https://github.com/vin-spiegel/pin-publish)

Or from the Railway CLI:

```bash
railway login
railway init --name pin-publish
railway up
```

Set the environment variables in Railway dashboard after deploy.

## License

MIT
