# Installing htmldrop (for Cline and other MCP clients)

htmldrop is a **hosted** MCP server — there is nothing to clone, build, or run
locally. You add one remote SSE endpoint and you are done.

## Add the server

Add htmldrop to your MCP settings (for Cline, `cline_mcp_settings.json`):

```json
{
  "mcpServers": {
    "htmldrop": {
      "url": "https://htmldrop.link/mcp",
      "type": "sse"
    }
  }
}
```

No API key or environment variables are required for the free tier. (An
optional `x-htmldrop-key` header unlocks higher rate limits and longer TTLs,
but it is not needed to get started.)

## What you get

htmldrop exposes a single tool:

- **`publish_html`** — publish HTML or Markdown content (or fetch a remote URL)
  and get back a shareable link. Optional `title`, `ttl_days`, and `password`.

Try it: ask the agent to *"publish this as a shareable link"* after producing a
report, dashboard, chart, or demo. It calls `publish_html` and returns a URL on
its own subdomain (e.g. `https://happy-otter-42.htmldrop.link`) with an
auto-generated social preview card. Links expire by default and are served
`noindex`.

## Self-hosting (optional)

To publish to your own domain/storage instead, run the npm package as a local
stdio server — see the [README](https://github.com/vin-spiegel/htmldrop#readme).
