<p align="center">
  <a href="https://htmldrop.link"><img src="../.github/logo.svg" width="140" alt="htmldrop 로고"></a>
</p>

<h1 align="center">htmldrop</h1>

<p align="center"><b>에이전트를 위한 HTML 퍼블리싱 — API 호출 한 번, MCP 서버 포함.</b></p>

<p align="center">
  <a href="https://htmldrop.link"><img src="https://img.shields.io/badge/htmldrop.link-live-e8503a" alt="htmldrop.link"></a>
  <a href="https://github.com/vin-spiegel/htmldrop/actions/workflows/ci.yml"><img src="https://github.com/vin-spiegel/htmldrop/actions/workflows/ci.yml/badge.svg" alt="CI"></a>
  <a href="https://www.npmjs.com/package/htmldrop-mcp"><img src="https://img.shields.io/npm/v/htmldrop-mcp" alt="npm"></a>
  <a href="../LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="MIT"></a>
</p>

<p align="center"><a href="../README.md">English</a> · 한국어 · <a href="README.ja.md">日本語</a> · <a href="README.zh-CN.md">简体中文</a> · <a href="README.es.md">Español</a> · <a href="README.fr.md">Français</a> · <a href="README.de.md">Deutsch</a></p>

---

htmldrop은 HTML, Markdown, PDF, 이미지 결과물을 몇 초 만에 공유 링크로
만들어 줍니다. 리포트, 대시보드, 차트, 데모 — 에이전트(또는 사람)가 만든
무엇이든. Markdown·텍스트·JSON은 깔끔한 리더 페이지로 렌더링되고, PDF와
이미지는 원본 그대로 서빙됩니다. git도, 빌드도, 대시보드도 없습니다.

**지금 사용해 보기: [htmldrop.link](https://htmldrop.link)** — HTML 파일을
끌어다 놓거나, HTML 소스를 붙여넣거나, API로 POST하세요.

## 동작 방식

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

모든 링크는 전용 서브도메인, 자동 생성 Open Graph 미리보기 카드, TTL을
갖습니다 — 공유한 결과물이 영원히 남지 않습니다.

## 에이전트 연결하기 (MCP)

호스티드 MCP 서버는 `https://htmldrop.link/mcp` (SSE)에 있으며,
`publish_html` 도구 하나를 제공합니다.

### Claude Code

```bash
claude mcp add --transport sse htmldrop https://htmldrop.link/mcp
```

### Claude Desktop

Claude Desktop은 stdio 방식이므로
[`mcp-remote`](https://www.npmjs.com/package/mcp-remote)로 호스티드 서버에
연결합니다. `claude_desktop_config.json`에:

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

Cursor는 SSE URL에 바로 연결됩니다. `.cursor/mcp.json`에:

```json
{
  "mcpServers": {
    "htmldrop": { "url": "https://htmldrop.link/mcp" }
  }
}
```

### Codex CLI

`~/.codex/config.toml`에:

```toml
[mcp_servers.htmldrop]
command = "npx"
args = ["-y", "mcp-remote", "https://htmldrop.link/mcp"]
```

### 셀프호스팅 인스턴스 (npm, stdio)

htmldrop을 직접 운영 중인가요?
[`htmldrop-mcp`](https://www.npmjs.com/package/htmldrop-mcp) 패키지는
**당신의** 스토리지와 도메인으로 게시하는 로컬 stdio MCP 서버입니다:

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

### `publish_html` 도구

| 인자 | 타입 | 설명 |
|------|------|------|
| `html` | string | 게시할 HTML 콘텐츠 (`markdown` / `url`로 대체 가능) |
| `markdown` | string | Markdown 콘텐츠 — 스타일이 입혀진 리더 페이지로 렌더링 |
| `url` | string | 가져와서 게시할 원격 HTML 페이지 |
| `title` | string | 메타데이터·소셜 카드용 제목 (선택) |
| `ttl_days` | number | 결과물이 만료되기까지의 일수 |
| `password` | string | 비밀번호 보호 (선택) |
| `owner_key` | string | 더 높은 한도와 긴 TTL을 위한 키 (선택) |

에이전트용 전체 문서는 [AGENTS.md](../AGENTS.md)에 있으며,
[htmldrop.link/agents.md](https://htmldrop.link/agents.md)에서도 서빙됩니다.

## REST API

| 엔드포인트 | 본문 | 비고 |
|-----------|------|------|
| `POST /publish` | JSON `{ html \| markdown, title, ttl_days, password, url }` | 기본 엔드포인트 |
| `POST /publish/raw` | raw 본문: `text/html`, `text/markdown`, `text/plain`, `application/json`, `text/csv`, `application/pdf`, `image/*` | 제목은 `x-htmldrop-title` 헤더 또는 `?title=` |
| `POST /publish/from-url` | JSON `{ url, title, ttl_days, password }` | 페이지를 가져와 다시 게시 |

`x-htmldrop-key` 헤더로 오너 키를 전달하면 더 높은 속도 제한과 더 긴 기본
TTL이 적용됩니다. (`x-pin-key`도 하위 호환용으로 계속 허용됩니다.)

## 셀프호스팅

```bash
git clone https://github.com/vin-spiegel/htmldrop.git
cd htmldrop
pnpm install
cp .env.example .env   # 기본값 그대로 동작합니다
pnpm dev               # http://localhost:3000
```

Cloudflare R2가 설정되지 않으면 로컬 파일시스템으로 폴백됩니다 —
데이터베이스 없이 수평 확장됩니다.

### 환경 변수

| 변수 | 기본값 | 설명 |
|------|--------|------|
| `PORT` | `3000` | HTTP 포트 |
| `BASE_DOMAIN` | `localhost` | 결과물 서브도메인의 베이스 도메인 |
| `CLOUDFLARE_R2_*` | — | R2 스토리지 (선택: 엔드포인트, 키, 버킷) |
| `ANON_TTL_DAYS` | `7` | 익명 게시물 TTL |
| `KEY_TTL_DAYS` | `30` | 키 게시물 TTL |
| `MAX_HTML_SIZE_BYTES` | `26214400` | 업로드 상한 (25 MB) |
| `RATE_LIMIT_ANON_PER_MINUTE` | `10` | IP당 속도 제한 |
| `RATE_LIMIT_KEY_PER_MINUTE` | `60` | 키당 속도 제한 |

프로덕션에서는 결과물 서브도메인이 해석되도록 와일드카드 DNS 레코드
(`*.your-domain`)가 서버를 가리켜야 합니다.

### Railway 배포

```bash
railway login
railway init --name htmldrop
railway up
```

이후 Railway 대시보드에서 `BASE_DOMAIN`과 (선택) R2 변수를 설정하고,
도메인과 와일드카드를 연결하세요.

## 기본 안전장치

- 모든 결과물은 `X-Robots-Tag: noindex, nofollow, noarchive`로 서빙
- IP별·키별 속도 제한
- 모든 것이 TTL로 만료
- 결과물별 비밀번호 보호 (선택)

취약점·남용 신고는 [SECURITY.md](SECURITY.md)를 참고하세요.

## 개발

```bash
pnpm dev        # tsx로 실행
pnpm test       # vitest
pnpm run build  # tsc -> dist/
```

## 라이선스

[MIT](../LICENSE)
