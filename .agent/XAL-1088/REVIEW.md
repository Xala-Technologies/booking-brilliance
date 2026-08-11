# XAL-1088 — Review log

## Round 1 — CORRECTNESS

Lens: does the change do what the acceptance criteria say, including on edge
cases? Read `.agent/XAL-1088/SPEC.md`, the diff (`git diff origin/main...HEAD`),
`src/lib/blogFrontmatter.ts`, `src/pages/BlogPost.tsx`, `src/components/SEO.tsx`,
the new test file, and the two precedent tests it copies its pattern from
(`src/content/blogFaq.test.ts` for XAL-758, `src/content/blog-xal1155-lokalesok-faq.test.ts`).
Ran the full test suite (`pnpm vitest run`, all 21 files / 45 tests green)
before touching anything.

### Finding: the FAQPage schema's primary Q&A is never visible to a reader — only to the JSON-LD

The acceptance criteria require the page to "svare direkte på spørsmålet"
(answer the query directly) with a citable answer block. The fix wires
`POST_FAQ["system-for-innbyggere-booke-idrettshall-kommune"][0]` to the exact
target query, `"Hvilket system kan innbyggere bruke til å booke idrettshall i
kommunen?"`, which is correct for the FAQPage JSON-LD (verified: `SEO.tsx:247-251`
turns the `faq` prop straight into `mainEntity`, and `BlogPost.tsx:161` passes
`POST_FAQ[post.slug]` as that prop).

But that exact question string is **never rendered as visible page text**.
The "Vanlige spørsmål" section in the markdown body only has H3 headings for
`POST_FAQ` entries 1–5 (gratis / faste treningstider / mobil / systembytte /
private aktører); entry 0's question only exists in the post's frontmatter
(`faqQuestion: "Hvilket system kan innbyggere bruke..."`), which
`SPEC.md`'s own "HOW IT WORKS NOW" section documents as dead —
`extractFrontmatter` whitelists a fixed field set and drops anything else,
so `faqQuestion` never reaches any rendered component. The "Kort svar:" intro
paragraph contains the *answer* text verbatim, but never states the
*question* itself as visible copy.

Compared against both precedents this pattern is copied from:
- XAL-758 (`beste-nettside-leie-lokale-hytte-utstyr-norge.md`): target
  question is dead in frontmatter (line 13) **and** a live H3 in the body
  (line 82).
- XAL-1155 (`lokalesok-definisjoner-lokaletyper-priser.md`): target question
  is an H2 (line 16) **and** repeated bold text in the body (line 77).

Both precedents keep the FAQPage's primary claim backed by visible text —
matching `blogFaq.mjs`'s own file comment that Q/A entries should mirror
"what the reader sees." This diff is the first of the three to break that:
it emits a `FAQPage` `mainEntity` entry for a question string that appears
nowhere in the rendered `<article>`.

This is a real citability regression for the exact problem the ticket is
about: Google's structured-data guidelines require FAQPage content to also
be visible on the page (a JSON-LD-only claim risks the rich result being
ignored, and an AI crawler reading rendered HTML — not just JSON-LD — won't
find the literal target phrase to cite either).

**Masking bug in the new test**: `blog-xal1088-aeo.test.ts`'s "mirrors a
matching Vanlige spørsmål section" test reads the *entire raw .md file*
(frontmatter included) via `readFileSync`, then checks `raw.toContain(question)`.
Because the dead `faqQuestion:` frontmatter line still contains the exact
question string, the assertion passes even though the question is invisible
to an actual reader. This is the same shape of test in both precedent files
(also checks raw-with-frontmatter) — but it only stayed correct there because
those two posts happen to also carry the question as real body text. It's a
latent trap: copy the test pattern without copying the "also put the question
in the body" discipline, and the test gives a false green light. Confirmed by
re-running the test unmodified after the fix below — still green, now for the
right reason.

### What I changed

- `src/content/blog/system-for-innbyggere-booke-idrettshall-kommune.md`:
  added the exact target query as a visible H3 at the top of the "Vanlige
  spørsmål" section (before the 5 existing ones), with its answer being the
  same text already in the "Kort svar" intro paragraph — so `POST_FAQ[0]` now
  mirrors real, visible body copy like every other entry, matching the
  established XAL-758/XAL-1155 convention.
- No test change: `blog-xal1088-aeo.test.ts` now passes for the right reason
  (the question is genuinely in the body, not only in dead frontmatter). Left
  the test's raw-file-read pattern as-is to stay consistent with the two
  precedent test files — tightening it to strip frontmatter first is a
  repo-wide test-hygiene fix that affects three files outside this ticket's
  scope, not a defect introduced by this diff.
- Re-ran `pnpm vitest run`: still 21 files / 45 tests green.

Other things checked and found correct, not flagged:
- `updated: 2026-08-11` frontmatter format matches what `scripts/prerender.mjs`
  reads for `dateModified` (confirmed by reading the prerender code, matching
  SPEC's description).
- Comparison table markdown is well-formed (6 columns throughout, no ragged
  rows).
- `POST_FAQ` object-literal edit is purely additive — grepped `blogFaq.mjs`'s
  two consumers, confirmed no other slug's entry is affected.
- Full `pnpm vitest run` was green both before and after the fix.

## Round 2 — REGRESSION

Lens: what else reads this code path — not just the files this diff touched —
and did anything depend on the old behaviour? Grepped every consumer of
`blogFaq.mjs`/`POST_FAQ`, every reference to the slug across the repo
(excluding `dist/`), the `SOLUTION_PAGES` keyword matcher, the redirect
guard, the description-length convention, and whether `POST_FAQ`'s `faq`
prop is rendered anywhere other than JSON-LD (which would have made Round
1's manual H3 addition a duplicate-content bug). Ran the full suite again
and the title-length guard.

### Checked, no regression found

- **`blogFaq.mjs` consumers**: exactly `src/pages/BlogPost.tsx` (client
  render → `SEO.tsx`'s `faq` prop) and `scripts/prerender.mjs` (SSR JSON-LD),
  plus four test files (`blogFaq.test.ts`, `blog-xal739-aeo.test.ts`,
  `blog-xal1155-lokalesok-faq.test.ts`, and this ticket's new
  `blog-xal1088-aeo.test.ts`). The new `POST_FAQ` key is a pure addition to
  an object literal — grepped every other key, none reference or depend on
  key order or count, and all four pre-existing FAQ-map tests still pass
  unchanged.
- **`faq` prop is JSON-LD only** (`src/components/SEO.tsx:247-251`, feeds
  `mainEntity` into a `<script type="application/ld+json">` block) — it is
  never rendered as visible markup anywhere in `BlogPost.tsx` or `SEO.tsx`.
  This confirms Round 1's fix (adding the target question as a visible H3 in
  the markdown body) was necessary — the FAQPage schema was genuinely
  invisible to readers before that — and that it didn't create a *duplicate*
  rendering: there's no second component that would also auto-render
  `POST_FAQ` entries as visible text, so the H3 is the only rendered copy.
- **Slug is referenced nowhere else in the repo** (`grep -rln
  "system-for-innbyggere-booke-idrettshall-kommune"`, excluding `dist/`):
  only the post's own frontmatter, the new `POST_FAQ` key, and the new test
  file. No hardcoded internal link, no redirect-map entry, no
  `SOLUTION_PAGES` per-slug matcher — that matcher
  (`src/pages/BlogPost.tsx:33`) matches generically on
  `/idrettshall|gymsal|sesong|hall|forening|trening|anlegg/i` against page
  content, the same way it already did before this diff; nothing in the
  changed copy removes or adds a keyword that regex depends on.
- **`guard-blog-redirects.mjs`** resolves slugs by *exact* frontmatter
  `slug:` match (`resolveSlug`), not fuzzy/substring match — so the two
  near-identical sibling slugs (`system-for-innbyggere-booke-idrettshall-kommune`
  vs. the pre-existing, untouched `system-booke-idrettshall-kommune`) can't
  collide in that guard despite the similar wording.
- **`check-blog-word-count.mjs` / `check-title-lengths.mjs`**: title is
  unchanged by this diff; word count guard was already confirmed green
  against the prerendered HTML in Round 1's `pnpm build` run, and the only
  content change since (the H3) added words, not removed them.
- **`src/lib/postContent.ts`** (`getAllPosts`, used by the two
  description-length tests and by sitemap/RSS-style consumers) globs
  `src/content/blog/*.md` directly — no allowlist to update, no per-slug
  branch that could silently exclude or duplicate this post.

### Finding: meta `description` is 222 chars, pushed further over the repo's own ~160-char convention — but this is pre-existing, not introduced by this diff

Two precedent tests in this repo
(`src/lib/leie-selskapslokale-description.test.ts`,
`src/lib/digitalt-bookingsystem-description.test.ts`) pin `description.length
< 160` for other posts, with a comment explaining why: `scripts/prerender.mjs`
writes `meta.description` verbatim into `<meta name="description">`,
`og:description` and `twitter:description` with **no truncation logic**
anywhere in the pipeline — confirmed by reading `prerender.mjs:2310,
2348-2362` and `SEO.tsx:116,126`. Google and social previews truncate past
~155-160 chars themselves, so an over-length description is a real (if soft)
regression risk for how the page renders in search/share previews — exactly
the kind of technical-citability detail this ticket cares about.

Measured both versions: the pre-diff description was already 205 chars (over
the convention), and this diff's edit — adding "BookUp", "Aktiv Kommune" and
"FRI Booking-system" in place of "bookup.no, Aktiv kommune" — pushed it to
222. So this is not a regression this diff *caused*: the post already
violated the convention before this ticket touched it, and no test covers
this specific slug so nothing was silently broken. Not fixing it here since
it's pre-existing and outside a regression-lens round's scope (Round 1
already owns correctness fixes; this is a candidate for a future round or a
follow-up ticket) — flagged as an ENHANCEMENT in the session report instead.

### What I changed

Nothing — this lens found no regression introduced by the diff. Re-ran
`pnpm vitest run`: still 21 files / 45 tests green, and
`node scripts/check-title-lengths.mjs` shows this post's title unaffected
(unchanged by the diff, not in the over-65-char list newly).
