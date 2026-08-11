# XAL-1098 — Review log

## Round 1 — Correctness

**Lens**: does the diff do what the acceptance criteria say, on the edge cases too? Checked against `.agent/XAL-1098/SPEC.md` and `git diff origin/main...HEAD`.

What I checked:
- Read every changed file (`Tilgjengelighet.tsx`, `App.tsx`, `Footer.tsx`, `scripts/prerender.mjs`, `src/lib/search/corpus.ts`, `src/entry-server.h1.test.tsx`) against SPEC.md's stated plan — all six matched what was promised, no drive-by scope creep.
- Diffed `Tilgjengelighet.tsx` against its stated template (`Personvern.tsx`) line-by-line for structural parity (SEO props, `<main id="main">`, prose classes, `<Footer />`) — matches exactly.
- Ran the full suite (`npx vitest run`) — 20 files / 41 tests passed, including the new `entry-server.h1.test.tsx` case.
- Ran `npx tsc --noEmit` — clean, no type errors.
- Wrote two throwaway vitest cases calling `render("/tilgjengelighet")` directly (not committed) to inspect the actual SSR HTML output rather than trust the source read:
  - Exactly one `<h1>`, one `<main>`, footer contains `href="/tilgjengelighet"`, page links to `uustatus.no`.
  - `canonical`/`<title>` are `undefined` in the raw `render()` output — confirmed this is *not* a regression by running the identical check against `/personvern` (existing, shipped page): same `undefined`. Per SPEC.md, `scripts/prerender.mjs` injects title/canonical/OG/JSON-LD as a separate post-render step for no-JS crawlers; `entry-server.tsx`'s `render()` alone was never supposed to carry them. Confirmed `node --check scripts/prerender.mjs` passes.
- Checked `src/entry-server.main-landmark.test.tsx` / `heading-outline.test.tsx` — these assert against a fixed, curated set of representative routes (not every route), so the new page not being added to them is not a gap; it's covered by the same template class as `/personvern`, which those tests already exercise.
- Checked the `mailto:kontakt@digilist.no` address against every other usage in the codebase (`BookingsystemKommune.tsx`, `BookingsystemUtleie.tsx`, `PilotInvitationSection.tsx`, `Footer.tsx`) — matches the site-wide contact address exactly, not a typo'd or invented one.

**Found**: one real bug. `Tilgjengelighet.tsx`'s "Hvordan vi tester" list item used markdown-style backticks — `` (som `main` og `nav`) `` — inside plain JSX text. JSX does not interpret markdown, so those backticks were rendering as literal backtick characters in the actual HTML sent to users. Confirmed via the throwaway SSR-render test above (`backtick present: true` before the fix). Ironic spot for a rendering glitch to land, given the page's subject.

**Fixed**: replaced the markdown backticks with `<code>main</code>` and `<code>nav</code>`, matching the existing `<code>` precedent in `src/pages/Transparens.tsx:385`. Re-ran the full suite (41/41 pass) and `tsc --noEmit` (clean) after the fix.

**Not a finding, scope note carried over from SPEC.md**: SPEC.md already scopes out formally registering the erklæring on uustatus.no itself (external government action, no API access) and treats the two sustainability findings as already shipped by XAL-1156. I re-verified both claims are still true on this branch (`nginx.snippet.conf` unchanged by this diff, `grep -rn "nginx.snippet"` still only finds the file itself) rather than re-litigating the decision — this round's job is correctness of what's built, not re-deciding scope that's already documented and justified.

## Round 2 — Regression

**Lens**: what ELSE reads this code path? Grepped every consumer of every file touched by the diff (`Footer.tsx`'s `juridisk`, `corpus.ts`'s `ROUTE_ITEMS`, `App.tsx`'s route table, `prerender.mjs`'s `ROUTES`/sitemap arrays), not just the six files the diff itself edited, to check nothing else depends on the pre-change shape of those consumers.

What I checked:
- `juridisk` array in `Footer.tsx`: only one render site (`juridisk.map` at line 400, same file) and no other file references the identifier — checked `MobileMenu.tsx` specifically in case it duplicates the legal-links list independently (it doesn't; no legal links there at all, so no second list to fall out of sync).
- `ROUTE_ITEMS` / `getSearchCorpus()`: consumers are `GlobalSearch.tsx` (site search — builds the full corpus into a `useMemo`, no slicing/truncation that would hide a 25th entry), `useChatbot.ts` and `src/lib/chatbot/rag.ts` (chatbot RAG — `rag.ts` does `.slice(0, k)` / `.slice(0, 6)` on *scored hit* lists, not on the source corpus, so adding one more corpus item can only ever add a candidate, never silently push an existing one out). No count assertions on `ROUTE_ITEMS` length anywhere (`grep` for `ROUTES.length`/`routes.length`/`ROUTE_ITEMS.length` across `src/` and `scripts/` — zero hits).
- `App.tsx`'s route table: no other file enumerates or cross-checks the route list (no "every App.tsx route must appear in X" consistency test — grepped `src/*.test.tsx` for `ROUTES` and found nothing outside `entry-server.route-split.test.tsx`, which asserts against a fixed, unrelated set of already-shipped lazy routes and is untouched by this diff). No redirects/rewrites config (`_redirects`, `vercel.json`, `netlify.toml`) that hardcodes a page allowlist exists in this repo to fall out of sync.
- `prerender.mjs`'s `ROUTES` array and sitemap-entries array: both flat, order-independent, and the new entries were appended without touching any existing entry — re-ran `node --check scripts/prerender.mjs` (syntax-only, matches Round 1's approach since the full script needs a live Convex/build context to execute).
- `server/nginx.snippet.conf`: re-confirmed (again) it has no route-specific allowlist that would need a `/tilgjengelighet` entry — its locations are all extension/prefix based (`/api/`, `/assets/`, `/fonts/`, a file-extension regex), not a per-route list.

**Found**: one real gap. `public/sitemap.xml` is a *committed, static fallback* copy of the sitemap — `vite build` copies everything in `public/` verbatim into `dist/` before `scripts/prerender.mjs` runs and overwrites `dist/sitemap.xml` with the freshly generated one (`prerender.mjs:2716`, `join(DIST, "sitemap.xml")`). So in a full production build the committed file is transient and gets clobbered — but every prior route-adding commit in this repo's history still hand-updates it in the same PR (`7153692` "add missing bryllupslokale URLs to static sitemap", plus two earlier commits each adding new URL blocks). That makes it a real, established consumer of "the current route list" — anyone running `vite dev` (which serves `public/` files directly, unbuilt) or reading `public/sitemap.xml` straight from the repo gets a sitemap that's silently missing `/tilgjengelighet`, breaking the pattern every sibling page-addition commit maintained. This diff added the sitemap entry to `scripts/prerender.mjs`'s in-script array but never touched `public/sitemap.xml` itself.

**Fixed**: added the matching `<url>` block for `https://digilist.no/tilgjengelighet` to `public/sitemap.xml`, in the same position (right after `/cookies`) and same shape (`lastmod`/`changefreq`/`priority`) as the other three legal pages already there, using today's date for `lastmod` per the file's existing per-commit dating convention.

## Round 3 — Security

**Lens**: authz, tenant isolation, injection, secrets, and anything user-supplied that reaches a query, a path, or a page. Checked against the full `git diff origin/main...HEAD` (all 9 changed files, not just the new page).

What I checked:
- **Injection**: `Tilgjengelighet.tsx` renders only hardcoded, author-written JSX text nodes — no `dangerouslySetInnerHTML`, no template interpolation of anything external, no markdown-to-HTML step. `grep -inE "dangerouslySetInnerHTML|eval\("` across all 9 changed files: zero hits. The two `<a>` tags (`mailto:kontakt@digilist.no`, `https://uustatus.no`) are both literal strings in source, not built from any variable.
- **Reverse tabnabbing**: the `uustatus.no` link uses `target="_blank"` — confirmed it carries `rel="noopener noreferrer"` (`Tilgjengelighet.tsx:94-95`), same guard as every other external link in the legal-page family.
- **Authz / route exposure**: confirmed the new `<Route path="/tilgjengelighet">` (`App.tsx:372`) sits inside the same top-level `<Routes>` block as `/personvern`/`/cookies`/`/salgsvilkar` (lines 298-477), not inside any `ConvexScope`/auth-gated subtree — `ConvexScope` in this file wraps only the status/blog-preview/admin-dashboard routes, and this diff doesn't touch or move that boundary. No new route accidentally lands in a protected area, and no existing protected route is newly exposed.
- **Tenant isolation**: not applicable — this app has no multi-tenant/RBAC model (confirmed by existing memory: this repo is marketing/content-ops only, no booking/tenant domain). The new page and its footer link render identically for every visitor; nothing is scoped per-org or per-user.
- **Secrets**: `grep -inE "apiKey|secret|token|password"` across the 9 changed files surfaces only pre-existing, untouched lines in `scripts/prerender.mjs` (the `ADMIN_BASIC_AUTH`/Convex `adminToken` keyword-fetch helper at lines 30-42, unchanged by this diff — the diff's only edits to that file are the two static route/sitemap array entries at lines ~1946-1955 and ~2638) and a pre-existing comment in `App.tsx` about admin auth (lines 250-253, also untouched). No new secret, credential, or token introduced anywhere in this diff.
- **User-supplied input**: swept every changed file for anything reading from `location.search`, route params, form input, or request bodies — none of the 9 files do. The entire diff is static content plus static route/metadata registration; there is no code path here where a visitor's input reaches a query, a file path, or gets reflected into a page.

**Found**: nothing. This diff has no user-controlled input, no authz boundary change, no secret, and no injection sink — it's a static legal page wired into the same public route table as its three siblings. Recorded as a clean pass, not skipped.

**No fixes required for this round.**

## Round 4 — Scope

**Lens**: is anything in this diff NOT the stated change? Drive-by edits, unrelated tidying, files nobody asked to be touched. Checked `git diff origin/main...HEAD --stat` against `.agent/XAL-1098/SPEC.md`'s "WHAT CHANGES" list and each commit's own stated intent.

What I checked:
- Full file list (`git diff origin/main...HEAD --name-only`): `.agent/XAL-1098/{SPEC,REVIEW}.md`, `public/sitemap.xml`, `scripts/prerender.mjs`, `src/App.tsx`, `src/components/Footer.tsx`, `src/entry-server.h1.test.tsx`, `src/lib/search/corpus.ts`, `src/pages/Tilgjengelighet.tsx` — exactly the six code files SPEC.md named up front, plus the two process docs and the one file round 2 justified adding (`public/sitemap.xml`). No thirteenth file, nothing in `server/`, no `MobileMenu.tsx`/logo swap (that's XAL-1156's, confirmed still untouched here).
- Read every hunk in each of the 7 code diffs (not just the stat) looking for anything riding along with the stated addition — every hunk is a pure append (new array entry, new route, new test case, new file); no hunk touches an existing line, reformats, renames, or reorders anything pre-existing. `git status` is clean, so nothing is staged/uncommitted beyond what's in these 5 commits either.
- `src/lib/search/corpus.ts`'s one-line addition: not explicitly named in the ticket text, but it's the same "wire a new legal page into every place its three siblings already are" pattern SPEC.md documents (§"WHAT CHANGES" item 5) — treating this as in-scope integration, not a drive-by, since leaving it out would make the new page the only legal page missing from site search/chatbot discovery.
- `Tilgjengelighet.tsx`'s body copy mentions "bookingplattformen" — checked this wasn't an invented/scope-creeping product claim by grepping other site copy (`Salgsvilkar.tsx:14`, two blog posts) for the same term: it's the site's existing standard word for the product, reused consistently, not new terminology introduced by this page.
- Commit `af00717` (the pre-existing empty ticket-scaffold "chore" commit) and `864f445`/`da4808d`/`de52a2c` (rounds 1-3, already reviewed for their own content in prior rounds): confirmed none of them smuggle in anything beyond what their own commit messages claim — `git show --stat` on each matches its message.
- The two sustainability findings: SPEC.md documents these as already-shipped by XAL-1156 and deliberately not touched here. Confirmed (again) `server/nginx.snippet.conf` does not appear anywhere in `git diff origin/main...HEAD --name-only` — the decision to not touch it is being honored, not silently reversed by a later round.

**Found**: nothing. Every changed file, and every hunk within every changed file, maps directly to something SPEC.md or a prior round's stated finding called for. No unrelated tidying, no reformatting, no files touched that weren't asked for.

**No fixes required for this round.**

## Proof

This diff adds new behavior (a page + footer link that didn't exist before) —
per the "adding new behaviour → the AFTER only" rule there's no "before"
screenshot to capture. Verified live against `pnpm dev:client`
(http://localhost:8080) via `agent-browser`, not just by reading source:

- `.agent/XAL-1098/proof/01-footer-link.png` — homepage footer colophon,
  scrolled to the "Juridisk" nav: `TILGJENGELIGHET` sits alongside
  `PERSONVERN` / `SALGSVILKÅR` / `COOKIES`, exactly as SPEC.md's "link it in
  the footer" requirement describes.
- `.agent/XAL-1098/proof/02-tilgjengelighet-page-top.png` — clicking that
  link navigates to `/tilgjengelighet` and renders the
  "Tilgjengelighetserklæring" page (`<title>Tilgjengelighetserklæring ·
  Digilist | WCAG 2.1 AA</title>`), §1 "Standard og regelverk".
- `.agent/XAL-1098/proof/03-tilgjengelighet-page-mid.png` — §4
  "Tilbakemelding og klage": the `kontakt@digilist.no` mailto link and the
  `uustatus.no` link (the ticket's explicit "(uustatus.no)" ask) both render.
- `.agent/XAL-1098/proof/04-code-tags-fix.png` — §2 "Hvordan vi tester":
  live re-check of Round 1's backtick-rendering bug fix — "landemerker (som
  `main` og `nav`)" now renders with real `<code>` styling in the browser,
  not literal backtick characters.
- `.agent/XAL-1098/proof/dom-checks.txt` — `agent-browser eval` output run
  against the live DOM (not source-reading): exactly one `<h1>` on
  `/tilgjengelighet`, zero literal backtick characters anywhere in
  `document.body.innerText`, and the footer anchor's exact `outerHTML`
  confirming `href="/tilgjengelighet"`.

## Note on step 0 (AGENT-SPEC.md)

This session resumed from an interrupted run whose instructions assumed a
root-level `AGENT-SPEC.md` didn't exist. It doesn't — and per prior-session
memory (main's `15c7b14` deleted the root copy on purpose because per-branch
copies collide on every merge) it's deliberately not recreated there.
`.agent/XAL-1098/SPEC.md` already exists, was written in an earlier part of
this same session before the interruption, and already contains the full
"HOW IT WORKS NOW" / "WHAT CHANGES" / "BLAST RADIUS" writeup and a mermaid
diagram — i.e. step 0 was in fact completed, just not at the path the resume
prompt expected. Attaching it to the Linear issue was not possible: no
Linear MCP tools are reachable from this session (re-confirmed here, same as
prior-session memory from XAL-1151 — no Linear-related tools surface via
ToolSearch at all, not just a wrong-workspace issue).
