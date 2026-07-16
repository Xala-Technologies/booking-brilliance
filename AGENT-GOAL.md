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

Linear: https://linear.app/xala-technologies/issue/XAL-319/lcp-357s-trenger-forbedring-mal-25s-cwvlcp
