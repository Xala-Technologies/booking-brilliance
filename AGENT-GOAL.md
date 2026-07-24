# XAL-693: Content gap: Hobby- og interesseklubber - lokaler og medlemskap

> Auto-prepared by Digilist Improvements Agent. Run Claude in this worktree:
> `/loop Write and publish SEO content for "Hobby- og interesseklubber - lokaler og medlemskap". Cover Private hobby- og interesseklubber søker løsninger for møtelokaler og medlemskapsadministrasjon; privat marked-hull der Digilist løser booking, prising og tilskuddsadministrasjon.. Goal: satisfy search intent for "hobby" on digilist.no. The blog post itself must be in Norwegian Bokmål.`

## Implementation contract — complete this before writing code
- **Problem:** Write and publish SEO content for "Hobby- og interesseklubber - lokaler og medlemskap". Cover Private hobby- og interesseklubber søker løsninger for møtelokaler og medlemskapsadministrasjon; privat marked-hull der Digilist løser booking, prising og tilskuddsadministrasjon.. Goal: satisfy search intent for "hobby" on digilist.no. The blog post itself must be in Norwegian Bokmål.
- **Business objective:** _why this matters (from the Linear issue)_
- **Repository / branch:** `/root/booking-brilliance` @ `agent/xal-693-content-gap-hobby-og-interesseklubber-lokaler-og`
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
- One issue → one branch (`agent/xal-693-content-gap-hobby-og-interesseklubber-lokaler-og`) → one independently reviewable change. Never main.
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

SEO-innholdsmangel: [digilist.no](<http://digilist.no>) dekker ikke søkeintensjonen «Hobby- og interesseklubber – lokaler og medlemskap» rettet mot privatmarkedet. Saken (auto-generert fra søkedemand-klyngen «cluster:yoga studio klasseromlokale leie pris») hevder private hobby- og interesseklubber søker løsninger for møtelokaler og medlemskapsadministrasjon, og at dette er et privatmarked-hull der Digilist løser booking, prising og tilskuddsadministrasjon. Ingen kilde eller søkevolum er oppgitt, og produktpåstanden om medlemskaps-/tilskuddsadministrasjon er ikke verifisert.

## Scope

**Innenfor:**

* Opprette eller utvide ÉN innholds-/landingsside på [digilist.no](<http://digilist.no>) som dekker «Hobby- og interesseklubber – lokaler og medlemskap», rettet mot privatmarkedet
* Brødtekst på norsk bokmål, rettet mot søkeintensjonen for «hobby»
* Sidens egen frontmatter (title/description) og/eller dens egen komponent

**Utenfor:**

* Build-time-validering eller guards i delte build/render-skript (scripts/prerender.mjs, src/entry-server.tsx, scripts/verify-live.mjs) — meldes ev. som egen sak
* Endringer utenfor målrepoet (marketing/booking-brilliance)
* Urelaterte refaktoreringer, drive-by-fikser eller direkte merge til main
* Faktisk implementasjon av booking-/prisings-/tilskuddsfunksjonalitet i produktet — dette er en innholdsside, ikke en produktendring

## Acceptance Criteria

- [ ] Det finnes en publisert side på [digilist.no](<http://digilist.no>) som dekker «Hobby- og interesseklubber – lokaler og medlemskap» og adresserer både møtelokaler og medlemskap for private klubber
- [ ] All brødtekst på siden er på norsk bokmål
- [ ] Siden har egen frontmatter title og description knyttet til temaet
- [ ] Ingen produktpåstand om medlemskaps- eller tilskuddsadministrasjon publiseres uten at den er verifisert mot faktisk funksjonalitet (jf. åpne spørsmål)
- [ ] CI (relevante tester + build) er grønn
- [ ] Ingen regresjon i eksisterende brukervendt oppførsel på andre sider

## Testing Scenario

* Gitt at en bruker søker «hobbyklubb lokale leie» på Google, Når siden er indeksert, Så vises digilist.no-siden for hobby-/interesseklubber som et relevant treff (URL må avklares — se åpne spørsmål)
* Gitt at siden lastes i nettleser, Når den vises, Så er all brødtekst på norsk bokmål og både temaene lokaler og medlemskap er dekket
* Gitt en produksjonsbygg-kjøring, Når build og tester kjøres, Så passerer alt grønt uten regresjon på eksisterende sider

## Verdi: unknown — ingen prioritet satt; et menneske vurderer verdien

unknown fordi saken er auto-generert fra én søkedemand-klynge og oppgir ikke søkevolum, antall klubber eller faktisk etterspørsel — det finnes intet belegg for verdi å begrunne et nivå på; et menneske må vurdere.

## Målrepo: `marketing`

*Valgt av triage fra sakens innhold; ruter forberedelsen dit.*

## Åpne spørsmål

* Hvilken URL/rute skal siden ha, og finnes det en eksisterende side som skal utvides, eller skal en ny opprettes? Saken sier «create or expand» uten å bestemme.
* Hvilke konkrete nøkkelfraser skal siden rangere på? Saken oppgir kun klyngen «cluster:yoga studio klasseromlokale leie pris» og temaet «hobby».
* Stemmer påstanden om at Digilist løser medlemskaps- og tilskuddsadministrasjon for private klubber? Docs bekrefter booking, prising, sesongfordeling og medlems-/foreningsrabatter for lag og foreninger, men beskriver ikke «medlemskapsadministrasjon» eller «tilskuddsadministrasjon» som egne funksjoner — dette må verifiseres før det påstås i innholdet.
* Hva er beviset for verdi (søkevolum, antall klubber, reell etterspørsel)? Saken oppgir kun en auto-generert klynge.
* Hvordan defineres «done» for SEO-effekt — er publisering nok, eller kreves et ranking-/trafikkmål?

---

*Strukturert av triage-agenten. Originalteksten er bevart under.*

<details><summary>Opprinnelig beskrivelse</summary>

<!-- xaheen-triage -->

## Problem Statement

SEO-innholdsmangel: [digilist.no](<http://digilist.no>) dekker ikke søkeintensjonen «hobby- og interesseklubber – lokaler og medlemskap». Ifølge saken søker private hobby- og interesseklubber løsninger for møtelokaler og medlemskapsadministrasjon, og saken hevder dette er et hull i privatmarkedet der Digilist løser booking, prising og tilskuddsadministrasjon. Saken er auto-generert fra en søkedemand-klynge (cluster:yoga studio klasseromlokale leie pris).

## Scope

**Innenfor:**

* Opprette eller utvide én innholds-/landingsside som dekker «Hobby- og interesseklubber – lokaler og medlemskap», rettet mot privatmarkedet
* Innhold skrevet på norsk bokmål, rettet mot søkeintensjonen for «hobby» på [digilist.no](<http://digilist.no>)
* Sidens egen frontmatter (title/description) og/eller dens egen komponent

**Utenfor:**

* Build-time-validering eller guards i delte build/render-skript (scripts/prerender.mjs, src/entry-server.tsx, scripts/verify-live.mjs) — skal ev. meldes som egen sak
* Endringer utenfor målrepoet
* Urelaterte refaktoreringer, drive-by-fikser eller direkte merge til main
* Faktisk implementasjon av booking-/prisings-/tilskuddsfunksjonalitet i produktet (dette er en innholdsside, ikke en produktendring)

## Acceptance Criteria

- [ ] Det finnes en publisert side på [digilist.no](<http://digilist.no>) som dekker «Hobby- og interesseklubber – lokaler og medlemskap» og adresserer møtelokaler og medlemskapsadministrasjon for private klubber
- [ ] Sidens brødtekst er på norsk bokmål
- [ ] Siden har egen frontmatter title og description knyttet til temaet
- [ ] CI (relevante tester + build) er grønn
- [ ] Ingen regresjon i eksisterende brukervendt oppførsel på andre sider

## Testing Scenario

* Gitt at en bruker søker etter «hobbyklubb lokale leie» på Google, Når siden er indeksert, Så skal digilist.no-siden for hobby-/interesseklubber vises som et relevant treff (URL-en må avklares — se åpne spørsmål)
* Gitt at siden lastes i nettleser, Når den vises, Så er all brødtekst på norsk bok

Linear: https://linear.app/xala-technologies/issue/XAL-693/content-gap-hobby-og-interesseklubber-lokaler-og-medlemskap
