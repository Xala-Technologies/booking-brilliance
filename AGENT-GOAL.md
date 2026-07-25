# XAL-559: Content gap: Brukerstøtte, veiledning og feilsøking

> Auto-prepared by Digilist Improvements Agent. Run Claude in this worktree:
> `/loop Write and publish SEO content for "Brukerstøtte, veiledning og feilsøking". Cover Sluttbrukere søker hjelp til grunnleggende bruksscenarier som endring av tider, feilsøking, avbestilling og deling av bookinger.. Goal: satisfy search intent for "brukerstøtte" on digilist.no. The blog post itself must be in Norwegian Bokmål.`

## Implementation contract — complete this before writing code
- **Problem:** Write and publish SEO content for "Brukerstøtte, veiledning og feilsøking". Cover Sluttbrukere søker hjelp til grunnleggende bruksscenarier som endring av tider, feilsøking, avbestilling og deling av bookinger.. Goal: satisfy search intent for "brukerstøtte" on digilist.no. The blog post itself must be in Norwegian Bokmål.
- **Business objective:** _why this matters (from the Linear issue)_
- **Repository / branch:** `/root/booking-brilliance` @ `agent/xal-559-content-gap-brukerstotte-veiledning-og-feilsokin`
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
- One issue → one branch (`agent/xal-559-content-gap-brukerstotte-veiledning-og-feilsokin`) → one independently reviewable change. Never main.
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

Innholdsgap på markedssidene: det finnes ikke (ifølge kodeanalysen, gap med 89 % konfidens, ingen direkte kodetreff) innhold om «Brukerstøtte, veiledning og feilsøking». Sluttbrukere søker angivelig hjelp til grunnleggende bruksscenarier — endring av tider, feilsøking, avbestilling og deling av bookinger — og det finnes søkeetterspørsel etter «brukerstøtte» på [digilist.no](<http://digilist.no>) (kilde: produktidé fra cluster «steg for steg guide booking møterom»).

## Scope

**Innenfor:**

* Opprette eller utvide innhold som dekker «Brukerstøtte, veiledning og feilsøking» på markedssidene ([digilist.no](<http://digilist.no>))
* Dekke de fire nevnte bruksscenariene: endring av tider, feilsøking, avbestilling og deling av bookinger
* Innholdet skrives på norsk bokmål
* Rette innholdet mot søkeintensjonen for «brukerstøtte»

**Utenfor:**

* Endringer utenfor markedsrepoet (marketing / booking-brilliance)
* Urelaterte refaktoreringer eller drive-by-fikser
* Direkte merge til main
* Scope creep utover det uttalte innholdsmålet
* Endringer i selve produktets/appens funksjonalitet (kun innhold, ikke faktisk brukerstøtte-funksjon)

## Acceptance Criteria

- [ ] Det finnes publisert innhold på [digilist.no](<http://digilist.no>) som eksplisitt dekker alle fire scenariene: endring av tider, feilsøking, avbestilling og deling av bookinger
- [ ] Innholdet er skrevet på norsk bokmål
- [ ] Innholdet er rettet mot søkeordet «brukerstøtte» (fremgår av tittel/overskrift/meta)
- [ ] All relevant test og bygg passerer (grønn CI)
- [ ] Ingen regresjon i eksisterende brukervendt oppførsel

## Testing Scenario

* Gitt at innholdet er publisert, når en leser åpner den nye/utvidede siden, så finner de en seksjon for hver av de fire scenariene (endring av tider, feilsøking, avbestilling, deling av bookinger)
* Gitt at CI kjøres på grenen, når bygg og tester kjøres, så er alt grønt
* Gitt eksisterende markedssider, når den nye siden er lagt til, så fungerer eksisterende sider og navigasjon uendret (ingen regresjon)

## Verdi: unknown — ingen prioritet satt; et menneske vurderer verdien

unknown fordi issuet kun oppgir «fra søkeetterspørsel» og en kodeanalyse-gap på 89 % som begrunnelse — ingen konkrete søkevolumtall, ingen navngitte blokkerte brukere, ingen inntekt eller forpliktelse — så verdien er ikke dokumentert og må vurderes av et menneske.

## Målrepo: `marketing`

*Valgt av triage fra sakens innhold; ruter forberedelsen dit.*

## Åpne spørsmål

* Hvilket søkevolum/hvilke konkrete søkeord underbygger etterspørselen etter «brukerstøtte»? (issuet oppgir ingen tall)
* Gjelder «Sluttbrukere» offentlig/kommune-markedet, privat/utleie-markedet, eller begge?
* Skal dette være én ny artikkel/guide eller utvidelse av eksisterende sider — og finnes det allerede relatert innhold å bygge på?
* Hva er målformatet (blogg, hjelpesenter, FAQ) og hvor på [digilist.no](<http://digilist.no>) skal det ligge?
* Hvordan måles «tilfredsstilt søkeintensjon» — finnes et rangerings- eller trafikkmål å verifisere mot?

---

*Strukturert av triage-agenten. Originalteksten er bevart under.*

<details><summary>Opprinnelig beskrivelse</summary>

**SEO route:** content → `content-agent` · repo `marketing`

**Classification:** feature · severity minor · priority P2

## Problem statement

Product gap: Content gap: Brukerstøtte, veiledning og feilsøking. Sluttbrukere søker hjelp til grunnleggende bruksscenarier som endring av tider, feilsøking, avbestilling og deling av bookinger. Current assessment: gap (feature, minor).

## Scope

Create or expand content covering "Brukerstøtte, veiledning og feilsøking" aligned with Sluttbrukere søker hjelp til grunnleggende bruksscenarier som endring av tider, feilsøking, avbestilling og deling av bookinger.

## Out of scope

Changes outside the target repository for this issue. Unrelated refactors, drive-by fixes, or direct merges to main. Scope creep beyond the stated feature or improvement goal.

## Acceptance criteria

- [ ] Create or expand content covering "Brukerstøtte, veiledning og feilsøking" aligned with Sluttbrukere søker hjelp til grunnleggende bruksscenarier som endring av tider, feilsøking, avbestilling og deling av bookinger.
- [ ] All relevant tests and build pass (green CI).
- [ ] No regression in existing user-facing behaviour.

## Code analysis (evidence, marketing @ seo-run)

Status: **gap** (confidence 89%)

* (no direct code hits; see details)

## Source

Product idea (cluster:steg for steg guide booking møterom), from search demand

## Run as Claude loop (in `/root/booking-brilliance`, on a new branch)

```
/loop Write and publish SEO content for "Brukerstøtte, veiledning og feilsøking". Cover Sluttbrukere søker hjelp til grunnleggende bruksscenarier som endring av tider, feilsøking, avbestilling og deling av bookinger.. Goal: satisfy search intent for "brukerstøtte" on digilist.no. The blog post itself must be in Norwegian Bokmål.
```

---

*Auto-generated by Digilist Improvements Agent (Linear specialist) from cluster:steg for steg guide booking møterom + code analysis (graph @ seo-run). Move to the approval state to prepare an implementation branch.*

</details>

Linear: https://linear.app/xala-technologies/issue/XAL-559/content-gap-brukerstotte-veiledning-og-feilsoking
