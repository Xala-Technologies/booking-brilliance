# XAL-1154: Deep review log

Change under review: one new file,
`src/content/blog/utearealer-paviljonger-seating-bryllup-sommerfest.md`
(a Norwegian blog post), plus `AGENT-SPEC.md`.

## Round 1 — correctness / regression-duplication / security / scope

Four parallel agents, each told to REFUTE the change over the actual file
contents and `git diff origin/main..HEAD`.

**Correctness** — found one real grammar defect: line 24 shifted from the
plural antecedent "alle tre" to singular "den" mid-sentence ("...den må tåle
antall gjester..."), breaking agreement. Everything else checked out:
internal links (`/blogg/velge-bryllupslokale-guide-2026`,
`/blogg/leie-bryllupslokale-kapasitet-inkludert-skjenkebevilling`,
`/book-demo`) all resolve against real files/routes, frontmatter matches
sibling conventions (author/role/tag/cover/readingMinutes all consistent),
and the real-time-calendar/direct-booking claims in the CTA and the
"Slik sjekker og booker" section match how sibling posts describe the same
product feature — no overstatement. Also flagged a lower-confidence
redundancy: two separate checklist bullets both led with "Strøm", one for
lyd/lys and one for patioovner heating, reading as an editing inconsistency.

**Regression / duplication** — the most substantive finding: the "Vær og
plan B" section was near-verbatim to material already published in
`velge-bryllupslokale-guide-2026.md` (same three-question structure, same
"innendørs alternativ ... uten ekstra kostnad" / "responstid" / "hvem tar
avgjørelsen" phrasing) and one sentence in
`leie-bryllupslokale-kapasitet-inkludert-skjenkebevilling.md` ("Et telt til
80 gjester kan fort koste like mye som selve lokalleien" vs. this post's
near-identical "et telt til 80 gjester fort koster like mye som selve leien
av selskapslokalet"). Slug, cover image reuse (`en_plattform_hero_no.webp`,
already shared by 28 posts), and the `Privatperson` tag (81 existing uses)
were all confirmed clean — no collision, reuse is the established
convention. No other post targets "utearealer" as a primary keyword.

**Security** — no issues. No raw HTML/script in the markdown; the render
pipeline (`ReactMarkdown` + `remarkGfm`, no `rehype-raw` anywhere in the
repo, no `dangerouslySetInnerHTML` in the blog path) wouldn't execute raw
HTML even if present. No secrets or internal infra in either file. All
three links are internal/relative. The `skjenkebevilling` mentions are
framed as "sjekk med stedet/kommunen," not definitive legal advice.

**Scope** — clean except one stray uncommitted change: `pnpm-workspace.yaml`
had gained an `allowBuilds` block from my own local `pnpm approve-builds`
step (needed to install native deps in this fresh worktree) — unrelated to
the ticket, reverted with `git checkout -- pnpm-workspace.yaml` before
committing anything. The diff itself contains only the new post plus
`AGENT-GOAL.md`/`AGENT-SPEC.md`; none of the forbidden shared files
(`scripts/prerender.mjs`, `src/entry-server.tsx`, `scripts/verify-live.mjs`,
`vite.config.ts`, `build-plugins/blogMetaPlugin.ts`, `src/lib/posts.ts`,
`src/pages/Blog.tsx`) were touched.

### What I changed after round 1
- Fixed the "de"/"den" pronoun-agreement break (line 24).
- Renamed the "Strøm og oppvarming" bullet to "Oppvarming ved kveldskulde"
  and reworded it to add a detail (own strømkrets, sized for guest count)
  that wasn't already covered by the earlier "Strøm på stedet" bullet, so
  the two bullets no longer overlap in scope.
- Rewrote the telt/paviljong cost sentence so it makes the same point
  (get the all-in price, not just the tent rental) without echoing the
  sibling post's specific "kan fort koste like mye som selve lokalleien"
  wording.
- Rewrote the "Vær og plan B" section from a three-question list into
  flowing prose with a different structure and different specifics
  (decision deadline, who has final say, cost of the fallback), keeping
  the same underlying facts a reader needs but no longer matching the
  sibling post's paragraph sentence-for-sentence.
- Reverted the unrelated `pnpm-workspace.yaml` change (local tooling
  artifact from installing dependencies in this worktree, not part of the
  diff).
- Re-ran the full build pipeline (`optimize-images` → `vite build` → SSR
  build → `prerender.mjs` → `check-blog-word-count.mjs`) and
  `npx vitest run` — both green after the edits (16 files / 35 tests,
  word-count check passes on both markdown and prerendered HTML).

## Round 2 — re-verify round 1's fixes + fresh editorial/SEO pass

Two parallel agents: one re-verified all four round-1 fixes landed
correctly, re-checked the rewritten "Vær og plan B" section and telt-cost
sentence one more time against the two sibling posts, fact-checked every
remaining claim against three more related posts, and ran a full clean
production build with direct HTML/sitemap inspection; the other did a fresh
skeptical-editor read of the whole post plus a frontmatter/metadata/heading/
checklist/link-anchor audit, explicitly told not to assume round 1 caught
everything.

**Fact-check + build lens** — first three round-1 fixes (pronoun, bullet
rename, telt-cost sentence) verified correctly applied and reading
naturally in context. The fourth fix (the "Vær og plan B" rewrite) was only
partially fixed: it still carried a verbatim 5-word phrase ("dere, eller
vertskapet på stedet") lifted from `velge-bryllupslokale-guide-2026.md`, a
near-identical sentence template ("spesielt i mai og september, når
værutsiktene er minst pålitelige" vs. that post's "spesielt i mai og
september når været er minst forutsigbart"), and a verbatim 5-word phrase
("innendørs alternativ i samme bygning") lifted from
`leie-bryllupslokale-kapasitet-inkludert-skjenkebevilling.md` — the
structural rewrite hadn't touched the distinctive phrasing itself. No new
factual contradictions found against `utendorsfasiliteter-booking-og-
tilgjengelighet.md`, `leie-utstyr-til-fest-telt-bord-lyd-servering.md`, or
`leie-selskapslokale-bryllup-fest.md`. One low-severity terminology nuance
noted, not fixed: this post says "engangsløyve" where the kapasitet post
says "ambulerende bevilling" for a temporary skjenkebevilling — both
legitimate terms for related but not strictly identical routes, not a
contradiction. Full clean build (`rm -rf dist dist-server && npm run
build`) passed; direct inspection of the prerendered HTML confirmed exactly
one `<h1>`, correct canonical URL, complete Open Graph tags, and exactly
one sitemap entry.

**Editorial/SEO lens** — found two real issues: (1) "private arrangement"
(wrong plural — should be "private arrangementer") in the frontmatter
description and twice in the body; (2) the second internal link's anchor
text was stale — it read "Bryllupslokale: kapasitet, inkludert utstyr og
skjenkebevilling" but the actual title of
`leie-bryllupslokale-kapasitet-inkludert-skjenkebevilling.md` is
"Bryllupslokale 2026: kapasitet, totalpris og hva som faktisk er
inkludert". Everything else checked out clean: title length (60 chars, in
line with siblings, confirmed via `scripts/check-title-lengths.mjs`
reporting "ok"), `utearealer` correctly the first/primary keyword, heading
structure (H2s only, no skips or duplicates), and every checklist item
traceable to body content explained earlier in the post.

### What I changed after round 2
- Fixed "private arrangement" → "private arrangementer" in the frontmatter
  `description` and in both body occurrences (intro paragraph and the
  "Hva er utearealer..." section).
- Fixed the second internal link's anchor text to match the real title of
  `leie-bryllupslokale-kapasitet-inkludert-skjenkebevilling.md`.
- Reworded the "Vær og plan B" section a second time to remove the three
  remaining lifted phrases, restating the same underlying facts (decision
  deadline, who decides, cost of the fallback, and why a same-building
  alternative lowers risk) with genuinely different sentence construction
  and vocabulary this time, not just a different list-vs-prose structure.
- Re-ran the full build pipeline and `npx vitest run` — both green
  (16 files / 35 tests, word-count check passes on markdown and prerendered
  HTML).

## Round 3 — cold fresh-eyes copyedit + full-branch regression sweep

Two parallel agents, zero prior context, told to independently re-verify
everything rather than trust any earlier "fixed" claim: one did a
skeptical-copyeditor read plus one more overlap check against the two
sibling posts; the other swept the whole branch (commits, diff, working
tree, forbidden files) for anything content review wouldn't catch.

**Fresh-eyes copyedit lens** — found one more real grammar error of the
same class as round 1's de/den bug: "akkurat **den** oppsettet" should be
"akkurat **det** oppsettet" (`oppsett` is neuter). Confirmed the round-1 and
round-2 fixes (de/den agreement, "private arrangementer") held and found no
further instance of that error class elsewhere. Also found that round 2's
"Vær og plan B" rewrite still hadn't removed all the overlap: the closing
CTA paragraph was a near-verbatim clone of `velge-bryllupslokale-guide-
2026.md`'s CTA opening ("...uten å bruke uker på e-postrunder og
telefonsamtaler? Book en demo hos Digilist..."), and three of the seven
closing-checklist bullets shared near-identical sentence templates with
bullets in that post and in `leie-bryllupslokale-kapasitet-inkludert-
skjenkebevilling.md` (same "Har X, eller må dere søke selv" / "Er totalpris
inkludert X, eller kommer det i tillegg" frames, just the noun swapped) —
round 2's dedup pass had covered the body sections but missed the checklist
and CTA. All three links, and the full frontmatter, re-verified clean.

**Regression-sweep lens** — clean except one process gap, not a content
defect: `AGENT-REVIEW.md`'s round-2 write-up existed only in the working
tree, not yet committed. Confirmed: exactly 3 content-relevant files in the
diff at that point (the post, `AGENT-SPEC.md`, `AGENT-GOAL.md`), all 5
commits' messages matched their actual `--stat` content, no forbidden
shared file touched, exactly one new post under `src/content/blog/`,
`AGENT-GOAL.md` present/tracked/unmodified as expected at this stage, no
stray TODO/FIXME or wrong-ticket-number text, `pnpm-workspace.yaml` clean
(round 1's revert held).

### What I changed after round 3
- Fixed "den oppsettet" → "det oppsettet" (line 40).
- Rewrote the closing CTA paragraph with a different opening and structure,
  keeping the same offer (see real-time availability, book a demo) without
  echoing the sibling post's specific phrasing.
- Reworded the three overlapping checklist bullets (skjenkebevilling,
  innendørs-alternativ, totalpris) so each states the same underlying check
  with different sentence construction than the matching bullets in the two
  sibling posts.
- Committed the pending `AGENT-REVIEW.md` update from round 2, closing the
  process gap the sweep found.
- Re-ran the full build pipeline and `npx vitest run` — both green
  (16 files / 35 tests, word-count check passes on markdown and prerendered
  HTML).

## Round 4 — final holistic pass + independent cold read

Two parallel agents: one did a targeted final pass (encoding/whitespace
sweep, redundancy check between the definitional and checklist sections,
checklist-vs-body consistency, and one more skjenkebevilling cross-check),
explicitly told to assume all prior fixes were correct and look only for
anything new; the other read the file completely cold, with zero prior
context, independently re-verifying every link, the full frontmatter, and
the reading-time math from scratch.

**Holistic refute lens** — no encoding/whitespace issues (clean UTF-8, only
expected æøå/em-dash non-ASCII characters, no CRLF or trailing whitespace).
No redundancy between the definitional section and the mid-article
checklist — topic-sentence-then-detail structure, not duplication. Found
one real same-file inconsistency: the closing checklist's "Vet dere hvem
som bestemmer og hva det koster hvis uteplassen må byttes ut samme dag"
(line 74) didn't match the "Vær og plan B" section's own wording, which
said the same cost applied "samme uke" (line 53) — a timeframe mismatch
introduced across the earlier rewrite rounds. Re-checked skjenkebevilling
content against `leie-bryllupslokale-kapasitet-inkludert-skjenkebevilling.md`
one more time — consistent, no contradiction.

**Fresh-eyes lens** — independently re-verified all three links resolve,
frontmatter is complete and matches the schema of two randomly-picked
sibling posts field-by-field, and recomputed the word count (1302 words)
and implied reading speed (186 wpm) — within the plausible range and close
enough to two sibling posts' own ratios (203-205 wpm) that `readingMinutes:
7` needs no change. Confirmed `src/pages/Blog.tsx` renders `readingMinutes`
directly from frontmatter with no live computation, so there's no
authored-vs-computed mismatch to worry about (a pre-existing, sitewide
static pattern, not specific to this post). One nit found: "utepatioovner"
is a redundant compound ("ute-" + "patio" already implies outdoors).

### What I changed after round 4
- Fixed the checklist to say "samme dag" instead of "samme uke", matching
  the "Vær og plan B" section's own wording.
- Fixed "utepatioovner" → "patioovner".
- Re-ran the full build pipeline and `npx vitest run` — both green
  (16 files / 35 tests, word-count check passes on markdown and prerendered
  HTML).

Four rounds run. Round 1 found and fixed a pronoun-agreement error, a
checklist redundancy, and the most substantial issue — near-verbatim
phrasing overlap with two sibling posts in the "Vær og plan B" and
"Paviljong eller telt" sections — plus reverted a stray local-tooling file
change. Round 2 found the dedup rewrite had only partially removed the
overlap (three lifted phrases survived) plus a real grammar error and a
stale link anchor text. Round 3 found a second de/den-class agreement
error and discovered the dedup pass had missed the closing CTA and three
checklist bullets entirely. Round 4 found one same-file internal
inconsistency (a timeframe mismatch introduced by the earlier rewrites) and
one minor wording nit, with everything else — links, frontmatter, word
count, encoding, cross-file consistency — independently re-verified clean.
No round came back completely empty on real, fixable defects, which is why
this review ran the full four rounds as scoped.

## Proof

This is new content, not a fix to existing behavior, so only an AFTER state
applies (there is no "before" — the page didn't exist). Verified with a
full production build (`vite build` + SSR + `scripts/prerender.mjs`) served
via `vite preview`, then captured with `agent-browser`:
- `proof/after-utearealer-post.png` — the published post's top (title,
  description, author, reading time, tag, table of contents) at
  `/blogg/utearealer-paviljonger-seating-bryllup-sommerfest`.
- `proof/after-utearealer-post-checklist-cta.png` — the closing
  "Sjekkliste før dere booker uteareal" section rendering correctly with
  round 3's rewritten checklist bullets.
