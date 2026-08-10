## Round 1

**Lens: correctness** — does the diff do what the acceptance criteria (the four ticket
findings in SPEC.md) say, including on edge cases, not just the happy path?

### What it looked at

- `git diff origin/main...HEAD` (3 real files: `server/nginx.snippet.conf`,
  `src/components/MobileMenu.tsx`, `src/components/MobileMenu.test.tsx`) against
  the four ticket findings and every claim in `.agent/XAL-1156/SPEC.md`.
- Whether `/logo-64.webp` actually exists and is wired the same way as the
  already-shipped `Navbar.tsx`/`Footer.tsx` uses of it (same `width`/`height`,
  same decorative `alt=""`/`aria-hidden`).
- Whether `MobileMenu.test.tsx` actually exercises the bug scenario (drawer
  mounted-but-closed, not opened) rather than a trivially-true render.
- nginx location-matching semantics for the three new regex locations plus the
  `^~` added to `/api/`: match order, prefix-vs-regex precedence, and whether
  the file-extension catch-all and the `/assets/`/`/fonts/` prefix-regexes can
  shadow each other in a way that puts a file under the wrong `Cache-Control`.
- Whether the directories the new locations target actually exist in a real
  `pnpm build` output (`dist/assets` for hashed JS/CSS, `dist/fonts` for
  woff2, `dist/videos` for mp4/webm, `public/images`+`public/hero`+`public/clients`
  for non-hashed images) — i.e. whether the regexes match real paths, not just
  hypothetical ones.
- Whether `gzip_types` (missing `text/html`) still compresses HTML — checked
  against nginx's actual documented default (`text/html` is always compressed
  regardless of `gzip_types` contents) rather than assuming a gap.
- Whether the `Content-Type` nginx would assign to `.js` on this host's own
  `/etc/nginx/mime.types` matches `gzip_types`' `application/javascript`
  entry (checked the literal file on this box as the closest available proxy
  for the VPS's).
- Ran `npx tsc --noEmit` and the full `npx vitest run` suite to see whether
  the change broke anything outside its own test file.

### What it found

Nothing wrong with the diff itself.

- `/logo-64.webp` exists (2,456 bytes, valid WebP), and the swap keeps the
  same `width={64} height={64}` and decorative `alt=""`/`aria-hidden="true"`
  as the identical mark already shipped in `Navbar.tsx:141` and
  `Footer.tsx:154` — no layout or a11y regression.
- `MobileMenu.test.tsx` renders `<MobileMenu />` without opening it and still
  finds the logo `<img>` in the DOM — this does prove the drawer is
  unconditionally mounted (matching the bug SPEC.md describes) rather than
  only testing the open state. Confirmed by reading `MobileMenu.tsx`: it's a
  self-contained `useState`-driven drawer, open/closed toggling only a CSS
  transform class, never a conditional render.
- The `^~` added to `location /api/` is not cosmetic — it's load-bearing.
  Without it, nginx would prefer any of the three new regex locations over
  the plain-prefix `/api/` match for a coincidentally-matching proxied path
  (e.g. an API path ending `.svg`/`.png`), silently routing it to static
  file serving instead of the proxy. Confirmed this is standard nginx
  location-matching precedence (regex locations win over prefix locations
  unless the prefix carries `^~`), not a nice-to-have.
- Location match order (`/assets/` → `/fonts/` → extension catch-all) is
  correct for nginx's "first matching regex location in file order" rule, and
  doesn't misfire: `dist/assets/` only ever contains `.js`/`.css` (verified by
  listing a real build), `dist/fonts/` only `.woff2`, and the extension
  catch-all is what actually reaches `dist/videos/*.mp4`, `public/images/*`,
  `public/hero/*`, `public/clients/*` — none of which live under `/assets/`
  or `/fonts/`, so they correctly fall through to the third location instead
  of being shadowed by the first two.
- `gzip_types` omitting `text/html` is not a gap — nginx always compresses
  `text/html` independent of the `gzip_types` list (documented behavior),
  so the prerendered HTML documents this ticket cares about (LCP/Lighthouse
  targets are all on `/`) are compressed either way.
- `application/javascript` in `gzip_types` matches this host's own
  `/etc/nginx/mime.types` mapping for `.js` (`application/javascript js;`),
  so the hashed JS bundles under `/assets/` are the correct MIME type for
  gzip to catch them, not silently skipped by a mismatched type string.
- `npx tsc --noEmit`: clean.
- `npx vitest run`: 1 failure, `src/entry-server.main-landmark.test.tsx`
  ("wraps a lazily-loaded blog post in exactly one `<main>`") — an SSR
  Suspense-resolution race under full-suite load, in a file this diff never
  touches. Re-ran it alone: passes (3/3). Pre-existing flake, not caused by
  this change — matches the known `entry-server.tsx` SSR-race pattern from
  prior tickets (memory: XAL-3xx family), not something to "fix" as part of
  this diff.

### What changed

Nothing. This lens found no correctness defects to fix — the diff matches
what SPEC.md claims it does, on the edge cases checked above. No commit made
for this round.

## Round 2

**Lens: regression** — what ELSE reads this code path? Every consumer of the
changed files/paths was grepped (not just the three edited files), to check
nothing depended on the pre-change behaviour.

### What it looked at

- `logo.svg` / `logo-64.webp`: every reference across `src/`, `scripts/`,
  `docs/`, `server/` — confirmed `HeroPlatformPreview.tsx:209` and
  `SEO.tsx:150` (org schema `logo` field) and `scripts/prerender.mjs:2068`
  still legitimately use the full `logo.svg` (not the decorative-mark case
  this diff fixes) and are untouched. No third consumer of the drawer's
  decorative mark exists beyond `Navbar.tsx`/`Footer.tsx` (already on
  `logo-64.webp`) and the now-fixed `MobileMenu.tsx`.
- `MobileMenu` importers: only `Navbar.tsx` (confirmed, matches SPEC.md's
  claim) and the new test file.
- `nginx.snippet` references repo-wide: `infra/apply-security-headers.sh`,
  `server/README.md`, `server/index.mjs`, `tools/site-intelligence/REMEDIATION.md`.
  Read each — all four are false-positive substring matches (`nginx/snippets`,
  "nginx snippet" prose, `systemd/nginx-snippet` prose in a chatbot
  system-prompt string) or point at a *different* file
  (`infra/nginx/security-headers.conf`, applied only to
  status/dev/dashboard.dev/docs.digilist.no — **not** digilist.no, the domain
  this ticket and this diff touch). No script actually reads or applies
  `server/nginx.snippet.conf`; SPEC.md's "manually-applied, zero effect until
  pasted" claim holds.
- Whether `infra/nginx/security-headers.conf`'s header values (applied to the
  *other* subdomains) conflict with or contradict the values this diff
  re-declares for digilist.no — they differ (`X-XSS-Protection "0"` vs this
  diff's `"1; mode=block"`, no `preload` on HSTS vs this diff's `preload`),
  but that's pre-existing, intentional divergence between subdomains, not
  something this diff touches or should reconcile — this diff's values match
  `DEPLOYMENT.md`'s already-documented digilist.no header set exactly.
- `deploy.sh`'s CDN-purge layer (`CF_ZONE_ID`/`CF_API_TOKEN`, "Layer 4"):
  checked whether a live Cloudflare layer in front of digilist.no would
  change how the new `Cache-Control`/`gzip` headers actually reach end users.
  The script's own comment says purging is "No-op until a CDN is wired", and
  neither `server/.env.example` nor the repo's tracked `.env` defines
  `CF_ZONE_ID` — confirms no CDN currently sits between origin and users, so
  this diff's origin-level headers are what clients actually see today. (The
  DDoS blog post's "Digilist bruker en kommersiell CDN" line is marketing
  copy about Digilist's own product pitch, not a statement about this repo's
  infra, and isn't evidence to the contrary.)
- Whether the new nginx regex locations actually match the real build output,
  using the checked-in `dist/` from a prior build (round 1 only reasoned
  about this; round 2 listed it directly): `dist/assets/` is JS/CSS only,
  `dist/fonts/` is `.woff2` only, and every non-hashed static file actually
  shipped (`favicon-48.png`, `icon.png`, `og-image.png`, `manifest.webmanifest`,
  `logo.svg`, `logo-64.webp`, `dist/videos/*.mp4`/`*.webm`/`*-poster.jpg`,
  `dist/images`, `dist/hero`, `dist/clients`, `dist/integrations` — `.jpg`,
  `.png`, `.svg`, `.webp`) is covered by the extension catch-all. `.xml`
  (`sitemap.xml`), `.txt` (`robots.txt`, `llms.txt`, two hashed `.txt`
  files), and `.html` fall through uncached, same as before this diff — not
  a regression, just untouched (HTML staying uncached matches `deploy.sh`'s
  existing "origin's no-cache HTML headers" assumption).
- Whether `MobileMenu.test.tsx`'s `createRoot`/`act`/manual
  `IS_REACT_ACT_ENVIRONMENT` pattern and `// @vitest-environment jsdom`
  per-file override (needed because `vitest.config.ts`'s default `test.environment`
  is `"node"`) is a new, untested pattern that could behave differently across
  test files sharing a worker — checked against the three pre-existing files
  using the identical pattern (`CookieConsent.test.tsx`, `ThemedVideo.test.tsx`,
  `SEO.dedupe-ldjson.test.tsx`): all four are byte-for-byte identical in setup
  structure. Not a new risk, an established convention.
- Re-ran `npx tsc --noEmit` (clean) and `npx vitest run` on the changed test
  file plus a repo-wide search for any other test that snapshots or asserts
  on Navbar/MobileMenu output (`Navbar.test.tsx` doesn't exist; no other test
  references `logo.svg`/`logo-64` besides the new file) — nothing else reads
  the drawer's rendered output.

### What it found

No regressions. Every path that could plausibly have depended on the old
`logo.svg` reference, the old headerless/uncompressed nginx behaviour, or the
old `location /api/` prefix-match semantics was traced to its actual
consumers (or lack thereof), and each one either doesn't exist, doesn't
overlap with what changed, or already matches this diff's new behaviour.

### What changed

Nothing. No commit made for this round.

## Round 3

**Lens: security** — authz, tenant isolation, injection, secrets, and anything
user-supplied that reaches a query, a path, or a page.

### What it looked at

- Tenant/authz surface: this repo has no booking/product domain to leak
  across (memory: [repo has no booking domain at all]) — confirmed nothing
  in this diff touches `server/index.mjs`'s admin routes
  (`/api/audits/state`, `/api/content/*`, `/api/agents*`, all gated by
  `authorized(req)` / `ADMIN_BASIC_AUTH`) or introduces any new one. The only
  code files touched are `MobileMenu.tsx` (a static asset path string) and
  its test — neither takes user input.
- Injection: `server/nginx.snippet.conf`'s three new `location` blocks are
  fixed regex/prefix strings, not built from any request data, env var, or
  template interpolation — no injection surface. The `\.(?:png|jpg|...)$`
  extension list is a static alternation, properly anchored (`$`), not
  attacker-influenceable.
- Secrets: grepped the whole diff — no credentials, tokens, or key material
  added. Cross-checked `server/index.mjs` (untouched by this diff) for
  where `ANTHROPIC_API_KEY`/`RESEND_API_KEY`/`ADMIN_BASIC_AUTH` are used:
  all three stay server-side (outbound `Authorization`/`x-api-key` headers to
  Anthropic/Resend); `/api/health` only ever exposes `Boolean(...)` of each,
  never the value.
- Whether the new `gzip on` + `gzip_types application/json` +
  `gzip_proxied any` combination opens a BREACH-style compression oracle on
  `/api/*` responses (gzip settings are server-block-scoped, so they're
  inherited by the `^~ /api/` proxy location too, not just the new static
  locations) — checked for the two preconditions BREACH needs: (1) a secret
  in the response body (session token, CSRF token) and (2) attacker-supplied
  input reflected in that same response. Found neither: this API has no
  cookies/sessions/CSRF anywhere (`grep -n "csrf\|session\|Set-Cookie"
  server/index.mjs` → zero hits — auth is stateless HTTP Basic, and even
  `/api/health`, `/api/agents`, `/api/audits/*` return static
  catalog/config/boolean data, never a value that varies with request
  content the caller controls). No secret-bearing, input-reflecting response
  exists for a compression oracle to have anything to extract. Not a
  regression this diff needs to guard against.
- Whether the extension-catch-all location's inclusion of `.svg` — served
  without CSP/`X-Content-Type-Options` re-declared as `nosniff` is present,
  but SVG can still execute embedded `<script>` if navigated to directly —
  is exploitable: checked whether any `.svg` served by this app is
  user-influenced. It isn't — `find public dist -iname "*.svg"` and `grep -rln
  "multer\|upload\|formidable" server/ scripts/` confirm every SVG is a
  build-time, developer-committed asset (logo, client logos, blog hero
  illustrations); there's no upload path or dynamic-SVG-generation route
  anywhere in the repo. No attacker can get content into an `.svg` this
  location serves, so the missing CSP on that response has nothing to gate.
- Re-confirmed (independent of round 1's read) that `location ^~ /api/` is a
  security-*positive* change, not just a correctness one: without it, a
  regex location could shadow an admin API path that happened to end in a
  static extension, silently serving a 404 from disk instead of hitting
  `authorized(req)` — i.e. failing open to "not found" rather than to
  "unauthenticated 200", so even the failure mode was already safe, but
  `^~` removes the ambiguity entirely.
- Whether `Cache-Control: public` on the three new locations could cause any
  admin/authenticated response to be cached: the three locations match only
  `/assets/`, `/fonts/`, and fixed static extensions — none overlap with
  `/api/` (which `^~` guarantees always wins), so no admin JSON response can
  ever land under a `public`-cache location.

### What it found

No security defects. This diff has no authz/tenant-isolation surface (none
exists in this repo), introduces no injection vector (all new nginx config
is static), adds no secrets, and the one plausible compression-oracle
question (gzip now covering `/api/*` JSON) doesn't apply because the API has
no secret-bearing response to extract via BREACH. The `^~ /api/` change is
incidentally a hardening, not a weakening, of route-matching behavior.

### What changed

Nothing. No commit made for this round — this lens found nothing to fix.

## Round 4

**Lens: scope** — is anything in this diff NOT the stated change? Drive-by
edits, unrelated tidying, files nobody asked for.

### What it looked at

- `git diff --name-status origin/main...HEAD`: exactly 5 paths touched —
  `.agent/XAL-1156/SPEC.md` and `.agent/XAL-1156/REVIEW.md` (this workflow's
  own required process artifacts, not product code) plus the three files
  SPEC.md's "WHAT CHANGES" section names: `server/nginx.snippet.conf`,
  `src/components/MobileMenu.tsx`, `src/components/MobileMenu.test.tsx`
  (new). No other file in the repo was touched by any commit on this branch
  relative to `origin/main`.
- Confirmed the branch's other-looking commits
  (`84e8c01`/`dcdd354`/`8c9a111`, XAL-1160/1159/1161 content work) are
  already in `origin/main` — they show up in `git log` on this branch only
  because it was merged from `origin/main` (`27f1cc1`), not because this
  branch introduced them. `git diff origin/main...HEAD` already excludes
  them; verified by their absence from the 5-file stat above.
- `MobileMenu.tsx`: full-file line count check (`218` lines on
  `origin/main`, `224` here, diff reports `+8/-2`) — the arithmetic matches
  exactly one hunk touched (the `<img>` line plus a 6-line explanatory
  comment above it). No reformatting, import churn, or unrelated edits
  elsewhere in the file.
- `server/nginx.snippet.conf`: the only edits outside the three new
  `location` blocks (which exist solely to carry the ticket's
  compression/caching findings) are adding `^~` to the pre-existing
  `location /api/` and a comment explaining why. That's not a drive-by —
  round 1 and round 3 both already established it's load-bearing: without
  it, the three new regex `location`s this diff adds would shadow `/api/`
  for any proxied path ending in a static extension. It's a required
  consequence of the in-scope change, not an unrelated touch.
- `MobileMenu.test.tsx`: new file, scoped to exactly the one behavior this
  diff changes (asserts the drawer's logo `src`), not a broader test sweep.
- Checked every line of both process docs (`SPEC.md`, `REVIEW.md`) for
  claims about work done outside the three code files — none; both
  documents describe only the nginx/MobileMenu change and the review
  rounds themselves.
- Re-read the four ticket findings in SPEC.md against the diff one more
  time: LCP/Lighthouse-score (performance) are addressed by the
  `MobileMenu.tsx` transfer-size fix (SPEC.md is explicit that the 3.90s LCP
  figure itself didn't reproduce, and says so rather than inventing a fix
  for a number that wasn't real); "reduce inlined markup/defer
  non-critical/server compression" and "Cache-Control with revalidation"
  (sustainability) are addressed by `nginx.snippet.conf`'s `gzip` block and
  the three `Cache-Control` locations. Nothing in the diff serves a fifth
  purpose.

### What it found

No scope defects. Every changed line traces back to one of the four ticket
findings or is a required side-effect of an in-scope change (`^~ /api/`).
No drive-by tidying, no unrelated files, no reformatting beyond the actual
edits.

### What changed

Nothing. No commit made for this round — this lens found nothing to fix.

## Proof of work

`MobileMenu.tsx`'s logo-asset fix changes behaviour that existed both before
and after (the drawer's decorative `<img>` was always mounted, always
fetching the wrong asset) — so it was captured on both sides before the
"before" state disappeared for good, by building the exact pre-fix commit
(`96d6700`, the parent of the fix commit `623bde1`) in a throwaway worktree
and diffing it against the current build. Evidence lives in
`.agent/XAL-1156/proof/`:

- `01-before-page.png` / `02-before-drawer-open.png` — pre-fix build
  (`dist/` from commit `96d6700`) served locally, mobile viewport, drawer
  opened via `agent-browser`. DOM eval confirms the rendered `<img>` is
  still `src="/logo.svg"`.
- `03-after-drawer-open.png` / `04-after-page.png` — same flow against the
  current HEAD's `dist/`. DOM eval confirms `src="/logo-64.webp"`. Visually
  identical layout to the before screenshots (same `width`/`height`/
  `className`), confirming the swap is asset-only.
- `logo-asset-size.txt` — `curl -sI` `Content-Length` for each build's
  drawer asset: **147,179 bytes (`image/svg+xml`) before → 2,456 bytes
  (`image/webp`) after**, i.e. the ~144.7 KB/page-load saving `SPEC.md`
  claims, reproduced directly rather than only inferred from a Lighthouse
  trace.
- `mobilemenu-test-before-after.txt` — `MobileMenu.test.tsx` (this branch's
  new regression test) copied onto the pre-fix worktree and run there:
  **fails** (`expected '/logo.svg' to be '/logo-64.webp'`) on `96d6700`,
  **passes** on the current HEAD. Failing-before/passing-after test output,
  not just a "tests are green" claim.

Not captured as before/after: the `nginx.snippet.conf` gzip/`Cache-Control`
change. It's the "infra, not deployed by anything in this repo" case per
SPEC.md's BLAST RADIUS section — no `nginx` binary is available in this
sandbox to run `nginx -t` against, and even a successful syntax check
wouldn't demonstrate the headers reaching a real client, since this file is
manually pasted into the live VPS config and reloaded by a human, not by
any script this repo runs. **What a human should check after applying this
snippet to the live `digilist.no` nginx config and reloading**: `curl -sI
https://digilist.no/assets/<any-hashed-file>.js` should show `Cache-Control:
public, max-age=31536000, immutable` and a `Content-Encoding: gzip` (or
`br`, if the VPS's `ngx_brotli` module turns out to be present) on text
responses; `curl -sI https://digilist.no/api/health` should still reach the
Node process (not 404 from static) confirming `^~` didn't break the proxy.
