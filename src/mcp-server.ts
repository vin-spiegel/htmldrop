#!/usr/bin/env node
import 'dotenv/config';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';
import { publishArtifact } from './publish.js';
import { FilesystemStorage, R2Storage } from './storage.js';
import { isR2Configured } from './config.js';

const BASE_URL = process.env.PIN_BASE_URL || 'http://localhost:3000';

const PUBLISH_TOOL: Tool = {
  name: 'pin_publish',
  description:
    'Publish an HTML artifact or fetch a remote HTML page and get a shareable URL. Useful for sharing reports, dashboards, visualizations, or any rendered HTML produced by an agent.',
  inputSchema: {
    type: 'object',
    properties: {
      html: {
        type: 'string',
        description: 'HTML content to publish. Provide either html or url.',
      },
      url: {
        type: 'string',
        description: 'URL of an HTML page to fetch and publish. Provide either html or url.',
      },
      title: {
        type: 'string',
        description: 'Optional page title for the published artifact.',
      },
      ttl_days: {
        type: 'number',
        description: 'Optional custom TTL in days. Free tier defaults to 7 days.',
      },
      password: {
        type: 'string',
        description: 'Optional password protection for the artifact.',
      },
      owner_key: {
        type: 'string',
        description: 'Optional owner key for higher limits and ownership.',
      },
    },
    anyOf: [{ required: ['html'] }, { required: ['url'] }],
  },
};

const storage = isR2Configured() ? new R2Storage() : new FilesystemStorage();

const server = new Server(
  { name: 'pin-publish', version: '0.1.0' },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [PUBLISH_TOOL],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name !== 'pin_publish') {
    throw new Error(`Unknown tool: ${request.params.name}`);
  }

  const args = request.params.arguments || {};

  let html = '';
  let sourceUrl: string | undefined;
  if (args.url && !args.html) {
    const response = await fetch(String(args.url), { headers: { 'User-Agent': 'Pin-Publish-MCP/0.1' } });
    if (!response.ok) throw new Error(`fetch failed: ${response.status}`);
    html = await response.text();
    sourceUrl = String(args.url);
  } else {
    html = String(args.html || '');
  }

  const result = await publishArtifact(
    {
      html,
      title: args.title ? String(args.title) : undefined,
      ttlDays: args.ttl_days ? Number(args.ttl_days) : undefined,
      password: args.password ? String(args.password) : undefined,
      ownerKey: args.owner_key ? String(args.owner_key) : undefined,
      sourceUrl,
    },
    storage
  );

  return {
    content: [
      {
        type: 'text',
        text: `Published!\n\nURL: ${result.url}\nID: ${result.id}\nExpires: ${result.expiresAt}`,
      },
    ],
  };
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  // Keep process alive
}

main();
