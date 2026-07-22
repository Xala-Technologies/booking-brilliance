# XAL-318: Lighthouse Ytelse-score 74/100 (mål ≥90). (lighthouse.performance)

> Auto-prepared by Digilist Improvements Agent. Run Claude in this worktree:
> `/loop Forbedre Lighthouse ytelse-score for marketing-nettstedet (digilist.no) fra 74 til minst 90. Repo: marketing (React).

Kontekst: Lighthouse-skann rapporterer ytelse-score 74/100 på https://digilist.no, mål er minst 90. Det finnes ingen ytelseskonfig i koden ennå.

Oppgaver:
1. Kjør en lokal produksjonsbuild og analyser bundle-størrelse (f.eks. med source-map-explorer eller vite/rollup-visualizer). Identifiser største JS og CSS chunks.
2. Innfør code-splitting og lazy import (React.lazy + Suspense) for tunge sider og komponenter, spesielt admin-sider som src/pages/admin/IntelligenceOverview.tsx og src/pages/admin/IntelligenceCategory.tsx som ikke trengs på landingssiden.
3. Optimaliser bilder: konverter til WebP eller AVIF, angi eksplisitt width og height for å unngå layout shift (CLS), og legg til loading=lazy på bilder under folden.
4. Preload eller preconnect kritiske ressurser og fonter, og bruk font-display swap.
5. Fjern eller utsett ubrukt og render-blokkerende JavaScript og CSS, inkludert tredjepartsskript.
6. Sørg for riktig caching-headere for statiske assets der det styres fra repoet.

Aksept:
- Lighthouse ytelse-score for https://digilist.no (eller lokal produksjonsbuild) er minst 90 i mobil-profil.
- Largest Contentful Paint, Total Blocking Time og Cumulative Layout Shift er innenfor Lighthouse grønne terskler.
- Ingen funksjonell regresjon på eksisterende sider (Transparens og admin-sider fungerer som før).
- Alle eksisterende tester er grønne, og linting passerer.

Lever som PR med kort beskrivelse av tiltakene og før/etter Lighthouse-score.`

## Implementation contract — complete this before writing code
- **Problem:** Forbedre Lighthouse ytelse-score for marketing-nettstedet (digilist.no) fra 74 til minst 90. Repo: marketing (React).

Kontekst: Lighthouse-skann rapporterer ytelse-score 74/100 på https://digilist.no, mål er minst 90. Det finnes ingen ytelseskonfig i koden ennå.

Oppgaver:
1. Kjør en lokal produksjonsbuild og analyser bundle-størrelse (f.eks. med source-map-explorer eller vite/rollup-visualizer). Identifiser største JS og CSS chunks.
2. Innfør code-splitting og lazy import (React.lazy + Suspense) for tunge sider og komponenter, spesielt admin-sider som src/pages/admin/IntelligenceOverview.tsx og src/pages/admin/IntelligenceCategory.tsx som ikke trengs på landingssiden.
3. Optimaliser bilder: konverter til WebP eller AVIF, angi eksplisitt width og height for å unngå layout shift (CLS), og legg til loading=lazy på bilder under folden.
4. Preload eller preconnect kritiske ressurser og fonter, og bruk font-display swap.
5. Fjern eller utsett ubrukt og render-blokkerende JavaScript og CSS, inkludert tredjepartsskript.
6. Sørg for riktig caching-headere for statiske assets der det styres fra repoet.

Aksept:
- Lighthouse ytelse-score for https://digilist.no (eller lokal produksjonsbuild) er minst 90 i mobil-profil.
- Largest Contentful Paint, Total Blocking Time og Cumulative Layout Shift er innenfor Lighthouse grønne terskler.
- Ingen funksjonell regresjon på eksisterende sider (Transparens og admin-sider fungerer som før).
- Alle eksisterende tester er grønne, og linting passerer.

Lever som PR med kort beskrivelse av tiltakene og før/etter Lighthouse-score.
- **Business objective:** _why this matters (from the Linear issue)_
- **Repository / branch:** `/root/booking-brilliance` @ `agent/xal-318-lighthouse-ytelse-score-74-100-mal-90-lighthouse`
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
- One issue → one branch (`agent/xal-318-lighthouse-ytelse-score-74-100-mal-90-lighthouse`) → one independently reviewable change. Never main.
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

Marketing-nettstedet [digilist.no](<http://digilist.no>) har Lighthouse ytelse-score 74/100, mens målet er minst 90. Saken ber om ytelsesoptimalisering av marketing-nettstedet slik at scoren kommer over 90. Saken er auto-generert fra et skann-funn (performance/warn på [https://digilist.no](<https://digilist.no>)) med kodeanalyse mot repoet «marketing @ 7142d7e8», status «fixable» (konfidens 75 %). Kodeanalysen fant ingen direkte ytelseskonfig i koden.

## Scope

**Innenfor:**

* Lazy-loade og komprimere bilder; bruke moderne formater (WebP/AVIF) med eksplisitt width/height for å unngå layout shift; loading=lazy på bilder under folden
* Code-splitting og lazy import (React.lazy + Suspense) av tunge komponenter/ruter
* Redusere ubrukt JavaScript og CSS
* Sette opp riktig caching-headere for statiske assets der det styres fra repoet
* Preload/preconnect av kritiske ressurser og fonter; font-display swap
* Utsette eller fjerne render-blokkerende og tredjepartsskript
* Verifisere resultatet mot Lighthouse-målet før PR

**Utenfor:**

* Ytelse i selve booking-applikasjonen / backend — saken gjelder kun marketing-nettstedet ([digilist.no](<http://digilist.no>))
* Endringer i infrastruktur/CDN utenfor det som styres fra repoet (saken sier «der det styres fra repoet»)

## Acceptance Criteria

- [ ] Lighthouse ytelse-score for [https://digilist.no](<https://digilist.no>) (eller en lokal produksjonsbuild) er minst 90
- [ ] Largest Contentful Paint (LCP), Total Blocking Time (TBT) og Cumulative Layout Shift (CLS) er innenfor Lighthouse sine grønne terskler
- [ ] Ingen funksjonell regresjon på eksisterende sider (bl.a. Transparens)
- [ ] Alle eksisterende tester og bygg er grønne
- [ ] Linting passerer
- [ ] PR inneholder kort beskrivelse av tiltakene og før/etter Lighthouse-score

## Testing Scenario

* Gitt en produksjonsbuild av marketing-nettstedet, når Lighthouse kjøres, så er ytelse-scoren minst 90.
* Gitt en Lighthouse-kjøring på nettstedet, når rapporten leses, så er LCP, TBT og CLS alle innenfor grønn terskel.
* Gitt de eksisterende sidene (f.eks. Transparens), når de åpnes etter optimaliseringen, så vises og fungerer de som før uten synlig regresjon.
* Gitt at code-splitting/lazy import er innført, når en tung rute lastes, så lastes den etterspurte chunken uten at siden bryter sammen.
* Gitt kildekoden, når test- og lint-kommandoer kjøres i CI, så passerer alle.

## Verdi: unknown — ingen prioritet satt; et menneske vurderer verdien

*Ingen begrunnelse oppgitt.*

## Åpne spørsmål

* Hvilket repo/sti er autoritativt? Kodeanalysen gjelder «marketing @ 7142d7e8» og fant kun Transparens.tsx, mens loop-prompten peker på en annen sti (/Volumes/Laravel/Loveable/booking-brilliance) og admin-sider (IntelligenceOverview.tsx, IntelligenceCategory.tsx). Er admin-sidene faktisk del av marketing-nettstedet?
* Skal målet ≥90 måles i mobil- eller desktop-profil? Loop-prompten sier mobil; hoveddelen av saken spesifiserer ikke profil.
* Hva er de faktiske ytelsesflaskehalsene? Saken lister generiske «vanlige tiltak», men gir ingen målt fordeling av hva som er tregt (største JS/CSS-chunks, konkrete bilder).
* Hva er verdien / prioriteten? Saken oppgir ingen navngitte brukere som er blokkert, ingen inntekt eller forpliktelse — hva gjør denne scoren viktig nok til å prioriteres?
* Skal scoren måles mot live [https://digilist.no](<https://digilist.no>) eller mot en lokal produksjonsbuild? Aksept nevner begge som alternativ.

---

*Strukturert av triage-agenten. Originalteksten er bevart under.*

<details><summary>Opprinnelig beskrivelse</summary>

## Mål

Optimaliser ytelsen på marketing-nettstedet slik at Lighthouse-score kommer over 90. Vanlige tiltak: lazy-loade og komprimere bilder (bruk moderne formater som WebP/AVIF med width/height for å unngå layout shift), code-splitting og lazy import av tunge komponenter/ruter, redusere ubrukt JavaScript og CSS, sette opp riktig caching og preload av kritiske ressurser, og utsette tredjepartsskript. Verifiser mot Lighthouse-mål før PR.

## Kilde

Skann-funn: performance/warn — [https://digilist.no](<https://digilist.no>)

## Kodeanalyse (bevis, marketing @ 7142d7e8)

Status: **fixable** (konfidens 75 %)

* `marketing repo (digilist.no)` — Marketing-nettsted med Lighthouse ytelse-score 74/100 under mål 90
* `src/pages/Transparens.tsx` — eksisterende sider som kan optimaliseres, men ingen direkte ytelseskonfig funnet

## Akseptansekriterier

- [ ] Optimaliser ytelsen på marketing-nettstedet slik at Lighthouse-score kommer over 90. Vanlige tiltak: lazy-loade og komprimere bilder (bruk moderne formater som WebP/AVIF med width/height for å unngå layout shift), code-splitting og lazy import av tunge komponenter/ruter, redusere ubrukt JavaScript og CSS, sette opp riktig caching og preload av kritiske ressurser, og utsette tredjepartsskript. Verifiser mot Lighthouse-mål før PR.
- [ ] Tester og bygg grønne
- [ ] Ingen regresjon i eksisterende funksjonalitet

## Kjør som Claude-loop (i `/Volumes/Laravel/Loveable/booking-brilliance`, på en ny branch)

```
/loop Forbedre Lighthouse ytelse-score for marketing-nettstedet (digilist.no) fra 74 til minst 90. Repo: marketing (React).

Kontekst: Lighthouse-skann rapporterer ytelse-score 74/100 på https://digilist.no, mål er minst 90. Det finnes ingen ytelseskonfig i koden ennå.

Oppgaver:
1. Kjør en lokal produksjonsbuild og analyser bundle-størrelse (f.eks. med source-map-explorer eller vite/rollup-visualizer). Identifiser største JS og CSS chunks.
2. Innfør code-splitting og lazy import (React.lazy + Suspense) for tunge sider og komponenter, spesielt admin-sider som src/pages/admin/IntelligenceOverview.tsx og src/pages/admin/IntelligenceCategory.tsx som ikke trengs på landingssiden.
3. Optimaliser bilder: konverter til WebP eller AVIF, angi eksplisitt width og height for å unngå layout shift (CLS), og legg til loading=lazy på bilder under folden.
4. Preload eller preconnect kritiske ressurs

Linear: https://linear.app/xala-technologies/issue/XAL-318/lighthouse-ytelse-score-74100-mal-90-lighthouseperformance
