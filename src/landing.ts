export function landingPageHtml(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Pin — Publish HTML for agents</title>
<meta name="description" content="Publish HTML reports, dashboards, and visualizations with one API call.">
<meta property="og:title" content="Pin — Publish HTML for agents">
<meta property="og:description" content="POST HTML, get a link. MCP server included.">
<meta property="og:type" content="website">
<meta name="twitter:card" content="summary_large_image">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Gaegu:wght@400;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
  :root {
    --bg: #faf9f6;
    --paper: #ffffff;
    --ink: #1a1a1a;
    --muted: #6b6b6e;
    --accent: #ef4444;
    --accent-soft: rgba(239, 68, 68, 0.12);
    --blue: #2563eb;
    --blue-soft: rgba(37, 99, 235, 0.10);
    --line: #1a1a1a;
    --shadow: rgba(26, 26, 26, 0.06);
    --shadow-hover: rgba(26, 26, 26, 0.10);
  }
  * { box-sizing: border-box; }
  html { scroll-behavior: smooth; }
  body {
    margin: 0;
    padding: 0;
    font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
    background: var(--bg);
    color: var(--ink);
    line-height: 1.55;
    background-image: radial-gradient(#e4dfd5 0.7px, transparent 0.7px);
    background-size: 24px 24px;
  }
  .container { max-width: 1000px; margin: 0 auto; padding: 0 1.5rem; }

  /* Hand-drawn helpers */
  .doodle-border {
    border: 2px solid var(--line);
    border-radius: 255px 12px 225px 12px / 12px 225px 12px 255px;
    box-shadow: 5px 5px 0 var(--shadow);
    transition: box-shadow 0.15s ease, transform 0.15s ease;
  }
  .doodle-border:hover { box-shadow: 6px 6px 0 var(--shadow-hover); transform: translateY(-2px) rotate(-0.4deg); }

  h1, h2, h3, .hand { font-family: 'Gaegu', cursive; }

  /* Scribble underline draw-in */
  .scribble-underline { position: relative; display: inline; }
  .scribble-underline svg {
    position: absolute; left: -4px; right: -4px; bottom: -2px;
    width: calc(100% + 8px); height: 12px; overflow: visible; pointer-events: none;
  }
  .scribble-underline path {
    stroke: var(--accent); stroke-width: 5; fill: none; stroke-linecap: round;
    stroke-dasharray: 220; stroke-dashoffset: 220;
    animation: draw-underline 0.8s ease-out forwards; animation-delay: 0.4s;
  }
  @keyframes draw-underline { to { stroke-dashoffset: 0; } }

  /* Nav */
  nav { padding: 1.5rem 0 0.5rem; }
  .nav-inner { display: flex; align-items: center; justify-content: space-between; }
  .logo-mark { display: flex; align-items: center; gap: 0.5rem; font-family: 'Gaegu', cursive; font-weight: 700; font-size: 1.4rem; }
  .logo-pin { width: 30px; height: 30px; color: var(--accent); }
  .nav-links { display: flex; gap: 0.5rem; }
  .nav-links a {
    color: var(--muted); text-decoration: none; font-size: 0.9rem; font-weight: 600;
    padding: 0.4rem 0.9rem; border: 2px solid transparent; border-radius: 999px;
    transition: all 0.15s ease;
  }
  .nav-links a:hover { border-color: var(--line); color: var(--ink); transform: rotate(-1deg); }

  /* Hero */
  .hero { padding: 4rem 0 5rem; }
  .hero-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; align-items: center; }
  .hero h1 { font-size: clamp(3rem, 5.8vw, 4.6rem); line-height: 1.05; letter-spacing: 0.02em; margin: 0 0 1rem; }
  .tagline { font-size: 1.15rem; color: var(--muted); max-width: 420px; margin: 0 0 1.75rem; }
  .hero-actions { display: flex; flex-wrap: wrap; gap: 0.85rem; }
  .btn {
    display: inline-flex; align-items: center; gap: 0.4rem; text-decoration: none; font-weight: 600;
    font-size: 0.95rem; padding: 0.85rem 1.4rem; background: var(--paper); color: var(--ink);
    border: 2px solid var(--line); border-radius: 255px 12px 225px 12px / 12px 225px 12px 255px;
    box-shadow: 4px 4px 0 var(--shadow); transition: transform 0.15s ease, box-shadow 0.15s ease;
  }
  .btn:hover { transform: translateY(-2px) rotate(-0.8deg); box-shadow: 5px 5px 0 var(--shadow-hover); }
  .btn.primary { background: var(--accent); color: #fff; border-color: var(--accent); }
  .btn.blue { background: var(--blue); color: #fff; border-color: var(--blue); }

  .hero-art { position: relative; display: flex; align-items: center; justify-content: center; min-height: 320px; }
  .hero-art svg.main { width: 100%; max-width: 420px; height: auto; }
  .doodle-star { position: absolute; }
  .doodle-star.top { top: 6%; right: 2%; width: 34px; height: 34px; }
  .doodle-star.bottom { bottom: 18%; left: 4%; width: 26px; height: 26px; }
  .doodle-arrow { position: absolute; width: 60px; bottom: 2%; right: 4%; transform: rotate(-8deg); }

  /* API section */
  section { padding: 3.5rem 0; }
  .section-header { max-width: 560px; margin-bottom: 2rem; }
  .section-header h2 { font-size: clamp(1.8rem, 3.6vw, 2.6rem); margin: 0 0 0.5rem; }
  .section-header p { color: var(--muted); margin: 0; font-size: 1.05rem; }

  .endpoint-bar {
    background: var(--paper); padding: 1rem 1.25rem; display: flex; flex-wrap: wrap;
    gap: 0.5rem; align-items: center; margin-bottom: 1rem;
  }
  .endpoint-bar code {
    background: var(--accent-soft); color: var(--accent); padding: 0.35rem 0.65rem;
    border-radius: 8px; font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 0.82rem; font-weight: 700;
  }
  .endpoint-bar span { color: var(--muted); font-size: 0.9rem; }
  .code-card {
    background: var(--ink); color: #f7f7fa; padding: 1.25rem 1.5rem;
    border-radius: 18px; font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 0.85rem; line-height: 1.6; overflow-x: auto;
  }

  /* MCP banner */
  .mcp-banner {
    background: linear-gradient(135deg, var(--blue-soft) 0%, var(--paper) 100%);
    padding: 1.75rem 2rem; display: flex; flex-wrap: wrap;
    align-items: center; justify-content: space-between; gap: 1.25rem;
  }
  .mcp-banner h3 { margin: 0; font-size: 1.6rem; display: flex; align-items: center; gap: 0.5rem; }
  .mcp-banner p { margin: 0.3rem 0 0; color: var(--muted); }
  .mcp-banner .endpoint { font-family: ui-monospace, monospace; font-size: 0.85rem; color: var(--blue); font-weight: 700; }

  /* Features */
  .features { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.25rem; }
  .feature {
    background: var(--paper); padding: 1.5rem;
  }
  .feature h3 { margin: 0 0 0.4rem; font-size: 1.4rem; display: flex; align-items: center; gap: 0.5rem; }
  .feature p { margin: 0; color: var(--muted); font-size: 0.95rem; }
  .feature-icon {
    width: 38px; height: 38px; border-radius: 10px; display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; border: 2px solid var(--line);
  }
  .feature-icon.accent { background: var(--accent-soft); color: var(--accent); }
  .feature-icon.blue { background: var(--blue-soft); color: var(--blue); }
  .feature-icon.lemon { background: #fff3cd; color: var(--ink); }

  /* Steps */
  .steps { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }
  .step {
    text-align: center; padding: 1.5rem; background: var(--paper);
  }
  .step-num {
    display: inline-flex; align-items: center; justify-content: center;
    width: 38px; height: 38px; border-radius: 50%;
    background: var(--ink); color: #fff; font-family: 'Gaegu', cursive;
    font-size: 1.2rem; font-weight: 700; margin-bottom: 0.75rem;
  }
  .step h4 { margin: 0 0 0.3rem; font-family: 'Gaegu', cursive; font-size: 1.3rem; }
  .step p { margin: 0; color: var(--muted); font-size: 0.92rem; }

  /* Footer */
  footer { padding: 2.5rem 0; text-align: center; color: var(--muted); font-size: 0.9rem; font-family: 'Gaegu', cursive; }
  footer a { color: var(--muted); }
  footer a:hover { color: var(--ink); }

  @media (max-width: 900px) {
    .hero-grid { grid-template-columns: 1fr; }
    .hero { padding: 2.5rem 0 3.5rem; }
    .hero-art { order: -1; min-height: 260px; }
    .features, .steps { grid-template-columns: repeat(2, 1fr); }
  }
  @media (max-width: 560px) {
    .features, .steps { grid-template-columns: 1fr; }
    .endpoint-bar { flex-direction: column; align-items: flex-start; }
    .mcp-banner { text-align: center; justify-content: center; }
    .nav-links { display: none; }
  }
</style>
</head>
<body>
<div class="container">
  <nav>
    <div class="nav-inner">
      <div class="logo-mark">
        <svg class="logo-pin" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C8.13 2 5 5.13 5 9c0 4.17 3.93 8.11 5.63 9.63.33.29.37.8.37 1.37v.5c0 .28.22.5.5.5h1c.28 0 .5-.22.5-.5v-.5c0-.57.04-1.08.37-1.37C15.07 17.11 19 13.17 19 9c0-3.87-3.13-7-7-7z"/></svg>
        Pin
      </div>
      <div class="nav-links">
        <a href="#api">API</a>
        <a href="#mcp">MCP</a>
        <a href="/agents.md">agents.md</a>
        <a href="https://github.com/vin-spiegel/pin-publish" target="_blank" rel="noopener">GitHub</a>
      </div>
    </div>
  </nav>

  <header class="hero">
    <div class="hero-grid">
      <div>
        <h1>Publish HTML<br><span class="scribble-underline">in seconds<svg viewBox="0 0 180 12" preserveAspectRatio="none"><path d="M2 7 C 40 2, 70 10, 110 6 S 170 4, 178 9"/></svg></span>.</h1>
        <p class="tagline">Pin turns any HTML artifact into a public link with one API call. Reports, dashboards, charts, demos — anything an agent creates.</p>
        <div class="hero-actions">
          <a class="btn primary" href="#api">Try the API</a>
          <a class="btn" href="/agents.md">Read agents.md</a>
        </div>
      </div>
      <div class="hero-art">
        <svg class="main" viewBox="0 0 400 360" aria-hidden="true">
          <rect x="60" y="50" width="280" height="260" rx="24" fill="#fff" stroke="#1a1a1a" stroke-width="2.5"/>
          <rect x="60" y="87" width="280" height="2" fill="#1a1a1a" opacity="0.12"/>
          <circle cx="88" cy="70" r="5" fill="#ef4444" opacity="0.5"/>
          <circle cx="106" cy="70" r="5" fill="#f59e0b" opacity="0.8"/>
          <circle cx="124" cy="70" r="5" fill="#2563eb" opacity="0.4"/>
          <rect x="90" y="110" width="140" height="16" rx="8" fill="#ef4444" opacity="0.12"/>
          <rect x="90" y="140" width="190" height="12" rx="6" fill="#1a1a1a" opacity="0.08"/>
          <rect x="90" y="164" width="160" height="12" rx="6" fill="#1a1a1a" opacity="0.08"/>
          <g transform="translate(235, 185)">
            <circle cx="0" cy="0" r="44" fill="#ef4444" stroke="#1a1a1a" stroke-width="2.5"/>
            <circle cx="0" cy="-18" r="12" fill="#fff" stroke="#1a1a1a" stroke-width="2.5"/>
            <path d="M0 -6 L0 40" stroke="#1a1a1a" stroke-width="2.8" stroke-linecap="round"/>
            <path d="M-16 24 L16 16" stroke="#1a1a1a" stroke-width="2.8" stroke-linecap="round"/>
          </g>
          <path d="M110 240 Q 150 285, 205 265" fill="none" stroke="#2563eb" stroke-width="2.5" stroke-linecap="round"/>
          <circle cx="108" cy="236" r="5" fill="#f59e0b" stroke="#1a1a1a" stroke-width="1.5"/>
        </svg>
        <svg class="doodle-star top" viewBox="0 0 44 44" aria-hidden="true"><path d="M22 4 L26 16 L40 16 L29 24 L34 38 L22 29 L10 38 L15 24 L4 16 L18 16 Z" fill="#f59e0b" stroke="#1a1a1a" stroke-width="2" stroke-linejoin="round"/></svg>
        <svg class="doodle-star bottom" viewBox="0 0 32 32" aria-hidden="true"><path d="M16 3 L18 12 L28 12 L20 18 L23 28 L16 22 L9 28 L12 18 L4 12 L14 12 Z" fill="#ef4444" stroke="#1a1a1a" stroke-width="2" stroke-linejoin="round"/></svg>
        <svg class="doodle-arrow" viewBox="0 0 60 40" aria-hidden="true"><path d="M4 20 Q 20 5, 38 18 T 56 14" fill="none" stroke="#2563eb" stroke-width="2.5" stroke-linecap="round"/><path d="M48 8 L56 14 L50 22" fill="none" stroke="#2563eb" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </div>
    </div>
  </header>
</div>

<section id="api">
  <div class="container">
    <div class="section-header">
      <h2>One endpoint. One link.</h2>
      <p>Send HTML as JSON, raw body, or fetch it from a URL. Pin handles storage, OG images, TTL, and rate limits.</p>
    </div>
    <div class="endpoint-bar doodle-border">
      <code>POST /publish</code>
      <code>POST /publish/raw</code>
      <code>POST /publish/from-url</code>
      <span>→ returns {"url":"...","id":"...","expires_at":"..."}</span>
    </div>
    <div class="code-card">curl -X POST https://${process.env.BASE_DOMAIN || 'pin-publish-production.up.railway.app'}/publish \\
  -H "Content-Type: application/json" \\
  -d '{"html":"&lt;h1&gt;Hello agents&lt;/h1&gt;","title":"Demo"}'</div>
  </div>
</section>

<section id="mcp" style="background: rgba(26,26,26,0.02);">
  <div class="container">
    <div class="mcp-banner doodle-border">
      <div>
        <h3><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M7 10 L12 13 L17 10" stroke="#2563eb" stroke-width="2.5"/></svg> MCP Server at <span class="endpoint">/mcp</span></h3>
        <p>Connect any MCP client via Server-Sent Events and call <code>pin_publish</code> directly from the agent.</p>
      </div>
      <a class="btn blue" href="/agents.md">See agents.md</a>
    </div>
  </div>
</section>

<section>
  <div class="container">
    <div class="section-header">
      <h2>Built for agents, safe for humans.</h2>
      <p>Everything included without configuration creep.</p>
    </div>
    <div class="features">
      <article class="feature doodle-border">
        <h3><span class="feature-icon accent"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg></span> MCP over SSE</h3>
        <p>Expose <code>pin_publish</code> as a tool. Agents publish instantly without reading API docs.</p>
      </article>
      <article class="feature doodle-border">
        <h3><span class="feature-icon blue"><svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="3" y="6" width="18" height="13" rx="2" fill="#2563eb" opacity=".15" stroke="#2563eb" stroke-width="1.5"/><circle cx="15" cy="12" r="3" fill="#f59e0b" stroke="#1a1a1a" stroke-width="1.5"/><path d="M3 10h18" stroke="#2563eb" stroke-width="1.5"/></svg></span> Social cards</h3>
        <p>Automatic Open Graph + Twitter Cards. Missing images get a generated 1200×630 PNG preview.</p>
      </article>
      <article class="feature doodle-border">
        <h3><span class="feature-icon lemon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg></span> Fast & stateless</h3>
        <p>Cloudflare R2 or local filesystem. Scales horizontally with no database.</p>
      </article>
      <article class="feature doodle-border">
        <h3><span class="feature-icon blue"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></span> Optional password</h3>
        <p>Lock artifacts behind a password. Subdomain URLs stay easy to share.</p>
      </article>
      <article class="feature doodle-border">
        <h3><span class="feature-icon accent"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></span> TTL by default</h3>
        <p>Content expires automatically. Configure anonymous and keyed tiers via environment variables.</p>
      </article>
      <article class="feature doodle-border">
        <h3><span class="feature-icon lemon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></span> Rate limits & noindex</h3>
        <p>Per-IP and per-key limits with <code>X-Robots-Tag</code> keep the public web sane.</p>
      </article>
    </div>
  </div>
</section>

<section style="background: rgba(26,26,26,0.02);">
  <div class="container">
    <div class="section-header">
      <h2>How it works</h2>
      <p>Three steps from HTML artifact to shareable URL.</p>
    </div>
    <div class="steps">
      <div class="step doodle-border">
        <div class="step-num">1</div>
        <h4>Send HTML</h4>
        <p>POST JSON, raw HTML, or point us at a URL.</p>
      </div>
      <div class="step doodle-border">
        <div class="step-num">2</div>
        <h4>Pin stores it</h4>
        <p>We save the file to R2 or disk and generate metadata.</p>
      </div>
      <div class="step doodle-border">
        <div class="step-num">3</div>
        <h4>Get a link</h4>
        <p>Receive a random-subdomain URL with TTL and OG image.</p>
      </div>
    </div>
  </div>
</section>

<footer>
  <div class="container">
    Built for agents · <a href="/agents.md">agents.md</a> · <a href="https://github.com/vin-spiegel/pin-publish" target="_blank" rel="noopener">GitHub</a>
  </div>
</footer>
</body>
</html>`;
}
