# XAL-1135 — Review log

## Round 1

Lens: **correctness** — does the change do what the acceptance criteria in
`.agent/XAL-1135/SPEC.md` say, on the edge cases too?

Checked against `git diff origin/main...HEAD`, which touches exactly two
files: `.agent/XAL-1135/SPEC.md` (already written, contrary to the resume
prompt's assumption — step 0 was in fact completed in commit
`fa2d2e5`) and the new post
`src/content/blog/yoga-wellness-studio-klasseromlokaler.md`.

What was checked, and what came back:

- **Gap claim still holds.** Re-ran `grep -ril "yoga"` / `"wellness"` across
  `src/content/blog/*.md` excluding the new file itself — still zero hits.
  The persona is still genuinely new, not stepping on
  `kunstner-verksteder-studio-dansesaler-kreative-lokaler` (XAL-1143) or
  `treningsrom-gymhaller-personlig-trener-fitnessinstruktor` (XAL-1149).
- **Frontmatter, field by field, against `src/lib/blogFrontmatter.ts` and
  three sibling posts (XAL-1142/1143/1149):** slug, date format, author,
  role string, tag, cover path, and keywords-array syntax all match the
  established pattern exactly. `readingMinutes: 6` checked against actual
  body word count (1163 words) vs. siblings of near-identical length (1160
  and 1177 words, both also `readingMinutes: 6`) — consistent, not a guess.
- **Title**: measured 57 chars (SPEC claims 57) — confirmed by both a
  direct Python length check and `node scripts/check-title-lengths.mjs`,
  which prints `ok 57 yoga-wellness-studio-klasseromlokaler.md` (the
  corpus-wide "137/316 exceed 65 chars" failure is pre-existing noise
  across older posts, not this one).
- **Description**: measured 145 chars, under the 155 hand-checked limit
  (no automated gate exists for this field, per SPEC's note about the
  XAL-1143 round-2 finding).
- **Word-count gate**: ran `node scripts/check-blog-word-count.mjs`
  directly (dist/ already had a same-day prerender) —
  `✓ All 316 blog posts have at least 200 words in the markdown source` and
  the same for the prerendered HTML `<article>` text. Also spot-checked the
  prerendered `dist/blogg/yoga-wellness-studio-klasseromlokaler/index.html`
  by hand for real body text (`"yogainstruktør"`, `"Vanlige spørsmål om
  booking"` both present, 125KB — not a Suspense-fallback stub).
- **Slug uniqueness / FAQ convention**: `npx vitest run
  src/lib/post-slugs.test.ts src/content/blogFaq.test.ts` — both pass.
  Confirmed `src/content/blogFaq.mjs` untouched, matching the batch's
  established "prose FAQ, no `POST_FAQ` schema entry" convention.
- **Redirect-collision guard**: the local `--check` run reports "0 posts to
  check" because it only diffs uncommitted `git status` output and this
  post is already committed — that's the guard's designed pre-commit
  scope, not a bug here. To actually verify the SPEC's claim rather than
  trust it, fetched the live slug directly with `redirect: manual`
  semantics (`curl --max-redirs 0`): `https://digilist.no/blogg/yoga-wellness-studio-klasseromlokaler`
  → `200`, no redirect. Not claimed by a standing consolidation redirect.
- **Internal link**: exactly one contextual link, to
  `kunstner-verksteder-studio-dansesaler-kreative-lokaler`, target file
  confirmed to exist. Matches the SPEC's "and/or" — only one of the two
  candidates was used, which the SPEC explicitly allowed.
- **CTA**: closing link is `https://digilist.no/demo`, matching the
  majority CTA-link format used across the corpus (some peers use a
  root-relative `/demo` instead — both forms coexist site-wide, so this is
  not a deviation).
- **Full test suite**: `npx vitest run` — 20 files, 40 tests, all pass,
  including the SSR `<h1>`/landmark/heading-outline invariants that a
  content-only PR could still break if the new post's Markdown produced
  malformed heading structure. It doesn't.

**Findings: none.** Every acceptance criterion in the SPEC's "WHAT CHANGES"
section was checked against the actual file content (not re-read from the
SPEC's own claims) and holds. No edge case — slug collision, stale-dist
false pass, frontmatter parse mismatch, word-count gate, FAQ convention,
internal-link target — turned up a defect. No code changes made this
round.
