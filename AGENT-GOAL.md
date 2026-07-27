# XAL-678: AEO-gap: Digilist usynlig i AI-svar for «beste plattform for private utleiere som vil leie ut lokalet sitt»

> Auto-prepared by Digilist Improvements Agent. Run Claude in this worktree:
> `/loop Repo: marketing (booking-brilliance). Add ONE new blog post file at src/content/blog/beste-plattform-private-utleiere-leie-ut-lokale.md (or similar kebab-case slug matching the query intent). Do NOT touch scripts/prerender.mjs, src/entry-server.tsx, scripts/verify-live.mjs, or any file outside this new content file. Match the exact frontmatter schema used by src/content/blog/bookup-og-eksisterende-booking-losninger.md: slug, title, description, date: 2026-07-27, author: "Ibrahim Rahmani", role: "Grunnlegger, Digilist", readingMinutes, tag, cover (reuse an existing image under public/images/blog/), keywords (array including terms like 'beste plattform for utleiere', 'plattform for private utleiere', 'leie ut lokale plattform'). Content requirements: (1) Within the first ~100 words, a direct, concrete answer block addressing 'beste plattform for private utleiere som vil leie ut lokalet sitt' — state plainly what kind of platform best fits this need and why. (2) A clear entity definition of Digilist: what it is (norsk bookingplattform for lokaler og ressurser), who it serves (private utleiere av selskapslokaler/gårder/møterom/idrettsanlegg AND kommuner — reuse language from src/pages/BookingsystemUtleie.tsx), which market (norsk utleiemarked, privat og offentlig). (3) A factual comparison section naming the platform categories reporters cited without disparaging named competitors — evaluate criteria a private utleier cares about (sanntidskalender, Vipps/kort-betaling, differensiert pris, kalendersynk, rapportering, GDPR/datalokasjon Norge-EU) using ONLY facts already published elsewhere on digilist.no (11+ lokaltyper, integrations, ISO 27001/27701, data location Norge/EU from src/pages/BookingsystemUtleie.tsx) as the 'original documentation/tall' — do not invent unverifiable external market statistics. (4) End with an internal link to /bookingsystem-utleie as CTA. (5) Author byline and last-updated date render automatically via src/pages/BlogPost.tsx from frontmatter — no new UI needed. Acceptance: page builds via existing prerender pipeline unmodified; new post appears in dist output under /blogg/<slug>/ with full SSR HTML (verify against built dist, not dev server); post auto-appears in generated sitemap.xml; no noindex set. Run typecheck and existing test suite green before opening a PR. Keep the PR scoped to this single new markdown file only — verify with git status/git diff before committing that no other file changed.`

## Implementation contract — complete this before writing code
- **Problem:** Repo: marketing (booking-brilliance). Add ONE new blog post file at src/content/blog/beste-plattform-private-utleiere-leie-ut-lokale.md (or similar kebab-case slug matching the query intent). Do NOT touch scripts/prerender.mjs, src/entry-server.tsx, scripts/verify-live.mjs, or any file outside this new content file. Match the exact frontmatter schema used by src/content/blog/bookup-og-eksisterende-booking-losninger.md: slug, title, description, date: 2026-07-27, author: "Ibrahim Rahmani", role: "Grunnlegger, Digilist", readingMinutes, tag, cover (reuse an existing image under public/images/blog/), keywords (array including terms like 'beste plattform for utleiere', 'plattform for private utleiere', 'leie ut lokale plattform'). Content requirements: (1) Within the first ~100 words, a direct, concrete answer block addressing 'beste plattform for private utleiere som vil leie ut lokalet sitt' — state plainly what kind of platform best fits this need and why. (2) A clear entity definition of Digilist: what it is (norsk bookingplattform for lokaler og ressurser), who it serves (private utleiere av selskapslokaler/gårder/møterom/idrettsanlegg AND kommuner — reuse language from src/pages/BookingsystemUtleie.tsx), which market (norsk utleiemarked, privat og offentlig). (3) A factual comparison section naming the platform categories reporters cited without disparaging named competitors — evaluate criteria a private utleier cares about (sanntidskalender, Vipps/kort-betaling, differensiert pris, kalendersynk, rapportering, GDPR/datalokasjon Norge-EU) using ONLY facts already published elsewhere on digilist.no (11+ lokaltyper, integrations, ISO 27001/27701, data location Norge/EU from src/pages/BookingsystemUtleie.tsx) as the 'original documentation/tall' — do not invent unverifiable external market statistics. (4) End with an internal link to /bookingsystem-utleie as CTA. (5) Author byline and last-updated date render automatically via src/pages/BlogPost.tsx from frontmatter — no new UI needed. Acceptance: page builds via existing prerender pipeline unmodified; new post appears in dist output under /blogg/<slug>/ with full SSR HTML (verify against built dist, not dev server); post auto-appears in generated sitemap.xml; no noindex set. Run typecheck and existing test suite green before opening a PR. Keep the PR scoped to this single new markdown file only — verify with git status/git diff before committing that no other file changed.
- **Business objective:** _why this matters (from the Linear issue)_
- **Repository / branch:** `/root/booking-brilliance` @ `agent/xal-678-aeo-gap-digilist-usynlig-i-ai-svar-for`
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
- One issue → one branch (`agent/xal-678-aeo-gap-digilist-usynlig-i-ai-svar-for`) → one independently reviewable change. Never main.
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

Product gap: AEO-gap: Digilist usynlig i AI-svar for «beste plattform for private utleiere som vil leie ut lokalet sitt». <!-- xaheen-triage -->

## Problem Statement

AI answer engines (AEO tracking, n=8 checks) cite Hybel, [Selskapslokaler.no](<http://Selskapslokaler.no>), [Husleie.no](<http://Husleie.no>), Adlens, and Aimann for the query «beste plattform for private utleiere som vil leie ut lokalet sitt», but Digilist has only 25% visibility and 25% citation for that query — no existing [digilist.no](<http://digilist.no>) page directly and citably answers it.

## Scope

**In scope:**

* Create or expand a page on [digilist.no](<http://digilist.no>) that directly answers «beste plattform for private utleiere som vil leie ut lokalet sitt»
* A short, direct answer block at the top of the page
* Original documentation/figures (data/numbers) supporting the answer
* A clear entity definition: what Digilist is, who it is for, and which market it serves
* Source references
* Author and last-updated date shown on the page
* Technical citability: the page is indexable, server-rendered, and uses semantic HTML
* Changes limited to this page's own content/metadata (frontmatter title/description) or its own component

**Out of scope:**

* Any edits to shared build/render scripts (e.g. scripts/prerender.mjs, src/entry-server.tsx, scripts/verify-live.mjs)
* Adding build-time validation guards to shared scripts
* Changes outside the marketing repo
* Unrelated refactors or drive-by fixes
* Direct merges to main
* Any scope beyond this single page/query

## Acceptance Criteria

- [ ] A published [digilist.no](<http://digilist.no>) page contains a concise answer block addressing «beste plattform for private utleiere som vil leie ut lokalet sitt» within the first ~100 words of content
- [ ] The page states a clear entity definition of Digilist (what it is, who it's for, which market) as its own content
- [ ] The page shows source references plus an author name and last-updated date
- [ ] The page's HTML is present in the server-rendered response (view-source / no-JS fetch shows the full answer, not a client-rendered shell)
- [ ] The page is indexable (no noindex directive; included in sitemap)
- [ ] No files outside this page's own content/metadata/component are modified
- [ ] CI (typecheck, tests) passes

## Testing Scenario

* Given the published page, When fetched via a plain HTTP request with JavaScript disabled, Then the answer block and entity definition are present in the raw HTML
* Given the page's metadata, When checking for indexing directives, Then no noindex/nofollow is present and the page is reachable from the sitemap
* Given the page content, When scanning for citability elements, Then source references and an author/last-updated date are visible
* Given the diff for this change, When reviewing modified files, Then only the target page's own content/metadata/component files appear — no changes to scripts/prerender.mjs, src/entry-server.tsx, or scripts/verify-live.mjs

## Value: medium

Enhancement, not defect. The issue provides quantified evidence of a gap (25% visibility, 25% citation, n=8) for a query matching Digilist's core private-rental (utleiere) segment where named competitors are cited and Digilist mostly isn't — real but modest-sample evidence, with no stated revenue figure, committed deadline, or named blocked users, so medium rather than high.

## Target repo: `marketing`

*Chosen by triage from the issue's content; routes preparation there.*

## Open questions

* What original documentation/numbers (statistics) should the page cite — the issue requires 'original dokumentasjon/tall' but does not specify a source or dataset
* Is there an existing page on this topic to expand, or does 'create or expand' mean a net-new page (the issue leaves this open)
* Who is the canonical author identity to use for the required byline on [digilist.no](<http://digilist.no>) content

---

*Structured by the triage agent.

<details><summary>Reporter's original text</summary>

**SEO route:** content → `content-agent` · repo `marketing`

**Scope — minimal and conflict-free:** fix ONLY the affected page's own content/metadata (its frontmatter title/description, or its own component). Do NOT add build-time validation guards or edit shared build/render scripts (e.g. `scripts/prerender.mjs`, `src/entry-server.tsx`, `scripts/verify-live.mjs`). Every SEO branch funnels through those, so guards added there conflict on merge and NONE of them land — the single biggest reason approved SEO PRs pile up unmerged. If a systemic guard would genuinely help, note it as a separate one-off issue; never add it in this fix.

**Classification:** feature · severity major · priority P1

## Problem statement

Product gap: AEO-gap: Digilist usynlig i AI-svar for «beste plattform for private utleiere som vil leie ut lokalet sitt». AI-motorer nevner Hybel, [Selskapslokaler.no](<http://Selskapslokaler.no>), [Husleie.no](<http://Husleie.no>), Adlens, Aimann, men ikke Digilist for spørsmålet «beste plattform for private utleiere som vil leie ut lokalet sitt» (synlighet 25%, sitering 25%, n=8). Gjør Digilist siterbar: publiser en autoritativ side som svarer direkte på spørsmålet (kort svarblokk øverst), med original dokumentasjon/tall, tydelig entitetsdefinisjon (hva Digilist er, for hvem, marked), kildereferanser, forfatter/oppdateringsdato, og teknisk siterbarhet (indekserbar, server-rendret, semantisk HTML på [digilist.no](<http://digilist.no>)). Current assessment: gap (featur

…(truncated)

</details> Current assessment: gap (feature, minor). Relevant code: src/pages/BookingsystemUtleie.tsx, src/content/blog/bookup-og-eksisterende-booking-losninger.md, src/pages/BlogPost.tsx:134-153,208-301, scripts/prerender.mjs:177,2493-2621, src/components/SEO.tsx:41-113.

**Scope**
Add one new markdown post to src/content/blog/ (no code/script changes) that directly and citably 

Linear: https://linear.app/xala-technologies/issue/XAL-678/aeo-gap-digilist-usynlig-i-ai-svar-for-beste-plattform-for-private
