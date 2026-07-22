# XAL-316: LCP 3.63s (trenger forbedring — mål <2,5s) (cwv.lcp)

> Auto-prepared by Digilist Improvements Agent. Run Claude in this worktree:
> `/loop Reduser Largest Contentful Paint (LCP) på marketing-forsiden digilist.no fra 3,63s til under 2,5s.

Kontekst: LCP er målt til 3,63s på https://digilist.no. Repoet er marketing (React). Navnesøk på norske ord ga ingen treff fordi funnet er en Core Web Vitals-måling, ikke en kodesymbol.

Gjør følgende:
1. Kjør Lighthouse eller PageSpeed lokalt mot forsiden og identifiser hvilket element som er LCP (sannsynligvis hero-bilde eller hovedoverskrift). Dokumenter funnet.
2. Hvis LCP er et bilde: legg til fetchpriority="high" og preload i document head, server bildet i moderne format (WebP eller AVIF) med responsive srcset og korrekt intrinsic width/height for å unngå layout shift. Fjern lazy-loading på LCP-bildet.
3. Reduser render-blocking ressurser: inline kritisk CSS for above-the-fold, utsett ikke-kritisk CSS og JavaScript med defer/async, og fjern ubrukte web fonts eller bruk font-display: swap med preload av kritisk font.
4. Verifiser at tredjeparts-skript (analytics, chat osv) lastes etter interaksjon eller med lav prioritet slik at de ikke blokkerer hovedtråden.

Akseptansekriterier:
- Ny Lighthouse-måling (mobil, throttlet) viser LCP under 2,5s på forsiden.
- Ingen ny Cumulative Layout Shift-regresjon (CLS forblir under 0,1).
- Eksisterende tester og lint er grønne.
- Endringene er dokumentert i PR med før/etter Lighthouse-tall.

Kjør build og alle tester grønt før du åpner PR.`

## Implementation contract — complete this before writing code
- **Problem:** Reduser Largest Contentful Paint (LCP) på marketing-forsiden digilist.no fra 3,63s til under 2,5s.

Kontekst: LCP er målt til 3,63s på https://digilist.no. Repoet er marketing (React). Navnesøk på norske ord ga ingen treff fordi funnet er en Core Web Vitals-måling, ikke en kodesymbol.

Gjør følgende:
1. Kjør Lighthouse eller PageSpeed lokalt mot forsiden og identifiser hvilket element som er LCP (sannsynligvis hero-bilde eller hovedoverskrift). Dokumenter funnet.
2. Hvis LCP er et bilde: legg til fetchpriority="high" og preload i document head, server bildet i moderne format (WebP eller AVIF) med responsive srcset og korrekt intrinsic width/height for å unngå layout shift. Fjern lazy-loading på LCP-bildet.
3. Reduser render-blocking ressurser: inline kritisk CSS for above-the-fold, utsett ikke-kritisk CSS og JavaScript med defer/async, og fjern ubrukte web fonts eller bruk font-display: swap med preload av kritisk font.
4. Verifiser at tredjeparts-skript (analytics, chat osv) lastes etter interaksjon eller med lav prioritet slik at de ikke blokkerer hovedtråden.

Akseptansekriterier:
- Ny Lighthouse-måling (mobil, throttlet) viser LCP under 2,5s på forsiden.
- Ingen ny Cumulative Layout Shift-regresjon (CLS forblir under 0,1).
- Eksisterende tester og lint er grønne.
- Endringene er dokumentert i PR med før/etter Lighthouse-tall.

Kjør build og alle tester grønt før du åpner PR.
- **Business objective:** _why this matters (from the Linear issue)_
- **Repository / branch:** `/root/booking-brilliance` @ `agent/xal-316-lcp-3-63s-trenger-forbedring-mal-2-5s-cwv-lcp`
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
- One issue → one branch (`agent/xal-316-lcp-3-63s-trenger-forbedring-mal-2-5s-cwv-lcp`) → one independently reviewable change. Never main.
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

En automatisk skann-måling (performance/warn) rapporterer Largest Contentful Paint (LCP) på 3,63s på marketing-forsiden [digilist.no](<http://digilist.no>), over Core Web Vitals-målet på <2,5s. Kodeanalysen (marketing-repo, React, @7142d7e8) markerer funnet som fixable med 70 % konfidens. Saken ber om å optimalisere LCP på forsiden ned under 2,5s.

## Scope

**Innenfor:**

* Marketing-forsiden (forsiden på [digilist.no](<http://digilist.no>)) i marketing-repoet (React)
* Identifisere LCP-elementet på forsiden og redusere LCP fra 3,63s til under 2,5s

**Utenfor:**

* Andre sider enn forsiden — saken nevner kun forsiden
* Booking-appen / andre repoer — kun marketing-repoet er navngitt
* Andre Core Web Vitals enn en regresjonssjekk på CLS

## Acceptance Criteria

- [ ] En ny Lighthouse-måling (mobil, throttlet) på forsiden viser LCP under 2,5s
- [ ] Cumulative Layout Shift (CLS) på forsiden forblir under 0,1 (ingen ny regresjon)
- [ ] Eksisterende tester, bygg og lint er grønne
- [ ] Ingen regresjon i eksisterende funksjonalitet
- [ ] Før/etter Lighthouse-tall er dokumentert i PR

## Testing Scenario

* Gitt marketing-forsiden på [digilist.no](<http://digilist.no>), når den måles med Lighthouse i mobil throttlet modus, så er LCP under 2,5s.
* Gitt samme Lighthouse-måling av forsiden, når resultatet leses av, så er CLS under 0,1.
* Gitt marketing-repoet, når tester, bygg og lint kjøres, så er alt grønt.
* Gitt forsiden før og etter endringen, når Lighthouse-tall sammenlignes, så viser PR-en både før- og etter-verdier for LCP.

## Verdi: unknown — ingen prioritet satt; et menneske vurderer verdien

*Ingen begrunnelse oppgitt.*

## Åpne spørsmål

* Under hvilke betingelser (enhet, nettverks-throttling, lab vs. feltdata/CrUX) ble 3,63s målt? Selve funnet oppgir det ikke; loop-prompten antar mobil throttlet Lighthouse — er det den autoritative målemetoden?
* Hvilket element ER faktisk LCP på forsiden? Saken gjetter «typisk hero-bilde eller overskrift» med 70 % konfidens, men vet det ikke — dette må måles før tiltak velges.
* Hvem er berørt, og finnes det belegg for bruker- eller forretningskonsekvens (konvertering, avvist trafikk, forpliktelse)? Saken oppgir ingen — kun en automatisk skanner flagget den. Uten dette forblir verdien unknown.
* Er 3,63s stabilt reproduserbart, eller en enkeltmåling? En terskel-nær måling (3,63s vs. 4,0s-grensen) kan variere mellom kjøringer.

---

*Strukturert av triage-agenten. Originalteksten er bevart under.*

<details><summary>Opprinnelig beskrivelse</summary>

## Mål

Optimaliser Largest Contentful Paint på marketing-forsiden: identifiser LCP-elementet (typisk hero-bilde eller overskrift), preload kritiske ressurser, konverter til moderne bildeformat med korrekt størrelse, legg til fetchpriority=high på LCP-bilde, utsett ikke-kritisk JS/CSS og reduser render-blocking ressurser.

## Kilde

Skann-funn: performance/warn — [https://digilist.no](<https://digilist.no>)

## Kodeanalyse (bevis, marketing @ 7142d7e8)

Status: **fixable** (konfidens 70 %)

* `marketing (digilist.no)` — LCP 3.63s målt på forsiden, mål under 2,5s

## Akseptansekriterier

- [ ] Optimaliser Largest Contentful Paint på marketing-forsiden: identifiser LCP-elementet (typisk hero-bilde eller overskrift), preload kritiske ressurser, konverter til moderne bildeformat med korrekt størrelse, legg til fetchpriority=high på LCP-bilde, utsett ikke-kritisk JS/CSS og reduser render-blocking ressurser.
- [ ] Tester og bygg grønne
- [ ] Ingen regresjon i eksisterende funksjonalitet

## Kjør som Claude-loop (i `/Volumes/Laravel/Loveable/booking-brilliance`, på en ny branch)

```
/loop Reduser Largest Contentful Paint (LCP) på marketing-forsiden digilist.no fra 3,63s til under 2,5s.

Kontekst: LCP er målt til 3,63s på https://digilist.no. Repoet er marketing (React). Navnesøk på norske ord ga ingen treff fordi funnet er en Core Web Vitals-måling, ikke en kodesymbol.

Gjør følgende:
1. Kjør Lighthouse eller PageSpeed lokalt mot forsiden og identifiser hvilket element som er LCP (sannsynligvis hero-bilde eller hovedoverskrift). Dokumenter funnet.
2. Hvis LCP er et bilde: legg til fetchpriority="high" og preload i document head, server bildet i moderne format (WebP eller AVIF) med responsive srcset og korrekt intrinsic width/height for å unngå layout shift. Fjern lazy-loading på LCP-bildet.
3. Reduser render-blocking ressurser: inline kritisk CSS for above-the-fold, utsett ikke-kritisk CSS og JavaScript med defer/async, og fjern ubrukte web fonts eller bruk font-display: swap med preload av kritisk font.
4. Verifiser at tredjeparts-skript (analytics, chat osv) lastes etter interaksjon eller med lav prioritet slik at de ikke blokkerer hovedtråden.

Akseptansekriterier:
- Ny Lighthouse-måling (mobil, throttlet) viser LCP under 2,5s på forsiden.
- Ingen ny Cumulative Layout Shift-regresjon (CLS forblir under 0,1).
- Eksisterende tester og lint er grønne.
- Endringene er dokumentert i PR med før/etter Lighthouse-tall.

Kjør build og alle tester grønt før du åpner PR.
```

---

*Auto-generert av Digilist Improvements Agent fra performance/cwv.lcp@marketing + kodeanalyse (graf @ 7142d7e8). Flytt til godkjenningstilstand for å klargjøre en implementasjons-branch.*

</details>

Linear: https://linear.app/xala-technologies/issue/XAL-316/lcp-363s-trenger-forbedring-mal-25s-cwvlcp
