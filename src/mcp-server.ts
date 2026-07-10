#!/usr/bin/env node
import 'dotenv/config';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { PUBLISH_TOOL, handleCall } from './mcp-handlers.js';

const server = new Server(
  { name: 'htmldrop', version: '0.1.0' },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [PUBLISH_TOOL],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => handleCall(request));

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main();
