# XAL-1160 — Review log

## Round 1 — CORRECTNESS

Lens: does the change do what the acceptance criteria say — sharper
title/meta, clearer value proposition, internal links, and depth, to lift
CTR at position 17.2 — including on edge cases the SPEC didn't check?

### What I checked

- Every concrete number in the new "I korte trekk" box against the
  article's own sections it claims to summarize: "3 ressurstyper" (bullet
  list under "Hvilke ressurser kan bookes digitalt" has exactly 3 items),
  "4 brukergrupper" (bullet list under "Hvem bruker digitale
  bookingsystemer" has exactly 4 items), "6 steg" (numbered list under
  "Hvordan fungerer ... i praksis" has exactly 6 items). All three numbers
  are accurate, not invented.
- Both new internal link targets (`/bruksomrader/moterom`,
  `/bruksomrader/idrettshaller-gymsaler`) against `src/App.tsx` — both are
  live routes (lines 378-379).
- The title-length suffix logic in `BlogPost.tsx:133` and
  `prerender.mjs:2532` (both append " · Digilist" / " – Digilist" only
  when `title.length <= 50`) — new title is 54 chars, so both paths
  correctly stay suffix-free, matching the SPEC's claim.
- The frontmatter regex parsers in both `blogFrontmatter.ts` (used by the
  live SPA) and `scripts/prerender.mjs` (used by the static prerender)
  against the new title/description strings — the en-dash and question
  mark in the title, and the added `updated` field, parse cleanly in both;
  confirmed by reading the regexes by hand, not just trusting the SPEC's
  claim.
- Full `npx vitest run` (17 files / 36 tests, all green) and re-read of
  `npx tsc --noEmit` output — clean.
- Word-count delta between old and new markdown body (934 → 1000 words,
  +66) against the unchanged `readingMinutes: 7` — not enough added
  content to plausibly cross a minute boundary at any reasonable
  words-per-minute assumption; leaving it at 7 was correct, not an
  oversight.
- Norwegian Bokmål grammar/spelling of every added or edited sentence
  (intro clause, 4-line stats box, restructured "Neste steg" section) —
  read line by line, no typos or grammatical errors found.

### What I found

**Meta description is 224 characters — 64 over this repo's own ~160-char
SERP-truncation budget, and worse than the description it replaced.**

The new `description` frontmatter field
(`src/content/blog/digitalt-bookingsystem-hva-er-det.md:4`) is 224
characters long. The description it replaced was 164 characters — already
at the edge, but the new one is 37% longer, not shorter. This repo has
prior, confirmed incidents of exactly this failure mode: `XAL-787` (cited
in `src/pages/UtstyrFestutstyr.test.ts:8`) and a second post
(`leie-selskapslokale-bryllup-fest`) both have standing regression tests —
`src/lib/leie-selskapslokale-description.test.ts` and the Fredrikstad case
in `src/content/lokalerByer.test.ts` — that assert
`description.length < 160` specifically because Google truncates past
that point. This branch's own change works directly against the ticket's
goal: a SERP snippet that gets cut off mid-sentence with an ellipsis is
not "mer attraktiv" than a shorter, complete one. At a ~155-160 char
truncation point, the "6 steg" hook (the new title's whole selling point)
narrowly survives, but the sentence is chopped off mid-word
("...bekreftet reservas…"), which looks worse in the SERP than a
description that ends cleanly. This is a real defect against the
acceptance criteria, not a nitpick — it's the same bug class this
codebase has already paid to fix twice.

No other correctness issues found. The numbers, links, suffix logic,
frontmatter parsing (both parsers), tests, and prose all check out.

### What I changed

- Shortened `description` in
  `src/content/blog/digitalt-bookingsystem-hva-er-det.md` from 224 to 157
  characters, keeping the "6 steg" hook intact and ending on a complete
  sentence instead of a mid-clause cutoff.
- Added `src/lib/digitalt-bookingsystem-description.test.ts`, mirroring
  the existing `leie-selskapslokale-description.test.ts` pattern, to
  regression-guard this specific post's description against the same
  160-char truncation failure going forward.
- Re-ran `npx vitest run` (18 files / 37 tests, all green) and
  `npx tsc --noEmit` (clean) after the fix.
