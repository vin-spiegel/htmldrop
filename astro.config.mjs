// @ts-check
import { defineConfig } from 'astro/config';

// The landing site is a static, per-locale build served by the existing
// Express app. Astro owns only the marketing pages under web/; the API, MCP
// endpoint, artifact subdomains, and /agents.md stay in the Express server.
export default defineConfig({
  site: 'https://htmldrop.link',
  srcDir: './web/src',
  outDir: './web/dist',
  publicDir: './web/public',
  build: { format: 'directory' },
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ko', 'ja', 'zh', 'es', 'fr', 'de'],
    routing: { prefixDefaultLocale: false },
  },
});
