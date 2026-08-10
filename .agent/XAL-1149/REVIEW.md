# XAL-1149: Review log

## Round 1 — Correctness

Lens: does the diff do what the ticket/spec acceptance criteria say, on the
edge cases too? Read `.agent/XAL-1149/SPEC.md`, the full
`git diff origin/main...HEAD`, and the test suite; ran the build-time content
gates directly.

Checked:

- **Ticket coverage.** Both required beats are present and substantive: the
  PT/instructor flexible-booking need (own H2 with concrete scenarios: short
  slots, short-notice booking, recurring weekly clients) and the private
  gym-operator persona (own H2: per-room pricing, multi-room/multi-instructor
  calendar, pay-at-booking, cancellation rules). Not a thin restatement of
  the ticket text — each claim is grounded in the product vocabulary already
  used elsewhere in the blog (serietidsbestilling, sanntidskalender).
- **Content-gap claim still holds.** Re-ran the two greps SPEC.md cites
  (`treningsrom`, `personlig trener|fitnessinstruktør|treningssenter`) against
  `src/content/blog/*.md` excluding the new file — still zero hits. No other
  post already covers this.
- **Frontmatter shape.** Matches `BlogFrontmatter` in `blogFrontmatter.ts`
  exactly; `tag: "Utleier"` is an existing tag (16 other posts use it, none
  invented).
- **Build gates.** `node scripts/check-blog-word-count.mjs` — passes for all
  310 posts, source and prerendered HTML both. Body is 1177 words, well over
  the 200-word `content.thin` floor. `check-title-lengths.mjs` — rendered
  title is 59 chars, under the 65-char informational threshold.
- **Full test suite.** `npx vitest run` — 19 files, 38 tests, all pass,
  including the slug-uniqueness guard, webp-sibling guard, and the two SSR
  `<h1>`/landmark invariant tests. No regression from the new file.
- **Internal link.** `/blogg/trenings-og-badeanlegg-booking-treningsgrupper-svommeklubber`
  — target file exists, and the linking sentence correctly frames it as a
  different persona (lag/foreninger vs. selvstendige trenere), which matches
  what SPEC.md verified about that post so the link doesn't cannibalize.
- **CTA-stripping interaction.** `BlogPost.tsx`'s `isCta()` un-anchored regex
  strips any paragraph *containing* `[Book en demo](...)` anywhere in it, not
  just paragraphs that are only a CTA. The new post's closing paragraph
  ("## Gjør treningsrommene dine bookbare" + prose ending in
  `[Book en demo](https://digilist.no/demo)`) gets fully stripped from the
  rendered article body, same as the two neighbor posts' closing sections —
  confirmed this is the established, intentional pattern (comment in
  `BlogPost.tsx` explains why), not a bug specific to this diff.
- **FAQ registration.** The post's inline "Vanlige spørsmål" Q&A has no
  `POST_FAQ` entry in `blogFaq.mjs`, so no FAQPage JSON-LD renders for it.
  Confirmed against precedent: `trenings-og-badeanlegg-...svommeklubber.md`
  has the same inline-FAQ-without-registration pattern, and SPEC.md already
  flagged this as optional. `blogFaq.test.ts` /
  `blog-xal739-aeo.test.ts` are slug-pinned regression tests, not a generic
  "every FAQ section must be registered" gate — no test failure risk.

Found and fixed one real inconsistency:

- **`readingMinutes: 7` didn't match the actual computed reading time.**
  `BlogPost.tsx` (the article page itself) ignores the frontmatter value and
  computes its own `Math.round(wordCount / 200)` for the on-page "min
  lesetid" label; only the homepage teaser and `/blogg` listing read the
  frontmatter field. At 1177 words that computes to 6, not 7, so the same
  post would have shown "7 min lesetid" on the teaser/listing and "6 min
  lesetid" on the article itself. Pre-existing posts already carry worse
  drift of this kind (one is off by 3), so this isn't a new class of bug in
  the codebase, but there's no reason to add a fresh instance of it when the
  fix is a one-line correction. Changed `readingMinutes: 7` → `6` in
  `src/content/blog/treningsrom-gymhaller-personlig-trener-fitnessinstruktor.md`.

No other correctness issues found this round. Re-ran
`check-blog-word-count.mjs`, `check-title-lengths.mjs`, and the full
`vitest run` after the fix — all still pass.
