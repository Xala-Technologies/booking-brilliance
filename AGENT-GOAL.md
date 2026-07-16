# XAL-312: No <main> landmark (a11y.landmark.main)

> Auto-prepared by Digilist Improvements Agent. Run Claude in this worktree:
> `/loop I repoet marketing (digilist.no) skal du fikse a11y-funnet a11y.landmark.main der 7 sider mangler et <main> landmark. Eksempelside: https://digilist.no/blogg/automatisert-avbooking-og-refusjon-kommunal-saksbehandling.

Oppgave:
1. Finn det felles sideoppsettet (layout eller template) som brukes av marketing-sidene, inkludert blogg-sidene. Se etter en delt layout-komponent eller wrapper som rendrer header, innhold og footer.
2. Sørg for at hovedinnholdet omsluttes av nøyaktig ett semantisk <main>-element per side. Header og footer skal ligge utenfor <main>. Hvis flere maler brukes, oppdater alle som mangler <main>.
3. Unngå duplikate landmarks: verifiser at ingen side ender opp med mer enn ett <main>.
4. Behold eksisterende styling og struktur, kun legg til det semantiske elementet der det mangler.

Akseptansekriterier:
- Alle 7 affiserte sider, inkludert blogg-eksempelet, rendrer nøyaktig ett <main> landmark rundt hovedinnholdet.
- Ingen side har mer enn ett <main>.
- Header og footer ligger utenfor <main>.
- Eksisterende tester er grønne, og du legger til eller oppdaterer en test som verifiserer at layout-komponenten rendrer et <main>-element.

Kjør alle tester og lint før du åpner PR, og sørg for at alt er grønt.`

## Implementation contract — complete this before writing code
- **Problem:** I repoet marketing (digilist.no) skal du fikse a11y-funnet a11y.landmark.main der 7 sider mangler et <main> landmark. Eksempelside: https://digilist.no/blogg/automatisert-avbooking-og-refusjon-kommunal-saksbehandling.

Oppgave:
1. Finn det felles sideoppsettet (layout eller template) som brukes av marketing-sidene, inkludert blogg-sidene. Se etter en delt layout-komponent eller wrapper som rendrer header, innhold og footer.
2. Sørg for at hovedinnholdet omsluttes av nøyaktig ett semantisk <main>-element per side. Header og footer skal ligge utenfor <main>. Hvis flere maler brukes, oppdater alle som mangler <main>.
3. Unngå duplikate landmarks: verifiser at ingen side ender opp med mer enn ett <main>.
4. Behold eksisterende styling og struktur, kun legg til det semantiske elementet der det mangler.

Akseptansekriterier:
- Alle 7 affiserte sider, inkludert blogg-eksempelet, rendrer nøyaktig ett <main> landmark rundt hovedinnholdet.
- Ingen side har mer enn ett <main>.
- Header og footer ligger utenfor <main>.
- Eksisterende tester er grønne, og du legger til eller oppdaterer en test som verifiserer at layout-komponenten rendrer et <main>-element.

Kjør alle tester og lint før du åpner PR, og sørg for at alt er grønt.
- **Business objective:** _why this matters (from the Linear issue)_
- **Repository / branch:** `/root/booking-brilliance` @ `agent/xal-312-no-main-landmark-a11y-landmark-main`
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
- One issue → one branch (`agent/xal-312-no-main-landmark-a11y-landmark-main`) → one independently reviewable change. Never main.
- Smallest valid change. No opportunistic refactoring, no broad formatting changes, no hidden dependency on another open PR.
- Validation is mandatory and staged — "code written" ≠ "compiled" ≠ "tests passed" ≠ "acceptance demonstrated". Collect evidence (test output / logs) before opening the PR.
- If scope expands beyond "Files likely affected", or the change grows large, STOP and escalate ("BLOCKED:") rather than pressing on.
- Open a PR only when green (otherwise a draft PR with a note). Delete this file before opening the PR.

Linear: https://linear.app/xala-technologies/issue/XAL-312/no-main-landmark-a11ylandmarkmain
