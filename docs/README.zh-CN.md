<p align="center">
  <a href="https://htmldrop.link"><img src=".github/logo.svg" width="140" alt="htmldrop 徽标"></a>
</p>

<h1 align="center">htmldrop</h1>

<p align="center"><b>为智能体发布 HTML — 一次 API 调用，内置 MCP 服务器。</b></p>

<p align="center">
  <a href="https://htmldrop.link"><img src="https://img.shields.io/badge/htmldrop.link-live-e8503a" alt="htmldrop.link"></a>
  <a href="https://github.com/vin-spiegel/htmldrop/actions/workflows/ci.yml"><img src="https://github.com/vin-spiegel/htmldrop/actions/workflows/ci.yml/badge.svg" alt="CI"></a>
  <a href="https://www.npmjs.com/package/htmldrop-mcp"><img src="https://img.shields.io/npm/v/htmldrop-mcp" alt="npm"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="MIT"></a>
</p>

<p align="center"><a href="README.md">English</a> · <a href="README.ko.md">한국어</a> · <a href="README.ja.md">日本語</a> · 简体中文 · <a href="README.es.md">Español</a> · <a href="README.fr.md">Français</a> · <a href="README.de.md">Deutsch</a></p>

---

htmldrop 能在几秒内把 HTML、Markdown、PDF 或图片变成可分享的链接。报告、
仪表盘、图表、演示 — 智能体(或人)创建的一切。Markdown、文本、JSON 会渲染成
干净的阅读页面；PDF 和图片原样提供。无需 git、无需构建、无需控制台。

**立即试用：[htmldrop.link](https://htmldrop.link)** — 拖放 HTML 文件、
粘贴 HTML 源码，或直接 POST 到 API。

## 工作原理

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

每个链接都有专属子域名、自动生成的 Open Graph 预览卡片和 TTL —
分享的内容不会永远存在。

## 连接你的智能体 (MCP)

托管 MCP 服务器位于 `https://htmldrop.link/mcp` (SSE)，提供一个工具：
`publish_html`。

### Claude Code

```bash
claude mcp add --transport sse htmldrop https://htmldrop.link/mcp
```

### Claude Desktop

Claude Desktop 使用 stdio，因此通过
[`mcp-remote`](https://www.npmjs.com/package/mcp-remote) 桥接到托管服务器。
在 `claude_desktop_config.json` 中：

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

Cursor 可直接连接 SSE URL。在 `.cursor/mcp.json` 中：

```json
{
  "mcpServers": {
    "htmldrop": { "url": "https://htmldrop.link/mcp" }
  }
}
```

### Codex CLI

在 `~/.codex/config.toml` 中：

```toml
[mcp_servers.htmldrop]
command = "npx"
args = ["-y", "mcp-remote", "https://htmldrop.link/mcp"]
```

### 自托管实例 (npm, stdio)

自己运行 htmldrop？
[`htmldrop-mcp`](https://www.npmjs.com/package/htmldrop-mcp) 包是一个本地
stdio MCP 服务器，发布到**你自己的**存储和域名：

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

### `publish_html` 工具

| 参数 | 类型 | 说明 |
|------|------|------|
| `html` | string | 要发布的 HTML 内容 (也可用 `markdown` / `url`) |
| `markdown` | string | Markdown 内容 — 渲染为带样式的阅读页面 |
| `url` | string | 要抓取并发布的远程 HTML 页面 |
| `title` | string | 元数据和社交卡片的标题 (可选) |
| `ttl_days` | number | 内容过期前的天数 |
| `password` | string | 密码保护 (可选) |
| `owner_key` | string | 用于更高限额和更长 TTL 的密钥 (可选) |

面向智能体的完整文档见 [AGENTS.md](AGENTS.md)，也在
[htmldrop.link/agents.md](https://htmldrop.link/agents.md) 提供。

## REST API

| 端点 | 请求体 | 备注 |
|------|--------|------|
| `POST /publish` | JSON `{ html \| markdown, title, ttl_days, password, url }` | 主端点 |
| `POST /publish/raw` | 原始请求体: `text/html`, `text/markdown`, `text/plain`, `application/json`, `text/csv`, `application/pdf`, `image/*` | 标题通过 `x-htmldrop-title` 头或 `?title=` |
| `POST /publish/from-url` | JSON `{ url, title, ttl_days, password }` | 抓取页面并重新发布 |

在 `x-htmldrop-key` 头中传入所有者密钥可获得更高的速率限制和更长的默认
TTL。(`x-pin-key` 仍向后兼容。)

## 自托管

```bash
git clone https://github.com/vin-spiegel/htmldrop.git
cd htmldrop
pnpm install
cp .env.example .env   # 默认配置即可运行
pnpm dev               # http://localhost:3000
```

未配置 Cloudflare R2 时回退到本地文件系统 — 无需数据库，可水平扩展。

### 环境变量

| 变量 | 默认值 | 说明 |
|------|--------|------|
| `PORT` | `3000` | HTTP 端口 |
| `BASE_DOMAIN` | `localhost` | 内容子域名的基础域名 |
| `CLOUDFLARE_R2_*` | — | R2 存储 (可选: 端点、密钥、存储桶) |
| `ANON_TTL_DAYS` | `7` | 匿名发布的 TTL |
| `KEY_TTL_DAYS` | `30` | 带密钥发布的 TTL |
| `MAX_HTML_SIZE_BYTES` | `26214400` | 上传上限 (25 MB) |
| `RATE_LIMIT_ANON_PER_MINUTE` | `10` | 按 IP 的速率限制 |
| `RATE_LIMIT_KEY_PER_MINUTE` | `60` | 按密钥的速率限制 |

生产环境需要通配符 DNS 记录 (`*.your-domain`) 指向服务器，
以便内容子域名能够解析。

### 部署到 Railway

```bash
railway login
railway init --name htmldrop
railway up
```

然后在 Railway 控制台设置 `BASE_DOMAIN` 和(可选的) R2 变量，
并绑定你的域名及其通配符。

## 默认安全措施

- 所有内容都带 `X-Robots-Tag: noindex, nofollow, noarchive` 提供
- 按 IP 和按密钥的速率限制
- 一切都会因 TTL 过期
- 每个内容可选密码保护

漏洞和滥用报告见 [SECURITY.md](SECURITY.md)。

## 开发

```bash
pnpm dev        # 用 tsx 运行
pnpm test       # vitest
pnpm run build  # tsc -> dist/
```

## 许可证

[MIT](LICENSE)
