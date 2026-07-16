# XAL-313: Only 3 words on page (recommend 200+) (content.thin)

> Auto-prepared by Digilist Improvements Agent. Run Claude in this worktree:
> `/loop I marketing-repoet: 7 bloggsider trigger SEO-regelen content.thin fordi de kun rendrer 3 ord, eksempel https://digilist.no/blogg/automatisert-avbooking-og-refusjon-kommunal-saksbehandling. Gjør følgende: 1) Finn hvordan bloggartikler hentes og rendres (let etter blogg-route, artikkel-komponent, MDX eller datakilde for blogginnhold i src/pages og src/components). 2) Verifiser om brødteksten faktisk finnes i datakilden men ikke rendres, eller om innholdet mangler helt. 3) Hvis rendringsfeil: fiks komponenten slik at full artikkeltekst vises. 4) Hvis innholdet mangler: legg inn reelt fagredaksjonelt innhold på minst 200 ord per artikkel for de 7 affiserte sidene, eller sett noindex/fjern sider som ikke er klare for publisering. 5) Legg til en enkel test eller sjekk som feiler hvis en publisert bloggartikkel har under 200 ord i brødteksten. Akseptansekriterier: alle publiserte bloggsider rendrer full brødtekst med minst 200 ord, content.thin gir ingen treff på de 7 sidene, ingen uferdige sider er indekserbare, og alle tester er grønne før PR opprettes. Bruk norsk bokmål i alt innhold.`

## Implementation contract — complete this before writing code
- **Problem:** I marketing-repoet: 7 bloggsider trigger SEO-regelen content.thin fordi de kun rendrer 3 ord, eksempel https://digilist.no/blogg/automatisert-avbooking-og-refusjon-kommunal-saksbehandling. Gjør følgende: 1) Finn hvordan bloggartikler hentes og rendres (let etter blogg-route, artikkel-komponent, MDX eller datakilde for blogginnhold i src/pages og src/components). 2) Verifiser om brødteksten faktisk finnes i datakilden men ikke rendres, eller om innholdet mangler helt. 3) Hvis rendringsfeil: fiks komponenten slik at full artikkeltekst vises. 4) Hvis innholdet mangler: legg inn reelt fagredaksjonelt innhold på minst 200 ord per artikkel for de 7 affiserte sidene, eller sett noindex/fjern sider som ikke er klare for publisering. 5) Legg til en enkel test eller sjekk som feiler hvis en publisert bloggartikkel har under 200 ord i brødteksten. Akseptansekriterier: alle publiserte bloggsider rendrer full brødtekst med minst 200 ord, content.thin gir ingen treff på de 7 sidene, ingen uferdige sider er indekserbare, og alle tester er grønne før PR opprettes. Bruk norsk bokmål i alt innhold.
- **Business objective:** _why this matters (from the Linear issue)_
- **Repository / branch:** `/root/booking-brilliance` @ `agent/xal-313-only-3-words-on-page-recommend-200-content-thin`
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
- One issue → one branch (`agent/xal-313-only-3-words-on-page-recommend-200-content-thin`) → one independently reviewable change. Never main.
- Smallest valid change. No opportunistic refactoring, no broad formatting changes, no hidden dependency on another open PR.
- Validation is mandatory and staged — "code written" ≠ "compiled" ≠ "tests passed" ≠ "acceptance demonstrated". Collect evidence (test output / logs) before opening the PR.
- If scope expands beyond "Files likely affected", or the change grows large, STOP and escalate ("BLOCKED:") rather than pressing on.
- Open a PR only when green (otherwise a draft PR with a note). Delete this file before opening the PR.

Linear: https://linear.app/xala-technologies/issue/XAL-313/only-3-words-on-page-recommend-200-contentthin
