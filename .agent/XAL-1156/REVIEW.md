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
