# XAL-1091 Review Log

## Round 1

**Note on step 0:** the resume prompt claimed `AGENT-SPEC.md` did not exist. It
does — at the correct per-issue path `.agent/XAL-1091/SPEC.md` — and is
already thorough (problem framing, "how it works now", blast radius, a
Mermaid diagram, testing requirements, definition of done). Step 0 was
already done in an earlier session; nothing to redo. Linear attachment is
still blocked (no Linear MCP tools available in this environment — reconfirmed
this round), same as prior tickets in memory.

**Lens: CORRECTNESS** — does the diff do what the spec's acceptance criteria
say, including edge cases? Checked SPEC.md's "Definition of done" and
"Testing requirements" line by line against the actual repo state, then read
the new post itself for factual accuracy against the product it funnels to.

What I checked and found:

- **Test/gate suite**: ran all three gates named in the spec directly.
  `pnpm vitest run` — 20 files, 41 tests, all green, including
  `post-slugs.test.ts` (slug uniqueness) and the SSR `<h1>`/heading-outline
  tests. `node scripts/check-blog-word-count.mjs` — passes both the raw
  markdown floor and the rendered-`<article>` floor for all 326 posts.
  `node scripts/check-title-lengths.mjs` — new post's title renders at 55
  chars, well under the 65-char informational ceiling.
- **Frontmatter shape**: every field in the new post's frontmatter
  (`slug/title/description/date/author/role/readingMinutes/tag/cover/keywords`)
  matches `BlogFrontmatter` in `src/lib/blogFrontmatter.ts` exactly; `author`/
  `role` match the value used by every other post in the corpus; `tag:
  "Privatperson"` is an existing tag already used by 108 other posts, not a
  novel value.
- **Internal links resolve**: `/overnatting/leilighet` is a real route
  (`src/App.tsx:336`); `/blogg/booking-paa-90-sekunder-innbygger` and
  `/blogg/somlos-betaling-vipps-ehf` are real post slugs; the cover image
  `public/images/blog/booking_calendar_hero_no.webp` exists on disk.
- **Factual accuracy against the product**: every concrete claim the post
  makes about how booking works — totalpris shown before booking, real-time
  calendar of available nights, direct Vipps/card payment, digital key
  code/lockbox where the host offers it, host-set cancellation policy, and
  per-listing kitchen/washer/wifi/parking flags — cross-checked line-by-line
  against `src/pages/OvernattingLeilighet.tsx` and matches it; nothing in the
  post overstates what the product actually does (no claim of permanent
  housing, matching the spec's explicit scoping decision).
- **relatedSolutions fallback**: confirmed the post's slug/title/tag/keywords
  don't match any regex in `BlogPost.tsx`'s `SOLUTION_PAGES` list (kommune,
  idrettshall, møterom, selskapslokale, kulturhus), so the sidebar
  "related solution" widget falls back to the generic
  `/booking-av-lokaler-og-moterom` rather than `/overnatting/leilighet`. This
  is real, but it's a pre-existing limitation of a fixed regex list shared by
  every post, explicitly called out and scoped out of this ticket in
  SPEC.md — the actual conversion path (the inline link in the post body) does
  point to `/overnatting/leilighet` correctly, so this isn't a defect
  introduced by this change. Not fixing it here; if the accommodation family
  needs its own sidebar link, that's a separate cross-cutting ticket.
- **Blast radius**: no other file references the new slug; nothing assumes a
  fixed post count. Matches SPEC.md's claim.

**One inaccuracy found and fixed**: SPEC.md's "Testing requirements" section
said the post's title is "64 chars as-is" — it's actually 55 chars (both are
"as-is, under 65," so the conclusion was right, but the number was wrong).
Fixed the number in SPEC.md so the record matches reality.

**No functional/correctness bugs found.** All three build/test gates pass,
all internal links resolve to real routes/posts, all product claims in the
post are accurate against the current `/overnatting/leilighet` page, and the
frontmatter is well-formed. The only gap found (related-solutions sidebar
fallback) is pre-existing, explicitly scoped out in SPEC.md, and not
something a content-only change should take on.

## Round 2

**Note on step 0:** the resume prompt again claimed `AGENT-SPEC.md` did not
exist. It does, at `.agent/XAL-1091/SPEC.md`, unchanged since Round 1 —
nothing to redo.

**Lens: REGRESSION** — what else, beyond the files this diff touches, reads
blog content, and could anything have depended on the old behaviour (no post
at this slug, one fewer post in the corpus, etc.)? `git diff
origin/main...HEAD --stat` confirms this diff is content-only: one new file,
`src/content/blog/bolig-til-leie-oslo-mellombolig-leilighet.md`, plus the two
`.agent/XAL-1091/*.md` process files. Zero source/script files touched — so
by construction the only regression surface is "what happens when the
existing pipeline ingests one more markdown file with this specific
frontmatter," not "did a code edit change shared logic."

Grepped every consumer of blog content beyond the ones SPEC.md's "blast
radius" section already named, to check none of them assume a fixed post
count, a fixed slug set, or behave differently under this post's specific
field values:

- **Sitemap generation** (`scripts/prerender.mjs:2628-2632`) — spreads
  `posts.map(...)` into `sitemapEntries` with `lastmod: p.date`; the new post
  is picked up automatically with no manual sitemap edit required. Confirmed
  `p.date` parses cleanly: `blogFrontmatter.ts:71` does
  `new Date(data.date).toISOString().slice(0, 10)` on the unquoted
  `date: 2026-08-11` frontmatter value, round-trips to the same string, no
  timezone-shift risk since it's a bare ISO date.
- **Search corpus** (`src/lib/search/corpus.ts:95-101`) — blog items keyed by
  `id: \`b-${p.slug}\``; new slug doesn't collide with any existing id, and
  `getSearchCorpus()`'s module-level `cached` var is just an in-memory
  first-call memo, not a pre-seeded list — no stale-count risk.
- **Sidebar `relatedPosts`** (`src/pages/BlogPost.tsx:109-116`) — filters all
  posts sharing the same `tag`, dedupes by slug, `.slice(0, 3)`. `tag:
  "Privatperson"` is already shared by 108 other posts (Round 1 finding); the
  new post just becomes one more candidate in a pool that already exceeds the
  slice bound, so this can't overflow or change ordering guarantees for other
  posts' sidebars.
- **Frontmatter regex parser** (`blogFrontmatter.ts` `parseFrontmatter`) —
  checked the one field with an embedded special character,
  `title: "Bolig til leie i Oslo: mellombolig og korttidsleilighet"` (colon
  inside the quoted value). The line-level regex `^([A-Za-z0-9_-]+):\s*(.*)$`
  only treats the *first* colon as the key/value delimiter (colon isn't in
  the key's character class), so the embedded colon in the title string is
  captured correctly as part of the value — same pattern already relied on by
  other posts with colons in their titles, not something this post exercises
  for the first time.
- **`BlogPreview.tsx`** (admin draft-preview route) — also imports
  `parseFrontmatter` from the same module, but operates on Convex draft rows
  (`draft.body` / `draft.frontmatter_json`), not on files in
  `src/content/blog/`. Confirmed unrelated: this route can't be affected by a
  new committed post either way.
- **Chatbot RAG** (`src/lib/chatbot/rag.ts`) — greps for "keywords" turned
  this up as a possible consumer, but it retrieves over `FAQ_CATEGORIES`
  only, never touches blog content. Unrelated.
- **Admin `IntelligenceVekst.tsx`** (`snap.keywords.recent`) — a different
  `keywords` entirely (Search Console-style discovered-query rows), unrelated
  to the blog frontmatter `keywords: string[]` field. Unrelated.
- **`llms-full.txt`** (`scripts/prerender.mjs:2580-2606`) — appends the FAQ
  corpus only; blog posts aren't part of that file. Unrelated.
- **IndexNow submission** (`scripts/indexnow-submit.mjs`) — a manually
  invoked script with a hardcoded `DEFAULT_PATHS` list; doesn't run
  automatically off the blog glob, so it neither breaks nor needs updating
  for this post (submitting the new URL, if desired, is a manual follow-up
  outside this ticket's scope, same as it is for every other new post).

**Old-behaviour dependency check**: nothing in the corpus (tests or app code)
asserts an exact post count, an exact slug list, or an exact sitemap-entry
count — every consumer iterates whatever `getAllPosts()` / the blog glob
returns. Re-ran the full suite after this review: `pnpm vitest run` — 20
files, 41 tests, all green, including `post-slugs.test.ts`.

**No regressions found.** This is a pure content-additive change; every
downstream reader of blog content (sitemap, search index, sidebar related
posts, frontmatter parser) handles an additional post through the same
glob-driven, count-agnostic mechanism every prior post already went through,
and the one field with a syntactic edge case (colon inside a quoted title)
parses the same way existing posts' colon-bearing titles already do. Nothing
fixed this round — no code was touched to fix.
