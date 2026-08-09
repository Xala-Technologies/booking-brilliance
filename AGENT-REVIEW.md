# XAL-1140: Deep review log

Change under review: one new file,
`src/content/blog/uterom-grontareal-arrangementer-kommune.md`
(a Norwegian blog post), plus `AGENT-SPEC.md`.

## Round 1 — correctness / regression-duplication / security / scope

Four parallel agents, each told to REFUTE the change over the actual file
contents.

**Correctness** — found one real defect:
1. Line 14 used "på siden av" where standard Norwegian is "ved siden av"
   ("alongside"). Confirmed by grepping the entire blog corpus: "ved siden
   av" appears 30+ times (including in the sibling
   `utendorsfasiliteter-booking-og-tilgjengelighet.md`), "på siden av"
   appeared nowhere else — a genuine typo, not house style.

Everything else checked out: no overstated legal/regulatory claims (all
references to "søknad om bruk av offentlig grunn" etc. are appropriately
hedged, unlike some sibling posts that cite specific fees/dates); the
"objektmodell" product-capability claim mirrors the sibling post's
established phrasing, not a new overreach (confirmed `convex/schema.ts` has
no product booking-object schema at all — this repo has no booking domain in
code, so all such claims are marketing narrative, consistently scoped across
posts); both internal links resolve to real files; frontmatter is internally
consistent. Minor nitpick raised (keyword "kommunalt friareal utleie" didn't
match the body's "friområde" wording) — fixed by aligning the keyword.

**Regression / duplication** — found one real defect:
1. The post's "why this sits outside the booking system today" paragraph and
   its closing CTA paragraph were structural template-swaps of
   `utendorsfasiliteter-booking-og-tilgjengelighet.md`'s equivalent
   paragraphs — same sentence shapes, same "stående utenfor ... styrt av en
   e-post" phrasing, same "X som ikke er søkbart, er i praksis en ressurs
   kommunen ... uten å få ... igjen" closing structure. The *topical*
   distinction between event-scale outdoor space and small fixed structures
   (grillhytter/paviljonger) holds up, but the phrasing itself was a
   near-clone, which reads as templated/thin to a search engine even where
   the underlying facts differ.

No other issues: no other post substantially covers "uterom"/"grøntareal"/
"strandavsnitt" (only one unrelated, single-word hit in a wedding-cost post);
no slug/title collision; no shared build/render file touched (confirmed
`scripts/prerender.mjs`, `src/entry-server.tsx`, `scripts/verify-live.mjs`,
`vite.config.ts`, `src/lib/posts.ts`, `src/lib/blogFrontmatter.ts`,
`src/content/blogFaq.mjs` all untouched); no hardcoded blog-slug enumeration
outside the glob-based discovery in `src/lib/posts.ts`; cover image's
`-preview.webp` sibling already committed.

**Security** — no issues found. No raw HTML/script/XSS vectors in the
markdown; no secrets or internal infra details in frontmatter; all three
links are internal relative paths or the canonical `https://digilist.no/demo`
domain; no unsubstantiated compliance/certification claims (unlike
`ssa-l-2026-bookingsystem-kommune.md`, this post makes no ISO/GDPR
certification assertions); `AGENT-SPEC.md` contains no credentials or
internal-only infrastructure details.

**Scope** — no issues found. Only `AGENT-SPEC.md` and the one new blog post
changed; no shared build/render files touched; post length (1,413 words at
review time) is within the corpus's normal range (sampled posts ran
716–1,534 words); `AGENT-GOAL.md` correctly still present (deletion happens
right before the PR, not before); `AGENT-SPEC.md` content matches XAL-1140,
not leftover XAL-1141 content.

### What changed after round 1
- `src/content/blog/uterom-grontareal-arrangementer-kommune.md` line 14:
  "på siden av" → "ved siden av".
- Rewrote the "hvorfor det havner utenfor bookingoversikten" section's
  opening two paragraphs to drop the templated "stående utenfor ... styrt av
  en e-post" phrasing shared with the sibling post, while keeping the same
  underlying facts (park/idrett-avdelingen prioritizes high-traffic venues
  first; scale and actor mix differ from small fixed structures).
- Rewrote the closing CTA paragraph to drop the "X som ikke er søkbart, er i
  praksis en ressurs kommunen ... uten å få ... igjen" template structure
  shared with the sibling post's closing, replacing it with a risk-framing
  argument (who bears the cost of not having this booked centrally) that
  isn't used elsewhere in the corpus.
- Frontmatter keyword "kommunalt friareal utleie" → "kommunalt friområde
  utleie" to match the body's actual wording.
- Re-ran `npx vitest run src/lib/post-slugs.test.ts src/lib/webp-sources.test.ts src/content/blogFaq.test.ts`
  after the edits: 3 files, 6 tests, all passing.

## Round 2 — correctness / regression-duplication / security / scope, re-run against the round-1 fix

Four fresh parallel agents, re-run against the post as edited in round 1,
each again told to REFUTE. This round earned its place: it found real
problems in round 1's own fix, not just confirmed it.

**Correctness** — found one real defect and one awkward phrase:
1. The round-1 rewrite of the closing paragraph introduced a factual
   contradiction: it claimed "det er arrangøren, ikke kommunen, som bærer
   risikoen for dobbeltbooking" (only the organizer bears double-booking
   risk), directly contradicting an earlier, untouched sentence in the same
   post ("risikerer kommunen å gi klarsignal til to overlappende
   arrangementer i samme park samme helg") — which makes double-booking
   explicitly a risk the *kommune* bears too. The rewrite fixed one
   duplication problem by introducing a new correctness problem.
2. "hvem som helst i park og idrett-avdelingen må huske" read unnaturally —
   "hvem som helst" ("anyone/whoever") doesn't pair naturally with "må"
   ("must"), and it also sat oddly against the post's own later framing of
   the knowledge as concentrated in one specific person, not "anyone."

**Regression / duplication** — found the round-1 fix was incomplete:
1. The closing CTA paragraph was genuinely fixed (independently confirmed:
   the old "X som ikke er søkbart, er i praksis en ressurs kommunen ... uten
   å få ... igjen" template is gone).
2. But the "hvorfor" section's *opening* sentence was still a near-verbatim
   template match the round-1 rewrite missed: "Når en kommune digitaliserer
   booking, prioriteres først de anleggene med høyest trafikk og størst
   konfliktpotensial: idrettshaller og møterom" vs. the sibling post's "Når
   en kommune innfører digital booking, prioriteres naturlig nok de
   anleggene med mest trafikk og størst konfliktpotensial: idrettshaller med
   sesongtildeling til lag, møterom med daglig etterspørsel" — grepping
   "trafikk og størst konfliktpotensial" repo-wide returned exactly these
   two files, zero others.
3. Also flagged as a genuine (if softer) signal: the section heading
   "Hvorfor ... havner utenfor bookingoversikten" appeared, repo-wide, only
   in these two posts.
4. The shared closing-CTA formula ("Vil du se hvordan Digilist kan gjøre X
   like enkle å booke som resten av kommunens lokaler? [Book en demo]...")
   was checked separately and confirmed as genuine repo-wide boilerplate
   (found verbatim in 4 unrelated posts) — not sibling-specific duplication,
   no action needed there.

**Security** — no new vulnerabilities (no HTML/script/link issues from the
round-1 edits), but independently flagged the same sentence correctness
caught: the "arrangøren, ikke kommunen" line reads as a new relative-
liability assertion that hadn't been reviewed before — corroborates the
correctness finding from a different angle.

**Scope** — no issues found. `git status --short` showed only
`AGENT-REVIEW.md`, `AGENT-SPEC.md`, and the one blog post changed; no shared
build/render files touched; the round-1 diff was confirmed surgical (one
keyword swap, one paragraph-pair rewrite, one closing-paragraph rewrite,
nothing else); `AGENT-GOAL.md` still present.

### What changed after round 2
- Rewrote the "hvorfor" section's heading (now "Hvorfor et uterom sjelden er
  en egen lokaltype i bookingsystemet") and its first paragraph, dropping
  the "Når en kommune digitaliserer/innfører booking, prioriteres først/
  naturlig nok de anleggene med høyest/mest trafikk og størst
  konfliktpotensial: idrettshaller ... møterom" template shared with the
  sibling post, while fixing the "hvem som helst ... må huske" phrasing at
  the same time (now: the knowledge sits with one specific saksbehandler,
  not "anyone").
- Rewrote the closing paragraph's opening sentence to resolve the
  contradiction: both kommunen and the arrangør now explicitly bear risk
  from the lack of a shared calendar, consistent with the earlier
  "risikerer kommunen å gi klarsignal ..." sentence.
- Re-ran `npx vitest run src/lib/post-slugs.test.ts src/lib/webp-sources.test.ts src/content/blogFaq.test.ts`
  after the edits: 3 files, 6 tests, all passing. Confirmed via grep that
  none of "trafikk og størst konfliktpotensial", "hvem som helst", "ikke
  kommunen, som bærer", or "på siden av" remain in the file.

## Round 3 — fresh full-file adversarial pass, sharpened after round 2 found real issues

Four fresh parallel agents, told explicitly not to trust the round-1/round-2
summaries and to verify every claimed fix themselves by reading the file.
Security and scope came back clean (and scope independently re-verified two
of the round-2 fixes by grepping the file itself, confirming the review log
matches reality). Correctness and regression each found new, real problems.

**Correctness** — found two real defects:
1. "park og idrett-avdelingen" (wrong compound form) appeared twice, in the
   "hvorfor" section and the closing paragraph — correct Norwegian is
   "park- og idrettsavdelingen". It was introduced by round 1/2's rewrites of
   both paragraphs and repeated verbatim, not a one-off typo.
2. A soft internal tension: the "Hva regnes som uterom" bullet list framed
   grøntareal as fitting "alt fra en bursdagsfest til en sommerkonsert",
   while the very next section stated "Et grøntareal til et arrangement
   handler sjelden om én familie for en kveld" — not a hard contradiction
   (capacity range vs. typical case are different claims) but close enough
   together to read as the post inviting in, then dismissing, the same
   scenario.

**Regression / duplication** — confirmed the round-1/2 fixes to the
"hvorfor" section and the closing paragraph's opening sentence held (now
genuinely distinct reasoning, not reworded synonyms of the sibling post) and
confirmed the shared CTA closing formula ("Vil du se hvordan Digilist kan
gjøre X ... ? [Book en demo]... så viser vi løsningen i praksis.") is
authentic repo-wide boilerplate (verified via grep against
`klasseromsleie-til-kurs-og-opplaering.md` and
`finn-og-book-ledige-moterom-i-din-kommune.md`, which use the same trailing
clause with a different opening) — not sibling-specific, no action needed.
But it found three sentences that WERE sibling-specific near-verbatim
templates, confirmed via grep to appear in exactly these two files and no
others:
1. The "objektmodell" sentence describing how the generic booking model
   applies to the new facility type.
2. The "Ansvarlig arrangør/booker" bullet's exact clause structure.
3. The weather-cancellation bullet's exact sentence shape.

**Security** — no issues found; re-verified all injection-vector checks,
link allowlist, and frontmatter secrets checks independently, and reviewed
the "ansvarlig arrangør"/insurance language as advisory/descriptive, not a
Digilist liability assertion.

**Scope** — no issues found; `git status --short` showed only the review
docs and the one blog post changed; all seven shared build/render files
confirmed untouched; word count (1,462 at the time of this round) still in
normal range; `AGENT-GOAL.md` still present, no PR exists yet (`gh pr list`
empty). Independently spot-checked two round-1/2 fix claims against the live
file (grep for "på siden av" and "ikke kommunen, som bærer") and confirmed
both are genuinely gone — the review log accurately reflects the file.

### What changed after round 3
- "park og idrett-avdelingen" → "park- og idrettsavdelingen" (both
  occurrences).
- Reworded the "Parker og grøntareal" definition bullet to drop the
  "bursdagsfest" framing that sat awkwardly against the later "sjelden om
  én familie" claim, replacing it with a capacity range that doesn't imply
  a specific typical booker.
- Reworded the "objektmodell" sentence, the "Ansvarlig arrangør" bullet, and
  the weather-cancellation bullet so none of the three remain sibling-
  specific near-verbatim templates, while keeping the same underlying facts.
- Re-ran `npx vitest run src/lib/post-slugs.test.ts src/lib/webp-sources.test.ts src/content/blogFaq.test.ts`
  after the edits: 3 files, 6 tests, all passing.

## Round 4 — final verification pass on the round-3 rewrites

Four fresh parallel agents, one final adversarial pass before opening the
PR. Security and scope came back clean. Correctness and regression each
found one more real thing — this is not a rubber-stamp round, and neither
finding was a repeat of anything already fixed.

**Correctness** — found one real defect: the round-3 reword of the
"Fleksibel avbestilling ved vær" bullet introduced a gender-agreement error,
"en stormvarsel" (should be neuter: "et stormvarsel" — "varsel" is always
neuter in Bokmål), sitting right next to the correctly-neuter "Et regnvær"
in the same sentence. Confirmed "park- og idrettsavdelingen" (round 3's fix)
is correct and appears consistently in both places. No other new errors
found in a full top-to-bottom re-read.

**Regression / duplication** — found the review process itself hadn't
converged yet: a full side-by-side re-scan against
`utendorsfasiliteter-booking-og-tilgjengelighet.md` turned up four more
sentence-level near-clones that rounds 1–3 hadn't touched because they'd
each focused on different flagged spots:
1. The "Hva regnes som" section's opening definitional sentence shared the
   skeleton "[X] er samlebetegnelse(n) på de ___, ___ ... kommune forvalter."
2. The "Hva bookingsystemet må dekke" section's intro clause "...og
   bookingløsningen må reflektere det:" was word-for-word identical to the
   sibling's equivalent sentence.
3. The "Praktiske krav" section's closing sentence ("Disse kravene vises i
   bookingsystemet før bekreftelse...") shared its first 11 words verbatim
   with the sibling's closing sentence.
4. The weather-cancellation bullet (already reworded once in round 3) still
   echoed the sibling's phrasing via "enn for innendørs lokaler," "hele
   gebyret," and "på en måte X aldri blir/ikke er."
The same pass confirmed the round-1–3 fixes (the "hvorfor" section, the
closing CTA opening, the objektmodell sentence, the "Ansvarlig arrangør"
bullet) now hold and are genuinely distinct from the sibling post, and
re-confirmed the shared CTA closing formula is authentic repo-wide
boilerplate (present in 4 unrelated posts), not sibling-specific.

**Security** — no issues found on a full fresh re-check of injection
vectors, the link allowlist, frontmatter secrets, and liability/legal
phrasing.

**Scope** — no issues found; only the review docs and the one blog post
changed; all seven shared build/render files still untouched; word count
(1,487 at the time of this round) still normal and the growth across four
rounds judged genuine (each section substantive, no padding); `AGENT-GOAL.md`
still present; no PR exists yet.

### What changed after round 4
- "en stormvarsel" → "et stormvarsel" (gender agreement).
- Reworded the "Hva regnes som" opening sentence, the "Hva bookingsystemet
  må dekke" section's intro clause, the "Praktiske krav" section's closing
  sentence, and the weather-cancellation bullet (a second pass) to remove
  the four remaining sibling-specific near-verbatim clones, keeping the same
  underlying facts.
- Re-ran `npx vitest run src/lib/post-slugs.test.ts src/lib/webp-sources.test.ts src/content/blogFaq.test.ts`
  after the edits: 3 files, 6 tests, all passing. Confirmed via grep that
  none of "samlebetegnelse", "bookingløsningen må reflektere", "Disse
  kravene vises i bookingsystemet før bekreftelse" (as the sibling phrases
  it), "en stormvarsel", "enn for innendørs lokaler", "hele gebyret", or
  "aldri blir" remain in the file.

This is the fourth round, and it still found real, non-overlapping defects
in both lenses that ran it — the review did not go through the motions.
Stopping here per the four-round process; the remaining shared elements
identified across all four rounds (the H2 section skeleton, the CTA closing
formula) were independently confirmed as authentic repo-wide conventions
used by several unrelated posts, not artifacts of copying this specific
sibling.

## Final verification and proof

- `npx vitest run`: 16 test files, 35 tests, all passing.
- `pnpm build`: full production build succeeded; prerendered
  `dist/blogg/uterom-grontareal-arrangementer-kommune/index.html` (99,161
  bytes); `scripts/check-blog-word-count.mjs` confirmed all 257 blog posts
  (including this new one) render at least 200 words in the prerendered
  HTML; sitemap regenerated to 341 URLs.
- `proof/after-uterom-grontareal-arrangementer-kommune.png`: the rendered
  page's header, title, tag ("Innbygger"), reading time and date, and the
  table-of-contents built from the post's own H2s — served via
  `vite preview` against the production build.
- `proof/after-uterom-grontareal-arrangementer-kommune-body.png`: the
  article body's opening paragraph, confirming the actual prerendered
  content matches the source markdown.
- This is new content — no page existed at this URL before the change, so
  only an "after" state exists to capture; there is no "before" to show.

