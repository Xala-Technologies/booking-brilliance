# XAL-1152: Deep review log

Change under review: one new file, `src/content/blog/regler-booking-kommunale-lokaler.md`
(a Norwegian Bokmål blog post), plus `AGENT-SPEC.md`.

## Round 1 — correctness / regression-duplication / security / scope

Four parallel agents, each told to REFUTE the change over the actual file
contents and `git diff origin/main..HEAD`.

**Correctness** — found four real defects and confirmed everything else clean:
1. Line 33: "Skjenkebevilling ... søkt separat hos kommunen" used the wrong
   verb tense (past participle) for an ongoing requirement.
2. Line 14 broke parallel structure between "for deg som søker et lokale"
   and "for deg som kommunalt ansatt skal forvalte."
3. The klagerett/klageadgang content promised by the frontmatter
   `description` and the keyword "klage på avslått søknad lokale" was
   thinner than the actual legal mechanism — no mention of
   `forvaltningsloven`, `enkeltvedtak`, or the normal three-week
   `klagefrist`, unlike sibling posts in the same corpus
   (`sesongtildeling-idrettshall-kommune-fordelingsnokkel.md`,
   `redusert-leie-sal-kommune-prisregulativ-saksbehandler.md`) that treat
   the identical topic with real specificity.
4. Line 43 mildly overstated the linked godkjenningsflyt post's claim —
   that post says the audit trail is "et krav i anskaffelsen" (singular,
   the customer's own procurement), not "et krav i mange kommunale
   anskaffelser" (plural/generic) as this post originally phrased it.
   All three internal links (two blog posts, `/book-demo`) were confirmed
   to resolve via frontmatter `slug:` (not filename), and the claims made
   about the linked godkjenningsflyt post's content were otherwise accurate.
   Frontmatter, word count (991 body words) vs. `readingMinutes: 7`, and
   markdown syntax were all clean against sibling-post conventions.

**Regression / duplication** — the substantive finding of the round: this
post's ground overlaps, to varying degrees, with `praktisk-guide-prosedyrer-
krav-prising-booking.md` (same-day companion post, admin side of the same
krav/prosedyre split), `leie-lokale-kommune-vilkar-depositum-avbestilling.md`
and `sal-kommune-vilkar-avbestilling-depositum-ansvar.md` (deposit/
cancellation rules for the same Innbygger audience), and
`godkjenningsflyt-revisjonsspor-booking-re-forespørsel.md` /
`saksbehandler-godkjenne-avvise-kommunisere.md` (approval/rejection flow).
No slug collision, frontmatter format matches sibling posts, cover image
path resolves under `public/images/blog/`, and no test in the suite
enumerates or imposes schema constraints across all posts, so there is no
test risk.

**Decision on the duplication finding, not a defect fix**: kept the post.
The established pattern in this repo (see XAL-1139's own review, and the
AGENT-SPEC's own overlap check before writing) is a consolidated post that
takes one throughline and links out to deeper, persona-specific posts
rather than repeating them. No existing post frames the *entire* booking
lifecycle — eligibility, documentation, procedure, in-use rules,
cancellation, appeal — as a single applicant-facing rules reference; each
sibling post owns one piece of that lifecycle for one narrower audience
(driftsleder pricing, saksbehandler workflow, one specific "vilkår" page).
This post's job, and the ticket's explicit ask ("regler, prosedyrer og krav"
as one search intent), is exactly to be that single reference and link out
to the deep dives, which is what it does in three places. Verified the
cross-links are additive only — none of the linked posts were edited.

**Security** — clean. Pure Markdown/YAML, no raw HTML, no script/javascript:/
data: URIs. `BlogPost.tsx`/`BlogPreview.tsx` render via `react-markdown` +
`remark-gfm` only, no `rehype-raw`, no `dangerouslySetInnerHTML` anywhere in
the render path, so raw HTML in a `.md` file would render inert even if
present (there is none). No secrets, no internal infra, no false
certification/compliance claim. All three internal links are legitimate
internal routes/slugs, no open redirects or disguised external URLs.

**Scope** — pass. Both commits on this branch touch only `AGENT-GOAL.md`,
`AGENT-SPEC.md`, and the new post. None of the forbidden shared files
(`scripts/prerender.mjs`, `src/entry-server.tsx`, `scripts/verify-live.mjs`,
`build-plugins/blogMetaPlugin.ts`, `vite.config.ts`) appear in either
commit. `git diff origin/main..HEAD --stat` shows two other blog posts as
deleted, but this is a stale-base diff artifact: those two files were added
to `origin/main` by an unrelated concurrent commit (`083a25e`, "Daily blog
agent (VPS+Max): 2 post(s)") after this branch's base — neither of this
branch's own commits touches those paths. Resolved by the merge onto
`origin/main` at step 7 (see below), not by any change here. `tag:
"Innbygger"` reuses an existing value (32 prior uses), no new taxonomy.

### What I changed after round 1
- Fixed the wrong verb tense in the skjenkebevilling bullet
  ("søkt separat" → "som må søkes separat").
- Fixed the broken parallel structure in the intro sentence.
- Expanded the "Hva skjer hvis søknaden avvises" section with the specific
  legal mechanism (`forvaltningsloven`, `enkeltvedtak`, three-week
  `klagefrist`) the description/keywords already promised, while keeping
  the honest nuance that not every single-booking rejection rises to the
  level of a formal `enkeltvedtak` — matching how sibling posts
  (`redusert-leie-sal-kommune-prisregulativ-saksbehandler.md`) handle the
  same distinction, and switching the one quoted phrase to guillemets
  («hvorfor») to match the corpus-wide convention (112 other posts use
  guillemets for quoted phrases).
- Corrected the SSA-L/anskaffelse claim to match the linked post's actual
  framing (the customer's own procurement, not "many" procurements
  generically).
- Re-ran the full build pipeline (`optimize-images` → `vite build` → SSR
  build → `prerender.mjs` → `check-blog-word-count.mjs`) and `pnpm vitest
  run` after the edits — both green (349 pages prerendered, 265/265 posts
  pass the word-count check on markdown and prerendered HTML, 16 files /
  35 tests green).

## Round 2 — deeper fact-check + build/SEO regression

Two parallel agents: one re-verified round 1's fixes and did a fresh
line-by-line fact-check of every remaining claim against six related posts
(`godkjenningsflyt-revisjonsspor-booking-re-forespørsel.md`,
`avbooking-refusjon-og-saksbehandling.md`,
`praktisk-guide-prosedyrer-krav-prising-booking.md`,
`redusert-leie-sal-kommune-prisregulativ-saksbehandler.md`,
`sesongtildeling-idrettshall-kommune-fordelingsnokkel.md`,
`leie-lokale-kommune-vilkar-depositum-avbestilling.md`); the other ran a
full clean production build (`rm -rf dist dist-server && pnpm build`) and
inspected the prerendered HTML, sitemap, and blog listing directly.

**Fact-check lens** — found two real defects:
1. Line 46 claimed manual review "tar det gjerne 1-3 virkedager, spesielt
   ved sesongtildeling eller store arrangementer" — this directly
   contradicted `sesongtildeling-idrettshall-kommune-fordelingsnokkel.md`,
   which describes sesongtildeling as a multi-week seasonal process with an
   application deadline weeks before the season starts, not a 1-3 day
   turnaround.
2. The full-refund cancellation threshold ("mer enn 14 dager i forveien")
   picked one of two contradictory numbers already present across the
   corpus — `avbooking-refusjon-og-saksbehandling.md` uses 14 days,
   `leie-lokale-kommune-vilkar-depositum-avbestilling.md` uses 30 days —
   stated as a flat fact rather than acknowledging it varies by kommune.
   Round 1's klagerett fix (forvaltningsloven/enkeltvedtak/three-week
   klagefrist, and the nuance that not every single booking rejection is a
   formal enkeltvedtak) was independently re-verified as accurate and
   internally consistent with the sesongtildeling and redusert-leie posts.
   All other claims (documentation requirements, brannforskrift/max-guests,
   damage liability) checked out clean against the related posts. Also
   flagged: round 1's own parallel-structure fix on line 14 ("for deg som,
   som kommunalt ansatt") had introduced an awkward "som, som" stutter.

**Build/SEO lens** — clean pass. Full clean build (349 pages prerendered,
265/265 posts pass word-count on markdown and rendered HTML) and
`pnpm vitest run` (16 files / 35 tests) both green. Direct inspection of
`dist/blogg/regler-booking-kommunale-lokaler/index.html` confirmed: exactly
one `<h1>` matching the title, correct `Article` JSON-LD, canonical/OG/
Twitter tags pointing at the right slug, real prerendered prose (not a
Suspense fallback, verified a distinctive sentence appears verbatim), and
exactly one sitemap entry. One pre-existing, out-of-scope note (not a
defect in this post): the post doesn't appear on the static blog listing's
first page because `src/pages/Blog.tsx` paginates client-side and 63 posts
share today's date — the same known systemic gap called out in the XAL-1139
review, unrelated to this post's content and out of scope per the
"don't touch shared rendering files" rule.

### What I changed after round 2
- Reworded the manual-review-time sentence to separate the 1-3 business-day
  figure (a single booking) from sesongtildeling, described accurately as
  its own longer, weeks-ahead process.
- Reworded the full-refund cancellation bullet to state a range
  ("to til fire uker") and explicitly note it depends on the kommune's own
  regelverk, instead of asserting one fixed threshold that conflicts with
  another post in the corpus.
- Fixed the "som, som kommunalt ansatt" stutter left by round 1's own
  parallel-structure fix.
- Re-ran the full build pipeline and `pnpm vitest run` after the edits —
  both green (349 pages, 265/265 word-count checks, 16 files / 35 tests).

## Round 3 — adversarial editorial read + full-branch regression sweep

Two parallel agents: one did a fresh skeptical-editor read of the whole
post, explicitly told not to re-check rounds 1-2's specific fixes and to
find only new issues; the other swept the whole branch (commits, diff,
worktree, ignored files) for anything content review wouldn't catch.

**Editorial lens** — found four real issues:
1. Three separate sections each asserted their own topic as the "most
   common" cause of a negative outcome with no source
   ("en av de vanligste grunnene til at en booking avvises", "den vanligste
   årsaken til at en søknad blir sendt tilbake eller avvist", "den vanligste
   grunnen til at et depositum holdes tilbake") — stacked, formulaic
   superlatives repeated once per section rather than one substantiated
   claim.
2. The line-24 and line-28 "most common reason for rejection" claims sat in
   tension with each other — two different unqualified causes competing for
   the same outcome (avslag) without reconciling which one actually
   dominates.
3. Line 43's unqualified "Et avslag skal alltid komme med en konkret grunn"
   was restated almost verbatim as the opening of the klage section
   ("Et avslag skal komme med en skriftlig begrunnelse..."), adding nothing
   new before the valuable forvaltningsloven/klagerett detail that follows.
4. The closing CTA paragraph mixed formal/plural "dere/deres" with singular
   "din" address in the same paragraph to the same kommunalt-ansatt reader
   ("lokalene dere forvalter" ... "søkere i din kommune" ... "deres egne
   lokaler") — not a consistent address form.
   No new defects found in encoding/typos (bold markers balanced, no double
   spaces) or in frontmatter accuracy against the current body.

**Regression-sweep lens** — clean. All 4 commits on the branch verified
against their own diffs, messages accurate. `git diff origin/main..HEAD
--stat` confirmed the only real content change is the one blog post plus
process files; the two files shown as "deleted" are a stale-base artifact
from an unrelated concurrent commit on `origin/main`, not a real change on
this branch (same finding as round 1, still true). `git status --short`
shows only `AGENT-REVIEW.md` itself in progress, no stray artifacts.
No forbidden shared files touched. `AGENT-GOAL.md` present and unmodified.
No TODO/FIXME markers or wrong ticket references. Exactly one new file
under `src/content/blog/`.

### What I changed after round 3
- Reworded the category-mismatch sentence to state the consequence directly
  instead of an unbacked "most common" claim, removing the tension with the
  documentation section's own "vanligste årsak" claim.
- Softened the depositum-withheld sentence from "den vanligste grunnen" to
  "en vanlig grunn ... helt eller delvis".
- Dropped "alltid" from the trinn-3 sentence and rewrote the klage
  section's opening to build on trinn 3's begrunnelse instead of restating
  it, before moving into the klagerett detail.
- Fixed the closing CTA's pronoun mismatch ("din kommune" → "deres
  kommune"), consistent with the surrounding "dere/deres" address.
- Re-ran the full build pipeline and `pnpm vitest run` after the edits —
  both green (349 pages, 265/265 word-count checks, 16 files / 35 tests).

## Round 4 — final holistic refute pass + independent fresh-eyes read

Two parallel agents: one did a targeted final pass (encoding/whitespace
sweep, checking for new redundancy introduced by rounds 1-3's own edits,
checklist-vs-current-wording consistency, and one more legal-claim
cross-check against the linked godkjenningsflyt post), explicitly told to
assume rounds 1-3's fixes landed correctly and not re-check them; the other
read the file completely cold, with zero prior context, independently
re-verifying every link, the full frontmatter, the word count/reading-time
math against a corpus baseline, and doing its own from-scratch Norwegian
grammar read.

**Holistic refute lens** — no encoding/whitespace issues (UTF-8 correct
throughout, no stray characters, bold markers balanced). No new
contradiction introduced by rounds 1-3's own edits — the reworded klage
opener and the sesongtildeling mentions in two different sections address
different aspects (process timing vs. legal appeal basis) and don't
conflict. One real defect found: checklist item 5 said "Be om **skriftlig**
begrunnelse," but the word "skriftlig" never appeared anywhere in the body
after round 3's trim — the checklist promised a specificity the article
itself didn't establish. The surviving legal claim ("krav i kommunens egen
anskaffelse av bookingsystemet") was re-checked against
`godkjenningsflyt-revisjonsspor-booking-re-forespørsel.md` one more time
("For kommunen er det et krav i anskaffelsen") and is consistent.

**Fresh-eyes lens** — independently re-verified all four links (three
`/blogg/*` slugs plus `/book-demo`) resolve, frontmatter parses cleanly
against `src/lib/blogFrontmatter.ts`'s actual parser, and recomputed the
word count (1092 body words) and implied reading speed (156 wpm) against a
sampled corpus baseline (~156-176 wpm across three related posts) — within
range. Found two new, real grammar issues on a fresh read:
1. The closing CTA mixed singular "du" with plural "dere/deres" for the
   same referent within one sentence ("Er du kommunalt ansatt... for
   lokalene dere forvalter... søkere i deres kommune... deres egne
   lokaler"), breaking the singular "du/deg/din" address form used
   consistently everywhere else in the post and in the sibling post's own
   CTA.
2. The intro's rhetorical questions dropped from second person ("du") into
   first person ("jeg") mid-sentence ("hva må jeg dokumentere... hva skjer
   hvis jeg avbestiller"), jarring against the du-address used throughout
   the rest of the post.
   Also flagged as a minor word-choice issue, not core to either lens:
   "re-behandles" (step 3) is a hyphenated Anglicism; more natural Bokmål is
   "behandles på nytt."

### What I changed after round 4
- Softened checklist item 5 from "skriftlig begrunnelse" to "en konkret
  begrunnelse," matching what the body actually establishes ("en konkret
  grunn" in trinn 3, "å få vite hvorfor" in the klage section).
- Rewrote the intro's embedded questions to stay in second person
  ("hva du må dokumentere... hva skjer hvis du avbestiller") instead of
  switching to "jeg."
- Fixed "re-behandles" → "behandles på nytt."
- Rewrote the closing CTA to use singular "du/din/dine" consistently
  throughout, matching the address form used everywhere else in the post
  and in the sibling praktisk-guide post's own CTA.
- Re-ran the full build pipeline and `pnpm vitest run` after the edits —
  both green (349 pages prerendered, 265/265 word-count checks on markdown
  and rendered HTML, 16 files / 35 tests).

Four rounds run. Round 1 found and fixed four real defects (wrong verb
tense, broken parallel structure, an overstated cross-post claim, thin
klagerett content) and made one considered decision to keep the post
despite topical overlap with sibling posts, since it fills a genuine gap as
the single applicant-facing rules reference the ticket asked for. Round 2
found and fixed two real defects (a factually wrong sesongtildeling
timeline claim, a refund threshold that silently picked one of two
conflicting corpus numbers). Round 3 found and fixed four real defects
(stacked unsupported superlatives, two competing "most common cause"
claims, a redundant restatement, a formality/pronoun mismatch). Round 4
found and fixed four more real issues (a checklist claim unsupported by the
body, a second person/first person slip, an Anglicism, a second pronoun
mismatch in the CTA) on independent fresh reads. No round came back
completely empty on real, fixable defects, which is why this review runs
the full four rounds as scoped rather than stopping early.

## Proof

This is new content, not a fix to existing behavior, so only an AFTER state
applies (there is no "before" — the page didn't exist). Verified with a full
production build (`vite build` + SSR + `scripts/prerender.mjs`) served via
`vite preview`, then captured with `agent-browser`:
- `proof/after-regler-booking-kommunale-lokaler.png` — the published post's
  top (title, tag "Innbygger", author, reading time, table of contents) at
  `/blogg/regler-booking-kommunale-lokaler`.
- `proof/after-regler-booking-kommunale-lokaler-klage.png` — the
  avbestilling and "Hva skjer hvis søknaden avvises" sections rendering
  further down the page, with round 1-4's fixes visible in the live output.

See the "Issue protocol" section of the PR body for
the full command-output evidence (build, tests, word-count checks) at each
round.
