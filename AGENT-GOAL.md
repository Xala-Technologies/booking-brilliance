# XAL-523: Content gap: Utendørsfasiliteter

> Auto-prepared by Digilist Improvements Agent. Run Claude in this worktree:
> `/loop Write and publish SEO content for "Utendørsfasiliteter". Cover Mindre, spesialiserte utendørsfasiliteter krever også booking- og tilgjengelighetsstyring for optimal kommunal ressursbruk.. Goal: satisfy search intent for "utendørsfasiliteter" on digilist.no. The blog post itself must be in Norwegian Bokmål.`

## Implementation contract — complete this before writing code
- **Problem:** Write and publish SEO content for "Utendørsfasiliteter". Cover Mindre, spesialiserte utendørsfasiliteter krever også booking- og tilgjengelighetsstyring for optimal kommunal ressursbruk.. Goal: satisfy search intent for "utendørsfasiliteter" on digilist.no. The blog post itself must be in Norwegian Bokmål.
- **Business objective:** _why this matters (from the Linear issue)_
- **Repository / branch:** `/root/booking-brilliance` @ `agent/xal-523-content-gap-utendorsfasiliteter`
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
- One issue → one branch (`agent/xal-523-content-gap-utendorsfasiliteter`) → one independently reviewable change. Never main.
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

Digilist has no blog/marketing content targeting the Norwegian search term "utendørsfasiliteter" (outdoor facilities). The issue asserts an SEO content gap (87% confidence, no direct code hits) sourced from a search-demand cluster ("grillhytte og paviljong kommune"), with the angle that smaller, specialized outdoor facilities also need booking and availability management for optimal municipal (kommunal) resource use.

## Scope

**In scope:**

* Create or expand content on [digilist.no](<http://digilist.no>) covering "Utendørsfasiliteter", written in Norwegian Bokmål
* Frame the content around the stated angle: smaller/specialized outdoor facilities requiring booking and availability management for municipal resource use
* Target search intent for the keyword "utendørsfasiliteter"
* Green CI (relevant tests and build pass)

**Out of scope:**

* Changes outside the marketing (booking-brilliance) repository
* Unrelated refactors, drive-by fixes, or direct merges to main
* Product/booking functionality for outdoor facilities (this is a content task, not a feature build)
* Regressions to existing user-facing behaviour

## Acceptance Criteria

- [ ] A Norwegian Bokmål page/post targeting "utendørsfasiliteter" is published (or an existing page expanded to cover it) on [digilist.no](<http://digilist.no>)
- [ ] The content addresses booking and availability management for smaller/specialized outdoor facilities in a municipal context
- [ ] The published page is indexable and its primary keyword target is "utendørsfasiliteter"
- [ ] CI is green (relevant tests and build pass)
- [ ] No regression in existing user-facing behaviour

## Testing Scenario

* Given the content is published, When a reader visits the page on [digilist.no](<http://digilist.no>), Then it renders in Norwegian Bokmål and covers utendørsfasiliteter and their booking/availability management.
* Given a search for "utendørsfasiliteter", When the page is crawled/indexed, Then it is targeted at that keyword and appears in the site's indexable content.
* Given the branch is opened, When CI runs, Then all relevant tests and build pass with no regression to existing pages.

## Value: unknown — no priority set; a human decides the value

unknown fordi saken kun påstår «search demand» og et 87 %-gap uten søkevolum, navngitte brukere, inntekt eller forpliktelse — ingen dokumentert verdi å vurdere; verdien må settes av et menneske når evidensen finnes.

## Target repo: `marketing`

*Chosen by triage from the issue's content; routes preparation there.*

## Open questions

* What is the actual search volume / demand evidence for "utendørsfasiliteter" beyond the 87% gap confidence?
* Which specific outdoor facilities should the content cover (the source cluster names grillhytte og paviljong — are those the intended focus)?
* Is this a net-new page or an expansion of an existing [digilist.no](<http://digilist.no>) page, and if expansion, which one?
* Are there target keyword clusters, internal-linking targets, or a required format/length for the content?
* Is the audience strictly offentlig/kommune, or should privat/utleie also be addressed?

---

*Structured by the triage agent. Original text preserved below.*

<details><summary>Opprinnelig beskrivelse</summary>

**SEO route:** content → `content-agent` · repo `marketing`

**Classification:** feature · severity minor · priority P2

## Problem statement

Product gap: Content gap: Utendørsfasiliteter. Mindre, spesialiserte utendørsfasiliteter krever også booking- og tilgjengelighetsstyring for optimal kommunal ressursbruk. Current assessment: gap (feature, minor).

## Scope

Create or expand content covering "Utendørsfasiliteter" aligned with Mindre, spesialiserte utendørsfasiliteter krever også booking- og tilgjengelighetsstyring for optimal kommunal ressursbruk.

## Out of scope

Changes outside the target repository for this issue. Unrelated refactors, drive-by fixes, or direct merges to main. Scope creep beyond the stated feature or improvement goal.

## Acceptance criteria

- [ ] Create or expand content covering "Utendørsfasiliteter" aligned with Mindre, spesialiserte utendørsfasiliteter krever også booking- og tilgjengelighetsstyring for optimal kommunal ressursbruk.
- [ ] All relevant tests and build pass (green CI).
- [ ] No regression in existing user-facing behaviour.

## Code analysis (evidence, marketing @ seo-run)

Status: **gap** (confidence 87%)

* (no direct code hits; see details)

## Source

Product idea (cluster:grillhytte og paviljong kommune), from search demand

## Run as Claude loop (in `/root/booking-brilliance`, on a new branch)

```
/loop Write and publish SEO content for "Utendørsfasiliteter". Cover Mindre, spesialiserte utendørsfasiliteter krever også booking- og tilgjengelighetsstyring for optimal kommunal ressursbruk.. Goal: satisfy search intent for "utendørsfasiliteter" on digilist.no. The blog post itself must be in Norwegian Bokmål.
```

---

*Auto-generated by Digilist Improvements Agent (Linear specialist) from cluster:grillhytte og paviljong kommune + code analysis (graph @ seo-run). Move to the approval state to prepare an implementation branch.*

</details>

Linear: https://linear.app/xala-technologies/issue/XAL-523/content-gap-utendorsfasiliteter
