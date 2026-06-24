export function landingPageHtml(): string {
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
    --paper: #fffaf0;
    --ink: #1e1e24;
    --pencil: #4b4b55;
    --accent: #ff6b6b;
    --accent-2: #4ea8de;
    --highlight: #ffd166;
    --line: #1e1e24;
    --card: #ffffff;
    --shadow: rgba(30,30,36,0.08);
  }
  * { box-sizing: border-box; }
  html { scroll-behavior: smooth; }
  body {
    margin: 0;
    padding: 0;
    font-family: 'Comic Neue', 'Comic Sans MS', 'Chalkboard SE', 'Patrick Hand', system-ui, sans-serif;
    background: var(--paper);
    color: var(--ink);
    line-height: 1.65;
    background-image: radial-gradient(#e8e0d5 1.2px, transparent 1.2px);
    background-size: 24px 24px;
  }
  .doodle-border {
    border: 2.5px solid var(--line);
    border-radius: 255px 15px 225px 15px / 15px 225px 15px 255px;
    box-shadow: 6px 6px 0 var(--shadow);
  }
  .wiggle:hover { transform: rotate(-1deg) translateY(-2px); }
  .scribble-underline {
    position: relative;
    display: inline-block;
  }
  .scribble-underline::after {
    content: '';
    position: absolute;
    left: -4px; right: -4px; bottom: 2px;
    height: 8px;
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 10' preserveAspectRatio='none'%3E%3Cpath d='M0 8 Q 15 2, 30 7 T 60 6 T 100 5' fill='none' stroke='%23ffd166' stroke-width='5' stroke-linecap='round'/%3E%3C/svg%3E") center/contain no-repeat;
    z-index: -1;
  }
  header {
    max-width: 980px;
    margin: 0 auto;
    padding: 4.5rem 1.5rem 2rem;
    text-align: center;
  }
  .brand {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    transform: rotate(-2deg);
  }
  .pin-icon {
    width: 64px; height: 64px;
  }
  h1 {
    font-size: clamp(2.8rem, 8vw, 4.6rem);
    margin: 0;
    letter-spacing: -0.03em;
    line-height: 1.05;
  }
  .tagline {
    font-size: clamp(1.15rem, 3vw, 1.45rem);
    color: var(--pencil);
    max-width: 540px;
    margin: 1rem auto 2rem;
  }
  .cta-row { display: flex; flex-wrap: wrap; justify-content: center; gap: 0.75rem; }
  .btn {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    background: var(--accent);
    color: #fff;
    text-decoration: none;
    padding: 0.85rem 1.6rem;
    border: 2.5px solid var(--line);
    border-radius: 255px 15px 225px 15px / 15px 225px 15px 255px;
    font-weight: 700;
    font-size: 1.05rem;
    box-shadow: 4px 4px 0 var(--shadow);
    transition: transform 0.12s ease;
  }
  .btn:hover { transform: rotate(-1.5deg) translateY(-2px); }
  .btn.secondary { background: var(--card); color: var(--ink); }
  .btn.blue { background: var(--accent-2); }
  main { max-width: 980px; margin: 0 auto; padding: 0 1.5rem 4rem; }
  .hero {
    background: var(--card);
    padding: 2.25rem;
    margin-bottom: 2.5rem;
    text-align: center;
    position: relative;
  }
  .hero h2 { margin-top: 0; font-size: clamp(1.4rem, 4vw, 1.9rem); }
  .hero p { color: var(--pencil); max-width: 560px; margin: 0 auto 1.25rem; }
  .endpoint-row { display: flex; flex-wrap: wrap; justify-content: center; gap: 0.5rem; margin-bottom: 1rem; }
  .endpoint {
    display: inline-block;
    background: #f7f3eb;
    border: 2px dashed var(--line);
    padding: 0.55rem 0.95rem;
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    border-radius: 12px;
    font-size: 0.9rem;
  }
  .code-block {
    background: #282830;
    color: #f4f1ea;
    padding: 1.25rem;
    border-radius: 18px;
    overflow-x: auto;
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 0.88rem;
    line-height: 1.55;
    margin: 1rem auto 0;
    max-width: 640px;
    border: 2px solid var(--line);
    box-shadow: 4px 4px 0 var(--shadow);
    text-align: left;
  }
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 1.5rem;
    margin-top: 1rem;
  }
  .card {
    background: var(--card);
    padding: 1.5rem;
    transition: transform 0.12s ease;
  }
  .card:hover { transform: translateY(-3px) rotate(-0.5deg); }
  .card h3 { margin-top: 0; font-size: 1.2rem; display: flex; align-items: center; gap: 0.5rem; }
  .card p { color: var(--pencil); margin-bottom: 0.75rem; }
  .card-icon {
    width: 32px; height: 32px; flex-shrink: 0;
  }
  .mcp-banner {
    background: linear-gradient(135deg, #e7f5ff 0%, #fff 100%);
    border: 2.5px solid var(--line);
    border-radius: 24px;
    padding: 1.5rem;
    margin: 2.5rem 0;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    box-shadow: 6px 6px 0 var(--shadow);
  }
  .mcp-banner h3 { margin: 0; font-size: 1.3rem; }
  .mcp-banner p { margin: 0.25rem 0 0; color: var(--pencil); }
  footer {
    text-align: center;
    padding: 2rem 1rem 3rem;
    color: var(--pencil);
    font-size: 0.9rem;
  }
  footer a { color: var(--pencil); }
  @media (max-width: 520px) {
    .hero { padding: 1.5rem; }
    .mcp-banner { text-align: center; justify-content: center; }
  }
</style>
</head>
<body>
<header>
  <div class="brand">
    <svg class="pin-icon" viewBox="0 0 64 64" aria-hidden="true">
      <circle cx="32" cy="32" r="28" fill="#ff6b6b" stroke="#1e1e24" stroke-width="3"/>
      <circle cx="32" cy="24" r="8" fill="#fff" stroke="#1e1e24" stroke-width="2.5"/>
      <path d="M32 32 L32 54" stroke="#1e1e24" stroke-width="3" stroke-linecap="round"/>
      <path d="M24 48 L40 44" stroke="#1e1e24" stroke-width="3" stroke-linecap="round"/>
    </svg>
    <h1>Pin</h1>
  </div>
  <p class="tagline">Agent-native HTML publishing.<br>One API call from idea to shareable link.</p>
  <div class="cta-row">
    <a class="btn" href="#try">Try the API</a>
    <a class="btn secondary" href="/agents.md" target="_blank">agents.md</a>
    <a class="btn blue" href="https://github.com/vin-spiegel/pin-publish" target="_blank" rel="noopener">GitHub</a>
  </div>
</header>

<main>
  <section class="hero doodle-border" id="try">
    <h2><span class="scribble-underline">POST your HTML</span>, get a link.</h2>
    <p>Publish reports, dashboards, charts, demos, and any rendered artifact an agent creates — with optional passwords, TTL, and social cards.</p>
    <div class="endpoint-row">
      <span class="endpoint">POST /publish</span>
      <span class="endpoint">POST /publish/raw</span>
      <span class="endpoint">POST /publish/from-url</span>
    </div>
    <div class="code-block">curl -X POST https://${process.env.BASE_DOMAIN || 'your-domain'}/publish \\
  -H "Content-Type: application/json" \\
  -d '{"html":"&lt;h1&gt;Hello agents&lt;/h1&gt;","title":"Demo"}'</div>
  </section>

  <section class="mcp-banner wiggle">
    <div>
      <h3>🔌 MCP Server at <code>/mcp</code></h3>
      <p>Any MCP-compatible client can connect via SSE and call <code>pin_publish</code> directly.</p>
    </div>
    <a class="btn blue" href="/agents.md">Connect</a>
  </section>

  <section class="grid">
    <article class="card doodle-border">
      <h3><svg class="card-icon" viewBox="0 0 32 32" aria-hidden="true"><rect x="4" y="10" width="24" height="14" rx="3" fill="none" stroke="#1e1e24" stroke-width="2"/><path d="M8 14 L16 20 L24 14" fill="none" stroke="#4ea8de" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg> MCP over SSE</h3>
      <p>Expose <code>pin_publish</code> as a tool. Agents publish instantly without learning a bespoke API.</p>
    </article>
    <article class="card doodle-border">
      <h3><svg class="card-icon" viewBox="0 0 32 32" aria-hidden="true"><rect x="3" y="7" width="26" height="20" rx="3" fill="#ffd166" stroke="#1e1e24" stroke-width="2"/><circle cx="12" cy="16" r="3" fill="#ff6b6b"/><path d="M26 12 L29 12 L29 24 L26 24" fill="none" stroke="#1e1e24" stroke-width="2"/></svg> Social Cards</h3>
      <p>Automatic Open Graph + Twitter Cards. HTML without images gets a generated 1200×630 PNG preview.</p>
    </article>
    <article class="card doodle-border">
      <h3><svg class="card-icon" viewBox="0 0 32 32" aria-hidden="true"><path d="M6 26 L26 26 L24 12 L8 12 Z" fill="none" stroke="#1e1e24" stroke-width="2" stroke-linejoin="round"/><path d="M11 12 L11 8 L21 8 L21 12" fill="none" stroke="#1e1e24" stroke-width="2"/><circle cx="16" cy="19" r="3" fill="none" stroke="#4ea8de" stroke-width="2"/></svg> Fast & Stateless</h3>
      <p>Files live on Cloudflare R2 or local disk. Scales horizontally. No database required.</p>
    </article>
    <article class="card doodle-border">
      <h3><svg class="card-icon" viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="11" fill="none" stroke="#1e1e24" stroke-width="2"/><path d="M16 10 L16 16 L21 19" fill="none" stroke="#ff6b6b" stroke-width="2.5" stroke-linecap="round"/><path d="M23 6 L25 8" stroke="#1e1e24" stroke-width="2" stroke-linecap="round"/></svg> TTL & Safeguards</h3>
      <p>Rate limits, optional passwords, noindex robots tags, and configurable expiration keep things sane.</p>
    </article>
  </section>
</main>

<footer>
  Built for agents · <a href="/agents.md">agents.md</a> · <a href="https://github.com/vin-spiegel/pin-publish">GitHub</a>
</footer>
</body>
</html>`;
}
