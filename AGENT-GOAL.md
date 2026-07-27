# XAL-749: LCP 6.45s (kritisk — mål <2,5s) (cwv.lcp)

> Auto-prepared by Digilist Improvements Agent. Run Claude in this worktree:
> `/loop In this marketing repo (booking-brilliance), fix critical LCP (6.45s vs 2.5s target) on status.digilist.no and app.digilist.no/transparens caused by client-side-only data fetching.

Root cause (verified directly): src/pages/Status.tsx and src/pages/Transparens.tsx both start with `useState(loading=true)`/`useState<Summary|null>(null)` and only populate real data via a `useEffect` that fetches `/api/audits/public-summary`. React never runs `useEffect` during server-side rendering, so scripts/prerender.mjs's SSR pass (via src/entry-server.tsx's `render()`, which calls `renderToString` and only retries for unresolved React.lazy Suspense markers) always emits the `LoadingState`/'Henter live data…' placeholder for these two routes. There is no data-injection step in scripts/prerender.mjs for '/status' or '/transparens' (route entries around scripts/prerender.mjs:1947-1972 only carry SEO title/description/breadcrumbs). The JSON snapshot these pages need already exists and is read the same way for the live API in server/index.mjs (AUDIT_SNAPSHOT_PATH env var, default '/var/www/digilist-audit/state.json', read at server/index.mjs:718-745 and again ~1270).

Implement:
1. In scripts/prerender.mjs, add a small helper (mirroring fetchDiscoveredKeywords's try/catch/fallback style used earlier in the file) that reads AUDIT_SNAPSHOT_PATH (env var, same default as server/index.mjs) at build time and builds the same surfaces/ecosystem/incidents summary shape server/index.mjs produces for /api/audits/public-summary (reuse/extract that transform logic into a shared module if practical, e.g. server/lib or scripts, to avoid duplicating the byTarget/surfaces mapping logic — but do not over-engineer; a straightforward port is acceptable if extraction is awkward given server/index.mjs's structure).
2. For the '/status' route, inject the resulting object into the generated HTML as `<script>window.__STATUS_SNAPSHOT = ${JSON.stringify(snapshot)}</script>` placed before/alongside the SSR body from renderBody(route). For '/transparens', do the same with `window.__TRANSPARENS_SNAPSHOT` using whatever summary shape Transparens.tsx's fetch expects (check its `PublicSummary` type in src/pages/Transparens.tsx).
3. If AUDIT_SNAPSHOT_PATH is missing/unreadable at build time, skip injection and fall back to the current loading-shell prerender (log a warning, do not fail the build — mirror the existing graceful-degradation style already used in fetchDiscoveredKeywords and server/index.mjs's `!existsSync` branch).
4. Update src/pages/Status.tsx: initialize `data` state from `window.__STATUS_SNAPSHOT` (guarded with `typeof window !== 'undefined'`) and set `loading` to false synchronously when that global is present, skipping straight to rendering EcosystemBanner/SLASection/SurfaceList/IncidentLog. Keep the existing useEffect fetch running after mount as a background refresh that updates `data` when it resolves (so the page still reflects fresh data on the client without a visible loading flash). Do the equivalent in src/pages/Transparens.tsx for `window.__TRANSPARENS_SNAPSHOT`.
5. Verify: build the project with `AUDIT_SNAPSHOT_PATH` pointing at a sample snapshot JSON file (matching the shape read at server/index.mjs:727-745, i.e. `{ latest: [...], targets: [...] }`), run the prerender step, and confirm the generated dist HTML for /status and /transparens contains real surface/SLA content instead of 'Henter live data…'. Run the project's existing test suite (vitest) and make sure it stays green — do not skip tests. Do not deploy or run Lighthouse yourself; that verification happens after PR merge in production.

Acceptance criteria: prerendered HTML for both routes shows real content when the snapshot file exists at build time; both pages initialize synchronously from the embedded snapshot and skip the loading state when present; the client fetch still runs as a background refresh after mount; build succeeds with a missing snapshot file too (graceful fallback to loading shell, no build failure); tests green before opening the PR.`

## Implementation contract — complete this before writing code
- **Problem:** In this marketing repo (booking-brilliance), fix critical LCP (6.45s vs 2.5s target) on status.digilist.no and app.digilist.no/transparens caused by client-side-only data fetching.

Root cause (verified directly): src/pages/Status.tsx and src/pages/Transparens.tsx both start with `useState(loading=true)`/`useState<Summary|null>(null)` and only populate real data via a `useEffect` that fetches `/api/audits/public-summary`. React never runs `useEffect` during server-side rendering, so scripts/prerender.mjs's SSR pass (via src/entry-server.tsx's `render()`, which calls `renderToString` and only retries for unresolved React.lazy Suspense markers) always emits the `LoadingState`/'Henter live data…' placeholder for these two routes. There is no data-injection step in scripts/prerender.mjs for '/status' or '/transparens' (route entries around scripts/prerender.mjs:1947-1972 only carry SEO title/description/breadcrumbs). The JSON snapshot these pages need already exists and is read the same way for the live API in server/index.mjs (AUDIT_SNAPSHOT_PATH env var, default '/var/www/digilist-audit/state.json', read at server/index.mjs:718-745 and again ~1270).

Implement:
1. In scripts/prerender.mjs, add a small helper (mirroring fetchDiscoveredKeywords's try/catch/fallback style used earlier in the file) that reads AUDIT_SNAPSHOT_PATH (env var, same default as server/index.mjs) at build time and builds the same surfaces/ecosystem/incidents summary shape server/index.mjs produces for /api/audits/public-summary (reuse/extract that transform logic into a shared module if practical, e.g. server/lib or scripts, to avoid duplicating the byTarget/surfaces mapping logic — but do not over-engineer; a straightforward port is acceptable if extraction is awkward given server/index.mjs's structure).
2. For the '/status' route, inject the resulting object into the generated HTML as `<script>window.__STATUS_SNAPSHOT = ${JSON.stringify(snapshot)}</script>` placed before/alongside the SSR body from renderBody(route). For '/transparens', do the same with `window.__TRANSPARENS_SNAPSHOT` using whatever summary shape Transparens.tsx's fetch expects (check its `PublicSummary` type in src/pages/Transparens.tsx).
3. If AUDIT_SNAPSHOT_PATH is missing/unreadable at build time, skip injection and fall back to the current loading-shell prerender (log a warning, do not fail the build — mirror the existing graceful-degradation style already used in fetchDiscoveredKeywords and server/index.mjs's `!existsSync` branch).
4. Update src/pages/Status.tsx: initialize `data` state from `window.__STATUS_SNAPSHOT` (guarded with `typeof window !== 'undefined'`) and set `loading` to false synchronously when that global is present, skipping straight to rendering EcosystemBanner/SLASection/SurfaceList/IncidentLog. Keep the existing useEffect fetch running after mount as a background refresh that updates `data` when it resolves (so the page still reflects fresh data on the client without a visible loading flash). Do the equivalent in src/pages/Transparens.tsx for `window.__TRANSPARENS_SNAPSHOT`.
5. Verify: build the project with `AUDIT_SNAPSHOT_PATH` pointing at a sample snapshot JSON file (matching the shape read at server/index.mjs:727-745, i.e. `{ latest: [...], targets: [...] }`), run the prerender step, and confirm the generated dist HTML for /status and /transparens contains real surface/SLA content instead of 'Henter live data…'. Run the project's existing test suite (vitest) and make sure it stays green — do not skip tests. Do not deploy or run Lighthouse yourself; that verification happens after PR merge in production.

Acceptance criteria: prerendered HTML for both routes shows real content when the snapshot file exists at build time; both pages initialize synchronously from the embedded snapshot and skip the loading state when present; the client fetch still runs as a background refresh after mount; build succeeds with a missing snapshot file too (graceful fallback to loading shell, no build failure); tests green before opening the PR.
- **Business objective:** _why this matters (from the Linear issue)_
- **Repository / branch:** `/root/booking-brilliance` @ `agent/xal-749-lcp-6-45s-kritisk-mal-2-5s-cwv-lcp`
- **Scope:** _the one change this branch delivers_
- **Out of scope:** _what you will NOT touch — no opportunistic refactor, no formatting sweeps_
- **Acceptance criteria:** _observable, demonstrable outcomes_
- **Architecture constraints:** _boundaries + patterns to follow_
- **Files likely affected:** _list them; if this grows well beyond the list, escalate_
- **Testing requirements:** _what proves it works_
- **Security considerations:** _secrets, RBAC, injection, dependencies_
- **Rollback strategy:** _how to revert safely_
- **Definition of done:** compiled · tests green · acceptance demonstrated with evidence · one reviewable change · no attribution

## Delivery rules
- One issue → one branch (`agent/xal-749-lcp-6-45s-kritisk-mal-2-5s-cwv-lcp`) → one independently reviewable change. Never main.
- Smallest valid change. No opportunistic refactoring, no broad formatting changes, no hidden dependency on another open PR.
- Validation is mandatory and staged — "code written" ≠ "compiled" ≠ "tests passed" ≠ "acceptance demonstrated". Collect evidence (test output / logs) before opening the PR.
- If scope expands beyond "Files likely affected", or the change grows large, STOP and escalate ("BLOCKED:") rather than pressing on.
- Open a PR only when green (otherwise a draft PR with a note). Delete this file before opening the PR.

## Full issue — from Linear (the source of truth for scope & acceptance)
> The Linear MCP in this environment may be bound to the WRONG workspace, so
> do NOT rely on it to read this ticket — everything you need is below. If
> something essential is genuinely missing here (e.g. a screenshot), STOP and
> end with "CLARIFICATION:" rather than guessing.

**Classification:** bug · severity major · priority P1

Product gap: LCP 6.45s (kritisk — mål <2,5s) (cwv.lcp). <!-- xaheen-triage -->
**defect** · severity major — core status page is slow for every visitor (LCP 6.45s vs 2.5s target) but content still eventually loads correctly — no data loss, no full outage, so major rather than critical

[status.digilist.no](<http://status.digilist.no>) has a Lighthouse LCP of 6.45s against a 2.5s target. Status.tsx starts with loading=true and only renders the real content (EcosystemBanner/SLASection/SurfaceList) after a client-side useEffect fetch to /api/audits/public-summary resolves; until then only a loading placeholder shows. The build-time prerender (scripts/prerender.mjs) lists /status as a route but has no data-injection step, so the shipped static HTML also only contains the loading placeholder — confirmed by reading both files directly.

**Done when**

- [ ] Prerendered HTML for /status and /transparens contains real content (not the loading placeholder) when the AUDIT_SNAPSHOT_PATH snapshot file exists at build time
- [ ] Status.tsx and Transparens.tsx initialize from the embedded snapshot synchronously and skip the loading state when it is present
- [ ] The existing client fetch still runs after mount as a background refresh
- [ ] Lighthouse LCP for [status.digilist.no](<http://status.digilist.no>) drops below 2.5s after deploy

**How to verify**

* Build with AUDIT_SNAPSHOT_PATH pointing at a sample snapshot, confirm the rendered HTML for /status shows real content instead of 'Henter live data…'
* Run Lighthouse against [https://status.digilist.no](<https://status.digilist.no>) after deploy and confirm LCP <2.5s

Target repo: `marketing`

<details><summary>Reporter's original text</summary>

**Classification:** bug · severity major · priority P1

LCP 6.45s (kritisk — mål <2,5s) (cwv.lcp). LCP 6.45s (kritisk — mål <2,5s)
Regel: cwv.lcp
Overflate: Status — [status.digilist.no](<http://status.digilist.no>)
Affiserte sider: 1
Eksempel-URL: [https://status.digilist.no](<https://status.digilist.no>) Observed at [https://status.digilist.no](<https://status.digilist.no>). Classification: bug/major — gap. Relevant code: src/pages/Status.tsx:145-170,224-244, src/entry-server.tsx, scripts/prerender.mjs:1957-1965, src/App.tsx:95,376, server/index.mjs:71-72,683,727.

**Scope**
Eliminate the client-side round trip that currently blocks the LCP element on [status.digilist.no](<http://status.digilist.no>). In scripts/prerender.mjs, for the '/status' (and '/transparens', same pattern) route, read the AUDIT_SNAPSHOT_PATH JSON snapshot at build time (same file server/index.mjs already reads for the API) and inject it into the prerendered HTML as an embedded initial-state script (e.g. window.**STATUS_SNAPSHOT** = {...}), falling back to the current loading-shell behavior if the file is unavailable at build time (mirroring the existing Convex-unavailable fallback already in prerender.mjs). Update src/pages/Status.tsx to read window.**STATUS_SNAPSHOT** as the initial state (skip 'loading' and the fetch entirely when present) instead of always starting from loading=true, so real content is present in the very first paint. Keep the existing fetch as a background refresh after mount so t

…(truncated)

</details> Current assessment: gap (bug, major). Relevant code: src/pages/Status.tsx:141-168, src/pages/Transparens.tsx:109-115,216, src/entry-server.tsx:33-56, scripts/prerender.mjs:1958-1965, server/index.mjs:71-72,718-727.

**Scope**
In scripts/prerender.mjs, before calling renderBody(route) for '/status' and '/transparens', read AUDIT_SNAPSHOT_PATH (reuse the same JSON shape server/index.mjs builds at lines 718-745ish) and build a serialized snapshot object; inject it into the generated HTML as `<script>window.__STATUS_SNAPSHOT = {...}</script>` (and an analogous __TRANSPARENS_SNAPSHOT for that route) before the SSR body, falling back to the current loading-shell output when the file is missing/unreadable. Update Status.tsx and Transparens.tsx to read the injected global synchronously as the initial useState value and skip the loading state when present, while still running the existing useEffect fetch afterward as a background refresh. Touch points: src/pages/Status.tsx:141-168 (useState(loading=true) + useEffect fetch to /api/audits/public-summary; SSR never runs useEffect, so renderToString always emits LoadingState ("Henter live data…", line 259) with no h1-adjacent real content); src/pages/Transparens.tsx:109-115,216 (identical loading=true + useEffect fetch pattern); src/entry-server.tsx:33-56 (render() only retries for unresolved React.lazy Suspense markers; has no concept of awaiting a component's data fetch, so it can't help this case); scripts/prerender.mjs:1958-1965 (/status route entry has only SEO title/description/breadcrumbs — no data-injection step, confirmed no AUDIT_SNAPSHOT_PATH or window.__STATUS_SNAPSHOT reference anywhere in the file); server/index.mjs:71-72,718-727 (AUDIT_SNAPSHOT_PATH env + JSON snapshot read/shape already exists for the live API endpoint — same data prerender.mjs needs to read at build time).

**Done when**

- [ ] In scripts/prerender.mjs, before calling renderBody(route) for '/status' and '/transparens', read AUDIT_SNAPSHOT_PATH (reuse the same JSON shape server/index.mjs builds at lines 718-745ish) and build a serialized snapshot object; inject it into the generated HTML as `<script>window.__STATUS_SNAPSHOT = {...}</script>` (and an analogous __TRANSPARENS_SNAPSHOT for that route) before the SSR body, falling back to the current loading-shell output when the file is missing/unreadable. Update Status.tsx and Transparens.tsx to read the injected global synchronously as the initial useState value and skip the loading state when present, while still running the existing useEffect fetch afterward as a background refresh.

## Code analysis (evidence, marketing @ e55c0be1)

Status: **gap** (confidence 95%)

* `src/pages/St

Linear: https://linear.app/xala-technologies/issue/XAL-749/lcp-645s-kritisk-mal-25s-cwvlcp
