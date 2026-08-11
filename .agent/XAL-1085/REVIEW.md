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
