# XAL-1128 — Review log

## Round 1 — Correctness

Lens: does the change do what the acceptance criteria say, on the edge
cases too? Read `.agent/XAL-1128/SPEC.md`, the diff
(`git diff origin/main...HEAD`), and re-ran the tests/gates myself rather
than trusting SPEC's prior claims.

Checked, all confirmed correct:

- **Content-gap claim still holds.** Re-ran `grep -ril "spesiallokal\|niche"`
  and `grep -ril "teater"` / `"kjeller\|bunker\|hangar\|fabrikklokale"` — same
  zero/incidental-only results SPEC recorded; no duplicate was created.
- **Frontmatter fields.** `description` = 149 chars (≤155), `title` = 59 chars
  (`node scripts/check-title-lengths.mjs` → `ok 59 ...`, under the 65-char
  rendered limit). `tag: "Utleier"` is a real value already used across the
  corpus (checked against the full set of distinct `tag:` values in
  `src/content/blog/*.md`), not an invented one.
- **Word count.** Body is 949 words, both source and prerendered checks
  pass: `pnpm build` → "All 320 blog posts have at least 200 words in the
  markdown source" / "...render at least 200 words in dist/blogg/*/index.html."
  File count: `ls src/content/blog/*.md | wc -l` = 320, consistent with
  SPEC's "319 pre-this-post" claim.
- **Internal links resolve.** All 4 linked slugs
  (`kunstner-verksteder-studio-dansesaler-kreative-lokaler`,
  `sal-for-kulturarrangementer-og-seminarer`,
  `utleieobjekt-veiviser-steg-for-steg`,
  `spesialiserte-idrettssteder-tennis-bowling-basketball-gym`) exist as real
  files and appear as `href`s in the prerendered
  `dist/blogg/spesiallokaler-niche-utleie-teaterscene-kjeller/index.html`.
- **Redirect guard.** `scripts/guard-blog-redirects.mjs` only diffs the
  working tree (`git status --porcelain`), so with a clean tree it reported
  "0 posts to check" — not a bug, just a no-op on a committed branch. Forced
  it with `--all` instead: `✓ /blogg/spesiallokaler-niche-utleie-teaterscene-kjeller → HTTP 200`,
  no redirect collision. (Worth noting for future rounds: SPEC's phrasing
  made it sound like plain `--check` was sufficient going forward; on this
  branch it isn't, `--all` is needed to actually re-verify post-commit.)
- **Product-claim accuracy.** Cross-checked the new post's factual claims
  against source docs instead of trusting SPEC's summary:
  - The Steg I type list ("selskapslokale, møterom, hall, kantine, kontor,
    scene") matches `utleieobjekt-veiviser-steg-for-steg.md` verbatim.
  - "Alt er redigerbart... uten at eksisterende bookinger påvirkes" matches
    that same file's "Etter publisering: alt er redigerbart" section.
  - "Samme sanntidskalender håndterer... en fast avtale for gjentakende
    bruk" matches the recurring/fastleie claims made consistently across
    the corpus (`idrettshall-booking-for-lag-og-foreninger.md`,
    `kunstner-verksteder-studio-*.md`, etc.) — not fabricated.
  - One SPEC inaccuracy, not a content bug: SPEC's "Blast radius" section
    cites the wizard doc as `src/pages/utleieobjekt-veiviser-steg-for-steg.md`;
    it actually lives at `src/content/blog/utleieobjekt-veiviser-steg-for-steg.md`.
    Doesn't affect the shipped post, just a path typo in the SPEC's own
    prose — left as a note rather than "fixed" since fixing SPEC prose
    after the fact isn't the point of this lens.
- **CTA dedup.** The post's closing paragraph embeds
  `[Book en demo](https://digilist.no/demo)` mid-sentence with trailing
  prose after it, same as `isCta()` in `BlogPost.tsx` (line 121) strips —
  confirmed this is the *established* pattern (both
  `kunstner-verksteder-studio-*.md` and
  `spesialiserte-idrettssteder-*.md` do the identical thing), and confirmed
  in the prerendered HTML that no stray "Book en demo" text survives —
  only the CTA band's "Book demo" → `/book-demo` remains. Initially flagged
  this as a possible content-loss bug (the whole paragraph, including the
  non-CTA sentence before the link, gets popped) but it's intentional,
  site-wide, pre-existing behavior, not something this diff introduced or
  can fix in isolation.
- **Full gate re-run.** `pnpm build` (prerender + word-count gate) and
  `npx vitest run` → 20 files / 40 tests, all green, matching SPEC's
  claims. `git status --short` clean before and after — no stray
  `pnpm-workspace.yaml` or other drive-by diff.

**Findings: none.** Nothing to fix this round — all acceptance criteria and
edge cases checked out against the live code and build output, not just
against SPEC's prior narration of them.

## Round 2 — Regression

Lens: what ELSE reads this code path, not just the files this diff touched?
`git diff origin/main...HEAD --stat` confirms the diff is 3 files (both
`.agent/XAL-1128/*.md` plus the one new blog post) — so "regression" here
means: every existing consumer of `src/content/blog/*.md` that ran fine
against 319 posts, does it still behave correctly against 320, with this
specific new file's frontmatter/content?

Traced every consumer via `grep -rln "content/blog"` and
`grep -rln "getAllPosts|virtual:blog-meta"` (broader net than SPEC's Blast
Radius section, which only listed the ones SPEC's own diff touched) and
checked each one against the new file specifically:

- **`src/entry-server.main-landmark.test.tsx` — dynamic fixture, not a
  hardcoded slug.** This test does `const [firstPost] = getAllPosts()` and
  renders `/blogg/${firstPost.slug}` — since `getAllPosts()` sorts by date
  descending and the new post is dated 2026-08-10 (today, newest in the
  corpus), **this test now silently exercises the new post** as its "single
  `<main>` landmark, even as the first lazily-loaded route" fixture, instead
  of whatever post held that position before this branch. Worth flagging
  explicitly because it's exactly the kind of coupling this lens exists to
  catch — a test whose target quietly shifted underneath this diff without
  the diff itself touching that test file. Re-ran it standalone: passes
  (2.9s, SSR renders exactly one `<main>`). No regression, but it means
  *this specific post's* SSR output was pressure-tested by that assertion,
  not a stale post's.
- **`src/entry-server.h1.test.tsx`** — by contrast, pins two specific slugs
  (`automatisert-avbooking-...`, `leie-bryllupslokale`) rather than
  `getAllPosts()[0]`, so it's structurally immune to new-post churn. No
  interaction with this diff.
- **`src/lib/webp-sources.test.ts`** — iterates `getAllPosts()` and asserts
  `previewCover(post.cover)` exists on disk for every post, so the new
  post's cover is a real input to this test, not just the posts it was
  written against. Cover is `/images/blog/booking_calendar_hero_no.webp`;
  confirmed both it and its `booking_calendar_hero_no-preview.webp` sibling
  are present (`ls public/images/blog/`), so `previewCover()` resolves and
  the test passes. This is the exact failure mode the test's own docstring
  warns about (a newly added post/tile with a cover whose `-preview.webp`
  was never generated) — checked it directly rather than trusting the
  green run to have exercised the right path.
- **`scripts/sync-convex-blog-to-fs.ts`** — Convex→FS sync tool. Read it in
  full to confirm it's additive/idempotent only (writes files pulled from
  Convex, no `unlink`/directory-diff/delete-orphans logic found via
  `grep -n "unlink|rmSync"` → zero hits). A directly-committed `.md` file
  that never went through Convex is not at risk of being deleted or
  overwritten by a future `pnpm content:sync` run.
- **`scripts/prerender.mjs` sitemap block (~line 2599-2705)** — sitemap
  entries for blog posts are `...posts.map(...)`, no fixed-length array or
  count assertion; new post added itself as one more `<url>` automatically.
  Confirmed via `pnpm build` output: `✓ /sitemap.xml regenerated (404
  URLs)` (was presumably 403 before this post; not independently verified
  pre-diff, but the mechanism is structurally incapable of dropping or
  miscounting entries — it's a plain array spread).
- **`src/pages/BlogPost.tsx` `relatedSolutions()` / `sidebarRelated`** —
  checked the new post's slug+title+tag+keywords against the
  `SOLUTION_PAGES` regexes (kommune, idrettshall, møterom, selskapslokale,
  kulturhus): none match, so it falls back to the generic
  `/booking-av-lokaler-og-moterom` link — a real, working route, not a
  broken fallback. `sidebarRelated` (same-tag "Utleier" posts, backfilled
  with newest) has no minimum-count assumption that a new post could
  violate.
- **`src/components/BlogPreviewSection.tsx`** (`getAllPosts().slice(0, 6)`,
  homepage strip) — the new post, being newest, now occupies one of the 6
  homepage slots, pushing the previous 6th post out. This is the intended
  behavior of every prior post addition in this batch, not a defect
  introduced here.
- **`tools/content-agent/*`, `convex/content/publish.ts`,
  `scripts/dedup-blog-drafts.ts`** — all operate on the Convex-drafts side
  of the pipeline (generation prompts, admin-publish flow, draft dedup);
  none read or enumerate the committed `src/content/blog/*.md` corpus in a
  way this file could disrupt. `dedup-blog-drafts.ts`'s own docstring notes
  it leaves "the live site — served from committed src/content/blog/*.md —
  untouched."
- **No RSS/Atom feed generator exists** (`grep -rln "rss|feed.xml|atom"`
  over non-node_modules `.ts`/`.tsx`/`.mjs` turned up only unrelated
  content-agent source-type strings and one `LeieKonferanselokale.tsx` hit
  that isn't blog-related) — nothing there to regress.
- **Full re-run, independent of SPEC/Round 1's prior claims.**
  `npx vitest run` → 20 files / 40 tests green. `pnpm build` → prerendered
  405 pages incl. `/blogg/spesiallokaler-niche-utleie-teaterscene-kjeller/index.html`,
  word-count gate passed for all 320 posts (both source and rendered
  checks), sitemap regenerated with the new URL. `git status --short`
  clean before and after — no drive-by diff.

**Findings: none.** Every consumer this lens could find — including one
(`entry-server.main-landmark.test.tsx`) whose target silently shifted onto
this exact new post via date-sort — still behaves correctly. Nothing
fixed this round; no code changes beyond this REVIEW.md entry.
