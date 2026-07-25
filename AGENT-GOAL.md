# XAL-555: Content gap: Statistikk, rapportering og bruksdata

> Auto-prepared by Digilist Improvements Agent. Run Claude in this worktree:
> `/loop Write and publish SEO content for "Statistikk, rapportering og bruksdata". Cover Ledere og administratorer trenger rapporter og statistikk over bruk av kommunale lokaler for ressursplanlegging og optimalisering.. Goal: satisfy search intent for "statistikk" on digilist.no. The blog post itself must be in Norwegian Bokmål.`

## Implementation contract — complete this before writing code
- **Problem:** Write and publish SEO content for "Statistikk, rapportering og bruksdata". Cover Ledere og administratorer trenger rapporter og statistikk over bruk av kommunale lokaler for ressursplanlegging og optimalisering.. Goal: satisfy search intent for "statistikk" on digilist.no. The blog post itself must be in Norwegian Bokmål.
- **Business objective:** _why this matters (from the Linear issue)_
- **Repository / branch:** `/root/booking-brilliance` @ `agent/xal-555-content-gap-statistikk-rapportering-og-bruksdata`
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
- One issue → one branch (`agent/xal-555-content-gap-statistikk-rapportering-og-bruksdata`) → one independently reviewable change. Never main.
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

Markedssiden mangler innhold om «Statistikk, rapportering og bruksdata». Ifølge issuet trenger ledere og administratorer rapporter og statistikk over bruk av kommunale lokaler for ressursplanlegging og optimalisering, og kodeanalysen markerer dette som et innholdsgap (gap, 95 % konfidens, ingen direkte kodetreff). Oppgaven er å opprette eller utvide SEO-innhold som dekker dette temaet.

## Scope

**Innenfor:**

* Opprette eller utvide innhold i marketing-repoet (booking-brilliance) om «Statistikk, rapportering og bruksdata»
* Rette innholdet mot målgruppen ledere og administratorer med vinkling på ressursplanlegging og optimalisering av kommunale lokaler
* Innholdet skrives på norsk bokmål
* Dekke søkeintensjonen for «statistikk» slik issuet angir

**Utenfor:**

* Endringer utenfor marketing-repoet
* Bygging av faktisk rapporterings-/statistikkfunksjonalitet i produktet (app-repoet)
* Urelaterte refaktoreringer, drive-by-fikser eller direkte merge til main
* Scope-creep utover det angitte innholdsmålet

## Acceptance Criteria

- [ ] Det finnes en publisert side/blogginnlegg i marketing-repoet som dekker «Statistikk, rapportering og bruksdata»
- [ ] Innholdet omtaler eksplisitt målgruppen ledere/administratorer og bruken av kommunale lokaler for ressursplanlegging og optimalisering
- [ ] Innholdet er skrevet på norsk bokmål
- [ ] Relevante tester og bygg passerer (grønn CI)
- [ ] Ingen regresjon i eksisterende brukervendt oppførsel

## Testing Scenario

* Gitt at innholdet er publisert, når en leser åpner den nye siden, så beskriver den statistikk, rapportering og bruksdata for kommunale lokaler rettet mot ledere/administratorer, på norsk bokmål
* Gitt at endringen er levert, når CI kjøres på grenen, så er alle tester og bygg grønne
* Gitt eksisterende markedssider, når den nye siden er publisert, så fungerer navigasjon og eksisterende sider fortsatt uten regresjon

## Verdi: unknown — ingen prioritet satt; et menneske vurderer verdien

Value settes til unknown fordi issuet kun oppgir «from search demand» og en navngitt målgruppe, men ingen målbar evidens (søkevolum, trafikk eller konvertering) som lar en vurdere faktisk verdi; «major/P1» er auto-generert og ikke begrunnet.

## Målrepo: `marketing`

*Valgt av triage fra sakens innhold; ruter forberedelsen dit.*

## Åpne spørsmål

* Hvilket konkret søkevolum / hvilke nøkkelord ligger bak clusteret «statistikk rapport bruk kommunale lokaler»?
* Skal dette være et blogginnlegg, en landingsside eller en produkt-/funksjonsside?
* Finnes det en faktisk statistikk-/rapporteringsfunksjon i produktet som innholdet skal lenke til eller markedsføre, eller er dette rent SEO-innhold?
* Hva er målbar «done» for å tilfredsstille søkeintensjonen (f.eks. rangering, publisert URL, intern lenking)?
* Hvilken URL/rute skal innholdet ligge på?

---

*Strukturert av triage-agenten. Originalteksten er bevart under.*

<details><summary>Opprinnelig beskrivelse</summary>

**SEO route:** content → `content-agent` · repo `marketing`

**Classification:** feature · severity major · priority P1

## Problem statement

Product gap: Content gap: Statistikk, rapportering og bruksdata. Ledere og administratorer trenger rapporter og statistikk over bruk av kommunale lokaler for ressursplanlegging og optimalisering. Current assessment: gap (feature, major).

## Scope

Create or expand content covering "Statistikk, rapportering og bruksdata" aligned with Ledere og administratorer trenger rapporter og statistikk over bruk av kommunale lokaler for ressursplanlegging og optimalisering.

## Out of scope

Changes outside the target repository for this issue. Unrelated refactors, drive-by fixes, or direct merges to main. Scope creep beyond the stated feature or improvement goal.

## Acceptance criteria

- [ ] Create or expand content covering "Statistikk, rapportering og bruksdata" aligned with Ledere og administratorer trenger rapporter og statistikk over bruk av kommunale lokaler for ressursplanlegging og optimalisering.
- [ ] All relevant tests and build pass (green CI).
- [ ] No regression in existing user-facing behaviour.

## Code analysis (evidence, marketing @ seo-run)

Status: **gap** (confidence 95%)

* (no direct code hits; see details)

## Source

Product idea (cluster:statistikk rapport bruk kommunale lokaler), from search demand

## Run as Claude loop (in `/root/booking-brilliance`, on a new branch)

```
/loop Write and publish SEO content for "Statistikk, rapportering og bruksdata". Cover Ledere og administratorer trenger rapporter og statistikk over bruk av kommunale lokaler for ressursplanlegging og optimalisering.. Goal: satisfy search intent for "statistikk" on digilist.no. The blog post itself must be in Norwegian Bokmål.
```

---

*Auto-generated by Digilist Improvements Agent (Linear specialist) from cluster:statistikk rapport bruk kommunale lokaler + code analysis (graph @ seo-run). Move to the approval state to prepare an implementation branch.*

</details>

Linear: https://linear.app/xala-technologies/issue/XAL-555/content-gap-statistikk-rapportering-og-bruksdata
