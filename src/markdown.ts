import { marked } from 'marked';

/**
 * Render markdown into a complete, readable HTML document in the htmldrop
 * reader style (cream paper, ink text, coral accents). The result is a full
 * document, so `wrapHtml` passes it through untouched and only injects the
 * floating badge.
 */
export function markdownToHtml(markdown: string, title?: string): { html: string; title: string } {
  const body = marked.parse(markdown, { async: false }) as string;
  const resolvedTitle = title || extractTitle(markdown) || 'htmldrop artifact';
  return { html: readerShell(body, resolvedTitle), title: resolvedTitle };
}

/**
 * Plain-text-ish content (txt, json, csv) rendered as a <pre> inside the same
 * reader shell. JSON is pretty-printed when it parses.
 */
export function textToHtml(text: string, title?: string, kind?: 'json' | 'csv' | 'text'): { html: string; title: string } {
  let display = text;
  if (kind === 'json') {
    try {
      display = JSON.stringify(JSON.parse(text), null, 2);
    } catch {
      /* keep as-is */
    }
  }
  const resolvedTitle = title || 'htmldrop artifact';
  const body = `<pre>${escapeHtml(display)}</pre>`;
  return { html: readerShell(body, resolvedTitle), title: resolvedTitle };
}

function readerShell(body: string, resolvedTitle: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHtml(resolvedTitle)}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
<style>
  :root { --bg:#f7f3ea; --ink:#211d18; --muted:#756c60; --accent:#e8503a; --paper:#fffdf9; --line:rgba(33,29,24,.14); }
  * { box-sizing: border-box; }
  body {
    margin: 0; background: var(--bg); color: var(--ink);
    font-family: 'Nunito', system-ui, -apple-system, 'Segoe UI', sans-serif;
    font-size: 17px; line-height: 1.75; -webkit-font-smoothing: antialiased;
  }
  main { max-width: 720px; margin: 0 auto; padding: 3.5rem 1.5rem 5rem; }
  h1, h2, h3, h4 { line-height: 1.25; font-weight: 800; margin: 2.2em 0 0.6em; }
  h1 { font-size: 2.3rem; margin-top: 0; }
  h2 { font-size: 1.6rem; border-bottom: 2px solid var(--line); padding-bottom: 0.35rem; }
  h3 { font-size: 1.25rem; }
  a { color: var(--accent); text-decoration: none; border-bottom: 1.5px solid rgba(232,80,58,.3); }
  a:hover { border-bottom-color: var(--accent); }
  p { margin: 0 0 1.1em; }
  strong { font-weight: 800; }
  ul, ol { padding-left: 1.5rem; margin: 0 0 1.1em; }
  li { margin: 0.25em 0; }
  blockquote {
    margin: 1.4em 0; padding: 0.6em 1.2em; color: var(--muted);
    border-left: 4px solid var(--accent); background: var(--paper); border-radius: 0 10px 10px 0;
  }
  blockquote p:last-child { margin-bottom: 0; }
  code { font-family: 'JetBrains Mono', ui-monospace, monospace; font-size: 0.86em; }
  :not(pre) > code { background: rgba(232,80,58,.09); color: #b93c29; padding: 0.15em 0.4em; border-radius: 6px; }
  pre {
    background: #1c1915; color: #f4efe6; padding: 1.1rem 1.3rem; border-radius: 12px;
    overflow-x: auto; line-height: 1.7; margin: 1.4em 0;
  }
  pre code { background: none; color: inherit; padding: 0; }
  table { border-collapse: collapse; width: 100%; margin: 1.4em 0; font-size: 0.95em; }
  th, td { border: 1.5px solid var(--line); padding: 0.55em 0.9em; text-align: left; }
  th { background: var(--paper); font-weight: 800; }
  img { max-width: 100%; border-radius: 12px; }
  hr { border: none; border-top: 2px dashed var(--line); margin: 2.5em 0; }
</style>
</head>
<body>
<main>
${body}
</main>
</body>
</html>`;
}

/** First `# heading` in the markdown, used as the title when none is given. */
function extractTitle(markdown: string): string | undefined {
  const m = markdown.match(/^#\s+(.+)$/m);
  return m ? m[1].trim().replace(/[*_`]/g, '') : undefined;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
