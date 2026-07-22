# XAL-317: CLS 0.170 (trenger forbedring — mål <0,1) (cwv.cls)

> Auto-prepared by Digilist Improvements Agent. Run Claude in this worktree:
> `/loop I repoet marketing (Digilist landingsside digilist.no) har forsiden CLS på 0,170 som er over målet 0,1. Målet er å redusere Cumulative Layout Shift til under 0,1.

Gjør følgende:
1. Kjør Lighthouse eller mål CLS lokalt på forsiden for å finne hvilke elementer som forskyver layout.
2. For alle bilder og media (img, video, iframe, embeds) på forsiden: sett eksplisitt width og height eller aspect-ratio slik at nettleseren reserverer plass før innlasting.
3. For webfonter: bruk font-display: optional eller swap kombinert med size-adjust/ascent-override slik at fallback-font matcher målfonten og unngår reflow når fonten lastes.
4. For innhold som lastes asynkront (bannere, dynamiske seksjoner, cookie-samtykke, hero-elementer): reserver fast høyde/min-height eller skeleton-plassholder slik at innsetting ikke dytter innhold nedover.
5. Unngå innsetting av elementer over eksisterende innhold uten reservert plass.

Akseptansekriterier:
- CLS på https://digilist.no er under 0,1 målt med Lighthouse (mobil og desktop).
- Ingen visuelle regresjoner på forsiden.
- Alle eksisterende tester og lint kjører grønt før PR opprettes.

Dokumenter hvilke elementer som forårsaket forskyvningen og hvilke endringer som ble gjort i PR-beskrivelsen.`

## Implementation contract — complete this before writing code
- **Problem:** I repoet marketing (Digilist landingsside digilist.no) har forsiden CLS på 0,170 som er over målet 0,1. Målet er å redusere Cumulative Layout Shift til under 0,1.

Gjør følgende:
1. Kjør Lighthouse eller mål CLS lokalt på forsiden for å finne hvilke elementer som forskyver layout.
2. For alle bilder og media (img, video, iframe, embeds) på forsiden: sett eksplisitt width og height eller aspect-ratio slik at nettleseren reserverer plass før innlasting.
3. For webfonter: bruk font-display: optional eller swap kombinert med size-adjust/ascent-override slik at fallback-font matcher målfonten og unngår reflow når fonten lastes.
4. For innhold som lastes asynkront (bannere, dynamiske seksjoner, cookie-samtykke, hero-elementer): reserver fast høyde/min-height eller skeleton-plassholder slik at innsetting ikke dytter innhold nedover.
5. Unngå innsetting av elementer over eksisterende innhold uten reservert plass.

Akseptansekriterier:
- CLS på https://digilist.no er under 0,1 målt med Lighthouse (mobil og desktop).
- Ingen visuelle regresjoner på forsiden.
- Alle eksisterende tester og lint kjører grønt før PR opprettes.

Dokumenter hvilke elementer som forårsaket forskyvningen og hvilke endringer som ble gjort i PR-beskrivelsen.
- **Business objective:** _why this matters (from the Linear issue)_
- **Repository / branch:** `/root/booking-brilliance` @ `agent/xal-317-cls-0-170-trenger-forbedring-mal-0-1-cwv-cls`
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
- One issue → one branch (`agent/xal-317-cls-0-170-trenger-forbedring-mal-0-1-cwv-cls`) → one independently reviewable change. Never main.
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

Forsiden på [digilist.no](<http://digilist.no>) (marketing-repoet) har en målt Cumulative Layout Shift (CLS) på 0,170, som er over målet på 0,1. Funnet kommer fra en skann (performance/warn) og en kodeanalyse merket «fixable» med 75 % konfidens. Saken oppgir ikke hvilke konkrete elementer som forårsaker forskyvningen.

## Scope

**Innenfor:**

* Forsiden (landingssiden) til [digilist.no](<http://digilist.no>) i marketing-repoet
* Redusere layout shift ved å reservere plass for media (bilder/video/iframe/embeds) med eksplisitt width/height eller aspect-ratio
* Bruke font-display med size-adjust/ascent-override slik at fallback-font matcher målfonten og unngår tekstforskyvning
* Reservere plass (fast høyde/min-height eller skjelett-plassholder) for innhold som lastes etter første render (bannere, dynamiske seksjoner, cookie-samtykke, hero)

**Utenfor:**

* Andre sider enn forsiden — saken nevner kun forsiden
* Andre repoer enn marketing
* Andre ytelsesmetrikker enn CLS (saken gjelder kun cwv.cls)

## Acceptance Criteria

- [ ] CLS på [https://digilist.no](<https://digilist.no>) forside er under 0,1 målt med Lighthouse på både mobil og desktop
- [ ] Ingen visuelle regresjoner på forsiden
- [ ] Alle eksisterende tester og lint kjører grønt før PR opprettes
- [ ] PR-beskrivelsen dokumenterer hvilke elementer som forårsaket forskyvningen og hvilke endringer som ble gjort

## Testing Scenario

* Gitt at forsiden lastes på mobil, når CLS måles med Lighthouse, så er CLS < 0,1
* Gitt at forsiden lastes på desktop, når CLS måles med Lighthouse, så er CLS < 0,1
* Gitt et bilde/media på forsiden, når siden lastes før mediet er ferdig lastet, så er plassen allerede reservert og innholdet under forskyves ikke
* Gitt at en webfont lastes, når fallback-fonten byttes ut med målfonten, så forskyves ikke teksten merkbart
* Gitt asynkront innhold (banner/cookie-samtykke/dynamisk seksjon), når det settes inn i DOM, så dyttes ikke eksisterende innhold nedover

## Alvorlighetsgrad: minor

Valgt lavere av to grunner (regelen sier: er du i tvil, velg lavere og begrunn). Saken dokumenterer kun at metrikken 0,170 er over målet 0,1 — den ligger i «trenger forbedring»-sonen (0,1–0,25), ikke «dårlig» (>0,25). Forsiden fungerer; det finnes ikke belegg i saken for konkret brukerskade (f.eks. feilklikk) utover selve tallet. Ikke datatap, ikke sikkerhet/GDPR, ikke en kjerneflyt som er brutt. Passer «fungerer, men uheldig».

## Åpne spørsmål

* Hvilke konkrete elementer på forsiden forårsaker forskyvningen? Saken ber om å kjøre Lighthouse for å finne det ut — det er ikke fastslått ennå.
* Ble de 0,170 målt på mobil, desktop eller begge? Funn-linjen oppgir ikke hvilken.
* Stammer forskyvningen primært fra media, fonter eller dynamisk innhold? Kodeanalysens 75 %-konfidens sier ikke hvilken av de tre kildene som dominerer.

---

*Strukturert av triage-agenten. Originalteksten er bevart under.*

<details><summary>Opprinnelig beskrivelse</summary>

## Mål

Reduser layout shift på forsiden ved å reservere plass for bilder/annonser/fonter: sett eksplisitte width/height eller aspect-ratio på media, bruk font-display med size-adjust for å unngå tekstforskyvning, og reserver plass for dynamisk innhold som lastes etter første render.

## Kilde

Skann-funn: performance/warn — [https://digilist.no](<https://digilist.no>)

## Kodeanalyse (bevis, marketing @ 7142d7e8)

Status: **fixable** (konfidens 75 %)

* `marketing (digilist.no)` — CLS 0.170 målt på forsiden, over målet på 0,1

## Akseptansekriterier

- [ ] Reduser layout shift på forsiden ved å reservere plass for bilder/annonser/fonter: sett eksplisitte width/height eller aspect-ratio på media, bruk font-display med size-adjust for å unngå tekstforskyvning, og reserver plass for dynamisk innhold som lastes etter første render.
- [ ] Tester og bygg grønne
- [ ] Ingen regresjon i eksisterende funksjonalitet

## Kjør som Claude-loop (i `/Volumes/Laravel/Loveable/booking-brilliance`, på en ny branch)

```
/loop I repoet marketing (Digilist landingsside digilist.no) har forsiden CLS på 0,170 som er over målet 0,1. Målet er å redusere Cumulative Layout Shift til under 0,1.

Gjør følgende:
1. Kjør Lighthouse eller mål CLS lokalt på forsiden for å finne hvilke elementer som forskyver layout.
2. For alle bilder og media (img, video, iframe, embeds) på forsiden: sett eksplisitt width og height eller aspect-ratio slik at nettleseren reserverer plass før innlasting.
3. For webfonter: bruk font-display: optional eller swap kombinert med size-adjust/ascent-override slik at fallback-font matcher målfonten og unngår reflow når fonten lastes.
4. For innhold som lastes asynkront (bannere, dynamiske seksjoner, cookie-samtykke, hero-elementer): reserver fast høyde/min-height eller skeleton-plassholder slik at innsetting ikke dytter innhold nedover.
5. Unngå innsetting av elementer over eksisterende innhold uten reservert plass.

Akseptansekriterier:
- CLS på https://digilist.no er under 0,1 målt med Lighthouse (mobil og desktop).
- Ingen visuelle regresjoner på forsiden.
- Alle eksisterende tester og lint kjører grønt før PR opprettes.

Dokumenter hvilke elementer som forårsaket forskyvningen og hvilke endringer som ble gjort i PR-beskrivelsen.
```

---

*Auto-generert av Digilist Improvements Agent fra performance/cwv.cls@marketing + kodeanalyse (graf @ 7142d7e8). Flytt til godkjenningstilstand for å klargjøre en implementasjons-branch.*

</details>

Linear: https://linear.app/xala-technologies/issue/XAL-317/cls-0170-trenger-forbedring-mal-01-cwvcls
