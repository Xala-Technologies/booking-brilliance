# XAL-598: Content gap: Digitale søknadsskjemaer

> Auto-prepared by Digilist Improvements Agent. Run Claude in this worktree:
> `/loop Write and publish SEO content for "Digitale søknadsskjemaer". Cover Digitalisering av søknadsprosessen er aktivt søkt – kommuner reduserer papirflyt ved å tilby online skjemaer og strukturert godkjenningsgang.. Goal: satisfy search intent for "digitale" on digilist.no. The blog post itself must be in Norwegian Bokmål.`

## Implementation contract — complete this before writing code
- **Problem:** Write and publish SEO content for "Digitale søknadsskjemaer". Cover Digitalisering av søknadsprosessen er aktivt søkt – kommuner reduserer papirflyt ved å tilby online skjemaer og strukturert godkjenningsgang.. Goal: satisfy search intent for "digitale" on digilist.no. The blog post itself must be in Norwegian Bokmål.
- **Business objective:** _why this matters (from the Linear issue)_
- **Repository / branch:** `/root/booking-brilliance` @ `agent/xal-598-content-gap-digitale-soknadsskjemaer`
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
- One issue → one branch (`agent/xal-598-content-gap-digitale-soknadsskjemaer`) → one independently reviewable change. Never main.
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

SEO-innholdsgap: Digilist har ingen (eller utilstrekkelig) innhold som dekker søkeintensjonen «Digitale søknadsskjemaer». Ifølge issuet er digitalisering av søknadsprosessen aktivt søkt – kommuner vil redusere papirflyt ved å tilby online skjemaer og en strukturert godkjenningsgang. Klyngen «digitalt søknadsskjema for lokaler» er identifisert via søke-etterspørsel med 95 % tillit til at det er et gap (ingen direkte kodetreff). Målet er en norsk (bokmål) SEO-artikkel/innholdsside på [digilist.no](<http://digilist.no>) som fanger denne intensjonen.

## Scope

**Innenfor:**

* Opprette eller utvide innhold som dekker temaet «Digitale søknadsskjemaer» rettet mot kommuner som vil digitalisere søknads- og godkjenningsprosessen for lokaler
* Innholdet skrives på norsk bokmål
* Forankre innholdet i Digilists faktiske godkjenningsgang (saksbehandler-flyt: godkjenne/avvise/kommunisere) og kommune-booking som dokumentasjonen bekrefter finnes
* Målrette søkeintensjon rundt «digitale søknadsskjemaer» / «digitalt søknadsskjema for lokaler» på [digilist.no](<http://digilist.no>)

**Utenfor:**

* Endringer utenfor marketing-repoet (booking-brilliance)
* Bygging av faktisk skjema-/søknadsfunksjonalitet i produktet – dette er markedsinnhold, ikke en produktfeature
* Urelaterte refaktoreringer, drive-by-fikser eller direkte merge til main
* Scope-utvidelse utover det angitte innholdstemaet

## Acceptance Criteria

- [ ] Det finnes en publisert artikkel/innholdsside på norsk bokmål som dekker «Digitale søknadsskjemaer» for kommuner (digitalisering av søknads-/godkjenningsprosess, redusert papirflyt, strukturert godkjenningsgang)
- [ ] Innholdet refererer korrekt til Digilists faktiske godkjenningsgang og påstår ikke funksjonalitet produktet ikke har
- [ ] Alle relevante tester og bygg passerer (grønn CI)
- [ ] Ingen regresjon i eksisterende brukervendt oppførsel

## Testing Scenario

* Gitt at innholdet er publisert, Når en redaktør åpner siden på [digilist.no](<http://digilist.no>), Så vises en norsk-bokmål-artikkel om digitale søknadsskjemaer / digitalisering av søknadsprosessen for kommuner
* Gitt at en bruker søker på «digitale søknadsskjemaer» eller «digitalt søknadsskjema for lokaler», Når de treffer siden, Så adresserer innholdet søkeintensjonen (online skjema, redusert papirflyt, strukturert godkjenning)
* Gitt CI-pipeline for marketing-repoet, Når endringen kjøres, Så passerer alle tester og bygg grønt uten regresjon

## Verdi: unknown — ingen prioritet satt; et menneske vurderer verdien

Enhancement (innholdsgap), så ingen severity. Verdi satt til unknown: issuet påstår søke-etterspørsel («aktivt søkt», kilde «from search demand», klynge:digitalt søknadsskjema for lokaler) men gir ingen målbare bevis – ingen søkevolum, ingen trafikk-/konverteringstall, ingen navngitte kunder eller forpliktelser. Auto-generert av Improvements-agenten uten menneskelig verdivurdering, så verdien er ikke fastslått ennå.

## Målrepo: `marketing`

*Valgt av triage fra sakens innhold; ruter forberedelsen dit.*

## Åpne spørsmål

* Hva er faktisk søkevolum / keyword-data for «digitale søknadsskjemaer» og «digitalt søknadsskjema for lokaler» som begrunner prioriteten P1/major i issuet?
* Skal innholdet være et nytt blogginnlegg, en landingsside, eller utvidelse av eksisterende side – og hvor i informasjonsarkitekturen?
* Tilbyr Digilist et faktisk «digitalt søknadsskjema» som distinkt funksjon (utover booking-/godkjenningsflyten dokumentasjonen beskriver), eller skal innholdet ramme godkjenningsgangen som svaret på søkeintensjonen?
* Finnes det allerede overlappende innhold på [digilist.no](<http://digilist.no>) som bør utvides i stedet for å opprette nytt (for å unngå intern kannibalisering)?

---

*Strukturert av triage-agenten. Originalteksten er bevart under.*

<details><summary>Opprinnelig beskrivelse</summary>

**SEO route:** content → `content-agent` · repo `marketing`

**Classification:** feature · severity major · priority P1

## Problem statement

Product gap: Content gap: Digitale søknadsskjemaer. Digitalisering av søknadsprosessen er aktivt søkt – kommuner reduserer papirflyt ved å tilby online skjemaer og strukturert godkjenningsgang. Current assessment: gap (feature, major).

## Scope

Create or expand content covering "Digitale søknadsskjemaer" aligned with Digitalisering av søknadsprosessen er aktivt søkt – kommuner reduserer papirflyt ved å tilby online skjemaer og strukturert godkjenningsgang.

## Out of scope

Changes outside the target repository for this issue. Unrelated refactors, drive-by fixes, or direct merges to main. Scope creep beyond the stated feature or improvement goal.

## Acceptance criteria

- [ ] Create or expand content covering "Digitale søknadsskjemaer" aligned with Digitalisering av søknadsprosessen er aktivt søkt – kommuner reduserer papirflyt ved å tilby online skjemaer og strukturert godkjenningsgang.
- [ ] All relevant tests and build pass (green CI).
- [ ] No regression in existing user-facing behaviour.

## Code analysis (evidence, marketing @ seo-run)

Status: **gap** (confidence 95%)

* (no direct code hits; see details)

## Source

Product idea (cluster:digitalt søknadsskjema for lokaler), from search demand

## Run as Claude loop (in `/root/booking-brilliance`, on a new branch)

```
/loop Write and publish SEO content for "Digitale søknadsskjemaer". Cover Digitalisering av søknadsprosessen er aktivt søkt – kommuner reduserer papirflyt ved å tilby online skjemaer og strukturert godkjenningsgang.. Goal: satisfy search intent for "digitale" on digilist.no. The blog post itself must be in Norwegian Bokmål.
```

---

*Auto-generated by Digilist Improvements Agent (Linear specialist) from cluster:digitalt søknadsskjema for lokaler + code analysis (graph @ seo-run). Move to the approval state to prepare an implementation branch.*

</details>

Linear: https://linear.app/xala-technologies/issue/XAL-598/content-gap-digitale-soknadsskjemaer
