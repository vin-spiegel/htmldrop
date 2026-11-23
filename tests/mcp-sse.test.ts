import request from 'supertest';
import { describe, it, expect, beforeEach } from 'vitest';
import express from 'express';
import { mcpStreamableHandler } from '../src/mcp-sse';

describe('MCP /mcp initialize', () => {
  let app: express.Express;

  beforeEach(() => {
    app = express();
    app.post('/mcp', express.json(), async (req, res) => {
      await mcpStreamableHandler(req, res, req.body);
    });
  });

  const initialize = (params: Record<string, unknown>) =>
    request(app)
      .post('/mcp')
      .send({
        jsonrpc: '2.0',
        id: 1,
        method: 'initialize',
        params: { capabilities: {}, clientInfo: { name: 'test-client', version: '1.0.0' }, ...params },
      });

  it('echoes a supported protocolVersion', async () => {
    const res = await initialize({ protocolVersion: '2025-03-26' });

    expect(res.status).toBe(200);
    expect(res.body.result.protocolVersion).toBe('2025-03-26');
    expect(res.headers['mcp-session-id']).toBeDefined();
  });

  it('echoes the newest supported protocolVersion', async () => {
    const res = await initialize({ protocolVersion: '2025-06-18' });

    expect(res.status).toBe(200);
    expect(res.body.result.protocolVersion).toBe('2025-06-18');
  });

  it('falls back to a supported protocolVersion when the requested one is unknown', async () => {
    const res = await initialize({ protocolVersion: 'banana' });

    expect(res.status).toBe(200);
    expect(res.body.result.protocolVersion).toBe('2025-03-26');
  });

  it('falls back to a supported protocolVersion when protocolVersion is missing', async () => {
    const res = await initialize({});

    expect(res.status).toBe(200);
    expect(res.body.result.protocolVersion).toBe('2025-03-26');
  });

  it('reports the server capabilities and info on initialize', async () => {
    const res = await initialize({ protocolVersion: '2025-03-26' });

    expect(res.body.result.capabilities).toEqual({ tools: {} });
    expect(res.body.result.serverInfo).toEqual({ name: 'htmldrop', version: '0.1.0' });
  });
});
