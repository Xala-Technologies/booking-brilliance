# Digilist Ecosystem Intelligence Center

> Observability + quality assurance + SEO + compliance + security posture
> management for the entire Digilist ecosystem — not just the marketing site.

## Surfaces monitored

Each surface is registered in `src/targets.ts` with a richer model than v1:

```ts
{
  name: "marketing",
  origin: "https://digilist.no",
  type: "marketing" | "app" | "dashboard" | "docs" | "api" | "status",
  environment: "production" | "staging" | "preview",
  indexable: true | false,         // gates SEO + sitemap expectations
  requiresAuth: true | false,      // gates which audits run
  checks: AuditType[],             // per-surface check allowlist
  active: true | false,            // master toggle
}
```

Current inventory (only `marketing` is active by default; the rest are
declared but dormant until each ships its scanner profile):

| Target | Type | Env | Indexable | Auth | Checks active |
|---|---|---|---|---|---|
| digilist.no | marketing | prod | ✓ | — | uptime, seo, a11y, security, links |
| dev.digilist.no | marketing | staging | × | — | uptime, a11y, security, links |
| app.digilist.no | app | prod | × | ✓ | uptime, security, links |
| docs.digilist.no | docs | prod | ✓ | — | uptime, seo, a11y, security, links |
| dashboard.digilist.no | dashboard | prod | × | ✓ | uptime, security, a11y |
| api.digilist.no | api | prod | × | ✓ | uptime, security |
| status.digilist.no | status | prod | ✓ | — | uptime, security |

The orchestrator gates each (target × audit_type) pair on `target.checks` —
we never run SEO on `/api` or expect a sitemap on `/dashboard`.

## Auditor matrix

| Audit type | Status | Source | Notes |
|---|---|---|---|
| **uptime** | ✅ shipped | `auditors/uptime.ts` | HTTP status + response time + TLS expiry via `tls.connect`. Cheap, runs on every surface. |
| **seo** | ✅ shipped | `auditors/seo.ts` | Wraps the SEO crawler. Indexable surfaces only. |
| **a11y** (cheerio) | ✅ shipped | `auditors/a11y.ts` | lang, alt, label-for, heading order, landmarks, link/button accessible names, duplicate IDs, skip link. |
| **security** | ✅ shipped | `auditors/security.ts` | HSTS/CSP/X-Frame/Referrer/Permissions + sensitive-path probes + mixed content + source maps. |
| **links** | ✅ shipped | `auditors/links.ts` | External link HEAD-checker with 405→GET fallback. |
| **a11y** (axe-core) | ⏳ pass 2 | needs Playwright | Real WCAG 2.1 AA via `@axe-core/playwright`. ~500 MB Chromium dependency. |
| **performance** (Lighthouse CI) | ⏳ pass 2 | needs runner | LCP / CLS / INP / FCP / TTFB + bundle weight regression. |
| **security baseline** (OWASP ZAP) | ⏳ pass 2 | needs Docker | Passive baseline scan only — no active attacks. Authorized Digilist-owned domains only. |
| **vulns** (npm-audit / Dependabot / Snyk) | ⏳ pass 3 | needs API tokens | Importer for package + container CVEs. |
| **api-health** (synthetic probes) | ⏳ pass 2 | needs runner | `/health`, `/ready`, response time, DB-connect health endpoint. |
| **runtime-errors** | ⏳ pass 3 | needs Sentry/Plausible | Capture JS errors / network failures on production. |

## Backend API (server/index.mjs)

```
GET  /api/health                              → liveness, audit configured?
GET  /api/audits/state    (basic-auth)        → JSON snapshot of latest runs
POST /api/audits/run      (basic-auth)        → spawn `pnpm audit:all`, returns runId
```

Server env on VPS:
- `ADMIN_BASIC_AUTH` — `user:pass` string for basic-auth gate
- `AUDIT_SNAPSHOT_PATH` — default `/var/www/digilist-audit/state.json`
- `AUDIT_REPO_DIR` — checkout containing `tools/site-intelligence` and `pnpm`

Deploy.sh stage 2.7 ships:
- `tools/site-intelligence/` → `/var/www/digilist-audit/tools/site-intelligence/`
- Generated `package.json` with just the audit deps (`better-sqlite3`, `cheerio`, `tsx`)
- Bootstrap `state.json` so the dashboard renders before the first remote run

## Dashboard (`/admin/intelligence`)

Rendered by `src/pages/AdminIntelligence.tsx`. Behind basic-auth login card.
Currently surfaces:

1. **Ecosystem overview** — surfaces total / healthy / with-errors,
   ecosystem-wide avg score, error/warn rollup. ✅ shipped
2. **Surface tiles** — type/env/indexable/auth badges + per-audit score grid
   + "Run scan" button. ✅ shipped
3. **What went wrong** — issue feed sorted by severity with surface,
   category, rule, message, affected count, last-seen timestamp.
   Filterable by error / warn / info / all. ✅ shipped
4. **Recent scans** — last 30 runs, status + score. ✅ shipped
5. **Top findings** — frequency-ranked rule occurrences. ✅ shipped
6. **External controls** — outbound to GSC, Plausible, SSL Labs,
   SecurityHeaders, PageSpeed, Resend. ✅ shipped

Planned modules (deferred):

7. **Domain inventory editor** — UI for `targets.ts` (read-only today)
8. **Uptime monitor (timeline)** — multi-day chart of uptime % per surface
9. **WCAG monitor (per-page drilldown)** — axe-core findings grouped by impact
10. **Vulnerability monitor** — import GH Dependabot + Snyk JSON
11. **Performance regression** — Lighthouse score delta vs last run
12. **AI recommendations** — Claude proposes fix + acceptance criteria per finding
13. **Task generator** — issue clusters → GitHub Issues / CSV / PDF export
14. **Incident timeline** — single-thread view of severity transitions
15. **Regression history** — score-over-time charts per audit type
16. **Audit log** — scan-started / -completed / issue-detected / config-changed

## Scheduled scans (deferred)

System cron (or `node-cron` inside `server/index.mjs`):

- `uptime` — every 5 min on production surfaces
- `security` — daily
- `seo` — daily for marketing, weekly for docs
- `a11y` baseline — daily
- `links` — daily
- `axe-core` (pass 2) — daily, off-hours
- `Lighthouse CI` (pass 2) — daily, off-hours
- `OWASP ZAP baseline` (pass 2) — weekly
- `vulns` import (pass 3) — daily

## Phased roadmap

### Phase 1 — Foundation (shipped 2026-05-14 → 2026-05-15)

- ✅ Multi-target audit infrastructure (SQLite, orchestrator, snapshot)
- ✅ 4 auditors: seo, a11y (cheerio), security, links
- ✅ Static HTML dashboard + live `/admin/intelligence` route
- ✅ Basic-auth gating on `/api/audits/state` + `/api/audits/run`
- ✅ Deploy.sh wires `/var/www/digilist-audit/` + bootstrap snapshot

### Phase 1.5 — Ecosystem expansion (shipped 2026-05-15)

- ✅ Richer Target model: type / environment / indexable / requiresAuth / checks
- ✅ Surface inventory expanded to 7 surfaces (added api, status)
- ✅ **Uptime + SSL auditor** (HTTP status, response time, cert expiry)
- ✅ Per-surface audit gating via `target.checks`
- ✅ Ecosystem overview tile (surfaces healthy, error count, avg score)
- ✅ **What Went Wrong** issue feed with severity filter

### Phase 2 — Real WCAG + Performance (next)

- Playwright + `@axe-core/playwright` for actual WCAG 2.1 AA
- Lighthouse CI integration → store LCP / CLS / INP / FCP / TTFB per page
- Structured-data validator (schema.org JSON-LD shape check)
- Activate `dev.digilist.no` target after content parity sign-off
- Cron schedule: uptime every 5 min, full audit daily

### Phase 3 — Security posture + Vulns

- OWASP ZAP baseline runner (Docker container, weekly schedule)
- npm audit / GitHub Dependabot import for `digilist` monorepo
- Container image scan import (if container deploys exist)
- Secret-scanning runner (truffleHog or git-secrets)

### Phase 4 — Authenticated app surfaces

- Session injection for `app.digilist.no` + `dashboard.digilist.no`
  (cookie / bearer-token profile per surface)
- Per-route scan profiles for app: search, listings, booking flow, login
- Tenant-scoped scan runs (admin can request "scan as this tenant")

### Phase 5 — AI + Task generation

- Claude proposes fix + acceptance criteria per (severity, rule, surface)
- Issue cluster → GitHub Issues (Linear if migrated)
- PDF / CSV exports per surface

### Phase 6 — RBAC + audit logging

- Migrate dashboard from basic-auth → app-shell `RequireAuth` + RBAC
  (PlatformAdmin / Developer / Viewer)
- Audit-log every scan trigger + config change to `convex` audit table

## Risks + constraints

- **better-sqlite3 native build.** Lockfile pins one version; install on VPS
  rebuilds the native binding via prebuild-install or node-gyp.
- **Authenticated scans.** Session injection introduces a real attack
  surface — keep profiles out of the public repo, store in `/etc/digilist-api.env`.
- **OWASP ZAP only on owned domains.** Never scan third-party origins from
  the dashboard, even if a user pastes the URL.
- **Chromium footprint.** Pass 2 brings ~500 MB Chromium to the VPS; consider
  a separate audit-runner host if `digilist-api` stays small.

## Out of scope (intentional)

- Real-time uptime monitoring (use UptimeRobot / BetterStack for sub-minute SLAs)
- Synthetic browser tests (those live in `playwright/` next to the app)
- APM / distributed tracing (separate concern)
