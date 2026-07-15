# htmldrop — MCP server for publishing HTML

This is the htmldrop MCP server (htmldrop.link). It lets an agent publish an HTML artifact and receive a public URL. The MCP tool name is `publish_html`.

## Service endpoints

| Endpoint | URL |
|----------|-----|
| Landing page | https://htmldrop.link/ |
| MCP (Streamable HTTP) | `POST https://htmldrop.link/mcp` |
| REST API | `POST https://htmldrop.link/publish` |
| This file | https://htmldrop.link/agents.md |

## Connect as an MCP client

The server speaks MCP over **Streamable HTTP** (stateless) — POST each JSON-RPC
message to `/mcp`. No session handshake or `sessionId` is required. The response
is returned as `application/json`, or as a `text/event-stream` `message` event
if you send `Accept: text/event-stream`.

```text
POST https://htmldrop.link/mcp
Content-Type: application/json
Accept: application/json, text/event-stream

{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-03-26","capabilities":{},"clientInfo":{"name":"agent","version":"1.0"}}}
```

Then send `tools/list` and `tools/call` the same way. Most MCP clients handle
this automatically — see the README for one-line setup (Claude Code, Cursor, …).

## Available tool

### `publish_html`

Publish HTML or Markdown and get a public link. Markdown is rendered into a
clean reader page server-side.

**Schema**

```json
{
  "name": "publish_html",
  "description": "Publish an HTML or markdown artifact to a public URL",
  "inputSchema": {
    "type": "object",
    "properties": {
      "html": { "type": "string", "description": "HTML content to publish" },
      "markdown": { "type": "string", "description": "Markdown content to publish; rendered to a reader page" },
      "title": { "type": "string", "description": "Title used for social cards and metadata" },
      "ttl_days": { "type": "number", "description": "Days until the artifact expires" },
      "password": { "type": "string", "description": "Optional password to protect the artifact" },
      "owner_key": { "type": "string", "description": "Optional owner key for higher rate limits and longer TTL" }
    },
    "required": ["html"]
  }
}
```

**Example call**

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "publish_html",
    "arguments": {
      "html": "<h1>Hello world</h1>",
      "title": "Demo",
      "ttl_days": 7
    }
  }
}
```

**Example response**

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "content": [
      {
        "type": "text",
        "text": "{\"url\":\"https://<subdomain>.htmldrop.link\",\"id\":\"...\",\"expires_at\":\"2026-07-02T...\"}"
      }
    ]
  }
}
```

The response text is a JSON string. Parse it once to access `url`, `id`, and `expires_at`.

### Other formats (REST)

`POST /publish/raw` accepts raw bodies of `text/html`, `text/markdown`,
`text/plain`, `application/json`, `text/csv`, `application/pdf`, and
`image/*` (png, jpeg, gif, webp, svg). Text formats render into a reader
page; PDF and images are stored and served verbatim. Pass a title via the
`x-htmldrop-title` header or `?title=` query parameter.

## REST fallback

If you cannot use MCP, make a regular HTTP request:

```bash
curl -X POST https://htmldrop.link/publish \
  -H "Content-Type: application/json" \
  -d '{"html":"<h1>Hello</h1>","title":"Demo","ttl_days":7}'
```

Response:

```json
{
  "url": "https://<subdomain>.htmldrop.link",
  "id": "...",
  "subdomain": "...",
  "expires_at": "2026-07-02T..."
}
```

## Important notes

- The returned URL is volatile. Content expires automatically based on `ttl_days`.
- All artifacts include `X-Robots-Tag: noindex, nofollow, noarchive`.
- Pass an `owner_key` for higher rate limits and longer default TTL.
- Ask for a fresh URL if the page returns 404 (expired) or 401 (password protected).
