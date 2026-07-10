# Security Policy

htmldrop is a hosted service (htmldrop.link) and a self-hostable server that
accepts anonymous HTML uploads, so we take abuse and vulnerability reports
seriously.

## Reporting a vulnerability

Please **do not open a public issue** for security problems. Instead, report
privately via [GitHub Security Advisories](https://github.com/vin-spiegel/htmldrop/security/advisories/new).

Include what you found, how to reproduce it, and the potential impact. We will
respond as quickly as we can.

## Reporting abuse on htmldrop.link

If you find published content that is malicious, illegal, or abusive
(phishing, malware, etc.), open a regular GitHub issue with the artifact URL —
published artifacts expire automatically via TTL, but we will take reported
content down sooner.

## Hardening notes for self-hosters

- All published artifacts are served with `X-Robots-Tag: noindex, nofollow, noarchive`.
- Per-IP and per-key rate limits are enabled by default (`RATE_LIMIT_*` env vars).
- Every artifact has a TTL (`ANON_TTL_DAYS` / `KEY_TTL_DAYS`); nothing lives forever.
- Uploads are capped by `MAX_HTML_SIZE_BYTES` (default 25 MB).
