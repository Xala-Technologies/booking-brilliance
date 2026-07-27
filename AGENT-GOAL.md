# XAL-331: [marketing] [SEO error] h1.missing — /blogg/bookingsoftware-kommune-sammenligning-pris

> Auto-prepared by Digilist Improvements Agent. Run Claude in this worktree:
> `/loop [marketing] [SEO error] h1.missing — /blogg/bookingsoftware-kommune-sammenligning-pris`

## Implementation contract — complete this before writing code
- **Problem:** [marketing] [SEO error] h1.missing — /blogg/bookingsoftware-kommune-sammenligning-pris
- **Business objective:** _why this matters (from the Linear issue)_
- **Repository / branch:** `/root/booking-brilliance` @ `agent/xal-331-blogg-bookingsoftware-kommune`
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
- One issue → one branch (`agent/xal-331-blogg-bookingsoftware-kommune`) → one independently reviewable change. Never main.
- Smallest valid change. No opportunistic refactoring, no broad formatting changes, no hidden dependency on another open PR.
- Validation is mandatory and staged — "code written" ≠ "compiled" ≠ "tests passed" ≠ "acceptance demonstrated". Collect evidence (test output / logs) before opening the PR.
- If scope expands beyond "Files likely affected", or the change grows large, STOP and escalate ("BLOCKED:") rather than pressing on.
- Open a PR only when green (otherwise a draft PR with a note). Delete this file before opening the PR.

## Full issue — from Linear (the source of truth for scope & acceptance)
> The Linear MCP in this environment may be bound to the WRONG workspace, so
> do NOT rely on it to read this ticket — everything you need is below. If
> something essential is genuinely missing here (e.g. a screenshot), STOP and
> end with "CLARIFICATION:" rather than guessing.

**Classification:** bug · severity minor · priority P3

Product gap: [marketing] [SEO error] h1.missing — /blogg/bookingsoftware-kommune-sammenligning-pris. <!-- xaheen-triage -->

## Problem Statement

Bloggsiden på [https://digilist.no/blogg/bookingsoftware-kommune-sammenligning-pris](<https://digilist.no/blogg/bookingsoftware-kommune-sammenligning-pris>) har ingen <h1>-overskrift. SEO-skanneren (marketing @ seo-run) flagget «No <h1> on page» som feil med 88 % konfidens på at det er fiksbart.

## Scope

**Innenfor:**

* Sørge for at siden /blogg/bookingsoftware-kommune-sammenligning-pris rendrer en <h1>
* Endringen gjøres i marketing-repoet (booking-brilliance) på en ny branch

**Utenfor:**

* Endringer utenfor målrepoet for denne saken
* Urelaterte refaktoreringer eller drive-by-fikser
* Utvidelse av omfanget utover å reprodusere og fikse den rapporterte h1-mangelen
* Direkte merge til main

## Acceptance Criteria

- [ ] Siden /blogg/bookingsoftware-kommune-sammenligning-pris rendrer nøyaktig én <h1> i produsert HTML
- [ ] SEO-crawleren rapporterer ikke lenger h1.missing for denne URL-en etter endringen
- [ ] Relevante tester og build passerer (grønn CI)
- [ ] Ingen regresjon i eksisterende brukervendt oppførsel

## Testing Scenario

* Gitt at siden /blogg/bookingsoftware-kommune-sammenligning-pris er publisert, når jeg henter den rendrede HTML-en, så finnes det nøyaktig ett <h1>-element med ikke-tomt innhold
* Gitt at endringen er deployet, når seo-crawleren kjøres på nytt mot URL-en, så er h1.missing-funnet borte
* Gitt at jeg åpner siden i en nettleser, når siden lastes, så vises en synlig hovedoverskrift øverst i innholdet

## Alvorlighetsgrad: minor

Saken oppgir «major/P1», men teksten gir ingen belegg for konsekvens (ingen tall på trafikk, rangering eller tilgjengelighetstap). En manglende <h1> på én bloggside svekker SEO/semantikk, men siden fungerer, ingen kjerneflyt (booking) er berørt og det finnes ingen indikasjon på tap uten omgåelse. I tråd med regelen om å velge lavere alvorlighet ved manglende belegg settes den til minor.

## Åpne spørsmål

* Mangler <h1> helt, eller finnes overskriften men er markert opp som en annen tag (f.eks. <h2>/<div>)? Teksten sier kun «No <h1> on page».
* Er dette et mal-/template-problem som rammer alle blogginnlegg, eller kun denne ene URL-en? Saken nevner bare én side.
* Hvilken komponent/mal i marketing-repoet rendrer tittelen på blogginnlegg? Ikke oppgitt i saken.
* Hva er faktisk konsekvens (trafikk-/rangeringstap) — dette trengs for å vurdere om major/P1 er berettiget.

---

*Strukturert av triage-agenten.

<details><summary>Reporter's original text</summary>

**SEO route:** technical → `improvements-agent` · repo `marketing`

**Klassifisering:** bug · alvorlighet major · prioritet P1

## Problem statement

[marketing] [SEO error] h1.missing — /blogg/bookingsoftware-kommune-sammenligning-pris. No <h1> on page Observed at [https://digilist.no/blogg/bookingsoftware-kommune-sammenligning-pris](<https://digilist.no/blogg/bookingsoftware-kommune-sammenligning-pris>). Classification: bug/major — fixable. Relevant code: [https://digilist.no/blogg/bookingsoftware-kommune-sammenligning-pris](<https://digilist.no/blogg/bookingsoftware-kommune-sammenligning-pris>).

## Scope

Fix technical SEO issue (marketing:crawl:h1.missing:[https://digilist.no/blogg/bookingsoftware-kommune-sammenligning-pris](<https://digilist.no/blogg/bookingsoftware-kommune-sammenligning-pris>)): No <h1> on page Touch points: [https://digilist.no/blogg/bookingsoftware-kommune-sammenligning-pris](<https://digilist.no/blogg/bookingsoftware-kommune-sammenligning-pris>) (No <h1> on page).

## Out of scope

Changes outside the target repository for this issue. Unrelated refactors, drive-by fixes, or direct merges to main. Expanding scope beyond reproducing and fixing the reported defect.

## Acceptance criteria

- [ ] Fix technical SEO issue (marketing:crawl:h1.missing:[https://digilist.no/blogg/bookingsoftware-kommune-sammenligning-pris](<https://digilist.no/blogg/bookingsoftware-kommune-sammenligning-pris>)): No <h1> on page
- [ ] All relevant tests and build pass (green C

…(truncated)

</details> Current assessment: exists (bug, minor). Relevant code: src/pages/BlogPost.tsx:198, src/entry-server.tsx (PR #74, commit 9216df8), live fetch [https://digilist.no/blogg/bookingsoftware-kommune-sammenligning-pris](<https://digilist.no/blogg/bookingsoftware-kommune-sammenligning-pris>), branch agent/xal-365-blogg-bookingsoftware-kommune (commit 66e8dc2).

**Scope**
No fix needed. Verified live production HTML for the reported URL contains exactly one non-empty <h1>. The underlying cause (SSR prerender race in entry-server.tsx shipping the loading shell instead of real content) was already fixed repo-wide in PR #74 (2026-07-18), which postdates this blog post's addition. The scan finding is stale (pre-fix crawl or cached result). No merge exists for the stub branch xal-365, and none is required. Touch points: src/pages/BlogPost.tsx:198 (renders single <h1> via EditorialHeading for every blog post); src/entry-server.tsx (PR #74, commit 9216df8) (fixed the SSR prerender race that shipped a loading shell without h1/content; landed 2026-07-18); live fetch [https://digilist.no/blogg/bookingsoftware-kommune-sammenligning-pris](<https://digilist.no/blogg/bookingsoftware-kommune-sammenligning-pris>) (curl of production HTML shows exactly one non-empty <h1> present now); branch agent/xal-365-blogg-bookingsoftware-kommune (commit 66e8dc2) (only contains an AGENT-GOAL.md scaffold, no code change, unmerged).

**Done when**

- [ ] No fix needed. Verified live production HTML for the reported URL contains exactly one non-empty <h1>. The underlying cause (SSR prerender race in entry-server.tsx shipping the loading shell instead of real content) was already fixed repo-wide in PR #74 (2026-07-18), which postdates this blog post's addition. The scan finding is stale (pre-fix crawl or cached result). No me

Linear: https://linear.app/xala-technologies/issue/XAL-331/marketing-seo-error-h1missing-bloggbookingsoftware-kommune
