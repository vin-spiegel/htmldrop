<p align="center">
  <a href="https://htmldrop.link"><img src="../.github/logo.svg" width="140" alt="htmldrop-Logo"></a>
</p>

<h1 align="center">htmldrop</h1>

<p align="center"><b>HTML für Agenten veröffentlichen — ein API-Aufruf, MCP-Server inklusive.</b></p>

<p align="center">
  <a href="https://htmldrop.link"><img src="https://img.shields.io/badge/htmldrop.link-live-e8503a" alt="htmldrop.link"></a>
  <a href="https://github.com/vin-spiegel/htmldrop/actions/workflows/ci.yml"><img src="https://github.com/vin-spiegel/htmldrop/actions/workflows/ci.yml/badge.svg" alt="CI"></a>
  <a href="https://www.npmjs.com/package/htmldrop-mcp"><img src="https://img.shields.io/npm/v/htmldrop-mcp" alt="npm"></a>
  <a href="../LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="MIT"></a>
</p>

<p align="center"><a href="../README.md">English</a> · <a href="README.ko.md">한국어</a> · <a href="README.ja.md">日本語</a> · <a href="README.zh-CN.md">简体中文</a> · <a href="README.es.md">Español</a> · <a href="README.fr.md">Français</a> · Deutsch</p>

---

htmldrop verwandelt jedes HTML-, Markdown-, PDF- oder Bild-Artefakt in
Sekunden in einen teilbaren Link. Berichte, Dashboards, Diagramme, Demos —
alles, was ein Agent (oder ein Mensch) erstellt. Markdown, Text und JSON
werden in einer sauberen Leseseite gerendert; PDFs und Bilder werden
unverändert ausgeliefert. Kein git, kein Build, kein Dashboard.

**Jetzt ausprobieren: [htmldrop.link](https://htmldrop.link)** — HTML-Datei
per Drag & Drop ablegen, HTML-Quelltext einfügen oder per POST an die API.

## So funktioniert es

```bash
curl -X POST https://htmldrop.link/publish \
  -H "Content-Type: application/json" \
  -d '{"html":"<h1>Hello agents</h1>","title":"Demo"}'
```

```json
{
  "url": "https://happy-otter-42.htmldrop.link",
  "id": "...",
  "subdomain": "happy-otter-42",
  "expires_at": "2026-07-17T00:00:00.000Z"
}
```

Jeder Link erhält eine eigene Subdomain, eine automatisch generierte Open-
Graph-Vorschaukarte und eine TTL — Geteiltes bleibt nicht für immer online.

## Agenten verbinden (MCP)

Der gehostete MCP-Server läuft unter `https://htmldrop.link/mcp` (SSE) und
stellt ein Tool bereit: `publish_html`.

### Claude Code

```bash
claude mcp add --transport sse htmldrop https://htmldrop.link/mcp
```

### Claude Desktop

Claude Desktop spricht stdio, daher über
[`mcp-remote`](https://www.npmjs.com/package/mcp-remote) zum gehosteten
Server brücken. In `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "htmldrop": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "https://htmldrop.link/mcp"]
    }
  }
}
```

### Cursor

Cursor verbindet sich direkt mit SSE-URLs. In `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "htmldrop": { "url": "https://htmldrop.link/mcp" }
  }
}
```

### Codex CLI

In `~/.codex/config.toml`:

```toml
[mcp_servers.htmldrop]
command = "npx"
args = ["-y", "mcp-remote", "https://htmldrop.link/mcp"]
```

### Selbst gehostete Instanz (npm, stdio)

Du betreibst dein eigenes htmldrop? Das Paket
[`htmldrop-mcp`](https://www.npmjs.com/package/htmldrop-mcp) ist ein lokaler
stdio-MCP-Server, der auf **deinen** Speicher und deine Domain veröffentlicht:

```json
{
  "mcpServers": {
    "htmldrop": {
      "command": "npx",
      "args": ["-y", "htmldrop-mcp"],
      "env": {
        "BASE_DOMAIN": "your-domain.example",
        "CLOUDFLARE_R2_ENDPOINT": "...",
        "CLOUDFLARE_R2_ACCESS_KEY_ID": "...",
        "CLOUDFLARE_R2_SECRET_ACCESS_KEY": "...",
        "CLOUDFLARE_R2_BUCKET_NAME": "..."
      }
    }
  }
}
```

### `publish_html`-Tool

| Argument | Typ | Beschreibung |
|----------|-----|--------------|
| `html` | string | Zu veröffentlichender HTML-Inhalt (oder `markdown` / `url`) |
| `markdown` | string | Markdown-Inhalt — gerendert als gestylte Leseseite |
| `url` | string | Entfernte HTML-Seite zum Abrufen und Veröffentlichen |
| `title` | string | Optionaler Titel für Metadaten und Social Cards |
| `ttl_days` | number | Tage bis zum Ablauf des Artefakts |
| `password` | string | Optionaler Passwortschutz |
| `owner_key` | string | Optionaler Schlüssel für höhere Limits und längere TTL |

Die vollständige Agenten-Dokumentation liegt in [AGENTS.md](../AGENTS.md) und
wird auch unter [htmldrop.link/agents.md](https://htmldrop.link/agents.md)
ausgeliefert.

## REST-API

| Endpoint | Body | Hinweise |
|----------|------|----------|
| `POST /publish` | JSON `{ html \| markdown, title, ttl_days, password, url }` | Haupt-Endpoint |
| `POST /publish/raw` | Raw-Body: `text/html`, `text/markdown`, `text/plain`, `application/json`, `text/csv`, `application/pdf`, `image/*` | Titel via `x-htmldrop-title`-Header oder `?title=` |
| `POST /publish/from-url` | JSON `{ url, title, ttl_days, password }` | Ruft eine Seite ab und veröffentlicht sie neu |

Übergib einen Owner-Key im `x-htmldrop-key`-Header für höhere Rate-Limits
und eine längere Standard-TTL. (`x-pin-key` wird aus Kompatibilitätsgründen
weiterhin akzeptiert.)

## Selbst hosten

```bash
git clone https://github.com/vin-spiegel/htmldrop.git
cd htmldrop
pnpm install
cp .env.example .env   # Standardwerte funktionieren direkt
pnpm dev               # http://localhost:3000
```

Ohne konfiguriertes Cloudflare R2 fällt der Speicher auf das lokale
Dateisystem zurück — keine Datenbank, horizontal skalierbar.

### Umgebungsvariablen

| Variable | Standard | Beschreibung |
|----------|----------|--------------|
| `PORT` | `3000` | HTTP-Port |
| `BASE_DOMAIN` | `localhost` | Basis-Domain für Artefakt-Subdomains |
| `CLOUDFLARE_R2_*` | — | Optionaler R2-Speicher (Endpoint, Schlüssel, Bucket) |
| `ANON_TTL_DAYS` | `7` | TTL für anonyme Veröffentlichungen |
| `KEY_TTL_DAYS` | `30` | TTL für Veröffentlichungen mit Schlüssel |
| `MAX_HTML_SIZE_BYTES` | `26214400` | Upload-Limit (25 MB) |
| `RATE_LIMIT_ANON_PER_MINUTE` | `10` | Rate-Limit pro IP |
| `RATE_LIMIT_KEY_PER_MINUTE` | `60` | Rate-Limit pro Schlüssel |

Die Produktion benötigt einen Wildcard-DNS-Eintrag (`*.deine-domain`), der
auf den Server zeigt, damit Artefakt-Subdomains auflösen.

### Auf Railway deployen

```bash
railway login
railway init --name htmldrop
railway up
```

Setze anschließend `BASE_DOMAIN` und (optional) die R2-Variablen im
Railway-Dashboard und verbinde deine Domain samt Wildcard.

## Sicherheits-Standards

- Artefakte werden mit `X-Robots-Tag: noindex, nofollow, noarchive` ausgeliefert
- Rate-Limits pro IP und pro Schlüssel
- Alles läuft über TTL ab
- Optionaler Passwortschutz pro Artefakt

Siehe [SECURITY.md](SECURITY.md) für Schwachstellen- und Missbrauchsmeldungen.

## Entwicklung

```bash
pnpm dev        # mit tsx ausführen
pnpm test       # vitest
pnpm run build  # tsc -> dist/
```

## Lizenz

[MIT](../LICENSE)
