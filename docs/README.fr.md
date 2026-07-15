<p align="center">
  <a href="https://htmldrop.link"><img src="../.github/logo.svg" width="140" alt="logo htmldrop"></a>
</p>

<h1 align="center">htmldrop</h1>

<p align="center"><b>Publiez tout pour les agents — un appel API, serveur MCP inclus.</b></p>

<p align="center">
  <a href="https://htmldrop.link"><img src="https://img.shields.io/badge/htmldrop.link-live-e8503a" alt="htmldrop.link"></a>
  <a href="https://github.com/vin-spiegel/htmldrop/actions/workflows/ci.yml"><img src="https://github.com/vin-spiegel/htmldrop/actions/workflows/ci.yml/badge.svg" alt="CI"></a>
  <a href="https://www.npmjs.com/package/htmldrop-mcp"><img src="https://img.shields.io/npm/v/htmldrop-mcp" alt="npm"></a>
  <a href="../LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="MIT"></a>
</p>

<p align="center"><a href="../README.md">English</a> · <a href="README.ko.md">한국어</a> · <a href="README.ja.md">日本語</a> · <a href="README.zh-CN.md">简体中文</a> · <a href="README.es.md">Español</a> · Français · <a href="README.de.md">Deutsch</a></p>

---

htmldrop transforme n'importe quel artefact HTML, Markdown, PDF ou image en
lien à partager en quelques secondes. Rapports, tableaux de bord, graphiques,
démos — tout ce qu'un agent (ou un humain) crée. Markdown, texte et JSON sont
rendus dans une page de lecture épurée ; les PDF et images sont servis tels
quels. Pas de git, pas de build, pas de tableau de bord.

**Essayez maintenant : [htmldrop.link](https://htmldrop.link)** — glissez-déposez
un fichier HTML, collez du code HTML ou envoyez un POST à l'API.

## Comment ça marche

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

Chaque lien reçoit son propre sous-domaine, une carte d'aperçu Open Graph
générée automatiquement et un TTL — rien ne reste en ligne pour toujours.

## Connectez votre agent (MCP)

Le serveur MCP hébergé se trouve sur `https://htmldrop.link/mcp` (SSE) et
expose un seul outil : `publish_html`.

### Claude Code

```bash
claude mcp add --transport sse htmldrop https://htmldrop.link/mcp
```

### Claude Desktop

Claude Desktop parle stdio ; utilisez donc
[`mcp-remote`](https://www.npmjs.com/package/mcp-remote) comme passerelle
vers le serveur hébergé. Dans `claude_desktop_config.json` :

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

Cursor se connecte directement aux URLs SSE. Dans `.cursor/mcp.json` :

```json
{
  "mcpServers": {
    "htmldrop": { "url": "https://htmldrop.link/mcp" }
  }
}
```

### Codex CLI

Dans `~/.codex/config.toml` :

```toml
[mcp_servers.htmldrop]
command = "npx"
args = ["-y", "mcp-remote", "https://htmldrop.link/mcp"]
```

### Instance auto-hébergée (npm, stdio)

Vous faites tourner votre propre htmldrop ? Le paquet
[`htmldrop-mcp`](https://www.npmjs.com/package/htmldrop-mcp) est un serveur
MCP stdio local qui publie vers **votre** stockage et votre domaine :

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

### Outil `publish_html`

| Argument | Type | Description |
|----------|------|-------------|
| `html` | string | Contenu HTML à publier (ou utilisez `markdown` / `url`) |
| `markdown` | string | Contenu Markdown — rendu dans une page de lecture stylée |
| `url` | string | Page HTML distante à récupérer et publier |
| `title` | string | Titre optionnel pour les métadonnées et cartes sociales |
| `ttl_days` | number | Jours avant expiration de l'artefact |
| `password` | string | Protection par mot de passe optionnelle |
| `owner_key` | string | Clé optionnelle pour des limites plus élevées et un TTL plus long |

La documentation complète pour agents se trouve dans [AGENTS.md](../AGENTS.md),
également servie sur [htmldrop.link/agents.md](https://htmldrop.link/agents.md).

## API REST

| Endpoint | Corps | Notes |
|----------|-------|-------|
| `POST /publish` | JSON `{ html \| markdown, title, ttl_days, password, url }` | Endpoint principal |
| `POST /publish/raw` | corps brut : `text/html`, `text/markdown`, `text/plain`, `application/json`, `text/csv`, `application/pdf`, `image/*` | Titre via l'en-tête `x-htmldrop-title` ou `?title=` |
| `POST /publish/from-url` | JSON `{ url, title, ttl_days, password }` | Récupère et republie une page |

Passez une clé propriétaire dans l'en-tête `x-htmldrop-key` pour des limites
de débit plus élevées et un TTL par défaut plus long. (`x-pin-key` reste
accepté pour la rétrocompatibilité.)

## Auto-hébergement

```bash
git clone https://github.com/vin-spiegel/htmldrop.git
cd htmldrop
pnpm install
cp .env.example .env   # les valeurs par défaut fonctionnent
pnpm dev               # http://localhost:3000
```

Le stockage bascule sur le système de fichiers local quand Cloudflare R2
n'est pas configuré — pas de base de données, mise à l'échelle horizontale.

### Variables d'environnement

| Variable | Défaut | Description |
|----------|--------|-------------|
| `PORT` | `3000` | Port HTTP |
| `BASE_DOMAIN` | `localhost` | Domaine de base des sous-domaines d'artefacts |
| `CLOUDFLARE_R2_*` | — | Stockage R2 optionnel (endpoint, clés, bucket) |
| `ANON_TTL_DAYS` | `7` | TTL des publications anonymes |
| `KEY_TTL_DAYS` | `30` | TTL des publications avec clé |
| `MAX_HTML_SIZE_BYTES` | `26214400` | Limite d'upload (25 Mo) |
| `RATE_LIMIT_ANON_PER_MINUTE` | `10` | Limite de débit par IP |
| `RATE_LIMIT_KEY_PER_MINUTE` | `60` | Limite de débit par clé |

La production nécessite un enregistrement DNS wildcard (`*.votre-domaine`)
pointant vers le serveur pour que les sous-domaines d'artefacts se résolvent.

### Déployer sur Railway

```bash
railway login
railway init --name htmldrop
railway up
```

Configurez ensuite `BASE_DOMAIN` et (optionnellement) les variables R2 dans
le tableau de bord Railway, puis rattachez votre domaine et son wildcard.

## Sécurité par défaut

- Les artefacts sont servis avec `X-Robots-Tag: noindex, nofollow, noarchive`
- Limites de débit par IP et par clé
- Tout expire via TTL
- Protection par mot de passe optionnelle par artefact

Voir [SECURITY.md](SECURITY.md) pour signaler vulnérabilités et abus.

## Développement

```bash
pnpm dev        # exécuter avec tsx
pnpm test       # vitest
pnpm run build  # tsc -> dist/
```

## Licence

[MIT](../LICENSE)
