# XAL-650: Content gap: BookUp og eksisterende booking-løsninger

> Auto-prepared by Digilist Improvements Agent. Run Claude in this worktree:
> `/loop Write and publish SEO content for "BookUp og eksisterende booking-løsninger". Cover Existing point solutions like BookUp indicate strong market demand and suggest opportunities to consolidate fragmented tooling.. Goal: satisfy search intent for "bookup" on digilist.no. The blog post itself must be in Norwegian Bokmål.`

## Implementation contract — complete this before writing code
- **Problem:** Write and publish SEO content for "BookUp og eksisterende booking-løsninger". Cover Existing point solutions like BookUp indicate strong market demand and suggest opportunities to consolidate fragmented tooling.. Goal: satisfy search intent for "bookup" on digilist.no. The blog post itself must be in Norwegian Bokmål.
- **Business objective:** _why this matters (from the Linear issue)_
- **Repository / branch:** `/root/booking-brilliance` @ `agent/xal-650-content-gap-bookup-og-eksisterende-booking-losni`
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
- One issue → one branch (`agent/xal-650-content-gap-bookup-og-eksisterende-booking-losni`) → one independently reviewable change. Never main.
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

Digilist ([digilist.no](<http://digilist.no>)) har ikke innhold som treffer søkeordet «bookup» / «BookUp og eksisterende booking-løsninger». En søke-etterspørselsklynge (cluster:BookUp) og kodeanalyse flagget dette som et gap (konfidens 95 %, ingen kodetreff). Oppgaven er å skrive og publisere ett norsk (Bokmål) blogginnlegg som dekker temaet og posisjonerer Digilist som en konsolidering av fragmentert bookingverktøy.

## Scope

**Innenfor:**

* Skrive og publisere ett SEO-blogginnlegg på norsk Bokmål om «BookUp og eksisterende booking-løsninger»
* Treffe og tilfredsstille søkeintensjonen for spørringen «bookup» på [digilist.no](<http://digilist.no>)
* Ramme innholdet rundt eksisterende punktløsninger (f.eks. BookUp) og Digilists konsolideringsvinkel
* Standard innholds-pipeline: utkast → godkjenning → publisering på markedsføringssiden

**Utenfor:**

* Endringer i andre repoer enn marketing (booking-brilliance)
* Produkt-/funksjonsendringer i booking- eller utleie-appen (dette er kun innhold)
* Urelaterte refaktoreringer, drive-by-fikser eller direkte merge til main
* Å bygge en faktisk konkurrentsammenligning eller migreringsverktøy

## Acceptance Criteria

- [ ] Et blogginnlegg som treffer spørringen «bookup» er publisert på [digilist.no](<http://digilist.no>) og er skrevet på norsk Bokmål
- [ ] Innlegget dekker BookUp / eksisterende booking-løsninger og Digilists konsolideringsposisjonering slik saken beskriver
- [ ] CI er grønn (alle relevante tester og bygg passerer)
- [ ] Ingen regresjon i eksisterende brukervendt innhold eller oppførsel

## Testing Scenario

* Gitt at innlegget er publisert, når en bruker søker «bookup» og lander på siden, så adresserer sideinnholdet BookUp og eksisterende booking-løsninger på norsk Bokmål
* Gitt at markedsføringssiden bygges i CI, når det nye innlegget legges til, så passerer bygg og alle tester uten feil
* Gitt siden før og etter endringen, når eksisterende sider lastes, så er ingen tidligere fungerende side eller rute ødelagt

## Verdi: unknown — ingen prioritet satt; et menneske vurderer verdien

unknown fordi saken påstår «strong market demand», men oppgir ingen belegg — ingen søkevolum, visninger eller trafikktall; 95 %-konfidensen gjelder kun at innholdet mangler, ikke at etterspørselen finnes, så verdien må vurderes av et menneske.

## Målrepo: `marketing`

*Valgt av triage fra sakens innhold; ruter forberedelsen dit.*

## Åpne spørsmål

* Hva er det faktiske etterspørselsbelegget bak cluster:BookUp — søkevolum, visninger eller trafikktall? Saken påstår sterk etterspørsel, men oppgir ingen.
* Hvem er målgruppen for søkeordet — offentlig/kommune-kjøpere eller privat/utleie-brukere? Saken sier det ikke.
* Hvilken vinkel er tiltenkt: en direkte «alternativ til BookUp»-sammenligning, en migrerings-/konsolideringsartikkel, eller en generell oversikt over booking-løsninger?
* Er det akseptabelt fra et merkevare-/juridisk ståsted å navngi BookUp direkte (en navngitt konkurrent/punktløsning)?
* Finnes det en eksisterende side som skal utvides, eller skal dette være et helt nytt innlegg — og hvilken mål-slug/URL?

---

*Strukturert av triage-agenten. Originalteksten er bevart under.*

<details><summary>Opprinnelig beskrivelse</summary>

<!-- xaheen-triage -->

## Problem Statement

Digilist ([digilist.no](<http://digilist.no>)) has no content targeting the search term "bookup" / "BookUp og eksisterende booking-løsninger". A search-demand cluster (cluster:BookUp) and code analysis flagged this as a gap (confidence 95%, no code hits). The stated rationale: point solutions like BookUp indicate market demand and an opportunity to position Digilist as a consolidation of fragmented booking tooling. The ask is to create (or expand) a Norwegian Bokmål blog post satisfying search intent for "bookup".

## Scope

**Innenfor:**

* Write and publish one SEO blog post in Norwegian Bokmål covering "BookUp og eksisterende booking-løsninger"
* Target and satisfy search intent for the query "bookup" on [digilist.no](<http://digilist.no>)
* Position the content around existing point solutions (e.g. BookUp) and Digilist's consolidation angle
* Standard content-pipeline output: draft → approval → publish in the marketing site

**Utenfor:**

* Changes to any repository other than the marketing site
* Product/feature changes to the booking or rental app itself (this is content only)
* Unrelated refactors, drive-by fixes, or direct merges to main
* Building an actual competitor-comparison feature or migration tooling

## Acceptance Criteria

- [ ] A blog post targeting the query "bookup" is published on [digilist.no](<http://digilist.no>) and is written in Norwegian Bokmål
- [ ] The post covers BookUp / existing booking solutions and Digilist's consolidation positioning as described in the issue
- [ ] CI is green (all relevant tests and build pass)
- [ ] No regression in existing user-facing content or behaviour

## Testing Scenario

* Given the post is published, When a user searches "bookup" and lands on the page, Then the page content addresses BookUp and existing booking solutions in Norwegian Bokmål.
* Given the marketing site build runs in CI, When the new post is added, Then the build and all tests pass with no errors.
* Given the site before and after the change, When existing pages are loaded, Then no previously working page or route is broken.

## Verdi: unknown — ingen prioritet satt; et menneske vurderer verdien

*Ingen begrunnelse oppgitt.*

## Målrepo: `marketing`

*Valgt av triage fra sakens innhold; ruter forberedelsen dit.*

## Åpne spørsmål

* What is the actual evidence of demand behind cluster:BookUp — search volume, impressions, or traffic numbers? The issue asserts "strong market demand" but gives none.
* Who is the target audience for this term — offentlig/kommune buyers or privat/utleie users? The issue does not say.
* What angle is intended: a direct "alternative to BookUp" comparison, a migration/con

Linear: https://linear.app/xala-technologies/issue/XAL-650/content-gap-bookup-og-eksisterende-booking-losninger
