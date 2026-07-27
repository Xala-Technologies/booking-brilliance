# XAL-348: [marketing] [SEO warn] content.thin — /blogg/bookingsoftware-kommune-sammenligning-pris

> Auto-prepared by Digilist Improvements Agent. Run Claude in this worktree:
> `/loop [marketing] [SEO warn] content.thin — /blogg/bookingsoftware-kommune-sammenligning-pris`

## Implementation contract — complete this before writing code
- **Problem:** [marketing] [SEO warn] content.thin — /blogg/bookingsoftware-kommune-sammenligning-pris
- **Business objective:** _why this matters (from the Linear issue)_
- **Repository / branch:** `/root/booking-brilliance` @ `agent/xal-348-blogg-bookingsoftware-kommune`
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
- One issue → one branch (`agent/xal-348-blogg-bookingsoftware-kommune`) → one independently reviewable change. Never main.
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

Product gap: [marketing] [SEO warn] content.thin — /blogg/bookingsoftware-kommune-sammenligning-pris. <!-- xaheen-triage -->

## Problem Statement

Bloggsiden /blogg/bookingsoftware-kommune-sammenligning-pris viser bare 3 ord. SEO-skanneren (marketing:crawl:content.thin) flagger dette som tynt innhold og anbefaler 200+ ord. Observert på [https://digilist.no/blogg/bookingsoftware-kommune-sammenligning-pris](<https://digilist.no/blogg/bookingsoftware-kommune-sammenligning-pris>).

## Scope

**Innenfor:**

* On-page-innhold/SEO for nøyaktig denne URL-en (/blogg/bookingsoftware-kommune-sammenligning-pris) i marketing-repoet
* Øke mengden sideinnhold slik at content.thin-advarselen forsvinner

**Utenfor:**

* Endringer utenfor marketing-repoet
* Urelaterte refaktoreringer eller drive-by-fikser
* Direkte merge til main
* Scope-creep utover det angitte innholdsmålet for denne siden

## Acceptance Criteria

- [ ] Siden har ≥200 ord synlig innhold (skannerens anbefaling)
- [ ] SEO-skanneren (seo-crawler) flagger ikke lenger content.thin for denne URL-en etter endring
- [ ] Relevante tester og build er grønne (CI)
- [ ] Ingen regresjon i eksisterende brukerrettet oppførsel

## Testing Scenario

* Given siden /blogg/bookingsoftware-kommune-sammenligning-pris, When seo-crawler kjøres på nytt etter endringen, Then rapporteres ingen content.thin-advarsel for URL-en.
* Given en besøkende laster URL-en, When siden er ferdig rendret, Then vises artikkelinnhold på ≥200 ord i stedet for kun 3 ord.

## Alvorlighetsgrad: minor

Siden laster; ingen datatap, sikkerhet eller kjerneflyt er berørt — kun tynt innhold på én bloggside. Saken gir ingen tall på trafikk eller brukerpåvirkning, så etter regelen om å velge lavere alvorlighet ved uklar konsekvens holdes den på minor (samsvarer med rapportørens egen klassifisering).

## Åpne spørsmål

* Hadde siden tidligere fullt innhold som har forsvunnet (defekt), eller er dette en ny/placeholder-side som aldri fikk skrevet innhold (enhancement)? Dette avgjør om saken egentlig er en feil eller en forbedring.
* Hva er det tiltenkte temaet/nøkkelordet og innholdet for artikkelen? Teksten oppgir kun URL og ordantall.
* Er 200 ord et hardt krav eller bare skannerens generiske anbefaling?
* Finnes det belegg for faktisk bruks-/SEO-påvirkning (trafikk, rangering) for denne siden?

---

*Strukturert av triage-agenten.

<details><summary>Reporter's original text</summary>

**SEO route:** technical → `improvements-agent` · repo `marketing`

**Klassifisering:** improvement · alvorlighet minor · prioritet P3

## Problem statement

[marketing] [SEO warn] content.thin — /blogg/bookingsoftware-kommune-sammenligning-pris. Only 3 words on page (recommend 200+) Observed at [https://digilist.no/blogg/bookingsoftware-kommune-sammenligning-pris](<https://digilist.no/blogg/bookingsoftware-kommune-sammenligning-pris>). Classification: improvement/minor — fixable. Relevant code: [https://digilist.no/blogg/bookingsoftware-kommune-sammenligning-pris](<https://digilist.no/blogg/bookingsoftware-kommune-sammenligning-pris>).

## Scope

Improve on-page SEO (marketing:crawl:content.thin:[https://digilist.no/blogg/bookingsoftware-kommune-sammenligning-pris](<https://digilist.no/blogg/bookingsoftware-kommune-sammenligning-pris>)): Only 3 words on page (recommend 200+) Touch points: [https://digilist.no/blogg/bookingsoftware-kommune-sammenligning-pris](<https://digilist.no/blogg/bookingsoftware-kommune-sammenligning-pris>) (Only 3 words on page (recommend 200+)).

## Out of scope

Changes outside the target repository for this issue. Unrelated refactors, drive-by fixes, or direct merges to main. Scope creep beyond the stated feature or improvement goal.

## Acceptance criteria

- [ ] Improve on-page SEO (marketing:crawl:content.thin:[[[[https://digilist.no/blogg/bookingsoftware-kommune-sammenligning-pris](<https://digilist.no/blogg/bookingsoftware-kommune-sammenligning-pris>)](<[https://digilist.no/blogg/bookingsoftware-kommune-sammenligning-](<https://digilist.no/blogg/bookingsoftware-kommune-sammenligning->)

…(truncated)

</details> Current assessment: not-actionable (nice-to-have, minor). Relevant code: src/content/blog/bookingsoftware-kommune-sammenligning-pris.md, src/entry-server.tsx, scripts/prerender.mjs:107-121, live fetch of [https://digilist.no/blogg/bookingsoftware-kommune-sammenligning-pris](<https://digilist.no/blogg/bookingsoftware-kommune-sammenligning-pris>).

**Scope**
No code change needed. The blog post source and current production rendering both contain full article content; the SEO scanner's 'only 3 words' observation does not reflect the present state of the page and the exact bug class it describes was already fixed in PR #74/#75/#7 (SSR prerender race for lazy blog routes). Likely a stale/one-off crawl (e.g. during a deploy window or transient render hiccup) rather than a current defect. Recommend re-running the seo-crawler against the live URL to confirm the warning clears on its own; if it still fires, the issue is in the scanner or its caching, not in this repo's content or SSR pipeline. Touch points: src/content/blog/bookingsoftware-kommune-sammenligning-pris.md (Full ~900-word Norwegian article exists with headings, table, and CTA — not 3 words); src/entry-server.tsx (SSR prerender retries until React Suspense boundaries resolve and throws (fails the build) if a route never settles, specifically to prevent shipping thin/empty content (PR #74, XAL-310)); scripts/prerender.mjs:107-121 (renderBody() re-throws SSR render errors instead of swallowing them, so a broken prerender for this route would fail CI, not silently ship 3 words); live fetch of [https://digilist.no/blogg/bookingsoftware-kommune-sammenligning-pris](<https://digilist.no/blogg/bookingsoftware-kommune-sammenligning-pris>) (Current production page renders ~2,100 words of visible article body text, matching the markdown source — no thin-content co

Linear: https://linear.app/xala-technologies/issue/XAL-348/marketing-seo-warn-contentthin-bloggbookingsoftware-kommune
