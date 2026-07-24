# XAL-700: Content gap: Kurs, opplæring og klasseromsleie

> Auto-prepared by Digilist Improvements Agent. Run Claude in this worktree:
> `/loop Write and publish SEO content for "Kurs, opplæring og klasseromsleie". Cover Kommuner og private kursarrangører søker klasseromsleie for opplæring og workshop — fleksibel booking med tilgjengelighet er kritisk.. Goal: satisfy search intent for "kurs" on digilist.no. The blog post itself must be in Norwegian Bokmål.`

## Implementation contract — complete this before writing code
- **Problem:** Write and publish SEO content for "Kurs, opplæring og klasseromsleie". Cover Kommuner og private kursarrangører søker klasseromsleie for opplæring og workshop — fleksibel booking med tilgjengelighet er kritisk.. Goal: satisfy search intent for "kurs" on digilist.no. The blog post itself must be in Norwegian Bokmål.
- **Business objective:** _why this matters (from the Linear issue)_
- **Repository / branch:** `/root/booking-brilliance` @ `agent/xal-700-content-gap-kurs-opplaering-og-klasseromsleie`
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
- One issue → one branch (`agent/xal-700-content-gap-kurs-opplaering-og-klasseromsleie`) → one independently reviewable change. Never main.
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

SEO content gap: [digilist.no](<http://digilist.no>) has no content targeting "Kurs, opplæring og klasseromsleie" (klasseromsleie for kurs, opplæring og workshop). The issue asserts (gap confidence 95%, no direct code hits) that kommuner og private kursarrangører søker klasseromsleie for opplæring og workshop, og at fleksibel booking med tilgjengelighet er kritisk for dem. Deliverable: new or expanded Norwegian-Bokmål marketing content that satisfies the search intent for "kurs" / "klasseromsleie" on [digilist.no](<http://digilist.no>).

## Scope

**Innenfor:**

* Create or expand a marketing page / blog post covering "Kurs, opplæring og klasseromsleie", written in Norwegian Bokmål
* The affected page's own content and its own metadata (frontmatter title/description, or its own component)
* Aligning content with the stated audience (kommuner + private kursarrangører) and the angle (fleksibel booking med tilgjengelighet er kritisk)

**Utenfor:**

* Build-time validation guards or edits to shared build/render scripts (scripts/prerender.mjs, src/entry-server.tsx, scripts/verify-live.mjs) — raise any systemic guard as a separate one-off issue
* Changes outside the marketing repository
* Unrelated refactors, drive-by fixes, or direct merges to main
* Product/booking functionality changes (content only, per the issue)

## Acceptance Criteria

- [ ] A page or blog post targeting "Kurs, opplæring og klasseromsleie" exists and is published/prerendered on the marketing site
- [ ] The content body is in Norwegian Bokmål
- [ ] The content addresses both stated audiences (kommuner og private kursarrangører) and the angle that fleksibel booking med tilgjengelighet er kritisk for klasseromsleie til kurs/opplæring/workshop
- [ ] The page has its own frontmatter title and meta description referencing the target topic (kurs / opplæring / klasseromsleie), unique to this page
- [ ] CI is green (all relevant tests and build pass)
- [ ] No regression in existing user-facing behaviour of the marketing site

## Testing Scenario

* Given the marketing site is built and prerendered, When a user visits the new/expanded page for "Kurs, opplæring og klasseromsleie", Then the page renders with Norwegian-Bokmål body content about klasseromsleie for kurs/opplæring/workshop.
* Given the page's HTML source, When its <title> and meta description are inspected, Then both are unique to this page and reference the target topic (kurs / opplæring / klasseromsleie).
* Given the page content, When it is read, Then it addresses both kommuner and private kursarrangører and the fleksibel-booking/tilgjengelighet angle.
* Given CI runs on the branch, When the build and test suite execute, Then they pass green with no new failures.

## Verdi: unknown — ingen prioritet satt; et menneske vurderer verdien

unknown fordi saken påstår søkeetterspørsel (gap-confidence 95 %) men oppgir ingen tall, ingen navngitte blokkerte brukere, ingen inntekt eller forpliktelse — kun en auto-generert påstand fra cluster:klasseromsleie; den tidligere «medium» hadde ingen begrunnelse.

## Målrepo: `marketing`

*Valgt av triage fra sakens innhold; ruter forberedelsen dit.*

## Åpne spørsmål

* Is this a NEW page or an expansion of an existing one? The issue says "create or expand" without deciding, and reports no direct code hits — the implementer must confirm no existing page already covers this before creating a duplicate.
* What is the exact target URL/slug and where should it sit in the marketing site's information architecture?
* What are the primary/secondary target keywords beyond "kurs" and "klasseromsleie" (e.g. "opplæringslokale", "kurslokale leie", "workshoplokale")?
* What is the actual search-demand evidence (volume/terms) behind cluster:klasseromsleie til kurs og opplæring? The issue asserts demand but gives no numbers — this is also the evidence needed to move value off unknown.
* Should the content lean offentlig/kommune, privat/utleie, or serve both markets equally?

---

*Strukturert av triage-agenten. Originalteksten er bevart under.*

<details><summary>Opprinnelig beskrivelse</summary>

<!-- xaheen-triage -->

## Problem Statement

SEO content gap: [digilist.no](<http://digilist.no>) has no content targeting "Kurs, opplæring og klasseromsleie" (classroom/room rental for courses, training and workshops). The issue asserts (gap confidence 95%, no direct code hits) that municipalities (kommuner) and private course organizers (private kursarrangører) search for classroom rental for training and workshops, and that flexible booking with availability is critical for them. The deliverable is new/expanded Norwegian-Bokmål marketing content that satisfies search intent for "kurs" / "klasseromsleie" on [digilist.no](<http://digilist.no>).

## Scope

**Innenfor:**

* Create or expand a marketing page / blog post covering "Kurs, opplæring og klasseromsleie", written in Norwegian Bokmål
* The affected page's own content and its own metadata (frontmatter title/description or its own component)
* Aligning the content with the stated audience (kommuner + private kursarrangører) and angle (fleksibel booking med tilgjengelighet)

**Utenfor:**

* Build-time validation guards or edits to shared build/render scripts (scripts/prerender.mjs, src/entry-server.tsx, scripts/verify-live.mjs) — these funnel every SEO branch and cause merge conflicts; raise any systemic guard as a separate one-off issue
* Changes outside the marketing repository
* Unrelated refactors, drive-by fixes, or direct merges to main
* Product/booking functionality changes (this is content only, per the issue)

## Acceptance Criteria

- [ ] A page or blog post targeting "Kurs, opplæring og klasseromsleie" exists and is published/prerendered on the marketing site
- [ ] The content body is in Norwegian Bokmål
- [ ] The content addresses the stated audience (kommuner og private kursarrangører) and the angle that flexible booking with availability is 

Linear: https://linear.app/xala-technologies/issue/XAL-700/content-gap-kurs-opplaering-og-klasseromsleie
