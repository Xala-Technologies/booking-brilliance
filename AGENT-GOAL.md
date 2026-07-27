# XAL-377: AEO-gap: Digilist usynlig i AI-svar for «hvordan digitalisere booking av kommunale lokaler»

> Auto-prepared by Digilist Improvements Agent. Run Claude in this worktree:
> `/loop In the `marketing` repo (Digilist marketing site, Vite/React + markdown blog under src/content/blog), publish one new blog post that directly answers the query 'hvordan digitalisere booking av kommunale lokaler' (how to digitalize booking of municipal facilities). Context: this exact topic cluster already has deep coverage - src/content/blog/kommunalt-bookingsystem-hva-er-det.md and hva-er-bookingsystem-kommunale-lokaler.md answer 'what is it', hvorfor-digital-booking-2026.md answers 'why is it required', bookingsystem-kommunale-lokaler-guide-it-leder.md and bookingsystem-kommune-sammenligning-matrise-tco.md cover procurement/comparison. None of these answer the PROCESS question 'how do we actually digitalize' as a step-by-step guide. Do NOT duplicate the 'hva er' or 'hvorfor' angle - this post must be a concrete HOW-TO: e.g. steps like (1) map existing manual/spreadsheet booking flows and facility types, (2) define user groups and approval rules, (3) choose ID-porten/BankID auth and SSA-L-compliant vendor, (4) migrate historical bookings and foreningsregister data, (5) pilot with one facility type, (6) roll out and measure adoption. Follow the exact frontmatter schema used by existing posts (see src/content/blog/bookingsystem-kommunale-lokaler-guide-it-leder.md for the pattern): slug, title, description, date (use today's date), author: 'Ibrahim Rahmani', role: 'Grunnlegger, Digilist', readingMinutes, tag, cover (reuse an existing /images/blog/*.webp asset, do not invent new image paths), keywords. Required content per the ticket's acceptance criteria: (a) a short, direct answer block (2-4 sentences) as the very first thing after the intro, literally answering 'hvordan digitaliserer man booking av kommunale lokaler' - a numbered or bulleted overview of the process; (b) at least one original figure/table (e.g. a step timeline or a before/after comparison table of manual vs digital flow - do not just restate marketing claims); (c) an explicit entity-definition paragraph stating what Digilist is, who it serves (kommuner/offentlig sektor booking innbyggere, lag og foreninger), which market (norsk kommunal sektor); (d) source/citation links (reuse the citation pattern from hvorfor-digital-booking-2026.md, e.g. links to digdir.no, SSA-L references, or internal /blogg/ cross-links to ssa-l-2026-bookingsystem-kommune.md and gdpr-iso-datalokasjon-norge.md if they exist); (e) author name and date are already handled by the frontmatter/BlogPost.tsx template - verify BlogPost.tsx renders both visibly, do not touch the template unless the date is not rendered as 'last updated' visibly; (f) confirm the blog route is server-rendered (check how BlogPost.tsx and vite build-plugins/blogMetaPlugin.ts handle SSR/prerendering for existing posts - it must already work since other posts are indexed, just don't break it). Cross-link the new post from the BookingsystemKommune.tsx pillar page and from the 2-3 most relevant existing posts (kommunalt-bookingsystem-hva-er-det.md, bookingsystem-kommunale-lokaler-guide-it-leder.md) using their existing internal-link convention ([text](/blogg/slug)). Run the repo's existing content checks before opening a PR: scripts/check-blog-word-count.mjs and scripts/guard-blog-redirects.mjs if they apply to new posts, plus the normal lint/build/test suite - all must be green. Do not touch anything outside src/content/blog, the one pillar page cross-link edit, and any other existing post files needed for the 2-3 cross-links. No refactors, no template changes beyond what's strictly needed to satisfy the author/date-visibility acceptance criterion if it's currently missing. Open a PR against main (do not merge directly) with tests green.`

## Implementation contract — complete this before writing code
- **Problem:** In the `marketing` repo (Digilist marketing site, Vite/React + markdown blog under src/content/blog), publish one new blog post that directly answers the query 'hvordan digitalisere booking av kommunale lokaler' (how to digitalize booking of municipal facilities). Context: this exact topic cluster already has deep coverage - src/content/blog/kommunalt-bookingsystem-hva-er-det.md and hva-er-bookingsystem-kommunale-lokaler.md answer 'what is it', hvorfor-digital-booking-2026.md answers 'why is it required', bookingsystem-kommunale-lokaler-guide-it-leder.md and bookingsystem-kommune-sammenligning-matrise-tco.md cover procurement/comparison. None of these answer the PROCESS question 'how do we actually digitalize' as a step-by-step guide. Do NOT duplicate the 'hva er' or 'hvorfor' angle - this post must be a concrete HOW-TO: e.g. steps like (1) map existing manual/spreadsheet booking flows and facility types, (2) define user groups and approval rules, (3) choose ID-porten/BankID auth and SSA-L-compliant vendor, (4) migrate historical bookings and foreningsregister data, (5) pilot with one facility type, (6) roll out and measure adoption. Follow the exact frontmatter schema used by existing posts (see src/content/blog/bookingsystem-kommunale-lokaler-guide-it-leder.md for the pattern): slug, title, description, date (use today's date), author: 'Ibrahim Rahmani', role: 'Grunnlegger, Digilist', readingMinutes, tag, cover (reuse an existing /images/blog/*.webp asset, do not invent new image paths), keywords. Required content per the ticket's acceptance criteria: (a) a short, direct answer block (2-4 sentences) as the very first thing after the intro, literally answering 'hvordan digitaliserer man booking av kommunale lokaler' - a numbered or bulleted overview of the process; (b) at least one original figure/table (e.g. a step timeline or a before/after comparison table of manual vs digital flow - do not just restate marketing claims); (c) an explicit entity-definition paragraph stating what Digilist is, who it serves (kommuner/offentlig sektor booking innbyggere, lag og foreninger), which market (norsk kommunal sektor); (d) source/citation links (reuse the citation pattern from hvorfor-digital-booking-2026.md, e.g. links to digdir.no, SSA-L references, or internal /blogg/ cross-links to ssa-l-2026-bookingsystem-kommune.md and gdpr-iso-datalokasjon-norge.md if they exist); (e) author name and date are already handled by the frontmatter/BlogPost.tsx template - verify BlogPost.tsx renders both visibly, do not touch the template unless the date is not rendered as 'last updated' visibly; (f) confirm the blog route is server-rendered (check how BlogPost.tsx and vite build-plugins/blogMetaPlugin.ts handle SSR/prerendering for existing posts - it must already work since other posts are indexed, just don't break it). Cross-link the new post from the BookingsystemKommune.tsx pillar page and from the 2-3 most relevant existing posts (kommunalt-bookingsystem-hva-er-det.md, bookingsystem-kommunale-lokaler-guide-it-leder.md) using their existing internal-link convention ([text](/blogg/slug)). Run the repo's existing content checks before opening a PR: scripts/check-blog-word-count.mjs and scripts/guard-blog-redirects.mjs if they apply to new posts, plus the normal lint/build/test suite - all must be green. Do not touch anything outside src/content/blog, the one pillar page cross-link edit, and any other existing post files needed for the 2-3 cross-links. No refactors, no template changes beyond what's strictly needed to satisfy the author/date-visibility acceptance criterion if it's currently missing. Open a PR against main (do not merge directly) with tests green.
- **Business objective:** _why this matters (from the Linear issue)_
- **Repository / branch:** `/root/booking-brilliance` @ `agent/xal-377-aeo-gap-digilist-usynlig-i-ai-svar-for`
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
- One issue → one branch (`agent/xal-377-aeo-gap-digilist-usynlig-i-ai-svar-for`) → one independently reviewable change. Never main.
- Smallest valid change. No opportunistic refactoring, no broad formatting changes, no hidden dependency on another open PR.
- Validation is mandatory and staged — "code written" ≠ "compiled" ≠ "tests passed" ≠ "acceptance demonstrated". Collect evidence (test output / logs) before opening the PR.
- If scope expands beyond "Files likely affected", or the change grows large, STOP and escalate ("BLOCKED:") rather than pressing on.
- Open a PR only when green (otherwise a draft PR with a note). Delete this file before opening the PR.

## Full issue — from Linear (the source of truth for scope & acceptance)
> The Linear MCP in this environment may be bound to the WRONG workspace, so
> do NOT rely on it to read this ticket — everything you need is below. If
> something essential is genuinely missing here (e.g. a screenshot), STOP and
> end with "CLARIFICATION:" rather than guessing.

**Classification:** feature · severity minor · priority P2

Product gap: AEO-gap: Digilist usynlig i AI-svar for «hvordan digitalisere booking av kommunale lokaler». <!-- xaheen-triage -->

## Problem Statement

For the search query «hvordan digitalisere booking av kommunale lokaler», AI engines cite BookUp, Aktiv Kommune, Oslo booking, Sem & Stenersen Prokom, and [Bookingtjeneste.no](<http://Bookingtjeneste.no>), but never Digilist (visibility 0%, citation 0%, n=2). Digilist has no authoritative page directly answering this question, so it is absent from AI-generated answers for this intent.

## Scope

**In scope:**

* Publish (or expand) one authoritative page on [digilist.no](<http://digilist.no>) that directly answers «hvordan digitalisere booking av kommunale lokaler»
* Short, direct answer block at the top of the page
* Original documentation or figures (not just marketing copy)
* Clear entity definition: what Digilist is, who it is for, which market it serves
* Source/citation references on the page
* Visible author and last-updated date
* Technical citability: indexable, server-rendered, semantic HTML

**Out of scope:**

* Changes outside the marketing repository
* Unrelated refactors, drive-by fixes, or direct merges to main
* Scope creep beyond publishing this one page

## Acceptance Criteria

- [ ] A published page on [digilist.no](<http://digilist.no>) directly answers «hvordan digitalisere booking av kommunale lokaler» with a short answer block near the top of the page
- [ ] The page includes original documentation or figures, not only generic claims
- [ ] The page includes an explicit entity definition of Digilist (what it is, for whom, which market)
- [ ] The page includes source/citation references
- [ ] The page displays an author and a last-updated date
- [ ] The page is server-rendered, indexable, and uses semantic HTML
- [ ] CI is green and no existing user-facing behaviour regresses

## Testing Scenario

* Given the published page, when a visitor opens it, then a short block directly answering the question is visible before any other content.
* Given the page HTML, when fetched without JavaScript execution (e.g. curl or view-source), then the answer content is present (server-rendered) and uses semantic HTML elements.
* Given the page, when a reader looks for authorship/freshness, then an author name and an update date are visibly shown.
* Given the page, when a reader looks for supporting evidence, then original data/documentation and source references are present, not just prose claims.

## Value: medium

The issue gives concrete evidence of a content gap (named competitors cited, Digilist at 0% visibility/citation for this query) but the sample size is explicitly n=2 and no traffic, revenue, or blocked-user impact is stated, so it doesn't meet the bar for 'high'.

## Target repo: `marketing`

*Chosen by triage from the issue's content; routes preparation there.*

## Open questions

* The visibility/citation measurement is based on n=2 — is that sample large enough to prioritize this over other AEO gaps?
* No revenue, traffic, or user impact is stated for this specific query — is there supporting data (search volume, lead value) elsewhere that would raise or lower priority?
* Issue says 'severity major/priority P1' in its own classification header, but this is an enhancement (new content), not a defect — should be re-scored as a value, not a severity.

---

*Structured by the triage agent.

<details><summary>Reporter's original text</summary>

**SEO route:** content → `content-agent` · repo `marketing`

**Classification:** feature · severity major · priority P1

## Problem statement

Product gap: AEO-gap: Digilist usynlig i AI-svar for «hvordan digitalisere booking av kommunale lokaler». AI-motorer nevner BookUp, Aktiv Kommune, Oslo booking, Sem & Stenersen Prokom, [Bookingtjeneste.no](<http://Bookingtjeneste.no>), men ikke Digilist for spørsmålet «hvordan digitalisere booking av kommunale lokaler» (synlighet 0%, sitering 0%, n=2). Gjør Digilist siterbar: publiser en autoritativ side som svarer direkte på spørsmålet (kort svarblokk øverst), med original dokumentasjon/tall, tydelig entitetsdefinisjon (hva Digilist er, for hvem, marked), kildereferanser, forfatter/oppdateringsdato, og teknisk siterbarhet (indekserbar, server-rendret, semantisk HTML på [digilist.no](<http://digilist.no>)). Current assessment: gap (feature, major).

## Scope

Create or expand content covering "AEO-gap: Digilist usynlig i AI-svar for «hvordan digitalisere booking av kommunale lokaler»" aligned with AI-motorer nevner BookUp, Aktiv Kommune, Oslo booking, Sem & Stenersen Prokom, [Bookingtjeneste.no](<http://Bookingtjeneste.no>), men ikke Digilist for spørsmålet «hvordan digitalisere booking av kommunale lokaler» (synlighet 0%, sitering 0%, n=2). Gjør Digilist siterbar: publiser en autoritativ side som svarer direkte på spørsmålet (kort svarblokk øverst), med original dokumentasjon/tall, tydelig entitetsdefinisjon (hva Digilist er, for hvem

…(truncated)

</details> Current assessment: partial (feature, minor). Relevant code: src/content/blog/hvorfor-digital-booking-2026.md, src/content/blog/kommunalt-bookingsystem-hva-er-det.md, src/content/blog/bookingsystem-kommunale-lokaler-guide-it-leder.md, src/pages/BookingsystemKommune.tsx, src/content/blog (97 posts, author: Ibrahim Rahmani, dated, frontmatter with updated/dateModified).

**Scope**
The topic cluster 'kommunalt bookingsystem' is heavily covered (8+ posts: hva er, hvorfor, sammenligning/TCO, småkommuner, SSA-L, GDPR, ID-porten, idrettshall-krav), all server-rendered with author/date/sources - so this is NOT a from-scratch gap. But no single page directly answers the specific process-oriented query 'hvordan digitalisere booking av kommunale lokaler' with a short answer block first. Publish one new blog post using the existing frontmatter/author/date pattern, framed explicitly as a step-by-step digitization guide (not another 'hva er' 

Linear: https://linear.app/xala-technologies/issue/XAL-377/aeo-gap-digilist-usynlig-i-ai-svar-for-hvordan-digitalisere-booking-av
