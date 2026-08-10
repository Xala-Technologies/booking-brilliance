# XAL-1127 — Adversarial Review

## Round 1 — Correctness

**Lens:** does the change do what the acceptance criteria say, including the
edge cases the build gates actually check? Read `.agent/XAL-1127/SPEC.md`,
`git diff origin/main...HEAD`, then verified every claim the SPEC makes
against the real gates and rendered output — not just the raw `.md`.

**Checked, all passed:**

- Title: 63 chars raw, >50 so rendered verbatim (per
  `scripts/check-title-lengths.mjs`'s own rule) → 63 ≤ 65. Confirmed via the
  script's own output (`ok 63 bookingsystem-integrasjoner-kalender-epost-notifikasjoner.md`),
  not just hand-counted.
- Description: 152 chars, ≤155 as claimed (hand-counted, no automated gate
  exists for this field).
- Slug uniqueness: `src/lib/post-slugs.test.ts` passes; exactly one file
  resolves to this slug.
- Word count: markdown source and, critically, the **prerendered**
  `dist/blogg/<slug>/index.html` both clear the 200-word `content.thin` gate
  (`scripts/check-blog-word-count.mjs` — this is the gate that matters per
  its own comment, since a thin markdown file can still SSR to a 3-word page;
  confirmed dist was rebuilt *after* the last markdown edit via mtime, then
  independently recounted the rendered `<article>` text: 1588 words).
- CTA dedup: body ends with `**[Book demo →](/book-demo)**`, matches
  `BlogPost.tsx`'s `isCta()` regex and the sibling-post convention exactly.
- Cross-links: all 3 referenced blog slugs
  (`booking-funksjonalitet-systemkrav-gdpr-sms-kalender-tilgang`,
  `sanntidskalender-kommunal-booking`, `realtime-varsler-driftsroller`) and
  the 4th inline link (`idrettshall-no-show-avbestilling-driftsleder-kapasitet`)
  exist as real files; both marketing-page links (`/bookingsystem-kommune`,
  `/bookingsystem-utleie`) are real routes. Verified every `href` in the
  prerendered HTML resolves to a real route or blog post — no broken links.
- Cover image (`availability_calendar_hero_no.webp`) exists in `public/`.
- Technical claims (iCal/CalDAV/Outlook/Google sync, per-lokale channel
  choice) cross-checked against `Kanaler.tsx`, `BookingsystemUtleie.tsx`,
  `UseCaseMoterom.tsx` and the sibling GDPR/SMS/kalender post — consistent,
  nothing invented.
- No-show stat ("10–12 % → under 5 %") cross-checked against the linked
  idrettshall post's own numbers ("8 til 12 prosent", "fra 11 til 4
  prosent") — same order of magnitude, not contradictory.
- Full suite: `npx vitest run` — 20/20 files, 40/40 tests green, including
  the SSR `<h1>`/`<main>`-landmark invariants and `entry-server` tests.
  Rendered `<h1>` and `<title>` match the frontmatter title exactly.
- `tag: "Plattform"` is a real, already-used tag value (not invented).

**Found — 1 issue, fixed:**

- `pnpm-workspace.yaml` carried an `allowBuilds` block (added by
  `pnpm approve-builds --all` during local setup, swept into the `0ee3fab`
  checkpoint commit via `git add -A`). This is monorepo-root config read by
  every `apps/*` package — shipping it in a content-only PR risks build
  behavior changes with zero relation to this diff. **This exact pattern was
  already caught and reverted twice on sibling tickets** (XAL-1129's
  `8ad1d5f`, XAL-1134's `0a8427a`), so it's a known recurring failure mode
  of the `git add -A` checkpoint habit, not a one-off. Reverted
  `pnpm-workspace.yaml` to `origin/main`'s version; re-ran the full test
  suite (20/20 files, 40/40 tests) to confirm nothing depended on it.

## Round 2 — Regression

**Lens:** this diff is a single new `.md` file — what ELSE reads the blog
corpus that a new entry could disturb? Grepped every consumer of
`src/lib/posts.ts` (not just the three SPEC named — `BlogPreview.tsx`,
`BlogPost.tsx`, `search/corpus.ts`) and every build-time script that scans
`src/content/blog/*.md`, then re-ran the full gates to confirm none of them
regressed with the new file present.

**Consumers found beyond what SPEC.md listed, all checked:**

- `src/pages/Blog.tsx` — listing/search/tag-filter page. Tag "Plattform" is
  already a used value (confirmed round 1), so it doesn't create an
  orphan filter bucket. Filtering/pagination logic is generic over
  `getAllPosts()`, no hardcoded count or slug.
- `src/components/BlogPreviewSection.tsx` (homepage "Innsikt" carousel) —
  `getAllPosts().slice(0, 6)`, sorted by date desc. The new post is dated
  2026-08-10 (today), so it now displaces the oldest of the previous top-6
  from the homepage carousel. This is intended editorial behavior (newest
  post should surface), not a bug.
- `src/lib/webp-sources.test.ts` — iterates `getAllPosts()` and asserts
  every post's cover has a committed webp preview sibling on disk. Runs
  against the new post's cover (`availability_calendar_hero_no.webp`,
  reused from ~33 other posts) — passed, so the preview asset is already
  committed.
- `src/entry-server.main-landmark.test.tsx` — takes `getAllPosts()[0]`
  (the *current* most-recent post, whatever that is) and SSR-renders it to
  assert exactly one `<main>` landmark. Because the new post is dated
  2026-08-10, it's now (or ties for) `firstPost`, so this run actually
  exercised the new post's own SSR output for the first time, not just a
  sibling's. Passed.
- `src/lib/digitalt-bookingsystem-description.test.ts`,
  `src/lib/leie-selskapslokale-description.test.ts` — both hardcode a
  specific *other* slug and assert its description length; unaffected by
  an added post, confirmed by reading (not just running).
- `src/lib/search/corpus.ts` — merges `getAllPosts()` into the search/
  chatbot corpus with no cap, no dedup-by-title logic that a new entry
  could trip.
- Static `public/sitemap.xml` does **not** contain the new slug (nor do
  two other existing sibling posts' slugs) — traced this to
  `scripts/prerender.mjs` (~line 2599), which regenerates
  `dist/sitemap.xml` from scratch at build time; `public/sitemap.xml` is a
  separate, pre-existing, unused-by-build static file. Not a regression
  introduced by this diff.
- `scripts/push-clean-blog-to-convex.ts`, `auto-publish-blogs.ts`,
  `sync-convex-blog-to-fs.ts`, `dedup-blog-drafts.ts`,
  `diag-blog-drafts.ts` — a separate Convex-backed draft pipeline exists,
  but none of these are wired into `pnpm build`, `pnpm test`, or
  `.github/workflows/pr-check.yml` (which runs only lint/test/build). They
  are operator-invoked (`content:sync`, `content:autopublish`, etc.) and
  out of this diff's blast radius.

**Verified, not just read:**

- `npx vitest run` — 20/20 files, 40/40 tests green (same count as round
  1), including the two tests above that now touch the new post's own SSR
  output for the first time.
- `pnpm lint` — 0 errors; the 40 warnings reported are all pre-existing,
  in files this diff never touches.
- `git status --porcelain` — clean before and after this round.

**Found:** nothing. No consumer outside the ones SPEC.md already named
broke, and the two consumers SPEC.md missed (`Blog.tsx`'s tag filter,
`entry-server.main-landmark.test.tsx`'s dynamic `firstPost`) both turned
out to depend only on generic, already-passing invariants (a real tag
value; a post that SSRs cleanly), not anything this specific post could
violate. No changes made this round.

## Round 3 — Security

**Lens:** authz, tenant isolation, injection, secrets, and anything
user-supplied that reaches a query, a path or a page. Read `SPEC.md`,
`REVIEW.md` rounds 1–2, and `git diff origin/main...HEAD` end to end
(the full diff is three files: `SPEC.md`, `REVIEW.md`, and the one new
`.md` post — no code changed).

**Checked:**

- Confirmed this repo has no booking/product domain to leak across
  tenants in the first place ([[project_repo_has_no_booking_domain]]) —
  there is no authz boundary or tenant model this diff could cross, and
  this diff adds zero application code, zero routes, zero API calls.
  There is nothing for "authz" or "tenant isolation" to mean here.
- Read the full body of the new post
  (`src/content/blog/bookingsystem-integrasjoner-kalender-epost-notifikasjoner.md`)
  looking for injection surface: no `<script>`, `<iframe>`, `javascript:`,
  `onerror=`/`onload=`, or any raw HTML tag at all
  (`grep -n "http://\|https://\|<script\|<iframe\|javascript:\|onerror=\|onload="`
  → zero matches). Every link in the body is a relative path
  (`/blogg/<slug>`, `/bookingsystem-kommune`, `/bookingsystem-utleie`,
  `/book-demo`) — no external URL, so no open-redirect or
  attacker-controlled-domain risk even in principle.
- Traced how the body actually renders: `BlogPost.tsx` feeds
  `post.content` to `ReactMarkdown` with only `remarkPlugins={[remarkGfm]}`
  — confirmed via
  `grep -rn "rehype-raw\|rehypeRaw\|allowDangerousHtml" src/` (zero
  matches) that `rehype-raw` is not wired in anywhere in this codebase, so
  even if the markdown *did* contain raw HTML, react-markdown would not
  render it as live DOM. Also confirmed no `dangerouslySetInnerHTML` in
  `BlogPost.tsx` at all. XSS-via-markdown is not reachable from this file
  regardless of content, and this file's content has none anyway.
- Frontmatter fields (`title`, `description`, `keywords`, `tag`, `cover`,
  `author`, `role`) flow into the `<SEO>` component (title tag, meta tags,
  JSON-LD `article` block) the same way every other post's frontmatter
  does — this is a pre-existing, shared code path this diff doesn't touch
  and every sibling post already exercises in production, so it's out of
  this diff's blast radius, not a new risk introduced here. The values
  themselves are hand-authored plain Norwegian sentences, not
  attacker-controlled input, and contain no quote-breaking or
  template-injection characters.
- Grepped the new file and the two `.agent/XAL-1127/*.md` docs for
  anything resembling a secret (API key, token, connection string,
  credential) — none present; the only "sensitive"-looking string is the
  author's public name/role, which is the same on every other post.
- `git status --porcelain` clean; `git diff origin/main...HEAD --stat`
  confirms the diff is exactly the 3 files above, nothing else changed
  underneath this round (in particular, `pnpm-workspace.yaml` — the
  recurring scope-creep file flagged in round 1 — is still absent from the
  diff).

**Found:** nothing. This is a pure static-content diff with no query, no
path, no authz surface, and no injection vector reachable from the
rendering pipeline as it exists today. No changes made this round.

## Round 4 — Scope

**Lens:** is anything in this diff NOT the stated change? Drive-by edits,
unrelated tidying, files nobody asked to be touched. Read `SPEC.md`,
`REVIEW.md` rounds 1–3 (round 1 already caught and reverted a
`pnpm-workspace.yaml` scope-creep instance of the recurring
`git add -A`-checkpoint failure mode), then re-derived the diff boundary
from scratch rather than trusting the earlier rounds' characterization of
it.

**Checked:**

- `git diff origin/main...HEAD --stat` — exactly 3 files:
  `.agent/XAL-1127/REVIEW.md`, `.agent/XAL-1127/SPEC.md`, and the one new
  post `src/content/blog/bookingsystem-integrasjoner-kalender-epost-notifikasjoner.md`.
  435 insertions, **0 deletions** — the diff is purely additive, nothing
  pre-existing was modified or removed anywhere in the tree.
- `git status --porcelain=v1 --untracked-files=all` — empty. No untracked
  files sitting in the worktree outside git's view (e.g. no stray
  `pnpm-workspace.yaml` edit, no leftover build artifact, no `dist/`
  drift) that a later careless `git add -A` could sweep in.
- Confirmed the round-1 `pnpm-workspace.yaml` `allowBuilds` scope-creep
  (the recurring failure mode on sibling tickets XAL-1129/XAL-1134) is
  still absent from the diff — re-verified independently rather than
  taking round 3's note on faith, since that's exactly the kind of file a
  fresh `pnpm install`/`approve-builds` run during this round could have
  silently reintroduced. It did not.
- Read the new post's full body end-to-end again looking for content that
  strays from the stated angle (kalender/e-post/SMS integrasjon,
  no-show): every section maps directly to the SPEC's stated structure
  (why "has calendar+SMS" ≠ integrated → kalenderintegrasjon →
  e-postintegrasjon → SMS/notifikasjoner → hendelsesdrevet kjede →
  no-show-tall → sjekkliste → CTA). No off-topic section, no unrelated
  product claim, no second angle smuggled in.
- The two `.agent/XAL-1127/*.md` files are the process artifacts this
  workflow itself requires (spec-before-code, review-after-code), not
  scope creep — every sibling ticket in this batch carries the same two
  files alongside its one content file.
- No `package.json`, lockfile, config file, CI workflow, other blog post,
  route, or component appears anywhere in the diff.

**Found:** nothing. The diff is exactly the stated change — one blog post
plus its required spec/review artifacts, fully additive, no drive-by
edits anywhere. No changes made this round.

## Visual proof

New behaviour (a page that did not exist before this ticket) — only an
"after" state is possible, per the merge gate's own rule. Captured live
against `pnpm dev:client` (localhost:8080) in this checkout, cookie banner
dismissed ("Godta alle"), at
`/blogg/bookingsystem-integrasjoner-kalender-epost-notifikasjoner`:

- `proof/01-hero-above-fold.png` — above-the-fold render: exact `<h1>`
  title text ("Bookingsystem-integrasjoner: kalender, e-post og
  notifikasjoner"), the dek paragraph naming the three-channel angle
  (kalendersync, e-postbekreftelse, SMS-påminnelse as one chain, not three
  features), byline/date, and the "I denne artikkelen" ToC linking every
  section SPEC.md describes (hvorfor "har kalender og SMS" ≠ integrert →
  kalenderintegrasjon → e-postintegrasjon → SMS/notifikasjoner → hvordan de
  kobles sammen → no-show i tall → sjekkliste) — confirms the frontmatter
  and heading structure actually render, not just parse.
- `proof/02-blog-post-full.png` — full-page render, confirms end to end:
  every section body text, the two internal cross-links visible in-body
  (sanntidskalender post, and the "Digilist bookingsystem for kommune"
  page), the "Digilist: kalender, e-post og notifikasjon som én kjede"
  closing section linking both `/bookingsystem-kommune`-style money pages,
  and — most importantly — the article-page CTA band ("Klar for å se
  Digilist i praksis?" → Book demo) rendering exactly once, which is the
  live evidence that the body's own `[Book demo →](/book-demo)` paragraph
  was correctly deduped by `isCta()` and didn't double up with the page's
  built-in CTA band.

## Linear attachment

Re-confirmed this session: no Linear MCP server is reachable in this
environment (`ToolSearch` for Linear-related tools returns nothing),
matching [[project_no_linear_mcp_tools_available]]. The proof images above
are committed to the branch at `.agent/XAL-1127/proof/` instead, so the
evidence travels with the diff even though it can't be attached to the
XAL-1127 issue directly from this session.
