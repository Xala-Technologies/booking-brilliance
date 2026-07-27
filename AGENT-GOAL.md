# XAL-349: [marketing] [SEO warn] content.thin — /blogg/bookingsystem-kommune-leverandor-valg

> Auto-prepared by Digilist Improvements Agent. Run Claude in this worktree:
> `/loop [marketing] [SEO warn] content.thin — /blogg/bookingsystem-kommune-leverandor-valg`

## Implementation contract — complete this before writing code
- **Problem:** [marketing] [SEO warn] content.thin — /blogg/bookingsystem-kommune-leverandor-valg
- **Business objective:** _why this matters (from the Linear issue)_
- **Repository / branch:** `/root/booking-brilliance` @ `agent/xal-349-blogg-bookingsystem-kommune-leverandor`
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
- One issue → one branch (`agent/xal-349-blogg-bookingsystem-kommune-leverandor`) → one independently reviewable change. Never main.
- Smallest valid change. No opportunistic refactoring, no broad formatting changes, no hidden dependency on another open PR.
- Validation is mandatory and staged — "code written" ≠ "compiled" ≠ "tests passed" ≠ "acceptance demonstrated". Collect evidence (test output / logs) before opening the PR.
- If scope expands beyond "Files likely affected", or the change grows large, STOP and escalate ("BLOCKED:") rather than pressing on.
- Open a PR only when green (otherwise a draft PR with a note). Delete this file before opening the PR.

## Full issue — from Linear (the source of truth for scope & acceptance)
> The Linear MCP in this environment may be bound to the WRONG workspace, so
> do NOT rely on it to read this ticket — everything you need is below. If
> something essential is genuinely missing here (e.g. a screenshot), STOP and
> end with "CLARIFICATION:" rather than guessing.

**Classification:** nice-to-have · severity minor · priority P3

Product gap: [marketing] [SEO warn] content.thin — /blogg/bookingsystem-kommune-leverandor-valg. <!-- xaheen-triage -->

## Problem Statement

Bloggsiden [https://digilist.no/blogg/bookingsystem-kommune-leverandor-valg](<https://digilist.no/blogg/bookingsystem-kommune-leverandor-valg>) har kun 3 ord der SEO-crawleren forventer 200+ («content.thin»). En publisert bloggartikkel med 3 ord mangler i praksis innholdet den skal ha. Funnet stammer fra et seo/warn-skann (marketing-repo, konfidens 72 % «fixable»).

## Scope

**Innenfor:**

* Siden/ruten [https://digilist.no/blogg/bookingsystem-kommune-leverandor-valg](<https://digilist.no/blogg/bookingsystem-kommune-leverandor-valg>) i marketing-repoet
* On-page-innholdet (ordantall/tekst) på nettopp denne URL-en

**Utenfor:**

* Endringer utenfor marketing-repoet
* Andre bloggsider eller URL-er enn den nevnte
* Urelaterte refaktoreringer, drive-by-fikser eller direkte merge til main
* Bredere SEO- eller innholdsstrategi utover denne ene siden

## Acceptance Criteria

- [ ] Siden på den nevnte URL-en har minst 200 ord substansielt innhold (crawlerens terskel)
- [ ] seo-crawleren rapporterer ikke lenger content.thin for denne URL-en etter endringen
- [ ] CI (tester + build) er grønn
- [ ] Ingen regresjon i eksisterende brukervendt oppførsel

## Testing Scenario

* Gitt at endringen er deployet, når jeg åpner [https://digilist.no/blogg/bookingsystem-kommune-leverandor-valg](<https://digilist.no/blogg/bookingsystem-kommune-leverandor-valg>), så vises en artikkeltekst på minst 200 ord.
* Gitt den deployede siden, når jeg kjører seo-crawleren mot URL-en, så rapporteres ingen content.thin-advarsel for den.
* Gitt eksisterende bloggruter, når endringen er merget, så rendrer og fungerer de øvrige bloggsidene som før (ingen regresjon).

## Alvorlighetsgrad: minor

Impact-basert og bevisst lavt valgt: dette er én enkelt marketing-bloggside, ikke en kjerneflyt (booking/innlogging). Saken oppgir ingen data-tap, sikkerhet/GDPR-brudd, berørte brukere eller trafikktall — kun et crawler-ordantall. Uten belegg for konsekvens velger jeg lavere grad. Kan heves hvis det viser seg at siden feilrendrer for reelle besøkende eller trekker ned indeksering/rangering; se openQuestions.

## Åpne spørsmål

* Er siden reelt ødelagt (artikkel-body feiler å rendre) eller en bevisst stubb/placeholder? Dette avgjør om det egentlig er defekt vs. innhold-som-mangler-å-skrives.
* Hvilke 3 ord vises i dag, og hvilket innhold er artikkelen ment å ha?
* Hvem er berørt, og har siden faktisk trafikk? Saken oppgir ingen brukerpåvirkning.
* Påvirker den tynne siden indeksering/rangering av andre sider, eller er den isolert?
* Ligger innholdet i marketing-repoets kode, i et CMS, eller i host-prosjektets blog-pipeline? Saken peker på repo «marketing» men bekrefter ikke hvor teksten redigeres.

---

*Strukturert av triage-agenten.

<details><summary>Reporter's original text</summary>

**SEO route:** technical → `improvements-agent` · repo `marketing`

**Klassifisering:** improvement · alvorlighet minor · prioritet P3

## Problem statement

[marketing] [SEO warn] content.thin — /blogg/bookingsystem-kommune-leverandor-valg. Only 3 words on page (recommend 200+) Observed at [https://digilist.no/blogg/bookingsystem-kommune-leverandor-valg](<https://digilist.no/blogg/bookingsystem-kommune-leverandor-valg>). Classification: improvement/minor — fixable. Relevant code: [https://digilist.no/blogg/bookingsystem-kommune-leverandor-valg](<https://digilist.no/blogg/bookingsystem-kommune-leverandor-valg>).

## Scope

Improve on-page SEO (marketing:crawl:content.thin:[https://digilist.no/blogg/bookingsystem-kommune-leverandor-valg](<https://digilist.no/blogg/bookingsystem-kommune-leverandor-valg>)): Only 3 words on page (recommend 200+) Touch points: [https://digilist.no/blogg/bookingsystem-kommune-leverandor-valg](<https://digilist.no/blogg/bookingsystem-kommune-leverandor-valg>) (Only 3 words on page (recommend 200+)).

## Out of scope

Changes outside the target repository for this issue. Unrelated refactors, drive-by fixes, or direct merges to main. Scope creep beyond the stated feature or improvement goal.

## Acceptance criteria

- [ ] Improve on-page SEO (marketing:crawl:content.thin:[https://digilist.no/blogg/bookingsystem-kommune-leverandor-valg](<https://digilist.no/blogg/bookingsystem-kommune-leverandor-valg>)): Only 3 words on page (recommend 200+)
- [ ] All

…(truncated)

</details> Current assessment: not-actionable (nice-to-have, minor). Relevant code: src/content/blog/booking-system-og-teknisk-integrasjon-for-kommune.md (frontmatter slug: bookingsystem-kommune-leverandor-valg), src/entry-server.tsx + scripts/prerender.mjs, live fetch of [https://digilist.no/blogg/bookingsystem-kommune-leverandor-valg](<https://digilist.no/blogg/bookingsystem-kommune-leverandor-valg>).

**Scope**
No code change needed. The content.thin finding is stale: it was almost certainly captured before PR #74 fixed the shared SSR prerender race (entry-server.tsx), which is the same root cause already documented for the XAL-3xx 'missing h1' tickets. The markdown source has full content and the live page currently renders it correctly. Recommend closing this finding and re-running the SEO crawler against current production to clear the stale content.thin flag; no repo work is required. Touch points: src/content/blog/booking-system-og-teknisk-integrasjon-for-kommune.md (frontmatter slug: bookingsystem-kommune-leverandor-valg) (full 1120-word markdown article body exists and maps to this exact slug via src/lib/postContent.ts); src/entry-server.tsx + scripts/prerender.mjs (PR #74 (merged 2026-07-18, commit 9216df8) fixed the exact bug class this finding describes: a lazy-route SSR/Suspense race that shipped the 'Laster…' loading shell (no h1, near-zero words) instead of the real article to crawlers. This blog post was created 2026-07-11, before that fix landed

Linear: https://linear.app/xala-technologies/issue/XAL-349/marketing-seo-warn-contentthin-bloggbookingsystem-kommune-leverandor
