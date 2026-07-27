# XAL-675: AEO-gap: Digilist usynlig i AI-svar for «beste nettside for å leie lokale, hytte eller utstyr i Norge»

> Auto-prepared by Digilist Improvements Agent. Run Claude in this worktree:
> `/loop In the marketing repo (booking-brilliance), edit ONLY the file src/content/blog/beste-nettside-leie-lokale-hytte-utstyr-norge.md (a blog post that already targets the AEO query 'beste nettside for å leie lokale, hytte eller utstyr i Norge'). Do not touch scripts/prerender.mjs, src/entry-server.tsx, scripts/verify-live.mjs, or any other shared build/render file — this post is picked up for prerendering generically by loadBlogPosts() in prerender.mjs, no route registration needed.

Context: an AEO study found AI engines answer this query by citing Finn.no, Hygglo, Selskapslokaler.no, Leiet.no and Inatur.no, but never Digilist (visibility/citation 13%, n=8). The existing post already has a good short-answer block at the top, an entity definition section ('Hva Digilist er, og for hvem'), original data with citations, a comparison table, and a 'Kilder, forfatter og oppdateringsdato' section with author Ibrahim Rahmani and a date. But its comparison section (lines ~50-61) only discusses Airbnb, Hygglo and norgesbooking.no — it never mentions Finn.no, Selskapslokaler.no, Leiet.no or Inatur.no, the four competitors actually being cited instead of Digilist for this exact query. That's the gap to close.

Do:
1. In the '## Digilist sammenlignet med ...' section, add one honest, factual sentence each for Finn.no (Norway's largest general classifieds/marketplace site, includes a rental/torget category but is a listings marketplace, not a booking/operations system with real-time calendar or payment), Selskapslokaler.no (a directory/catalog for finding event venues, similar in nature to norgesbooking.no — links out rather than running bookings), Leiet.no (a rental listings/classifieds site), and Inatur.no (booking of hunting/fishing/outdoor experiences and some public cabins — adjacent but a different vertical from lokaler/utstyr for kommuner and bedrifter). Only state things that are verifiably true about what these sites do generally (marketplace/directory/listings vs. an operated booking system); do not fabricate specific user/traffic numbers for them the way the post does for Airbnb/Hygglo unless you can attribute a real public source.
2. Extend the existing comparison table with rows for these four platforms using the same columns (Type, Egnet for, Betaling i systemet, ID-porten/offentlig, Hytte/fritidsbolig).
3. Update the 'Kilder, forfatter og oppdateringsdato' section to note that the Finn.no/Selskapslokaler.no/Leiet.no/Inatur.no descriptions are based on review of each site in July 2026 (matching the existing sourcing style used for norgesbooking.no).
4. Update the frontmatter 'keywords' array to include the newly named competitors if it improves relevance (e.g. add 'Finn.no lokaler', 'Selskapslokaler.no alternativ'), and bump 'date'/'lastUpdated' to reflect the edit.
5. Keep 'author: Ibrahim Rahmani' and the rest of the frontmatter/structure unchanged.

Acceptance criteria:
- The post's raw markdown (and rendered HTML once built) mentions and briefly characterizes all five competitors from the AEO study: Finn.no, Hygglo, Selskapslokaler.no, Leiet.no, Inatur.no.
- The short answer block, entity definition, original data, source references, and author/date sections remain intact and accurate.
- Run `pnpm test` (vitest) and `pnpm build` (which runs scripts/check-blog-word-count.mjs as part of the build) and confirm both pass.
- `git diff main` shows changes to ONLY this one markdown file — no edits to scripts/prerender.mjs, src/entry-server.tsx, scripts/verify-live.mjs, or any other file.
- Open a PR against main (not a direct merge) with tests/build green before requesting review.`

## Implementation contract — complete this before writing code
- **Problem:** In the marketing repo (booking-brilliance), edit ONLY the file src/content/blog/beste-nettside-leie-lokale-hytte-utstyr-norge.md (a blog post that already targets the AEO query 'beste nettside for å leie lokale, hytte eller utstyr i Norge'). Do not touch scripts/prerender.mjs, src/entry-server.tsx, scripts/verify-live.mjs, or any other shared build/render file — this post is picked up for prerendering generically by loadBlogPosts() in prerender.mjs, no route registration needed.

Context: an AEO study found AI engines answer this query by citing Finn.no, Hygglo, Selskapslokaler.no, Leiet.no and Inatur.no, but never Digilist (visibility/citation 13%, n=8). The existing post already has a good short-answer block at the top, an entity definition section ('Hva Digilist er, og for hvem'), original data with citations, a comparison table, and a 'Kilder, forfatter og oppdateringsdato' section with author Ibrahim Rahmani and a date. But its comparison section (lines ~50-61) only discusses Airbnb, Hygglo and norgesbooking.no — it never mentions Finn.no, Selskapslokaler.no, Leiet.no or Inatur.no, the four competitors actually being cited instead of Digilist for this exact query. That's the gap to close.

Do:
1. In the '## Digilist sammenlignet med ...' section, add one honest, factual sentence each for Finn.no (Norway's largest general classifieds/marketplace site, includes a rental/torget category but is a listings marketplace, not a booking/operations system with real-time calendar or payment), Selskapslokaler.no (a directory/catalog for finding event venues, similar in nature to norgesbooking.no — links out rather than running bookings), Leiet.no (a rental listings/classifieds site), and Inatur.no (booking of hunting/fishing/outdoor experiences and some public cabins — adjacent but a different vertical from lokaler/utstyr for kommuner and bedrifter). Only state things that are verifiably true about what these sites do generally (marketplace/directory/listings vs. an operated booking system); do not fabricate specific user/traffic numbers for them the way the post does for Airbnb/Hygglo unless you can attribute a real public source.
2. Extend the existing comparison table with rows for these four platforms using the same columns (Type, Egnet for, Betaling i systemet, ID-porten/offentlig, Hytte/fritidsbolig).
3. Update the 'Kilder, forfatter og oppdateringsdato' section to note that the Finn.no/Selskapslokaler.no/Leiet.no/Inatur.no descriptions are based on review of each site in July 2026 (matching the existing sourcing style used for norgesbooking.no).
4. Update the frontmatter 'keywords' array to include the newly named competitors if it improves relevance (e.g. add 'Finn.no lokaler', 'Selskapslokaler.no alternativ'), and bump 'date'/'lastUpdated' to reflect the edit.
5. Keep 'author: Ibrahim Rahmani' and the rest of the frontmatter/structure unchanged.

Acceptance criteria:
- The post's raw markdown (and rendered HTML once built) mentions and briefly characterizes all five competitors from the AEO study: Finn.no, Hygglo, Selskapslokaler.no, Leiet.no, Inatur.no.
- The short answer block, entity definition, original data, source references, and author/date sections remain intact and accurate.
- Run `pnpm test` (vitest) and `pnpm build` (which runs scripts/check-blog-word-count.mjs as part of the build) and confirm both pass.
- `git diff main` shows changes to ONLY this one markdown file — no edits to scripts/prerender.mjs, src/entry-server.tsx, scripts/verify-live.mjs, or any other file.
- Open a PR against main (not a direct merge) with tests/build green before requesting review.
- **Business objective:** _why this matters (from the Linear issue)_
- **Repository / branch:** `/root/booking-brilliance` @ `agent/xal-675-aeo-gap-digilist-usynlig-i-ai-svar-for`
- **Scope:** _the one change this branch delivers_
- **Out of scope:** _what you will NOT touch — no opportunistic refactor, no formatting sweeps_
- **Acceptance criteria:** _observable, demonstrable outcomes_
- **Architecture constraints:** _boundaries + patterns to follow_
- **Files likely affected:** _list them; if this grows well beyond the list, escalate_
- **Testing requirements:** _what proves it works_
- **Security considerations:** _secrets, RBAC, injection, dependencies_
- **Rollback strategy:** _how to revert safely_
- **Definition of done:** compiled · tests green · acceptance demonstrated with evidence · one reviewable change · no attribution

## Delivery rules
- One issue → one branch (`agent/xal-675-aeo-gap-digilist-usynlig-i-ai-svar-for`) → one independently reviewable change. Never main.
- Smallest valid change. No opportunistic refactoring, no broad formatting changes, no hidden dependency on another open PR.
- Validation is mandatory and staged — "code written" ≠ "compiled" ≠ "tests passed" ≠ "acceptance demonstrated". Collect evidence (test output / logs) before opening the PR.
- If scope expands beyond "Files likely affected", or the change grows large, STOP and escalate ("BLOCKED:") rather than pressing on.
- Open a PR only when green (otherwise a draft PR with a note). Delete this file before opening the PR.

## Full issue — from Linear (the source of truth for scope & acceptance)
> The Linear MCP in this environment may be bound to the WRONG workspace, so
> do NOT rely on it to read this ticket — everything you need is below. If
> something essential is genuinely missing here (e.g. a screenshot), STOP and
> end with "CLARIFICATION:" rather than guessing.

**Classification:** improvement · severity minor · priority P2

Product gap: AEO-gap: Digilist usynlig i AI-svar for «beste nettside for å leie lokale, hytte eller utstyr i Norge». <!-- xaheen-triage -->

## Problem Statement

Digilist is not cited by AI engines (AI-motorer) answering "beste nettside for å leie lokale, hytte eller utstyr i Norge" — competitors [Finn.no](<http://Finn.no>), Hygglo, [Selskapslokaler.no](<http://Selskapslokaler.no>), [Leiet.no](<http://Leiet.no>), and [Inatur.no](<http://Inatur.no>) are mentioned, Digilist is not (visibility 13%, citation 13%, n=8).

## Scope

**In scope:**

* Create or expand a single page/content piece on [digilist.no](<http://digilist.no>) that directly answers "beste nettside for å leie lokale, hytte eller utstyr i Norge"
* Include a short answer block at the top of the page
* Include original documentation/data (egen dokumentasjon/tall)
* Include a clear entity definition of Digilist (what it is, for whom, which market)
* Include source references
* Include author and last-updated date
* Ensure the page is technically citable: indexable, server-rendered, semantic HTML
* Only edit the affected page's own content/metadata (frontmatter title/description) or its own component

**Out of scope:**

* Any build-time validation guards
* Edits to shared build/render scripts (scripts/prerender.mjs, src/entry-server.tsx, scripts/verify-live.mjs)
* Any change outside the marketing repo
* Unrelated refactors or drive-by fixes
* Direct merges to main

## Acceptance Criteria

- [ ] The published page contains a short answer block at the top that directly answers "beste nettside for å leie lokale, hytte eller utstyr i Norge"
- [ ] The page includes original documentation/data, not only marketing copy
- [ ] The page includes an explicit entity definition of Digilist (what it is, for whom, market)
- [ ] The page includes source references and an author/last-updated date
- [ ] The page is server-rendered and indexable (full HTML present without client-side execution)
- [ ] CI (tests and build) passes on the change
- [ ] No regression in existing user-facing behaviour

## Testing Scenario

* Given the published page, When fetched with a plain HTTP request (no JS execution), Then the answer block, entity definition, and source references are present in the raw HTML
* Given the page's metadata, When inspected, Then it shows an author and an update date
* Given the build pipeline, When the PR is built, Then it succeeds without modifying scripts/prerender.mjs, src/entry-server.tsx, or scripts/verify-live.mjs
* Given the shared render scripts, When diffed against main, Then they are unchanged by this PR

## Value: medium

The issue supplies quantified evidence of a competitive visibility gap (13% visibility/citation, n=8, five named competitors cited instead of Digilist), which is more than a bare wish — but it states no revenue figure, no blocked user, and no commitment made, so it falls short of 'high'.

## Target repo: `marketing`

*Chosen by triage from the issue's content; routes preparation there.*

## Open questions

* What specific original data/documentation ("tall") should the page publish — the issue asks for it but supplies none itself
* What URL/page location within the marketing repo should host this content
* How was n=8 and the 13% visibility/citation figures measured, and how will success be re-measured after publishing
* Is there an existing page on this topic to expand, or is this net-new content

---

*Structured by the triage agent.

<details><summary>Reporter's original text</summary>

**SEO route:** content → `content-agent` · repo `marketing`

**Scope — minimal and conflict-free:** fix ONLY the affected page's own content/metadata (its frontmatter title/description, or its own component). Do NOT add build-time validation guards or edit shared build/render scripts (e.g. `scripts/prerender.mjs`, `src/entry-server.tsx`, `scripts/verify-live.mjs`). Every SEO branch funnels through those, so guards added there conflict on merge and NONE of them land — the single biggest reason approved SEO PRs pile up unmerged. If a systemic guard would genuinely help, note it as a separate one-off issue; never add it in this fix.

**Classification:** feature · severity major · priority P1

## Problem statement

Product gap: AEO-gap: Digilist usynlig i AI-svar for «beste nettside for å leie lokale, hytte eller utstyr i Norge». AI-motorer nevner [Finn.no](<http://Finn.no>), Hygglo, [Selskapslokaler.no](<http://Selskapslokaler.no>), [Leiet.no](<http://Leiet.no>), [Inatur.no](<http://Inatur.no>), men ikke Digilist for spørsmålet «beste nettside for å leie lokale, hytte eller utstyr i Norge» (synlighet 13%, sitering 13%, n=8). Gjør Digilist siterbar: publiser en autoritativ side som svarer direkte på spørsmålet (kort svarblokk øverst), med original dokumentasjon/tall, tydelig entitetsdefinisjon (hva Digilist er, for hvem, marked), kildereferanser, forfatter/oppdateringsdato, og teknisk siterbarhet (indekserbar, server-rendret, semantisk HTML på [digilist.no](<http://digilist.no>))

…(truncated)

</details> Current assessment: partial (improvement, minor). Relevant code: src/content/blog/beste-nettside-leie-lokale-hytte-utstyr-norge.md, src/content/blog/beste-nettside-leie-lokale-hytte-utstyr-norge.md:50-61, scripts/prerender.mjs:177-212 (loadBlogPosts).

**Scope**
Expand the existing post's comparison section to explicitly name and characterize [Finn.no](<http://Finn.no>), [Selskapslokaler.no](<http://Selskapslokaler.no>), [Leiet.no](<http://Leiet.no>) and [Inatur.no](<http://Inatur.no>) (the actual competitors cited in the AEO study) alongside Airbnb/Hygglo/norgesbooking.no, with one honest line per competitor on their niche and how Digilist differs, plus matching source notes in the 'Kilder' section. Edit only this markdown file's frontmatter/body. Touch points: src/content/blog/beste-nettside-leie-lokale-hytte-utstyr-norge.md (post already exists (commit 74bf7e

Linear: https://linear.app/xala-technologies/issue/XAL-675/aeo-gap-digilist-usynlig-i-ai-svar-for-beste-nettside-for-a-leie
