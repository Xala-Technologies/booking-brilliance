# XAL-519: Content gap: Private og bedriftsevent

> Auto-prepared by Digilist Improvements Agent. Run Claude in this worktree:
> `/loop Write and publish SEO content for "Private og bedriftsevent". Cover Private innbyggere og bedrifter søker lokaler for festligheter og corporate events — høy søkevolum og høy kommersiell verdi.. Goal: satisfy search intent for "private" on digilist.no. The blog post itself must be in Norwegian Bokmål.`

## Implementation contract — complete this before writing code
- **Problem:** Write and publish SEO content for "Private og bedriftsevent". Cover Private innbyggere og bedrifter søker lokaler for festligheter og corporate events — høy søkevolum og høy kommersiell verdi.. Goal: satisfy search intent for "private" on digilist.no. The blog post itself must be in Norwegian Bokmål.
- **Business objective:** _why this matters (from the Linear issue)_
- **Repository / branch:** `/root/booking-brilliance` @ `agent/xal-519-content-gap-private-og-bedriftsevent`
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
- One issue → one branch (`agent/xal-519-content-gap-private-og-bedriftsevent`) → one independently reviewable change. Never main.
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

The issue reports a content gap: [digilist.no](<http://digilist.no>) has no content targeting private residents ('private innbyggere') and businesses ('bedrifter') who are searching for venues/locales for private festivities and corporate events ('festligheter og corporate events'). The request is to create or expand Norwegian Bokmål SEO content covering 'Private og bedriftsevent' to satisfy this search intent. The issue is derived from a keyword cluster ('julebord lokale kommune pris') via search-demand analysis and a code/graph scan that found no existing content on this topic (status: gap, confidence 92%).

## Scope

**In scope:**

* Create or expand content on [digilist.no](<http://digilist.no>) covering 'Private og bedriftsevent' — private residents and businesses seeking venues for festivities and corporate events
* The published blog post / page copy must be in Norwegian Bokmål
* Target the search intent behind the 'julebord lokale kommune pris' cluster and the 'private' query on [digilist.no](<http://digilist.no>)
* Green CI (relevant tests and build pass)

**Out of scope:**

* Changes outside the marketing (booking-brilliance) repository
* Unrelated refactors or drive-by fixes
* Direct merges to main
* Any change that regresses existing user-facing behaviour
* Product/app functionality for booking or renting venues (this is content only, per the issue)

## Acceptance Criteria

- [ ] A Norwegian Bokmål blog post/page exists on [digilist.no](<http://digilist.no>) whose topic is renting venues for private festivities and corporate events, addressed to private residents and businesses
- [ ] The content targets the search terms implied by the 'julebord lokale kommune pris' cluster / the 'private' intent (specific target keywords TBD — see openQuestions)
- [ ] CI is green: relevant tests and the build pass
- [ ] No existing user-facing behaviour regresses

## Testing Scenario

* Given a reader searching for a venue for a private party or corporate event, When they land on the new [digilist.no](<http://digilist.no>) page, Then the copy addresses both private residents and businesses and is written in Norwegian Bokmål
* Given the CI pipeline for the marketing repo, When the new content branch is built and tested, Then all relevant tests and the build pass (green CI)
* Given the site before and after the change, When existing pages are loaded, Then no previously working page or behaviour is broken

## Value: unknown — no priority set; a human decides the value

unknown fordi issuet påstår «høy søkevolum og høy kommersiell verdi», men gir ingen faktiske tall, trafikkdata eller navngitte brukere/inntekter som bevis — påstanden er ikke underbygget, så verdien er ennå ikke vurdert av et menneske.

## Target repo: `marketing`

*Chosen by triage from the issue's content; routes preparation there.*

## Open questions

* What is the actual evidence for 'high search volume' and 'high commercial value'? (search-volume numbers, target keywords, or traffic data are not provided in the issue)
* What are the specific target keywords/queries? The title says 'Private og bedriftsevent' but the source cluster is 'julebord lokale kommune pris' (Christmas-party-specific) — which queries should the content rank for?
* Is this a brand-new page or an expansion of existing content? The scope says 'create or expand' but does not say which, and the code analysis found no direct hits.
* What format and depth is expected (single blog post, landing page, cluster of pages)? The issue does not specify.
* How does this relate to the kommune/offentlig market vs. the private/bedrift market — the cluster name mentions 'kommune' but the stated audience is private residents and businesses?

---

*Structured by the triage agent. Original text preserved below.*

<details><summary>Opprinnelig beskrivelse</summary>

**SEO route:** content → `content-agent` · repo `marketing`

**Classification:** feature · severity major · priority P2

## Problem statement

Product gap: Content gap: Private og bedriftsevent. Private innbyggere og bedrifter søker lokaler for festligheter og corporate events — høy søkevolum og høy kommersiell verdi. Current assessment: gap (feature, major).

## Scope

Create or expand content covering "Private og bedriftsevent" aligned with Private innbyggere og bedrifter søker lokaler for festligheter og corporate events — høy søkevolum og høy kommersiell verdi.

## Out of scope

Changes outside the target repository for this issue. Unrelated refactors, drive-by fixes, or direct merges to main. Scope creep beyond the stated feature or improvement goal.

## Acceptance criteria

- [ ] Create or expand content covering "Private og bedriftsevent" aligned with Private innbyggere og bedrifter søker lokaler for festligheter og corporate events — høy søkevolum og høy kommersiell verdi.
- [ ] All relevant tests and build pass (green CI).
- [ ] No regression in existing user-facing behaviour.

## Code analysis (evidence, marketing @ seo-run)

Status: **gap** (confidence 92%)

* (no direct code hits; see details)

## Source

Product idea (cluster:julebord lokale kommune pris), from search demand

## Run as Claude loop (in `/root/booking-brilliance`, on a new branch)

```
/loop Write and publish SEO content for "Private og bedriftsevent". Cover Private innbyggere og bedrifter søker lokaler for festligheter og corporate events — høy søkevolum og høy kommersiell verdi.. Goal: satisfy search intent for "private" on digilist.no. The blog post itself must be in Norwegian Bokmål.
```

---

*Auto-generated by Digilist Improvements Agent (Linear specialist) from cluster:julebord lokale kommune pris + code analysis (graph @ seo-run). Move to the approval state to prepare an implementation branch.*

</details>

Linear: https://linear.app/xala-technologies/issue/XAL-519/content-gap-private-og-bedriftsevent
