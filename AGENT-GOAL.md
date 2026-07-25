# XAL-529: Content gap: Rapportering og analyser

> Auto-prepared by Digilist Improvements Agent. Run Claude in this worktree:
> `/loop Write and publish SEO content for "Rapportering og analyser". Cover Municipal administrators need detailed reporting on space utilization, rental income, and usage patterns for budgeting and planning.. Goal: satisfy search intent for "rapportering" on digilist.no. The blog post itself must be in Norwegian Bokmål.`

## Implementation contract — complete this before writing code
- **Problem:** Write and publish SEO content for "Rapportering og analyser". Cover Municipal administrators need detailed reporting on space utilization, rental income, and usage patterns for budgeting and planning.. Goal: satisfy search intent for "rapportering" on digilist.no. The blog post itself must be in Norwegian Bokmål.
- **Business objective:** _why this matters (from the Linear issue)_
- **Repository / branch:** `/root/booking-brilliance` @ `agent/xal-529-content-gap-rapportering-og-analyser`
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
- One issue → one branch (`agent/xal-529-content-gap-rapportering-og-analyser`) → one independently reviewable change. Never main.
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

[digilist.no](<http://digilist.no>) has no content covering "Rapportering og analyser" (reporting and analytics). Per the issue, municipal administrators need detailed reporting on space utilization, rental income, and usage patterns for budgeting and planning, and there is search demand for "rapportering" that no current page satisfies. Code analysis reports this as a gap (95% confidence, no direct code hits).

## Scope

**In scope:**

* Create or expand Norwegian Bokmål SEO content covering "Rapportering og analyser" on [digilist.no](<http://digilist.no>)
* Address the municipal-administrator use case named in the issue: reporting on space utilization, rental income, and usage patterns for budgeting and planning
* Optimize the page for the search term "rapportering" so it satisfies that search intent

**Out of scope:**

* Changes outside the marketing repository
* Building or changing the actual reporting/analytics product feature in the app (this issue is SEO content, not product functionality)
* Unrelated refactors, drive-by fixes, or direct merges to main
* Scope creep beyond the stated content goal

## Acceptance Criteria

- [ ] A Norwegian Bokmål page/article covering "Rapportering og analyser" is published on [digilist.no](<http://digilist.no>)
- [ ] The content explicitly addresses reporting on space utilization, rental income, and usage patterns in a municipal budgeting/planning context
- [ ] The page is optimized for the keyword "rapportering" (present in title, meta description, and at least one heading)
- [ ] All relevant tests and the build pass (green CI)
- [ ] No regression in existing user-facing behaviour on the site

## Testing Scenario

* Given the content is published, When a reader opens the page, Then it is written in Norwegian Bokmål and its main topic is "Rapportering og analyser".
* Given the published page, When its body is inspected, Then it covers all three named dimensions — space utilization, rental income, and usage patterns — for municipal administrators.
* Given a search for "rapportering" scoped to [digilist.no](<http://digilist.no>), When the page is indexed, Then this page is the result that matches the query (title/meta/heading contain the keyword).
* Given the change is merged, When CI runs, Then tests and build pass and no existing page regresses.

## Value: low

low because the issue names an audience (municipal administrators) and a search-demand cluster as motivation, but gives no search-volume figures, revenue, commitment, or named blocked user to justify a higher value.

## Target repo: `marketing`

*Chosen by triage from the issue's content; routes preparation there.*

## Open questions

* Is this a net-new page or an expansion of an existing one, and what URL/slug should it live at?
* What search-volume or demand data backs the asserted "search demand" for "rapportering"? The issue asserts demand but provides no numbers.
* Should the content target only the kommune/offentlig market, or also the private-utleie market, given Digilist serves both?
* Does Digilist actually ship reporting/analytics features the content can describe accurately, or would the content be describing a capability that does not yet exist?

---

*Structured by the triage agent. Original text preserved below.*

<details><summary>Opprinnelig beskrivelse</summary>

**SEO route:** content → `content-agent` · repo `marketing`

**Classification:** feature · severity major · priority P1

## Problem statement

Product gap: Content gap: Rapportering og analyser. Municipal administrators need detailed reporting on space utilization, rental income, and usage patterns for budgeting and planning. Current assessment: gap (feature, major).

## Scope

Create or expand content covering "Rapportering og analyser" aligned with Municipal administrators need detailed reporting on space utilization, rental income, and usage patterns for budgeting and planning.

## Out of scope

Changes outside the target repository for this issue. Unrelated refactors, drive-by fixes, or direct merges to main. Scope creep beyond the stated feature or improvement goal.

## Acceptance criteria

- [ ] Create or expand content covering "Rapportering og analyser" aligned with Municipal administrators need detailed reporting on space utilization, rental income, and usage patterns for budgeting and planning.
- [ ] All relevant tests and build pass (green CI).
- [ ] No regression in existing user-facing behaviour.

## Code analysis (evidence, marketing @ seo-run)

Status: **gap** (confidence 95%)

* (no direct code hits; see details)

## Source

Product idea (cluster:statistikk og rapportering utleieinntekter kommune), from search demand

## Run as Claude loop (in `/root/booking-brilliance`, on a new branch)

```
/loop Write and publish SEO content for "Rapportering og analyser". Cover Municipal administrators need detailed reporting on space utilization, rental income, and usage patterns for budgeting and planning.. Goal: satisfy search intent for "rapportering" on digilist.no. The blog post itself must be in Norwegian Bokmål.
```

---

*Auto-generated by Digilist Improvements Agent (Linear specialist) from cluster:statistikk og rapportering utleieinntekter kommune + code analysis (graph @ seo-run). Move to the approval state to prepare an implementation branch.*

</details>

Linear: https://linear.app/xala-technologies/issue/XAL-529/content-gap-rapportering-og-analyser
