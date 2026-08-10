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
