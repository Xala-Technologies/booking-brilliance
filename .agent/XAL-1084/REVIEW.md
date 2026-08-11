# XAL-1084 — Review log

## Round 1 — CORRECTNESS

**Lens:** Does the shipped change do what the acceptance criteria (SPEC.md
"WHAT CHANGES") say, including edge cases the happy-path read would miss?
Read SPEC.md, then `git diff origin/main...HEAD` in full, then ran the actual
test/build gates rather than trusting the diff by eye.

**Checked, with evidence:**

- **Step 0 status** — `.agent/XAL-1084/SPEC.md` already exists (179 lines,
  committed in `b7baec4`, before this session started) with a full "how it
  works now" read of the consumer chain and a mermaid diagram. The resume
  prompt's premise ("AGENT-SPEC.md does NOT exist") was stale; step 0 was in
  fact already done in an earlier session. Nothing to redo here.
- **Real gap claim** — re-verified: no existing post combines "spesialiserte"
  with the kultur/underholdning venue category and the
  niche-market/lower-competition argument. The listed adjacent posts
  (eventlokaler-arrangement..., sal-for-kulturarrangementer...,
  spesiallokaler-niche-utleie..., spesialiserte-idrettssteder...,
  kunstner-verksteder..., leie-ovingsrom..., dans-og-kunstnerstudier...,
  booking-spesialiserte-trening-kunstnerlokaler...) confirmed to cover
  adjacent-but-distinct angles, matching the SPEC's characterization.
- **Slug uniqueness** — `grep` confirms `spesialiserte-lokaler-kultur-underholdning`
  appears in exactly one `.md` file; `post-slugs.test.ts` passes.
- **Word count gate** (the real acceptance gate, wired into `pnpm build`) —
  markdown source is 1132 words (>> 200 min). Ran a full `pnpm build`: prerender
  succeeded for all 417 pages, and both word-count checks
  ("All 331 blog posts have at least 200 words in the markdown source" /
  "...render at least 200 words in dist/blogg/*/index.html") passed,
  confirming the content survives SSR and isn't a Suspense-fallback stub.
- **Title length** — `check-title-lengths.mjs` reports 60/65 chars for this
  slug specifically (`ok 60 spesialiserte-lokaler-kultur-underholdning.md`).
  The script's overall "139/331 exceed 65 chars" output is pre-existing
  baseline noise across the whole corpus, unrelated to this post.
- **FAQ verbatim match** — extracted the live `FAQPage` JSON-LD from
  `dist/blogg/spesialiserte-lokaler-kultur-underholdning/index.html` after
  build and diffed it question-by-question against both the markdown's
  `## Vanlige spørsmål` section and the new `POST_FAQ[...]` entry in
  `blogFaq.mjs`: all four Q&A pairs match verbatim across all three places.
  `blogFaq.test.ts` and the full `npx vitest run` (21 files / 45 tests) pass.
- **Cross-links resolve** — all three linked slugs
  (`eventlokaler-arrangement-underholdning-kulturarrangement-arrangorer`,
  `spesiallokaler-niche-utleie-teaterscene-kjeller`,
  `spesialiserte-idrettssteder-tennis-bowling-basketball-gym`) exist as real
  files. Per SPEC, links are outward-only (no reverse links added to the
  shipped sibling posts) — confirmed this is the stated, deliberate policy,
  not an oversight.
- **Frontmatter correctness** — `tag: "Utleier"` matches the existing tag
  vocabulary (grepped all tags in use). `cover` path
  (`/images/blog/booking_calendar_hero_no.webp`) exists in `public/`,
  `dist/`, and `dist-server/`. `author`/`role` match the convention used by
  every recent sibling post. `date: 2026-08-11` matches the session's actual
  date, ISO format, parses correctly via `blogFrontmatter.ts`.
- **H1 / SSR** — prerendered HTML has exactly one `<h1>` matching the
  frontmatter title.
- **Linear attachment step** — SPEC already documents Linear MCP tools were
  unreachable this session (confirmed again this round via ToolSearch — no
  Linear tool surfaced). Matches the standing, repeatedly-confirmed
  `project_no_linear_mcp_tools_available.md` finding. SPEC stays committed
  under `.agent/XAL-1084/` as the fallback record, per that memory's guidance.

**Findings: none.** Every acceptance criterion in SPEC.md's "WHAT CHANGES"
section is met, the real build/test gates (not just the diff) pass, and the
FAQ/cross-link/frontmatter details that are easy to get subtly wrong on a
content-only change all check out under direct verification.

**Changes made this round:** none — nothing to fix. No commit needed since
the tree was already clean and no files were modified during this review.

## Round 2 — REGRESSION

**Lens:** what ELSE reads this code path? Grepped every consumer of
`src/content/blog/*.md` and `blogFaq.mjs` beyond what SPEC.md's "BLAST
RADIUS" section already listed, and checked nothing depended on the old
behaviour (fewer posts, no `"Utleier"`-tagged 2026-08-11 entry, etc.).

**Consumers found beyond SPEC.md's list, checked individually:**

- `src/lib/search/corpus.ts` — sitewide search corpus. Only imports
  `getAllPosts()`/frontmatter; a new post is just one more searchable item,
  no hardcoded post list or count to update.
- `src/components/BlogPreviewSection.tsx` (homepage teaser, `.slice(0, 6)`)
  and `src/pages/Blog.tsx` (blog index + tag filter) — both derive their tag
  list dynamically (`allPosts.forEach(p => set.add(p.tag))`), so the
  pre-existing `"Utleier"` tag needs no registration; both already render
  every other `"Utleier"`-tagged post today.
- `src/lib/posts.ts` sort (`[...blogMeta].sort((a,b) => a.date < b.date ? 1 : -1)`)
  — new post's `date: 2026-08-11` sorts it toward the front of
  `getAllPosts()`. Checked whether anything assumes a stable "first post":
  `src/entry-server.main-landmark.test.tsx` reads `getAllPosts()[0]`
  dynamically (not a pinned slug) specifically so it doesn't care which post
  is newest — confirmed still green.
- `src/lib/webp-sources.test.ts` ("BlogPreviewSection cover previews") —
  iterates every post's `previewCover(cover)` and asserts the `-preview.webp`
  sibling exists on disk. The new post reuses the same shared cover
  (`booking_calendar_hero_no.webp`) as ~19 other posts; confirmed
  `booking_calendar_hero_no-preview.webp` already exists in `public/images/blog/`.
- `src/pages/BlogPost.tsx` `relatedSolutions()` — regex-matches
  slug+title+tag+keywords against 5 solution pages
  (kommune/idrettshall/møterom/selskapslokale/kulturhus) to render 1-2
  contextual "solution" links, falling back to a generic
  `/booking-av-lokaler-og-moterom` link if nothing matches. The new post's
  hay (slug/title/tag/keywords only, not body text) doesn't hit any of the 5
  regexes — e.g. `/kulturhus|kantine|konferanse|kultursal|arrangement/i`
  needs one of those literal substrings, and the post has "kultur" but never
  "kulturhus"/"kultursal"/"arrangement" in its frontmatter fields. This is
  the designed fallback path, not a crash or broken match — confirmed by
  reading the function, not a regression, but noted as a missed
  cross-link opportunity (not fixed: fixing it would mean tuning a shared
  regex used by ~300 other posts, out of scope for a content-only ticket).
- `scripts/dedup-blog-drafts.ts`, `scripts/sync-convex-blog-to-fs.ts` —
  operate on the Convex drafts table, not on committed `.md` files; this
  post was never staged there, so these scripts have nothing to do with it.
- `scripts/verify-live.mjs` — has a cross-post exact-title duplicate check
  (`findDuplicateTitles`). Confirmed the new title `"Spesialiserte lokaler
  for kultur og underholdning"` doesn't exact-match any of the ~330 other
  post titles (nearest is `"Spesialiserte idrettssteder: tennis, bowling,
  basketball"`, a different string). This script hits the live site, isn't
  wired into `pnpm build`, so it's informational only, but the check passes
  on the source.
- `scripts/indexnow-submit.mjs` — has a hardcoded `DEFAULT_PATHS` list from
  the 2026-07 launch; doesn't include this or any other individual blog post
  by default, it's a manual operator tool, not a build gate. Not a
  regression: no post has ever needed adding here.

**Full test suite re-run:** `npx vitest run` — 21 files / 45 tests, all pass
(same result as Round 1, re-confirmed after this round's read-only
investigation).

**Findings: none.** Every consumer beyond the ones SPEC.md already named
either ignores the new post safely (dynamic tag/search lists), handles it
via an existing generic guard (webp-sources test, duplicate-title check), or
degrades gracefully via a designed fallback (`relatedSolutions`). Nothing
depended on the pre-change post count, order, or tag set.

**Changes made this round:** none — no code or content touched, nothing to
fix. No new commit (tree unchanged).
