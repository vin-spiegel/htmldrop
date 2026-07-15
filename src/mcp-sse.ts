import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import { IncomingMessage, ServerResponse } from 'http';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { PUBLISH_TOOL, handleCall } from './mcp-handlers';

export interface McpSession {
  transport: SSEServerTransport;
  server: Server;
}

const sessions = new Map<string, McpSession>();

// The /mcp SSE endpoint is unauthenticated (any agent may connect), so cap the
// live session map to keep a flood of open connections from exhausting memory.
const MAX_SESSIONS = 200;

export function getMcpSessions(): ReadonlyMap<string, McpSession> {
  return sessions;
}

export function mcpGetHandler(req: IncomingMessage, res: ServerResponse) {
  if (sessions.size >= MAX_SESSIONS) {
    res.writeHead(503);
    res.end('MCP server busy, try again later');
    return;
  }
  const transport = new SSEServerTransport('/mcp', res);
  const server = new Server(
    { name: 'htmldrop', version: '0.1.0' },
    { capabilities: { tools: {} } }
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: [PUBLISH_TOOL] }));
  server.setRequestHandler(CallToolRequestSchema, async (request) => handleCall(request));

  const sessionId = transport.sessionId;
  sessions.set(sessionId, { transport, server });

  server.connect(transport).catch((err) => {
    sessions.delete(sessionId);
    console.error('MCP SSE connection error:', err);
  });

  res.on('close', () => {
    sessions.delete(sessionId);
    server.close().catch(() => {});
  });
}

export async function mcpPostHandler(req: IncomingMessage, res: ServerResponse, parsedBody?: unknown) {
  const sessionId = new URL(req.url || '', `http://${req.headers.host}`).searchParams.get('sessionId');
  if (!sessionId || !sessions.has(sessionId)) {
    res.writeHead(404);
    res.end('MCP session not found');
    return;
  }
  const session = sessions.get(sessionId)!;
  await session.transport.handlePostMessage(req, res, parsedBody);
}

/**
 * Stateless Streamable HTTP transport for `POST /mcp` (no sessionId). This is
 * the current MCP transport that modern clients and registry scanners (e.g.
 * Smithery) expect; each POST carries one JSON-RPC message and gets one JSON
 * response. The legacy SSE transport above still works for existing clients.
 */
export async function mcpStreamableHandler(body: unknown, res: ServerResponse) {
  const json = (status: number, obj: unknown) => {
    res.writeHead(status, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(obj));
  };
  const msg = body as { jsonrpc?: string; id?: unknown; method?: string; params?: any };
  if (!msg || typeof msg !== 'object' || msg.jsonrpc !== '2.0' || typeof msg.method !== 'string') {
    json(400, { jsonrpc: '2.0', id: null, error: { code: -32600, message: 'Invalid Request' } });
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
      json(200, {
        jsonrpc: '2.0',
        id,
        result: {
          protocolVersion: typeof requested === 'string' ? requested : '2025-03-26',
          capabilities: { tools: {} },
          serverInfo: { name: 'htmldrop', version: '0.1.0' },
        },
      });
    } else if (method === 'tools/list') {
      json(200, { jsonrpc: '2.0', id, result: { tools: [PUBLISH_TOOL] } });
    } else if (method === 'tools/call') {
      const result = await handleCall({ params });
      json(200, { jsonrpc: '2.0', id, result });
    } else if (method === 'ping') {
      json(200, { jsonrpc: '2.0', id, result: {} });
    } else {
      json(200, { jsonrpc: '2.0', id, error: { code: -32601, message: `Method not found: ${method}` } });
    }
  } catch (err: unknown) {
    json(200, {
      jsonrpc: '2.0',
      id,
      error: { code: -32603, message: err instanceof Error ? err.message : String(err) },
    });
  }
}
