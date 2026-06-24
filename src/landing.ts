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
    --accent-soft: rgba(239, 68, 68, 0.10);
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
    background-image:
      radial-gradient(#e6e2db 0.6px, transparent 0.6px),
      radial-gradient(#e6e2db 0.6px, transparent 0.6px);
    background-size: 28px 28px;
    background-position: 0 0, 14px 14px;
  }
    background-image: radial-gradient(circle at 15% 5%, rgba(255,85,51,0.06) 0%, transparent 35%),
                      radial-gradient(circle at 85% 25%, rgba(42,106,255,0.05) 0%, transparent 30%);
  }
  .container { max-width: 1080px; margin: 0 auto; padding: 0 1.5rem; }

  /* Nav */
  nav { padding: 1.25rem 0; }
  .nav-inner { display: flex; align-items: center; justify-content: space-between; }
  .logo-mark { display: flex; align-items: center; gap: 0.5rem; font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 1.25rem; }
  .logo-pin { width: 28px; height: 28px; color: var(--coral); }
  .nav-links { display: flex; gap: 0.5rem; }
  .nav-links a { color: var(--ink-soft); text-decoration: none; font-size: 0.9rem; font-weight: 500; padding: 0.4rem 0.8rem; border-radius: 999px; }
  .nav-links a:hover { background: rgba(20,20,27,0.05); color: var(--ink); }

  /* Hero */
  .hero { padding: 4rem 0 5rem; position: relative; overflow: hidden; }
  .hero-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; align-items: center; }
  .hero h1 { font-family: 'Space Grotesk', sans-serif; font-size: clamp(2.6rem, 5.5vw, 4.2rem); line-height: 1.05; letter-spacing: -0.03em; margin: 0 0 1.25rem; }
  .hero .highlight { position: relative; display: inline-block; color: var(--coral); }
  .hero .highlight::after {
    content: '';
    position: absolute;
    left: -0.2em; right: -0.2em; bottom: 0.05em;
    height: 0.28em;
    background: var(--lemon);
    border-radius: 2px;
    z-index: -1;
    transform: rotate(-1.5deg);
  }
  .tagline { font-size: 1.15rem; color: var(--ink-soft); max-width: 480px; margin: 0 0 1.75rem; line-height: 1.65; }
  .hero-actions { display: flex; flex-wrap: wrap; gap: 0.75rem; }
  .btn {
    display: inline-flex; align-items: center; gap: 0.35rem;
    text-decoration: none; font-weight: 600; font-size: 0.95rem; padding: 0.8rem 1.4rem;
    border-radius: 12px; border: 2px solid transparent; transition: all 0.15s ease;
  }
  .btn-primary { background: var(--coral); color: #fff; border-color: var(--coral); }
  .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(255,85,51,0.25); }
  .btn-secondary { background: transparent; color: var(--ink); border-color: rgba(20,20,27,0.18); }
  .btn-secondary:hover { background: rgba(20,20,27,0.04); }

  .hero-art { position: relative; display: flex; align-items: center; justify-content: center; min-height: 320px; }
  .hero-art svg { width: 100%; max-width: 420px; height: auto; }

  /* Endpoint code */
  .endpoint-bar { background: var(--card); border: 1px solid rgba(20,20,27,0.08); border-radius: 16px; padding: 1rem 1.25rem; display: flex; flex-wrap: wrap; gap: 0.5rem; align-items: center; margin-top: 2rem; box-shadow: var(--shadow); }
  .endpoint-bar code { background: var(--coral-soft); color: var(--coral); padding: 0.3rem 0.6rem; border-radius: 8px; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 0.82rem; font-weight: 600; }
  .endpoint-bar span { color: var(--ink-soft); font-size: 0.9rem; }
  .code-card {
    background: var(--ink); color: #f8f8fa; padding: 1.25rem 1.5rem; border-radius: 18px;
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 0.85rem; line-height: 1.6;
    overflow-x: auto; margin-top: 0.75rem; box-shadow: var(--shadow);
  }

  /* Sections */
  section { padding: 4rem 0; }
  .section-header { max-width: 560px; margin-bottom: 2.5rem; }
  .section-header h2 { font-family: 'Space Grotesk', sans-serif; font-size: clamp(1.7rem, 3.5vw, 2.4rem); margin: 0 0 0.75rem; letter-spacing: -0.02em; }
  .section-header p { color: var(--ink-soft); margin: 0; font-size: 1.05rem; }

  /* MCP Banner */
  .mcp-banner {
    background: linear-gradient(135deg, var(--blue-soft) 0%, #fff 100%);
    border: 1px solid rgba(42,106,255,0.12);
    border-radius: 24px; padding: 2rem; display: flex; flex-wrap: wrap;
    align-items: center; justify-content: space-between; gap: 1.25rem;
    box-shadow: var(--shadow);
  }
  .mcp-banner h3 { margin: 0; font-size: 1.35rem; font-family: 'Space Grotesk', sans-serif; }
  .mcp-banner p { margin: 0.35rem 0 0; color: var(--ink-soft); }
  .mcp-banner .endpoint { font-family: ui-monospace, monospace; font-size: 0.85rem; color: var(--blue); font-weight: 600; }

  /* Features */
  .features { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.25rem; }
  .feature {
    background: var(--card); border: 1px solid rgba(20,20,27,0.08);
    border-radius: 20px; padding: 1.5rem; box-shadow: var(--shadow);
    transition: transform 0.15s ease, box-shadow 0.15s ease;
  }
  .feature:hover { transform: translateY(-3px); box-shadow: var(--shadow-hover); }
  .feature-icon {
    width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center;
    margin-bottom: 1rem; border: 1.5px solid var(--line);
  }
  .feature-icon.coral { background: var(--coral-soft); color: var(--coral); }
  .feature-icon.blue { background: var(--blue-soft); color: var(--blue); }
  .feature-icon.lemon { background: var(--lemon); color: var(--ink); }
  .feature h3 { margin: 0 0 0.5rem; font-size: 1.1rem; font-weight: 700; }
  .feature p { margin: 0; color: var(--ink-soft); font-size: 0.95rem; }

  /* How it works */
  .steps { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }
  .step { text-align: center; padding: 1.5rem; border-radius: 20px; background: var(--card); border: 1px solid rgba(20,20,27,0.08); }
  .step-num { display: inline-flex; align-items: center; justify-content: center; width: 36px; height: 36px; border-radius: 50%; background: var(--ink); color: #fff; font-weight: 700; margin-bottom: 0.75rem; }
  .step h4 { margin: 0 0 0.3rem; font-size: 1.05rem; }
  .step p { margin: 0; color: var(--ink-soft); font-size: 0.9rem; }

  footer { padding: 2.5rem 0; text-align: center; color: var(--ink-soft); font-size: 0.9rem; border-top: 1px solid rgba(20,20,27,0.08); }
  footer a { color: var(--ink-soft); text-decoration: none; }
  footer a:hover { color: var(--ink); text-decoration: underline; }

  @media (max-width: 900px) {
    .hero-grid { grid-template-columns: 1fr; }
    .hero { padding: 2rem 0 3rem; }
    .hero-art { order: -1; min-height: 240px; }
    .features, .steps { grid-template-columns: repeat(2, 1fr); }
  }
  @media (max-width: 560px) {
    .features, .steps { grid-template-columns: 1fr; }
    .endpoint-bar { flex-direction: column; align-items: flex-start; }
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
        <h1>Publish HTML <br><span class="highlight">in seconds.</span></h1>
        <p class="tagline">Pin turns any HTML artifact — reports, dashboards, charts, demos — into a public link with one API call. Volatile, fast, and agent-friendly.</p>
        <div class="hero-actions">
          <a class="btn btn-primary" href="#api">Try the API</a>
          <a class="btn btn-secondary" href="/agents.md">Read agents.md</a>
        </div>
      </div>
      <div class="hero-art">
        <svg viewBox="0 0 400 360" aria-hidden="true">
          <!-- Browser window -->
          <rect x="60" y="50" width="280" height="260" rx="24" fill="#fff" stroke="#14141b" stroke-width="2.5"/>
          <rect x="60" y="87" width="280" height="2" fill="#14141b" opacity="0.12"/>
          <circle cx="88" cy="70" r="5" fill="#ff5533" opacity="0.5"/>
          <circle cx="106" cy="70" r="5" fill="#ffe14d" opacity="0.8"/>
          <circle cx="124" cy="70" r="5" fill="#2a6aff" opacity="0.4"/>
          <!-- Content lines -->
          <rect x="90" y="110" width="140" height="16" rx="8" fill="#ff5533" opacity="0.12"/>
          <rect x="90" y="140" width="190" height="12" rx="6" fill="#14141b" opacity="0.08"/>
          <rect x="90" y="164" width="160" height="12" rx="6" fill="#14141b" opacity="0.08"/>
          <!-- Pin floating -->
          <g transform="translate(235, 185)">
            <circle cx="0" cy="0" r="44" fill="#ff5533" stroke="#14141b" stroke-width="2.5"/>
            <circle cx="0" cy="-18" r="12" fill="#fff" stroke="#14141b" stroke-width="2.5"/>
            <path d="M0 -6 L0 40" stroke="#14141b" stroke-width="2.8" stroke-linecap="round"/>
            <path d="M-16 24 L16 16" stroke="#14141b" stroke-width="2.8" stroke-linecap="round"/>
          </g>
          <!-- Connection line -->
          <path d="M110 240 Q 150 285, 205 265" fill="none" stroke="#2a6aff" stroke-width="2.5" stroke-linecap="round"/>
          <circle cx="108" cy="236" r="5" fill="#ffe14d" stroke="#14141b" stroke-width="1.5"/>
          <!-- Doodle decorations -->
          <path d="M40 45 L46 63 L64 63 L50 74 L56 92 L40 80 L24 92 L30 74 L16 63 L34 63 Z" fill="#ffe14d" stroke="#14141b" stroke-width="2" stroke-linejoin="round" transform="scale(0.55) translate(632, 25)"/>
          <path d="M340 300 Q 370 275, 392 292 T 425 288" fill="none" stroke="#2a6aff" stroke-width="2.5" stroke-linecap="round"/>
          <path d="M414 280 L425 288 L416 298" fill="none" stroke="#2a6aff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
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
    <div class="endpoint-bar">
      <code>POST /publish</code>
      <code>POST /publish/raw</code>
      <code>POST /publish/from-url</code>
      <span>→ returns <code>{"url":"...","id":"...","expires_at":"..."}</code></span>
    </div>
    <div class="code-card">curl -X POST https://${process.env.BASE_DOMAIN || 'pin-publish-production.up.railway.app'}/publish \\
  -H "Content-Type: application/json" \\
  -d '{"html":"&lt;h1&gt;Hello agents&lt;/h1&gt;","title":"Demo"}'</div>
  </div>
</section>

<section id="mcp" style="background: rgba(20,20,27,0.02);">
  <div class="container">
    <div class="mcp-banner">
      <div>
        <h3>🔌 MCP Server at <span class="endpoint">/mcp</span></h3>
        <p>Connect any MCP client via Server-Sent Events and call <code>pin_publish</code> directly from the agent.</p>
      </div>
      <a class="btn btn-secondary" href="/agents.md">See agents.md</a>
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
      <article class="feature">
        <div class="feature-icon coral">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
        </div>
        <h3>MCP over SSE</h3>
        <p>Expose <code>pin_publish</code> as a tool. Agents publish instantly without reading API docs.</p>
      </article>
      <article class="feature">
        <div class="feature-icon blue">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="3" y="6" width="18" height="13" rx="2" fill="#2a6aff" opacity=".15" stroke="#2a6aff" stroke-width="1.5"/><circle cx="15" cy="12" r="3" fill="#ffe14d" stroke="#14141b" stroke-width="1.5"/><path d="M3 10h18" stroke="#2a6aff" stroke-width="1.5"/></svg>
        </div>
        <h3>Social cards</h3>
        <p>Automatic Open Graph + Twitter Cards. Missing images get a generated 1200×630 PNG preview.</p>
      </article>
      <article class="feature">
        <div class="feature-icon lemon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
        </div>
        <h3>Fast & stateless</h3>
        <p>Cloudflare R2 or local filesystem. Scales horizontally with no database.</p>
      </article>
      <article class="feature">
        <div class="feature-icon blue">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
        </div>
        <h3>Optional password</h3>
        <p>Lock artifacts behind a password. Subdomain URLs stay easy to share.</p>
      </article>
      <article class="feature">
        <div class="feature-icon coral">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        </div>
        <h3>TTL by default</h3>
        <p>Content expires automatically. Configure anonymous and keyed tiers via environment variables.</p>
      </article>
      <article class="feature">
        <div class="feature-icon lemon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        </div>
        <h3>Rate limits & noindex</h3>
        <p>Per-IP and per-key limits with <code>X-Robots-Tag</code> keep the public web sane.</p>
      </article>
    </div>
  </div>
</section>

<section style="background: rgba(20,20,27,0.02);">
  <div class="container">
    <div class="section-header">
      <h2>How it works</h2>
      <p>Three steps from HTML artifact to shareable URL.</p>
    </div>
    <div class="steps">
      <div class="step">
        <div class="step-num">1</div>
        <h4>Send HTML</h4>
        <p>POST JSON, raw HTML, or point us at a URL.</p>
      </div>
      <div class="step">
        <div class="step-num">2</div>
        <h4>Pin stores it</h4>
        <p>We save the file to R2 or disk and generate metadata.</p>
      </div>
      <div class="step">
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
