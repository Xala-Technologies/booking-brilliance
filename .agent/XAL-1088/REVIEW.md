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
