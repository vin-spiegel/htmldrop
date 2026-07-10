import {
  CallToolRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { publishArtifact } from './publish';
import { FilesystemStorage, R2Storage } from './storage';
import { isR2Configured } from './config';

export const PUBLISH_TOOL = {
  name: 'publish_html',
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
        description: 'Optional custom TTL in days. Anonymous tier defaults to 7 days.',
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

export async function handleCall(request: {
  params: {
    name: string;
    arguments?: Record<string, unknown>;
  };
}) {
  if (request.params.name !== 'publish_html') {
    throw new Error(`Unknown tool: ${request.params.name}`);
  }

  const args = request.params.arguments || {};

  try {
    let html = '';
    let sourceUrl: string | undefined;
    if (args.url && !args.html) {
      const response = await fetch(String(args.url), { headers: { 'User-Agent': 'htmldrop-mcp/0.1' } });
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
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return {
      content: [{ type: 'text', text: `Error: ${message}` }],
      isError: true,
    };
  }
}
