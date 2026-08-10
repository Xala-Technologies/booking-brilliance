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
