# XAL-1085 — Review log

## Round 1 (lens: correctness)

**Question:** does the diff do what SPEC.md's acceptance criteria say, including
the edge cases (FAQ verbatim match, slug uniqueness, cross-link validity, build
gates)?

**Checked:**
- `.agent/XAL-1085/SPEC.md` already existed and was already committed (in
  `9ce7321`) with a full diagram and blast-radius section — step 0 from the
  resume instructions was in fact already done in an earlier session; nothing
  to redo there. `REVIEW.md` did not exist yet, so this is genuinely round 1.
- FAQ verbatim match: programmatically diffed the post's `## Vanlige spørsmål`
  body against `POST_FAQ["dans-og-kunstnerstudier-atelier-for-opplaering"]` in
  `src/content/blogFaq.mjs` (all 4 Q&A pairs) — exact match, both directions.
  (`blogFaq.test.ts` only pins one specific legacy slug, so this pairing isn't
  test-enforced; verified by hand instead.)
- Slug uniqueness: grepped every `.md` for the new slug — only one hit.
- All four cross-linked slugs
  (`kunstner-verksteder-studio-dansesaler-kreative-lokaler`,
  `leie-ovingsrom-musikk-dans-studio`,
  `spesiallokaler-niche-utleie-teaterscene-kjeller`,
  `booking-spesialiserte-trening-kunstnerlokaler`) resolve to real files; link
  markdown syntax (`/blogg/<slug>`) matches the pattern used elsewhere.
- Frontmatter fields all present and correctly typed per
  `BlogFrontmatter`/`extractFrontmatter` in `blogFrontmatter.ts`; `tag:
  "Privatperson"` is a real tag used elsewhere; `cover` image exists in
  `public/images/blog/`; `date: 2026-08-11` matches today and sibling posts
  published the same day; `keywords` leads with the bare target term `"dans"`
  per spec.
- Product-feature claims in the body (`serietidsbestilling`,
  `sammenhengende reservasjon`) aren't invented — both terms are used
  consistently across 11 other existing posts, so the new post isn't
  asserting a feature nothing else claims.
- `pnpm vitest run src/lib/post-slugs.test.ts src/content/blogFaq.test.ts` —
  3/3 pass.
- `node scripts/check-title-lengths.mjs` — new post: `ok 56` chars, within
  the 65-char budget.
- Full `pnpm build` — prerender succeeds (415 pages), word-count gate passes
  for all 330 posts including the new one, sitemap regenerated. Confirmed
  `dist/blogg/dans-og-kunstnerstudier-atelier-for-opplaering/index.html`
  exists, contains `FAQPage` JSON-LD, and contains the FAQ answer text.

**Found:** nothing. No correctness defects on any of the above — content,
frontmatter, cross-links, FAQ wiring, and build gates all match what the
spec/acceptance criteria require, including the edge cases (verbatim FAQ
match, slug collision, cross-link existence, title/word-count budgets).

**Changed:** nothing (no fixes needed this round).

## Round 2 (lens: regression)

**Question:** what ELSE reads this code path besides the files edited? Grep
every consumer of `src/content/blog/*.md` and `blogFaq.mjs`, not just
`BlogPost.tsx`/`blogFaq.test.ts`, and check nothing depended on the old
behaviour (i.e. the world *without* this slug).

**Checked every consumer, not just the ones the diff touches:**

- `src/lib/posts.ts` / `virtual:blog-meta`, `src/lib/postContent.ts` — glob
  over `src/content/blog/*.md`, no per-post registry; new file is picked up
  by construction, confirmed already in round 1's `pnpm build`.
- `src/lib/search/corpus.ts::getSearchCorpus()` — maps `getAllPosts()` into
  search index items with no allowlist; new post is auto-searchable. Its
  `faqItems` come from `src/content/faq.ts::allFAQEntries()`, a **separate**
  site-wide FAQ system, untouched by this diff — confirmed the two FAQ
  systems (`blogFaq.mjs` per-post JSON-LD vs. `faq.ts` site FAQ page) don't
  overlap, so there's no risk of the new `POST_FAQ` entry leaking into
  `/faq`.
- `src/pages/BlogPost.tsx` sidebar `sidebarRelated` (line 110-117) — filters
  `getAllPosts()` by `p.tag === post.tag`, no hardcoded list. New post
  (`tag: "Privatperson"`) now participates in that filter for itself and for
  every *other* Privatperson post's sidebar — this is the intended dynamic
  behaviour, not a regression; nothing hardcoded a "3 posts" or "N tags"
  expectation anywhere that this would break.
- `src/pages/Blog.tsx` — tag list (`allPosts.forEach(p => set.add(p.tag))`)
  and count strings (`${allPosts.length} ARTIKLER`) are both derived from
  `getAllPosts().length`, not a hardcoded 330/331; no update needed, no
  drift risk.
- `scripts/verify-live.mjs::findDuplicateTitles` — groups posts by rendered
  `<title>` and fails on any group with >1 slug. Diffed the new title
  `"Dans- og kunstnerstudier: atelier for opplæring og øving"` (56 chars,
  renders verbatim per `check-title-lengths.mjs`'s >50-char rule) against
  every other post's `title` frontmatter — no collision.
- `src/content/blogFaq.test.ts` — re-read closely: it pins only one legacy
  slug (`beste-nettside-leie-lokale-hytte-utstyr-norge`) verbatim, it does
  **not** iterate all `POST_FAQ` keys generically, so it can't catch a
  malformed new entry — this was already known (spec/round 1 flagged it and
  verified the new entry by hand instead), re-confirmed by reading the test
  file directly rather than trusting the summary.
- `scripts/auto-publish-blogs.ts`, `dedup-blog-drafts.ts`,
  `diag-blog-drafts.ts` — greped for `readdir`/frontmatter handling; these
  operate on a separate Convex-backed drafts pipeline, not
  `src/content/blog/*.md` directly, so they don't touch a post that was
  committed straight to the repo. No interaction.
- No RSS feed exists in this repo (checked) — nothing to regenerate.
- Grepped the whole repo for the new slug string and the four cross-linked
  slugs: the only hits are the new post itself, `blogFaq.mjs`, and the
  cross-linked files it points *to* — none of those four files were
  modified to link back, consistent with SPEC's one-direction linking
  decision (avoids touching already-shipped files). No stale reference to
  the old world (i.e. no code assumed this slug's absence).
- Full `pnpm vitest run` (not just the two files round 1 targeted): **21
  test files, 45 tests, all pass** — including SSR `<h1>`/main-landmark
  tests, route-split tests, and every other post's slug/FAQ tests. No
  regression anywhere in the suite.

**Found:** nothing. Every consumer of blog content is either fully dynamic
(glob/`getAllPosts()`-driven, no registry to forget) or scoped/pinned to
slugs unrelated to this one. The two FAQ systems don't cross-contaminate.
No hardcoded counts, titles, or slug lists anywhere depended on this slug's
prior non-existence.

**Changed:** nothing (no fixes needed this round).
