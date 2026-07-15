<p align="center">
  <a href="https://htmldrop.link"><img src="../.github/logo.svg" width="140" alt="logo de htmldrop"></a>
</p>

<h1 align="center">htmldrop</h1>

<p align="center"><b>Publica cualquier cosa para agentes — una llamada a la API, servidor MCP incluido.</b></p>

<p align="center">
  <a href="https://htmldrop.link"><img src="https://img.shields.io/badge/htmldrop.link-live-e8503a" alt="htmldrop.link"></a>
  <a href="https://github.com/vin-spiegel/htmldrop/actions/workflows/ci.yml"><img src="https://github.com/vin-spiegel/htmldrop/actions/workflows/ci.yml/badge.svg" alt="CI"></a>
  <a href="https://www.npmjs.com/package/htmldrop-mcp"><img src="https://img.shields.io/npm/v/htmldrop-mcp" alt="npm"></a>
  <a href="../LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="MIT"></a>
</p>

<p align="center"><a href="../README.md">English</a> · <a href="README.ko.md">한국어</a> · <a href="README.ja.md">日本語</a> · <a href="README.zh-CN.md">简体中文</a> · Español · <a href="README.fr.md">Français</a> · <a href="README.de.md">Deutsch</a></p>

---

htmldrop convierte cualquier artefacto HTML, Markdown, PDF o imagen en un
enlace para compartir en segundos. Informes, paneles, gráficos, demos — todo
lo que cree un agente (o un humano). Markdown, texto y JSON se renderizan en
una página de lectura limpia; los PDF e imágenes se sirven tal cual. Sin git,
sin build, sin panel de control.

**Pruébalo ahora: [htmldrop.link](https://htmldrop.link)** — arrastra un
archivo HTML, pega código HTML o haz POST a la API.

## Cómo funciona

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

Cada enlace obtiene su propio subdominio, una tarjeta de vista previa Open
Graph generada automáticamente y un TTL — lo compartido no vive para siempre.

## Conecta tu agente (MCP)

El servidor MCP alojado vive en `https://htmldrop.link/mcp` (SSE) y expone
una herramienta: `publish_html`.

### Claude Code

```bash
claude mcp add --transport sse htmldrop https://htmldrop.link/mcp
```

### Claude Desktop

Claude Desktop usa stdio, así que conéctate al servidor alojado con
[`mcp-remote`](https://www.npmjs.com/package/mcp-remote). En
`claude_desktop_config.json`:

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

Cursor se conecta a URLs SSE directamente. En `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "htmldrop": { "url": "https://htmldrop.link/mcp" }
  }
}
```

### Codex CLI

En `~/.codex/config.toml`:

```toml
[mcp_servers.htmldrop]
command = "npx"
args = ["-y", "mcp-remote", "https://htmldrop.link/mcp"]
```

### Instancia autoalojada (npm, stdio)

¿Ejecutas tu propio htmldrop? El paquete
[`htmldrop-mcp`](https://www.npmjs.com/package/htmldrop-mcp) es un servidor
MCP stdio local que publica en **tu** almacenamiento y dominio:

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

### Herramienta `publish_html`

| Argumento | Tipo | Descripción |
|-----------|------|-------------|
| `html` | string | Contenido HTML a publicar (o usa `markdown` / `url`) |
| `markdown` | string | Contenido Markdown — renderizado en una página de lectura con estilo |
| `url` | string | Página HTML remota a obtener y publicar |
| `title` | string | Título opcional para metadatos y tarjetas sociales |
| `ttl_days` | number | Días hasta que el artefacto caduque |
| `password` | string | Protección con contraseña opcional |
| `owner_key` | string | Clave opcional para límites más altos y TTL más largo |

La documentación completa para agentes está en [AGENTS.md](../AGENTS.md),
también servida en [htmldrop.link/agents.md](https://htmldrop.link/agents.md).

## API REST

| Endpoint | Cuerpo | Notas |
|----------|--------|-------|
| `POST /publish` | JSON `{ html \| markdown, title, ttl_days, password, url }` | Endpoint principal |
| `POST /publish/raw` | cuerpo raw: `text/html`, `text/markdown`, `text/plain`, `application/json`, `text/csv`, `application/pdf`, `image/*` | Título vía cabecera `x-htmldrop-title` o `?title=` |
| `POST /publish/from-url` | JSON `{ url, title, ttl_days, password }` | Obtiene y republica una página |

Pasa una clave de propietario en la cabecera `x-htmldrop-key` para límites de
tasa más altos y un TTL por defecto más largo. (`x-pin-key` sigue aceptándose
por compatibilidad.)

## Autoalojamiento

```bash
git clone https://github.com/vin-spiegel/htmldrop.git
cd htmldrop
pnpm install
cp .env.example .env   # los valores por defecto funcionan
pnpm dev               # http://localhost:3000
```

El almacenamiento recurre al sistema de archivos local cuando Cloudflare R2
no está configurado — sin base de datos, escala horizontalmente.

### Variables de entorno

| Variable | Por defecto | Descripción |
|----------|-------------|-------------|
| `PORT` | `3000` | Puerto HTTP |
| `BASE_DOMAIN` | `localhost` | Dominio base para los subdominios de artefactos |
| `CLOUDFLARE_R2_*` | — | Almacenamiento R2 opcional (endpoint, claves, bucket) |
| `ANON_TTL_DAYS` | `7` | TTL para publicaciones anónimas |
| `KEY_TTL_DAYS` | `30` | TTL para publicaciones con clave |
| `MAX_HTML_SIZE_BYTES` | `26214400` | Límite de subida (25 MB) |
| `RATE_LIMIT_ANON_PER_MINUTE` | `10` | Límite de tasa por IP |
| `RATE_LIMIT_KEY_PER_MINUTE` | `60` | Límite de tasa por clave |

Producción necesita un registro DNS comodín (`*.tu-dominio`) apuntando al
servidor para que los subdominios de artefactos resuelvan.

### Desplegar en Railway

```bash
railway login
railway init --name htmldrop
railway up
```

Luego configura `BASE_DOMAIN` y (opcionalmente) las variables R2 en el panel
de Railway, y vincula tu dominio junto con su comodín.

## Seguridad por defecto

- Los artefactos se sirven con `X-Robots-Tag: noindex, nofollow, noarchive`
- Límites de tasa por IP y por clave
- Todo caduca vía TTL
- Protección con contraseña opcional por artefacto

Consulta [SECURITY.md](SECURITY.md) para reportar vulnerabilidades y abusos.

## Desarrollo

```bash
pnpm dev        # ejecutar con tsx
pnpm test       # vitest
pnpm run build  # tsc -> dist/
```

## Licencia

[MIT](../LICENSE)
