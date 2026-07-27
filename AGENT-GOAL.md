# XAL-328: [marketing] [SEO error] h1.missing — /blogg/automatisert-avbooking-og-refusjon-kommunal-saksbehandling

> Auto-prepared by Digilist Improvements Agent. Run Claude in this worktree:
> `/loop [marketing] [SEO error] h1.missing — /blogg/automatisert-avbooking-og-refusjon-kommunal-saksbehandling`

## Implementation contract — complete this before writing code
- **Problem:** [marketing] [SEO error] h1.missing — /blogg/automatisert-avbooking-og-refusjon-kommunal-saksbehandling
- **Business objective:** _why this matters (from the Linear issue)_
- **Repository / branch:** `/root/booking-brilliance` @ `agent/xal-328-blogg-automatisert-avbooking-og-refusjon`
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
- One issue → one branch (`agent/xal-328-blogg-automatisert-avbooking-og-refusjon`) → one independently reviewable change. Never main.
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

Product gap: [marketing] [SEO error] h1.missing — /blogg/automatisert-avbooking-og-refusjon-kommunal-saksbehandling. <!-- xaheen-triage -->

## Problem Statement

SEO-skanneren (marketing @ seo-run) fant at bloggsiden [https://digilist.no/blogg/automatisert-avbooking-og-refusjon-kommunal-saksbehandling](<https://digilist.no/blogg/automatisert-avbooking-og-refusjon-kommunal-saksbehandling>) ikke har noe <h1>-element på siden («No <h1> on page»). Funnet er klassifisert som fixable med 88 % konfidens.

## Scope

**Innenfor:**

* Sørge for at siden /blogg/automatisert-avbooking-og-refusjon-kommunal-saksbehandling rendrer nøyaktig ett <h1>-element
* Endringer innenfor marketing-repoet (kilden til bloggsiden)

**Utenfor:**

* Endringer utenfor marketing-repoet
* Andre bloggsider eller URL-er som ikke er nevnt i saken
* Urelaterte refaktoreringer eller drive-by-fikser
* Andre SEO-funn enn h1.missing på denne ene URL-en

## Acceptance Criteria

- [ ] Siden /blogg/automatisert-avbooking-og-refusjon-kommunal-saksbehandling rendrer nøyaktig ett synlig <h1>-element
- [ ] seo-crawler rapporterer ikke lenger marketing:crawl:h1.missing for denne URL-en etter endringen
- [ ] Relevante tester og build er grønne (grønn CI)
- [ ] Ingen regresjon i eksisterende brukervendt oppførsel på bloggsidene

## Testing Scenario

* Given bloggsiden /blogg/automatisert-avbooking-og-refusjon-kommunal-saksbehandling, When siden lastes, Then finnes det nøyaktig ett <h1>-element i DOM-en
* Given at endringen er deployet, When seo-crawler kjøres mot URL-en på nytt, Then rapporteres ikke funnet h1.missing lenger

## Alvorlighetsgrad: minor

Impact-basert: kun én bloggside i marketing mangler <h1>. Ikke datatap, ikke sikkerhet/GDPR, og ingen kjerneflyt (booking) er brutt — siden fungerer fortsatt; dette er en SEO-/tilgjengelighetsforringelse på én markedsføringsside. Saken selv sier «major», men gir ikke belegg for konsekvens som rettferdiggjør det; jeg velger lavere alvorlighetsgrad i tråd med regelen om å ikke blåse opp køen.

## Åpne spørsmål

* Gjelder dette kun denne ene siden, eller mangler <h1> på hele blogg-malen / flere bloggsider? Saken nevner bare én URL.
* Hva skal <h1>-teksten være — artikkelens tittel («Automatisert avbooking og refusjon i kommunal saksbehandling»)? Saken spesifiserer ikke innhold.
* Finnes det allerede en tittel på siden som rendres som feil element (f.eks. <h2> eller <div>) og bør endres til <h1>, eller mangler tittelen helt?

---

*Strukturert av triage-agenten.

<details><summary>Reporter's original text</summary>

**SEO route:** technical → `improvements-agent` · repo `marketing`

**Klassifisering:** bug · alvorlighet major · prioritet P1

## Problem statement

[marketing] [SEO error] h1.missing — /blogg/automatisert-avbooking-og-refusjon-kommunal-saksbehandling. No <h1> on page Observed at [https://digilist.no/blogg/automatisert-avbooking-og-refusjon-kommunal-saksbehandling](<https://digilist.no/blogg/automatisert-avbooking-og-refusjon-kommunal-saksbehandling>). Classification: bug/major — fixable. Relevant code: [https://digilist.no/blogg/automatisert-avbooking-og-refusjon-kommunal-saksbehandling](<https://digilist.no/blogg/automatisert-avbooking-og-refusjon-kommunal-saksbehandling>).

## Scope

Fix technical SEO issue (marketing:crawl:h1.missing:[https://digilist.no/blogg/automatisert-avbooking-og-refusjon-kommunal-saksbehandling](<https://digilist.no/blogg/automatisert-avbooking-og-refusjon-kommunal-saksbehandling>)): No <h1> on page Touch points: [https://digilist.no/blogg/automatisert-avbooking-og-refusjon-kommunal-saksbehandling](<https://digilist.no/blogg/automatisert-avbooking-og-refusjon-kommunal-saksbehandling>) (No <h1> on page).

## Out of scope

Changes outside the target repository for this issue. Unrelated refactors, drive-by fixes, or direct merges to main. Expanding scope beyond reproducing and fixing the reported defect.

## Acceptance criteria

- [ ] Fix technical SEO issue (marketing:crawl:h1.missing:[[[[https://digilist.no/blogg/automatisert-avbooking-og-refusjon-k](<https://digilist.no/blogg/automatisert-avbooking-og-refusjon-k>)

…(truncated)

</details> Current assessment: exists (bug, minor). Relevant code: src/entry-server.h1.test.tsx:19-27, 9216df8 fix(seo): fix SSR prerender race (#74), live page check.

**Scope**
No code change needed. The SEO finding is stale: it duplicates XAL-310 (shared entry-server SSR prerender race across ~17 blog/landing pages) which was already fixed in PR #74 and covered by a regression test (PR #76) that explicitly asserts a single <h1> for this exact slug. The live URL currently renders exactly one <h1> with the correct title. Close as a duplicate/already-fixed rather than re-running the fix. Touch points: src/entry-server.h1.test.tsx:19-27 (dedicated regression test for this exact slug, passes (5/5 tests green)); 9216df8 fix(seo): fix SSR prerender race (#74) (root cause (SSR prerender race shipping loading shell instead of h1/content) fixed 2026-07-18, before this finding); live page check (curl [https://digilist.no/blogg/automatisert-avbooking-og-refusjon-kommunal-saksbehandling](<https://digilist.no/blogg/automatisert-avbooking-og-refusjon-kommunal-saksbehandling>) returns exactly one <h1> containing the post title).

**Done when**

- [ ] No code change needed. The SEO finding is stale: it duplicates XAL-310 (shared entry-server SSR prerender race across ~17 blog/landing pages) which was already fixed in PR #74 and covered by a regression test (PR #76) that explicitly asserts a single <h1> for this exact slug. The live URL currently renders exactly one <h1> with the correct title. Close as a duplicate/already-fixed rather than re-running the fix.

## Code analysis (evidence, marketing @ 95d442ea)

Status: **exists** (confidence 95%)

* `src/entry-server.h1.test.tsx:19-27` — dedicated regression test for this exact slug, passes (5/5 tests green)
* `9216df8 fix(seo): fix SSR 

Linear: https://linear.app/xala-technologies/issue/XAL-328/marketing-seo-error-h1missing-bloggautomatisert-avbooking-og-refusjon
