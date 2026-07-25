# XAL-571: Content gap: Ungdoms- og fritidssentre

> Auto-prepared by Digilist Improvements Agent. Run Claude in this worktree:
> `/loop Write and publish SEO content for "Ungdoms- og fritidssentre". Cover Ungdomssentre og fritidsklubbe administrerer lokalbooking for medlemsaktiviteter med medlemsbasert tilgang og kalenderadministrasjon.. Goal: satisfy search intent for "ungdoms" on digilist.no. The blog post itself must be in Norwegian Bokmål.`

## Implementation contract — complete this before writing code
- **Problem:** Write and publish SEO content for "Ungdoms- og fritidssentre". Cover Ungdomssentre og fritidsklubbe administrerer lokalbooking for medlemsaktiviteter med medlemsbasert tilgang og kalenderadministrasjon.. Goal: satisfy search intent for "ungdoms" on digilist.no. The blog post itself must be in Norwegian Bokmål.
- **Business objective:** _why this matters (from the Linear issue)_
- **Repository / branch:** `/root/booking-brilliance` @ `agent/xal-571-content-gap-ungdoms-og-fritidssentre`
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
- One issue → one branch (`agent/xal-571-content-gap-ungdoms-og-fritidssentre`) → one independently reviewable change. Never main.
- Smallest valid change. No opportunistic refactoring, no broad formatting changes, no hidden dependency on another open PR.
- Validation is mandatory and staged — "code written" ≠ "compiled" ≠ "tests passed" ≠ "acceptance demonstrated". Collect evidence (test output / logs) before opening the PR.
- If scope expands beyond "Files likely affected", or the change grows large, STOP and escalate ("BLOCKED:") rather than pressing on.
- Open a PR only when green (otherwise a draft PR with a note). Delete this file before opening the PR.

## Full issue — from Linear (the source of truth for scope & acceptance)
> The Linear MCP in this environment may be bound to the WRONG workspace, so
> do NOT rely on it to read this ticket — everything you need is below. If
> something essential is genuinely missing here (e.g. a screenshot), STOP and
> end with "CLARIFICATION:" rather than guessing.

<!-- xaheen-triage -->

## Problem Statement

[digilist.no](<http://digilist.no>) har ingen innhold som treffer «Ungdoms- og fritidssentre» (ungdomshus/fritidsklubber). Saken hevder at disse organisasjonene administrerer lokalbooking for medlemsaktiviteter, med medlemsbasert tilgang og kalenderadministrasjon, og at det finnes søkeetterspørsel (klynge «booking ungdomshus lørdag kveld» / spørringen «ungdoms») som ingen eksisterende side dekker. Kodeanalyse rapporterer dette som et gap (95 % konfidens, ingen direkte innholdstreff). Ønsket: en ny eller utvidet norsk Bokmål-side som dekker temaet.

## Scope

**Innenfor:**

* Opprette eller utvide en norsk Bokmål blogg-/SEO-side på [digilist.no](<http://digilist.no>) om «Ungdoms- og fritidssentre»
* Dekke de tre temaene saken navngir: lokalbooking for medlemsaktiviteter, medlemsbasert tilgang, kalenderadministrasjon
* Optimalisere siden for søkeintensjonen «ungdoms»/«ungdomshus» (tittel, overskrifter, brødtekst refererer måltermene)

**Utenfor:**

* Endringer utenfor marketing-repoet (booking-brilliance)
* Produkt-/funksjonsendringer i selve bookingappen — dette er kun innhold
* Urelaterte refaktoreringer, drive-by-fikser eller direkte merge til main
* Utvidelse av omfang utover det navngitte temaet

## Acceptance Criteria

- [ ] En norsk Bokmål-side/artikkel om «Ungdoms- og fritidssentre» er publisert og nåbar på [digilist.no](<http://digilist.no>)
- [ ] Innholdet omtaler eksplisitt alle tre navngitte aspektene: lokalbooking for medlemsaktiviteter, medlemsbasert tilgang og kalenderadministrasjon
- [ ] Tittel, overskrifter og brødtekst inneholder måltermene «ungdoms»/«ungdomshus»
- [ ] CI er grønn (relevante tester og bygg passerer)
- [ ] Ingen regresjon i eksisterende publiserte sider eller ruter

## Testing Scenario

* Gitt at den nye siden er publisert, Når en bruker søker på [digilist.no](<http://digilist.no>) (eller navigerer nettstedet) etter «ungdoms»/«ungdomshus», Så returneres/nås den nye siden.
* Gitt den publiserte siden, Når en leser leser den, Så dekker den eksplisitt lokalbooking for medlemsaktiviteter, medlemsbasert tilgang og kalenderadministrasjon, på norsk Bokmål.
* Gitt at grenen er åpnet, Når CI kjører, Så passerer bygg og tester og ingen eksisterende side/rute er brutt.

## Verdi: unknown — ingen prioritet satt; et menneske vurderer verdien

Verdi er unknown fordi saken ikke oppgir noen tall for søkeetterspørsel — «major/P1» er autogenerert uten belegg, og ingen har faktisk vurdert verdien.

## Målrepo: `marketing`

*Valgt av triage fra sakens innhold; ruter forberedelsen dit.*

## Åpne spørsmål

* Hva er den faktiske søkeetterspørselen (volum/visninger) bak «ungdoms» / klyngen «booking ungdomshus lørdag kveld»? Den autogenererte «major/P1» er ikke underbygget med tall.
* Er «Ungdoms- og fritidssentre» et segment Digilist faktisk betjener (offentlig/kommune), eller er dette et aspirasjonelt innholdsmål? Dette avgjør om påstandene om medlemsbasert tilgang og kalenderadministrasjon er sanne.
* Skal dette være en ny frittstående side eller en utvidelse av en eksisterende segment-/bransjeside — og i så fall hvilken?
* Hvilke(t) eksakt(e) målsøkeord og URL-slug skal siden bruke?
* Finnes det krav til intern lenking / innholdsklynge (hvilke eksisterende sider bør lenke til/fra den)?

---

*Strukturert av triage-agenten. Originalteksten er bevart under.*

<details><summary>Opprinnelig beskrivelse</summary>

<!-- xaheen-triage -->

## Problem Statement

[digilist.no](<http://digilist.no>) has no content targeting «Ungdoms- og fritidssentre» (youth and leisure centres / fritidsklubber). The issue asserts these organisations administer local booking for member activities, with member-based access and calendar administration, and that there is search demand (cluster «booking ungdomshus lørdag kveld») for the query «ungdoms» that no existing page satisfies. Code analysis reports this as a gap (95% confidence, no direct content hits).

## Scope

**Innenfor:**

* Create or expand a Norwegian Bokmål blog/SEO page on [digilist.no](<http://digilist.no>) covering «Ungdoms- og fritidssentre»
* Cover the three themes named in the issue: lokalbooking for medlemsaktiviteter, medlemsbasert tilgang, kalenderadministrasjon
* Target the search intent for «ungdoms» / «ungdomshus»-related booking queries

**Utenfor:**

* Changes outside the marketing repository
* Unrelated refactors, drive-by fixes, or direct merges to main
* Product/feature changes to the booking app itself (this is content only)
* Scope creep beyond the stated topic

## Acceptance Criteria

- [ ] A Norwegian Bokmål page/article about «Ungdoms- og fritidssentre» is published and reachable on [digilist.no](<http://digilist.no>)
- [ ] The content addresses all three named aspects: lokalbooking for medlemsaktiviteter, medlemsbasert tilgang, and kalenderadministrasjon
- [ ] The page is optimised for the «ungdoms»/«ungdomshus» search intent (title, headings, and body reference the target terms)
- [ ] CI is green (relevant tests and build pass)
- [ ] No regression in existing published content or routes

## Testing Scenario

* Given the new content is published, When a user searches [digilist.no](<http://digilist.no>) (or navigates the site) for «ungdoms»/«ungdomshus», Then the new page is returned/reachable.
* Given the published page, When a reader reads it, Then it explicitly covers lokalbooking for medlemsaktiviteter, medlemsbasert tilgang, and kalenderadministrasjon, in Norwegian Bokmål.
* Given the branch is opened, When CI runs, Then build and tests pass and no existing page/route is broken.

## Verdi: unknown — ingen prioritet satt; et menneske vurderer verdien

*Ingen begrunnelse oppgitt.*

## Målrepo: `marketing`

*Valgt av triage fra sakens innhold; ruter forberedelsen dit.*

## Åpne spørsmål

* What is the actual search demand (volume/impressions) behind «ungdoms»/«cluster:booking ungdomshus lørdag kveld»? The auto-generated «major/P1» is not backed by figures.
* Is «Ungdoms- 

Linear: https://linear.app/xala-technologies/issue/XAL-571/content-gap-ungdoms-og-fritidssentre
