# XAL-1145 Review

## Round 1 — Correctness

Lens: does the change do what the acceptance criteria (SPEC.md's "WHAT
CHANGES" + the ticket's search-intent goal) say, on the edge cases too?
Checked against the spec, the diff (`git diff origin/main...HEAD`), and a
fresh build, not just the markdown source.

Checked:

- **Slug/filename consistency** — frontmatter `slug:` matches the filename
  exactly (`teambuilding-lokaler-bedrift-mote-veiledning-booking`), no other
  post claims the same slug. Pass.
- **readingMinutes correctness** — `BlogPost.tsx:100` computes
  `Math.round(words/200)` off the raw markdown body at render time.
  Recomputed it standalone with Node against the actual file: 1220 words →
  6. Frontmatter says `readingMinutes: 6`. Matches exactly (this is the
  exact class of bug XAL-1149 round 1 caught in a sibling post).
- **Word-count gate** — ran `node scripts/check-blog-word-count.mjs` fresh:
  passes both the markdown-source floor (200 words min, this post has
  1220) and the rendered-HTML check against `dist/blogg/<slug>/index.html`
  (1357 words in the rendered `<article>`, confirmed with the same
  extraction regex the script uses).
- **Build freshness** — `dist/blogg/teambuilding-lokaler-bedrift-mote-veiledning-booking/`
  was already present from an earlier session; verified via `stat` that the
  dist HTML's mtime is *after* the markdown source's mtime, i.e. not stale.
  Confirmed `<h1>`, `<title>`, canonical URL, and the sitemap.xml entry all
  render correctly and match the frontmatter.
- **Frontmatter shape** — every field matches `BlogFrontmatter` in
  `src/lib/blogFrontmatter.ts` (slug/title/description/date/author/role/
  readingMinutes/tag/cover/keywords). `date: 2026-08-10` parses as a bare
  string (not misparsed as a number — the frontmatter parser's integer/float
  regexes require the *whole* value to be numeric, so the dashes protect
  it), consistent with every sibling post. `cover` points at an image that
  actually exists on disk (`public/images/blog/booking_calendar_hero_no.webp`,
  167KB, already used by other Bedrift/Privatperson posts per SPEC).
- **Dedup / content-gap claim re-verified independently** (not trusting
  SPEC's own grep output) — re-ran
  `grep -rli "teambuilding" src/content/blog/*.md` and confirmed the three
  named near-neighbor posts (`idrettshall-bedrift-*`,
  `moterom-kurslokale-*`, `leie-lokale-privat-fest-*`) don't cover the
  combined aktivitetslokale + møterom + veiledningsrom same-day scenario.
  No duplicate `title:` or `description:` across all 313 posts.
- **CTA-stripping edge case** — `BlogPost.tsx:121-127` pops a trailing
  paragraph from the rendered body if it matches a "book a demo" CTA
  regex, to avoid duplicating the CTA band below the article. This post's
  final paragraph ("Se det i praksis") contains the literal phrase
  "Book en demo" mid-sentence. Checked all three regexes
  (`\[book (en )?demo`, `^\*\*\s*book en demo`, `book demo\s*→`) against
  the actual paragraph text — none match, so the paragraph survives
  correctly. No silent content loss.
- **Product-claim consistency** — this repo has no booking backend (content
  is pure marketing copy); verified the post doesn't invent capabilities
  unique to itself. `samlefaktura` (23 other posts), `sanntid`/
  `sanntidskalender` (206), `ombooking` (10), `attestasjon` (2) are all
  established site vocabulary used elsewhere, not new claims.

**Found (fixed this round):**

- `scripts/check-title-lengths.mjs` (informational, not build-blocking)
  flagged the post's `<title>` at 75 chars against the site's 65-char
  convention (only 2 pre-existing posts, both about weddings, already
  violate this — not a pattern to extend). Since the whole point of this
  ticket is to satisfy search intent for "teambuilding" in the SERP, and
  Google truncates titles around this length, a truncated title works
  against the ticket's own goal. Shortened `title` from
  "Teambuilding for bedrifter: book lokaler til aktivitet, møter og
  veiledning" (75 chars) to "Teambuilding for bedrifter: book lokaler til
  møter og veiledning" (64 chars) — keeps the primary keyword at the front
  and the ticket's own phrase "møter og veiledning" intact, drops the
  redundant "aktivitet" (aktivitetslokale is still covered extensively in
  the body and in the `keywords` list). `<h1>` is unaffected — components
  render `h1` from the post title, an `<h1>` isn't length-constrained the
  way a SERP `<title>` is, so no need to touch it separately beyond the
  frontmatter `title` field itself, which both `<title>` and `<h1>` derive
  from.

No other correctness issues found this round.

## Round 2 — Regression

Lens: what ELSE reads this code path? Grepped every consumer of
`src/content/blog/*.md` (not just the six SPEC.md's BLAST RADIUS names),
verified nothing depended on the old (pre-this-post) behaviour.

Consumers found beyond SPEC's list, via
`grep -rln "content/blog\|getAllPosts\|blog-meta\|postContent"`:

- `src/lib/post-slugs.test.ts` — asserts every post's slug is globally
  unique via `getAllPosts()`. Pass.
- `src/content/blog-xal739-aeo.test.ts` — pins `getPostBySlug` output for a
  *different* slug (`hva-koster-...`). Unaffected by an unrelated addition.
- `src/entry-server.main-landmark.test.tsx` — calls `getAllPosts()[0]` (the
  *first* post after sort) and SSRs it as the "first lazy route rendered"
  regression case for a real historical bug (suspended-fallback treated as
  settled). This is the one consumer that could plausibly break from adding
  a post: `src/lib/posts.ts:19` sorts `[...blogMeta].sort((a,b) => a.date <
  b.date ? 1 : -1)` — stable, but 41 other posts already share this post's
  `date: 2026-08-10`, so ties break on `blogMetaPlugin.ts`'s `fs.readdir`
  order (filesystem-dependent, not alphabetical). Ran the test: new post did
  not become index 0, test passes.
- `src/entry-server.h1.test.tsx` — pins other slugs, unaffected.
- `src/lib/webp-sources.test.ts` — validates every post's `cover` resolves
  to a real, non-preview image via `previewCover()`. This post reuses
  `booking_calendar_hero_no.webp` (already validated for sibling posts).
  Pass.
- `src/lib/search/corpus.ts` (Navbar search) and
  `src/components/BlogPreviewSection.tsx` (homepage teaser,
  `getAllPosts().slice(0, 6)`) — both consume `getAllPosts()` generically,
  no hardcoded slug/count/order assumption. A new dated-today post
  displacing an older one from the 6-post teaser is the *intended*
  behaviour of "newest 6", not a regression.
- `convex/content/publish.ts`, `scripts/sync-convex-blog-to-fs.ts`,
  `scripts/dedup-blog-drafts.ts`, `tools/content-agent/src/{publish,
  generate}.ts` — a separate Convex-draft → filesystem sync pipeline for a
  *different* authoring path. This post was committed directly, never a
  Convex draft, so none of these read or could collide with it.

Ran the full suite fresh, not just the files touched by SPEC's blast
radius: `npx vitest run` → **20 files, 40 tests, all pass.** Ran a full
clean build (`rm -rf dist dist-server && pnpm build`) end to end: 397
sitemap URLs (one new entry for this slug, no dupes), critical CSS inlined
on 398/398 pages, `check-blog-word-count.mjs` passes for all 313 posts
(source and rendered HTML), new post's prerendered HTML has exactly one
`<h1>` and a correct canonical URL. No consumer choked on the new file, no
existing behaviour changed for any other post.

**Found (fixed this round):**

- SPEC.md's BLAST RADIUS section asserted `grep -rli "teambuilding\|team
  building\|team-building" src/content/blog/*.md` returned **zero hits**
  before this change. Re-ran that exact command against the pre-existing
  posts (excluding the new file): it returns **four hits** —
  `idrettshall-booking-flere-haller-samlefaktura-bedrift.md` (uses
  "teambuilding" five times, including in its `description:` frontmatter),
  `idrettshall-ledige-tider-book-enkelttime-privatperson.md`,
  `idrettshall-ledige-tider-booke-uten-lag-privatperson.md`, and
  `idrettshall-privat-utleier-ledige-tider-booking-drift.md`. Confirmed via
  `git log --oneline --all` + `git merge-base --is-ancestor` these all
  landed on `origin/main` on 2026-08-09 (commit `e5c74c9`), well before
  this branch's fork point — a pre-existing research gap in SPEC.md's own
  dedup grep, not a concurrent-fleet collision. Round 1's re-run of the
  same grep checked only whether the *three named* near-neighbor posts
  covered the combined scenario and didn't notice the "zero hits" claim
  itself was wrong.
  - Severity assessed as low, not a blocker: in all four existing posts,
    "teambuilding" appears only as one example use-case among several
    (company sports nights, birthday parties, general idrettshall booking)
    inside body text or a description — never in the title, H1, slug, or
    `keywords:` frontmatter. This post is the only one in the corpus with
    "teambuilding" in its title, URL slug, and keywords list, so it's still
    the sole page targeting the keyword as a *primary* term — normal
    secondary-keyword overlap, not primary-keyword cannibalization. The
    ticket's core verdict (real, unowned content gap) stands.
  - Fix: corrected the false "zero hits" claim in SPEC.md's BLAST RADIUS
    section to state the actual grep result and this severity assessment,
    so the record doesn't carry a factual error forward for a future round
    or reader to trust unverified.

No other regressions found this round.
