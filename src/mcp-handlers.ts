import {
  CallToolRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { publishArtifact } from './publish';
import { markdownToHtml } from './markdown';
import { FilesystemStorage, R2Storage } from './storage';
import { isR2Configured } from './config';

export const PUBLISH_TOOL = {
  name: 'publish_html',
  description:
    'Publish an HTML or markdown artifact (or fetch a remote HTML page) and get a shareable URL. Markdown is rendered into a clean reader page. Useful for sharing reports, dashboards, visualizations, or any document produced by an agent.',
  inputSchema: {
    type: 'object',
    properties: {
      html: {
        type: 'string',
        description: 'HTML content to publish. Provide one of html, markdown, or url.',
      },
      markdown: {
        type: 'string',
        description:
          'Markdown content to publish; rendered into a styled reader page. Provide one of html, markdown, or url.',
      },
      url: {
        type: 'string',
        description: 'URL of an HTML page to fetch and publish. Provide one of html, markdown, or url.',
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
    anyOf: [{ required: ['html'] }, { required: ['markdown'] }, { required: ['url'] }],
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
    let title = args.title ? String(args.title) : undefined;
    let sourceUrl: string | undefined;
    if (args.url && !args.html && !args.markdown) {
      const response = await fetch(String(args.url), { headers: { 'User-Agent': 'htmldrop-mcp/0.1' } });
      if (!response.ok) throw new Error(`fetch failed: ${response.status}`);
      html = await response.text();
      sourceUrl = String(args.url);
    } else if (args.markdown && !args.html) {
      const rendered = markdownToHtml(String(args.markdown), title);
      html = rendered.html;
      title = rendered.title;
    } else {
      html = String(args.html || '');
    }

    const result = await publishArtifact(
      {
        html,
        title,
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
