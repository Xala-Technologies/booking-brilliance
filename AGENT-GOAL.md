# XAL-319: LCP 3.57s (trenger forbedring — mål <2,5s) (cwv.lcp)

> Auto-prepared by Digilist Improvements Agent. Run Claude in this worktree:
> `/loop I marketing-repoet skal du forbedre Largest Contentful Paint (LCP) på statussiden som serveres på https://status.digilist.no. Nåværende LCP er 3.57s og målet er under 2,5s.

Gjør følgende:
1. Finn siden/komponenten som rendrer status.digilist.no i marketing-repo (søk etter status-route, status-side eller layout for statussiden). Identifiser LCP-elementet (typisk hero-overskrift, hero-bilde eller hovedbanner).
2. Hvis LCP-elementet er et bilde: konverter til moderne format (WebP/AVIF), sett eksplisitt width og height for å unngå layout shift, legg til fetchpriority="high" og en <link rel="preload"> for ressursen i dokumenthodet.
3. Utsett ikke-kritisk JavaScript (defer/async) og fjern render-blokkerende CSS ved å inline kritisk CSS eller laste resten asynkront.
4. Sørg for at statiske ressurser (bilder, fonter, CSS) serveres med langvarig cache-header og at fonter lastes med font-display: swap og preconnect til eventuelle eksterne domener.
5. Verifiser at ingen tunge tredjepartsskript blokkerer første rendering av statussiden.

Akseptansekriterier:
- LCP på statussiden måles til under 2,5s i Lighthouse/PageSpeed på mobil.
- LCP-elementet lastes med preload og fetchpriority="high".
- Ingen nye layout shifts (CLS holder seg lav).
- Eksisterende og eventuelle nye tester kjører grønt før PR opprettes.

Kjør /loop til alt er grønt og lag PR med kort oppsummering av tiltakene og målt LCP før og etter.`

## Implementation contract — complete this before writing code
- **Problem:** I marketing-repoet skal du forbedre Largest Contentful Paint (LCP) på statussiden som serveres på https://status.digilist.no. Nåværende LCP er 3.57s og målet er under 2,5s.

Gjør følgende:
1. Finn siden/komponenten som rendrer status.digilist.no i marketing-repo (søk etter status-route, status-side eller layout for statussiden). Identifiser LCP-elementet (typisk hero-overskrift, hero-bilde eller hovedbanner).
2. Hvis LCP-elementet er et bilde: konverter til moderne format (WebP/AVIF), sett eksplisitt width og height for å unngå layout shift, legg til fetchpriority="high" og en <link rel="preload"> for ressursen i dokumenthodet.
3. Utsett ikke-kritisk JavaScript (defer/async) og fjern render-blokkerende CSS ved å inline kritisk CSS eller laste resten asynkront.
4. Sørg for at statiske ressurser (bilder, fonter, CSS) serveres med langvarig cache-header og at fonter lastes med font-display: swap og preconnect til eventuelle eksterne domener.
5. Verifiser at ingen tunge tredjepartsskript blokkerer første rendering av statussiden.

Akseptansekriterier:
- LCP på statussiden måles til under 2,5s i Lighthouse/PageSpeed på mobil.
- LCP-elementet lastes med preload og fetchpriority="high".
- Ingen nye layout shifts (CLS holder seg lav).
- Eksisterende og eventuelle nye tester kjører grønt før PR opprettes.

Kjør /loop til alt er grønt og lag PR med kort oppsummering av tiltakene og målt LCP før og etter.
- **Business objective:** _why this matters (from the Linear issue)_
- **Repository / branch:** `/root/booking-brilliance` @ `agent/xal-319-lcp-3-57s-trenger-forbedring-mal-2-5s-cwv-lcp`
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
- One issue → one branch (`agent/xal-319-lcp-3-57s-trenger-forbedring-mal-2-5s-cwv-lcp`) → one independently reviewable change. Never main.
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

Statussiden som serveres på [status.digilist.no](<http://status.digilist.no>) (marketing-repo) har en målt LCP på 3,57s, over Core Web Vitals-målet på 2,5s. Kilden er et automatisk skann-funn klassifisert som performance/warn; kodeanalyse @7142d7e8 vurderer det som 'fixable' med 70 % konfidens. Målet er å redusere LCP ved å optimalisere det største synlige elementet (hero-bilde/tekst).

## Scope

**Innenfor:**

* Statussiden på [status.digilist.no](<http://status.digilist.no>) i marketing-repoet
* LCP-elementet på siden (det største synlige elementet — iflg. saken typisk hero-overskrift, hero-bilde eller hovedbanner)
* Preload av kritisk ressurs og fetchpriority="high" på LCP-elementet
* Eksplisitt width/height og moderne bildeformat (WebP/AVIF) hvis LCP-elementet er et bilde
* Utsettelse av ikke-kritisk JS/CSS og reduksjon av render-blokkerende ressurser
* Caching-headere for statisk innhold, font-display: swap og preconnect til eksterne domener

**Utenfor:**

* Andre sider enn statussiden
* Andre Core Web Vitals enn LCP, utover kravet om at CLS ikke skal forverres

## Acceptance Criteria

- [ ] LCP på statussiden måles til under 2,5s i Lighthouse/PageSpeed på mobil
- [ ] LCP-elementet lastes med <link rel="preload"> og fetchpriority="high"
- [ ] CLS forverres ikke (ingen nye layout shifts) sammenlignet med før endringen
- [ ] Eksisterende og eventuelle nye tester og bygg kjører grønt
- [ ] Ingen regresjon i eksisterende funksjonalitet på statussiden

## Testing Scenario

* Gitt statussiden på [status.digilist.no](<http://status.digilist.no>), når den måles i Lighthouse på mobil, så er LCP under 2,5s
* Gitt at statussiden lastes, når dokumenthodet inspiseres, så finnes en <link rel="preload"> for LCP-ressursen og LCP-elementet har fetchpriority="high"
* Gitt statussiden før og etter endringen, når CLS måles i samme oppsett, så er CLS etter ikke høyere enn før
* Gitt at LCP-elementet er et bilde, når kilden inspiseres, så har det eksplisitt width/height og serveres i WebP/AVIF

## Verdi: unknown — ingen prioritet satt; et menneske vurderer verdien

*Ingen begrunnelse oppgitt.*

## Åpne spørsmål

* Hvilket element er faktisk LCP-elementet på statussiden? Saken sier «typisk hero-overskrift, hero-bilde eller hovedbanner» men slår det ikke fast — om det er tekst gjelder ikke bildepunktene (format, width/height).
* Hvor kommer 3,57s-tallet fra — lab-måling (Lighthouse/PageSpeed) eller feltdata (CrUX), og på mobil eller desktop?
* Hvem er påvirket, og hvor mye? Saken gir ingen bevis på brukere, trafikkvolum eller forretningsverdi for statussiden — dette trengs for å prioritere (derav value: unknown).
* Er statussiden egen-hostet i marketing-repoet, eller en tredjeparts statustjeneste? Tiltakene (preload, caching-headere, inlining) forutsetter at vi kontrollerer rendering og servering av siden.
* Finnes det en definert terskel for «CLS holder seg lav», eller holder det at CLS ikke forverres mot dagens nivå?

---

*Strukturert av triage-agenten. Originalteksten er bevart under.*

<details><summary>Opprinnelig beskrivelse</summary>

## Mål

Reduser LCP på statussiden ved å optimalisere det største synlige elementet (hero-bilde/tekst): legg til preload av kritisk ressurs, sett bredde/høyde og moderne bildeformat, utsett ikke-kritisk JS/CSS, og server statisk innhold med god caching.

## Kilde

Skann-funn: performance/warn — [https://status.digilist.no](<https://status.digilist.no>)

## Kodeanalyse (bevis, marketing @ 7142d7e8)

Status: **fixable** (konfidens 70 %)

* `status.digilist.no` — LCP 3.57s over mål på 2,5s på statussiden i marketing-repo

## Akseptansekriterier

- [ ] Reduser LCP på statussiden ved å optimalisere det største synlige elementet (hero-bilde/tekst): legg til preload av kritisk ressurs, sett bredde/høyde og moderne bildeformat, utsett ikke-kritisk JS/CSS, og server statisk innhold med god caching.
- [ ] Tester og bygg grønne
- [ ] Ingen regresjon i eksisterende funksjonalitet

## Kjør som Claude-loop (i `/Volumes/Laravel/Loveable/booking-brilliance`, på en ny branch)

```
/loop I marketing-repoet skal du forbedre Largest Contentful Paint (LCP) på statussiden som serveres på https://status.digilist.no. Nåværende LCP er 3.57s og målet er under 2,5s.

Gjør følgende:
1. Finn siden/komponenten som rendrer status.digilist.no i marketing-repo (søk etter status-route, status-side eller layout for statussiden). Identifiser LCP-elementet (typisk hero-overskrift, hero-bilde eller hovedbanner).
2. Hvis LCP-elementet er et bilde: konverter til moderne format (WebP/AVIF), sett eksplisitt width og height for å unngå layout shift, legg til fetchpriority="high" og en <link rel="preload"> for ressursen i dokumenthodet.
3. Utsett ikke-kritisk JavaScript (defer/async) og fjern render-blokkerende CSS ved å inline kritisk CSS eller laste resten asynkront.
4. Sørg for at statiske ressurser (bilder, fonter, CSS) serveres med langvarig cache-header og at fonter lastes med font-display: swap og preconnect til eventuelle eksterne domener.
5. Verifiser at ingen tunge tredjepartsskript blokkerer første rendering av statussiden.

Akseptansekriterier:
- LCP på statussiden måles til under 2,5s i Lighthouse/PageSpeed på mobil.
- LCP-elementet lastes med preload og fetchpriority="high".
- Ingen nye layout shifts (CLS holder seg lav).
- Eksisterende og eventuelle nye tester kjører grønt før PR opprettes.

Kjør /loop til alt er grønt og lag PR med kort oppsummering av tiltakene og målt LCP før og etter.
```

---

*Auto-generert av Digilist Improvements Agent fra performance/cwv.lcp@status + kodeanalyse (graf @ 7142d7e8). Flytt til godkjenningstilstand for å klargjøre en implementasjons-branch.*

</details>

Linear: https://linear.app/xala-technologies/issue/XAL-319/lcp-357s-trenger-forbedring-mal-25s-cwvlcp
