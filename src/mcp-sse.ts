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

export function getMcpSessions(): ReadonlyMap<string, McpSession> {
  return sessions;
}

export function mcpGetHandler(req: IncomingMessage, res: ServerResponse) {
  const transport = new SSEServerTransport('/mcp', res);
  const server = new Server(
    { name: 'pin-publish', version: '0.1.0' },
    { capabilities: { tools: {} } }
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: [PUBLISH_TOOL] }));
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    console.log('MCP tool call:', request.params.name, JSON.stringify(request.params.arguments)?.slice(0, 200));
    const result = await handleCall(request);
    console.log('MCP tool result:', JSON.stringify(result).slice(0, 200));
    return result;
  });

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
