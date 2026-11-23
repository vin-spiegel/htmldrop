import { IncomingMessage, ServerResponse } from 'http';
import { randomUUID } from 'crypto';
import { PUBLISH_TOOL, handleCall } from './mcp-handlers';

/**
 * MCP protocol revisions this endpoint speaks. The transport is stateless and
 * implements only `initialize`, `tools/list`, `tools/call` and `ping`, so it can
 * serve any of these revisions as-is.
 */
const SUPPORTED_PROTOCOL_VERSIONS = ['2025-06-18', '2025-03-26', '2024-11-05'];

/**
 * Version advertised when the client omits `protocolVersion` or asks for one we
 * do not speak — never echo back a revision this server does not support.
 */
const DEFAULT_PROTOCOL_VERSION = '2025-03-26';

/**
 * Stateless Streamable HTTP transport for the hosted MCP server at `POST /mcp`.
 *
 * This is the current MCP transport (it replaced the older HTTP+SSE transport).
 * Each request carries one JSON-RPC message and gets one response; there is no
 * session state — the single tool (`publish_html`) needs none — which keeps the
 * endpoint proxy- and registry-scanner-friendly. The response is framed as an
 * SSE `message` event when the client sent `Accept: text/event-stream` (what
 * Streamable HTTP clients do), otherwise as a plain JSON body.
 */
export async function mcpStreamableHandler(req: IncomingMessage, res: ServerResponse, body: unknown) {
  const wantsSse = String(req.headers['accept'] || '').includes('text/event-stream');
  const reply = (obj: unknown, extraHeaders: Record<string, string> = {}) => {
    if (wantsSse) {
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
        ...extraHeaders,
      });
      res.end(`event: message\ndata: ${JSON.stringify(obj)}\n\n`);
    } else {
      res.writeHead(200, { 'Content-Type': 'application/json', ...extraHeaders });
      res.end(JSON.stringify(obj));
    }
  };

  const msg = body as { jsonrpc?: string; id?: unknown; method?: string; params?: any };
  if (!msg || typeof msg !== 'object' || msg.jsonrpc !== '2.0' || typeof msg.method !== 'string') {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ jsonrpc: '2.0', id: null, error: { code: -32600, message: 'Invalid Request' } }));
    return;
  }

  // Notifications (no id), e.g. notifications/initialized — acknowledge only.
  if (msg.id === undefined || msg.id === null) {
    res.writeHead(202);
    res.end();
    return;
  }

  const { id, method, params } = msg;
  try {
    if (method === 'initialize') {
      const requested = params?.protocolVersion;
      const protocolVersion =
        typeof requested === 'string' && SUPPORTED_PROTOCOL_VERSIONS.includes(requested)
          ? requested
          : DEFAULT_PROTOCOL_VERSION;
      reply(
        {
          jsonrpc: '2.0',
          id,
          result: {
            protocolVersion,
            capabilities: { tools: {} },
            serverInfo: { name: 'htmldrop', version: '0.1.0' },
          },
        },
        { 'Mcp-Session-Id': randomUUID() }
      );
    } else if (method === 'tools/list') {
      reply({ jsonrpc: '2.0', id, result: { tools: [PUBLISH_TOOL] } });
    } else if (method === 'tools/call') {
      const result = await handleCall({ params });
      reply({ jsonrpc: '2.0', id, result });
    } else if (method === 'ping') {
      reply({ jsonrpc: '2.0', id, result: {} });
    } else {
      reply({ jsonrpc: '2.0', id, error: { code: -32601, message: `Method not found: ${method}` } });
    }
  } catch (err: unknown) {
    reply({
      jsonrpc: '2.0',
      id,
      error: { code: -32603, message: err instanceof Error ? err.message : String(err) },
    });
  }
}
