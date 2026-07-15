# 오픈소스 공개 체크리스트 — htmldrop

> 2026-07-10 기준. 완료 항목은 이미 감사/처리된 것.

## 1. 시크릿 & 보안 감사

- [x] git 히스토리 시크릿 스캔 — 초기 커밋(`678e4bb`)의 `.env`는 전부 빈 템플릿 값, 유출 없음
- [x] `.gitignore`에 `.env`, `data/`, `dist/` 포함 확인
- [x] Railway 대시보드의 실제 env 값(R2 키 등)이 코드/문서 어디에도 없는지 최종 눈검사
- [x] `.env.example` 최신화 — `MAX_HTML_SIZE_BYTES=5242880`(5MB)로 남아 있는데 코드 기본값은 25MB. 값 통일 필요

## 2. 법적 / 라이선스

- [x] `package.json`에 `"license": "MIT"` 선언됨
- [x] **LICENSE 파일 추가** (MIT 전문 + 저작권자 표기) — 파일이 없으면 GitHub이 라이선스를 인식 못 함

## 3. 브랜딩 정리 (공개 전이 이름 바꿀 마지막 기회)

- [ ] 리포 이름 `pin-publish` → `htmldrop` (GitHub이 옛 URL 자동 리다이렉트)
- [x] 랜딩 내비/푸터의 GitHub 링크를 새 리포 주소로 갱신 (`src/landing.ts` 2곳)
- [x] `package.json` `name`, `bin`(`pin-publish-mcp`) 이름 결정 — npm 배포 계획 있으면 `htmldrop`으로
- [x] `x-pin-key` 헤더 이름 유지/변경 결정 — 공개 API라 나중에 바꾸면 브레이킹. 바꾼다면 지금 (`x-htmldrop-key` + 당분간 구 헤더 병행 수용 권장)
- [x] `keywords`의 `"pin"` 제거, `htmldrop` 추가

## 4. 문서

- [x] AGENTS.md — htmldrop.link 도메인/`publish_html` 툴로 정비 완료
- [x] README 정비:
  - [x] 한 줄 소개 + htmldrop.link 링크 + 스크린샷(랜딩 or 드롭존 GIF)
  - [x] 셀프호스팅 퀵스타트 (`pnpm install` → `.env` → `pnpm dev`, R2는 선택이고 없으면 파일시스템 폴백)
  - [x] MCP 클라이언트 연결 방법 (SSE 엔드포인트, `publish_html` 스키마)
  - [x] REST API 3개 엔드포인트 요약표
  - [x] 환경변수 표 (TTL, rate limit, R2)
  - [x] 라이선스 표기
- [x] SECURITY.md — 취약점 제보 연락처 (호스티드 서비스라 특히 중요)
- [ ] CONTRIBUTING.md 또는 README에 "이슈/PR 운영 방침" 한 줄 (as-is 유지보수라면 그렇게 명시)

## 5. 코드 위생

- [x] 테스트 통과 (vitest 10개)
- [x] 타입체크 통과
- [x] CI 추가 — GitHub Actions: `pnpm install --frozen-lockfile` → `build` → `test` (공개 리포 신뢰도의 기본)
- [ ] `scratchpad`/디버그 잔재 없는지 확인 (`git status` 클린 상태로 공개)

## 6. 호스티드 서비스 신뢰 장치

- [ ] 남용 신고 연락처 (README 또는 랜딩 푸터에 이메일 한 줄)
- [x] rate limit / TTL / noindex 정책이 README에 명시돼 있는지 (사용자가 "내 데이터 어떻게 되는데?"에 답을 찾을 수 있게)

## 7. GitHub 설정 (공개 전환 시)

- [ ] repo Public 전환
- [ ] Description: "Publish HTML for agents — one API call, MCP server included" + Website: `https://htmldrop.link`
- [ ] Topics: `mcp`, `mcp-server`, `agents`, `html`, `publishing`, `claude`
- [ ] Issues 탭 켜기/끄기 결정
- [ ] Settings → 기본 브랜치 보호 (선택)

## 8. 공개 직후

- [ ] `v0.1.0` 태그 + GitHub Release
- [ ] awesome-mcp-servers 류 리스트에 등록 PR (핵심 유통 채널)
- [ ] npm 배포 여부 결정 (`publishConfig.access: public` 이미 세팅됨 — bin으로 로컬 MCP 실행 배포 가능)
