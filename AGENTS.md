# htmldrop — MCP server for publishing HTML

This is the htmldrop MCP server (htmldrop.link). It lets an agent publish an HTML artifact and receive a public URL. The MCP tool name is `publish_html`.

## Service endpoints

| Endpoint | URL |
|----------|-----|
| Landing page | https://htmldrop.link/ |
| HTTP/SSE MCP | `GET/POST https://htmldrop.link/mcp` |
| REST API | `POST https://htmldrop.link/publish` |
| This file | https://htmldrop.link/agents.md |

## Connect as an MCP client

Use HTTP/SSE. Connect to:

```text
GET https://htmldrop.link/mcp
```

Wait for the endpoint event:

```text
event: endpoint
data: /mcp?sessionId=<uuid>
```

All subsequent JSON-RPC messages go to:

```text
POST https://htmldrop.link/mcp?sessionId=<uuid>
Content-Type: application/json
```

## Available tool

### `publish_html`

Publish HTML and get a public link.

**Schema**

```json
{
  "name": "publish_html",
  "description": "Publish an HTML artifact to a public URL",
  "inputSchema": {
    "type": "object",
    "properties": {
      "html": { "type": "string", "description": "HTML content to publish" },
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
