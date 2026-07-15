<p align="center">
  <a href="https://htmldrop.link"><img src=".github/logo.svg" width="140" alt="htmldrop ロゴ"></a>
</p>

<h1 align="center">htmldrop</h1>

<p align="center"><b>エージェントのためのHTML公開 — API呼び出し1回、MCPサーバー付き。</b></p>

<p align="center">
  <a href="https://htmldrop.link"><img src="https://img.shields.io/badge/htmldrop.link-live-e8503a" alt="htmldrop.link"></a>
  <a href="https://github.com/vin-spiegel/htmldrop/actions/workflows/ci.yml"><img src="https://github.com/vin-spiegel/htmldrop/actions/workflows/ci.yml/badge.svg" alt="CI"></a>
  <a href="https://www.npmjs.com/package/htmldrop-mcp"><img src="https://img.shields.io/npm/v/htmldrop-mcp" alt="npm"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="MIT"></a>
</p>

<p align="center"><a href="README.md">English</a> · <a href="README.ko.md">한국어</a> · 日本語 · <a href="README.zh-CN.md">简体中文</a> · <a href="README.es.md">Español</a> · <a href="README.fr.md">Français</a> · <a href="README.de.md">Deutsch</a></p>

---

htmldropは、HTML・Markdown・PDF・画像の成果物を数秒で共有リンクに変えます。
レポート、ダッシュボード、チャート、デモ — エージェント(または人)が作るもの
すべて。Markdown・テキスト・JSONはクリーンなリーダーページとしてレンダリング
され、PDFと画像はそのまま配信されます。gitもビルドもダッシュボードも不要です。

**今すぐ試す: [htmldrop.link](https://htmldrop.link)** — HTMLファイルをドラッグ
&ドロップ、HTMLソースを貼り付け、またはAPIにPOST。

## 仕組み

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

すべてのリンクには専用サブドメイン、自動生成のOpen Graphプレビューカード、
TTLが付きます — 共有した成果物が永遠に残ることはありません。

## エージェントを接続する (MCP)

ホスティッドMCPサーバーは `https://htmldrop.link/mcp` (SSE) にあり、
`publish_html` というツールを1つ公開しています。

### Claude Code

```bash
claude mcp add --transport sse htmldrop https://htmldrop.link/mcp
```

### Claude Desktop

Claude Desktopはstdioで動くため、
[`mcp-remote`](https://www.npmjs.com/package/mcp-remote) でホスティッド
サーバーへブリッジします。`claude_desktop_config.json` に:

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

CursorはSSE URLに直接接続できます。`.cursor/mcp.json` に:

```json
{
  "mcpServers": {
    "htmldrop": { "url": "https://htmldrop.link/mcp" }
  }
}
```

### Codex CLI

`~/.codex/config.toml` に:

```toml
[mcp_servers.htmldrop]
command = "npx"
args = ["-y", "mcp-remote", "https://htmldrop.link/mcp"]
```

### セルフホスト環境 (npm, stdio)

htmldropを自分で運用していますか?
[`htmldrop-mcp`](https://www.npmjs.com/package/htmldrop-mcp) パッケージは、
**あなたの**ストレージとドメインへ公開するローカルstdio MCPサーバーです:

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

### `publish_html` ツール

| 引数 | 型 | 説明 |
|------|----|------|
| `html` | string | 公開するHTMLコンテンツ (`markdown` / `url` でも可) |
| `markdown` | string | Markdownコンテンツ — スタイル付きリーダーページにレンダリング |
| `url` | string | 取得して公開するリモートHTMLページ |
| `title` | string | メタデータ・ソーシャルカード用タイトル (任意) |
| `ttl_days` | number | 成果物が期限切れになるまでの日数 |
| `password` | string | パスワード保護 (任意) |
| `owner_key` | string | 上限緩和・長いTTLのためのキー (任意) |

エージェント向けの完全なドキュメントは [AGENTS.md](AGENTS.md) にあり、
[htmldrop.link/agents.md](https://htmldrop.link/agents.md) でも配信されています。

## REST API

| エンドポイント | ボディ | 備考 |
|---------------|--------|------|
| `POST /publish` | JSON `{ html \| markdown, title, ttl_days, password, url }` | 基本エンドポイント |
| `POST /publish/raw` | rawボディ: `text/html`, `text/markdown`, `text/plain`, `application/json`, `text/csv`, `application/pdf`, `image/*` | タイトルは `x-htmldrop-title` ヘッダーか `?title=` |
| `POST /publish/from-url` | JSON `{ url, title, ttl_days, password }` | ページを取得して再公開 |

`x-htmldrop-key` ヘッダーでオーナーキーを渡すと、より高いレート制限と長い
デフォルトTTLが適用されます。(`x-pin-key` も後方互換のため引き続き有効です。)

## セルフホスティング

```bash
git clone https://github.com/vin-spiegel/htmldrop.git
cd htmldrop
pnpm install
cp .env.example .env   # デフォルトのまま動作します
pnpm dev               # http://localhost:3000
```

Cloudflare R2が未設定の場合はローカルファイルシステムにフォールバック —
データベース不要で水平スケールします。

### 環境変数

| 変数 | デフォルト | 説明 |
|------|-----------|------|
| `PORT` | `3000` | HTTPポート |
| `BASE_DOMAIN` | `localhost` | 成果物サブドメインのベースドメイン |
| `CLOUDFLARE_R2_*` | — | R2ストレージ (任意: エンドポイント、キー、バケット) |
| `ANON_TTL_DAYS` | `7` | 匿名公開のTTL |
| `KEY_TTL_DAYS` | `30` | キー付き公開のTTL |
| `MAX_HTML_SIZE_BYTES` | `26214400` | アップロード上限 (25 MB) |
| `RATE_LIMIT_ANON_PER_MINUTE` | `10` | IPごとのレート制限 |
| `RATE_LIMIT_KEY_PER_MINUTE` | `60` | キーごとのレート制限 |

本番環境では、成果物サブドメインが解決できるようワイルドカードDNSレコード
(`*.your-domain`) をサーバーに向けてください。

### Railwayへのデプロイ

```bash
railway login
railway init --name htmldrop
railway up
```

その後、Railwayダッシュボードで `BASE_DOMAIN` と (任意で) R2変数を設定し、
ドメインとワイルドカードを接続してください。

## デフォルトの安全対策

- すべての成果物は `X-Robots-Tag: noindex, nofollow, noarchive` 付きで配信
- IPごと・キーごとのレート制限
- すべてTTLで期限切れ
- 成果物ごとのパスワード保護 (任意)

脆弱性・不正利用の報告は [SECURITY.md](SECURITY.md) をご覧ください。

## 開発

```bash
pnpm dev        # tsxで実行
pnpm test       # vitest
pnpm run build  # tsc -> dist/
```

## ライセンス

[MIT](LICENSE)
