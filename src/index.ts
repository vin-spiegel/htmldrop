import 'dotenv/config';
import express from 'express';
import { createRouter } from './routes';
import { FilesystemStorage, R2Storage } from './storage';
import { config, isR2Configured } from './config';
import { mcpGetHandler, mcpPostHandler } from './mcp-sse';

const app = express();

const storage = isR2Configured() ? new R2Storage() : new FilesystemStorage();
const router = createRouter(storage);

app.set('trust proxy', true);

// Landing page at root
app.get('/', (req, res) => {
  res.set('Cache-Control', 'public, max-age=300');
  res.status(200).send(landingPageHtml());
});

// MCP over SSE at /mcp
app.get('/mcp', (req, res) => {
  mcpGetHandler(req, res);
});
app.post('/mcp', express.json(), async (req, res) => {
  await mcpPostHandler(req, res, req.body);
});

// Rest of the API and viewer routes
app.use('/', router);

app.listen(config.port, () => {
  console.log(`Pin running on port ${config.port}`);
  console.log(`Storage: ${isR2Configured() ? 'R2' : 'filesystem'}`);
});

function landingPageHtml(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Pin — Agent-native HTML publishing</title>
<meta name="description" content="Publish HTML reports, dashboards, and visualizations with a single API call.">
<meta property="og:title" content="Pin — Agent-native HTML publishing">
<meta property="og:description" content="POST HTML, get a link. MCP server included.">
<meta property="og:type" content="website">
<meta name="twitter:card" content="summary_large_image">
<style>
  :root {
    --bg: #fffcf7;
    --ink: #1d1d1f;
    --accent: #ff6b35;
    --accent-2: #35a8ff;
    --line: #1d1d1f;
    --muted: #6b6b6e;
    --card: #ffffff;
  }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    padding: 0;
    font-family: 'Comic Sans MS', 'Chalkboard SE', 'Comic Neue', system-ui, sans-serif;
    background: var(--bg);
    color: var(--ink);
    line-height: 1.6;
  }
  .doodle-border {
    border: 3px solid var(--line);
    border-radius: 255px 15px 225px 15px / 15px 225px 15px 255px;
    box-shadow: 4px 4px 0 rgba(0,0,0,0.08);
  }
  header {
    max-width: 960px;
    margin: 0 auto;
    padding: 4rem 1.5rem 2rem;
    text-align: center;
  }
  .logo {
    font-size: 4rem;
    margin: 0;
    display: inline-block;
    transform: rotate(-3deg);
  }
  h1 {
    font-size: 3rem;
    margin: 0.5rem 0 0.25rem;
    letter-spacing: -0.04em;
  }
  .tagline {
    font-size: 1.35rem;
    color: var(--muted);
    max-width: 560px;
    margin: 0 auto 2rem;
  }
  main {
    max-width: 960px;
    margin: 0 auto;
    padding: 0 1.5rem 4rem;
  }
  .hero-card {
    background: var(--card);
    padding: 2rem;
    margin-bottom: 2rem;
    text-align: center;
  }
  .hero-card h2 {
    margin-top: 0;
    font-size: 1.75rem;
  }
  .endpoint {
    display: inline-block;
    background: #f4f1ea;
    border: 2px dashed var(--line);
    padding: 0.75rem 1.25rem;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    border-radius: 12px;
    margin: 0.25rem;
    word-break: break-all;
  }
  .code-block {
    background: #1d1d1f;
    color: #f4f1ea;
    padding: 1.25rem;
    border-radius: 18px;
    overflow-x: auto;
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 0.9rem;
    line-height: 1.5;
    margin: 1rem 0;
  }
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 1.5rem;
    margin-top: 2rem;
  }
  .feature {
    background: var(--card);
    padding: 1.5rem;
  }
  .feature h3 {
    margin-top: 0;
    font-size: 1.25rem;
  }
  .btn {
    display: inline-block;
    background: var(--accent);
    color: #fff;
    text-decoration: none;
    padding: 0.85rem 1.5rem;
    border: 3px solid var(--line);
    border-radius: 255px 15px 225px 15px / 15px 225px 15px 255px;
    font-weight: 700;
    font-size: 1rem;
    margin: 0.5rem 0.25rem 0;
    box-shadow: 3px 3px 0 rgba(0,0,0,0.12);
    transition: transform 0.1s ease;
  }
  .btn:hover { transform: translateY(-2px) rotate(-1deg); }
  .btn.secondary {
    background: var(--accent-2);
  }
  footer {
    text-align: center;
    padding: 2rem 1rem 3rem;
    color: var(--muted);
    font-size: 0.9rem;
  }
  @media (max-width: 520px) {
    h1 { font-size: 2.25rem; }
    .logo { font-size: 3rem; }
  }
</style>
</head>
<body>
<header>
  <div class="logo">📌</div>
  <h1>Pin</h1>
  <p class="tagline">Agent-native HTML publishing. One API call from idea to shareable link.</p>
  <a class="btn" href="/agents.md">Agents.md</a>
  <a class="btn secondary" href="https://github.com/vin-spiegel/pin-publish" target="_blank" rel="noopener">GitHub</a>
</header>

<main>
  <section class="hero-card doodle-border">
    <h2>POST your HTML, get a link.</h2>
    <p>Perfect for reports, dashboards, charts, and any rendered artifact an agent produces.</p>
    <div>
      <span class="endpoint">POST /publish</span>
      <span class="endpoint">POST /publish/raw</span>
      <span class="endpoint">POST /publish/from-url</span>
    </div>
    <div class="code-block">
curl -X POST https://pin-publish-production.up.railway.app/publish \\
  -H "Content-Type: application/json" \\
  -d '{"html":"&lt;h1&gt;Hello agents&lt;/h1&gt;","title":"Demo"}'
    </div>
  </section>

  <section class="grid">
    <article class="feature doodle-border">
      <h3>🔌 MCP Server</h3>
      <p>Expose <code>pin_publish</code> as an MCP tool at <code>/mcp</code> so any compatible agent can publish instantly.</p>
      <span class="endpoint">GET/POST /mcp</span>
    </article>
    <article class="feature doodle-border">
      <h3>🖼️ Social Cards</h3>
      <p>Automatic Open Graph + Twitter Cards. HTML without images gets a generated 1200×630 PNG preview.</p>
      <span class="endpoint">/og/:subdomain.png</span>
    </article>
    <article class="feature doodle-border">
      <h3>⚡ Fast & Stateless</h3>
      <p>Files live on Cloudflare R2 (or local disk). Server scales horizontally. No database required.</p>
    </article>
    <article class="feature doodle-border">
      <h3>🔒 Safeguards</h3>
      <p>Rate limits, optional passwords, noindex robots tags, and configurable TTL keep things sane.</p>
    </article>
  </section>
</main>

<footer>
  Built for agents · <a href="/agents.md">agents.md</a> · <a href="https://github.com/vin-spiegel/pin-publish">GitHub</a>
</footer>
</body>
</html>`;
}
