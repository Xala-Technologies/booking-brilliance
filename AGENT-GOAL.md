# XAL-339: Content gap: Booking-funksjonalitet for Sluttbrukere

> Auto-prepared by Digilist Improvements Agent. Run Claude in this worktree:
> `/loop Skriv og publiser SEO-innhold for emnet "Booking-funks

…(truncated)

</details>`

## Implementation contract — complete this before writing code
- **Problem:** Skriv og publiser SEO-innhold for emnet "Booking-funks

…(truncated)

</details>
- **Business objective:** _why this matters (from the Linear issue)_
- **Repository / branch:** `/root/booking-brilliance` @ `agent/xal-339-content-gap-booking-funksjonalitet-for`
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
- One issue → one branch (`agent/xal-339-content-gap-booking-funksjonalitet-for`) → one independently reviewable change. Never main.
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

Auto-generated content-gap idea (XAL-339): [digilist.no](<http://digilist.no>) lacks SEO content covering self-service booking management for end users (Sluttbrukere) — administering, changing, and cancelling their own bookings, plus reminders. Sourced from a search-demand cluster ('endre kansellere og påminnelse booking'); code analysis reports a content gap at 95% confidence with no direct code hits. The underlying product capability exists per Digilist docs (Min side at [digilist.no/min-side](<http://digilist.no/min-side>), self-service cancellation link, cross-tenant booking overview, SMS/email/Vipps reminders), so this is a content coverage gap, not a missing feature.

## Scope

**In scope:**

* Create or expand marketing/SEO content on [digilist.no](<http://digilist.no>) covering 'Booking-funksjonalitet for Sluttbrukere'
* Cover the four subtopics named in the issue: administering own bookings, changing a booking, cancelling a booking, and reminders (påminnelser)
* Target search intent for 'booking' as stated in the issue
* Content in Norwegian Bokmål (shipped product copy on [digilist.no](<http://digilist.no>))

**Out of scope:**

* Building or changing the actual booking/self-service feature (it already exists) — this is content only
* Changes outside the marketing repository
* Unrelated refactors, drive-by fixes, or direct merges to main
* Scope creep beyond the stated content topic

## Acceptance Criteria

- [ ] A published page on [digilist.no](<http://digilist.no>) covers self-service booking management for end users and addresses all four subtopics the issue names: viewing/administering own bookings, changing a booking, cancelling a booking, and reminders
- [ ] Content is factually consistent with the actual product behaviour (e.g. Min side / [digilist.no/min-side](<http://digilist.no/min-side>), self-service cancellation link, reminders) rather than describing capabilities that do not exist
- [ ] Relevant tests and build pass (green CI)
- [ ] No regression in existing user-facing behaviour on [digilist.no](<http://digilist.no>)

## Testing Scenario

* Given the new/expanded page is published, When a reader searches for how to change or cancel their own booking, Then the page explains how end users do this via self-service and is reachable from [digilist.no](<http://digilist.no>)
* Given the page describes reminders, When compared against product behaviour, Then the described reminder mechanism matches what the product actually sends (e.g. SMS/email/Vipps)
* Given the content is deployed, When CI runs, Then all tests and the build pass with no regression in existing pages

## Value: low

low because the only evidence of value is an auto-generated search-demand cluster (95% gap confidence) with no traffic volume, revenue figure, named blocked user, or commitment; there is genuine but weak evidence of who wants it and why, which is above 'unknown' but does not support medium or high.

## Target repo: `marketing`

*Chosen by triage from the issue's content; routes preparation there.*

## Open questions

* Which audience does 'Sluttbrukere' mean here — public/kommune innbyggere, private renters (utleie), or both? The issue does not disambiguate, and it affects tone and examples.
* What is the actual search volume / keyword list behind the 'booking' cluster? The issue gives none, so value cannot be raised above low.
* Is this a net-new page or an expansion of an existing [digilist.no](<http://digilist.no>) page, and which URL should it target?
* The issue's repo path points to booking-brilliance and 'Kjør som Claude-loop' references /Volumes/.../booking-brilliance — is marketing (booking-brilliance) the intended surface, or should this coordinate with existing Min side / kom-i-gang content?

---

*Structured by the triage agent.

<details><summary>Reporter's original text</summary>

**SEO route:** content → `content-agent` · repo `marketing`

**Klassifisering:** feature · alvorlighet major · prioritet P1

## Problem statement

Product gap: Content gap: Booking-funksjonalitet for Sluttbrukere. Sluttbrukere trenger selvbetjeningsløsninger for å administrere, endre og kansellere egne bookinger med påminnelser. Current assessment: gap (feature, major).

## Scope

Create or expand content covering "Booking-funksjonalitet for Sluttbrukere" aligned with Sluttbrukere trenger selvbetjeningsløsninger for å administrere, endre og kansellere egne bookinger med påminnelser.

## Out of scope

Changes outside the target repository for this issue. Unrelated refactors, drive-by fixes, or direct merges to main. Scope creep beyond the stated feature or improvement goal.

## Acceptance criteria

- [ ] Create or expand content covering "Booking-funksjonalitet for Sluttbrukere" aligned with Sluttbrukere trenger selvbetjeningsløsninger for å administrere, endre og kansellere egne bookinger med påminnelser.
- [ ] All relevant tests and build pass (green CI).
- [ ] No regression in existing user-facing behaviour.

## Kodeanalyse (bevis, marketing @ seo-run)

Status: **gap** (konfidens 95 %)

* (ingen direkte kodetreff; se detaljer)

## Kilde

Produktidé (cluster:endre kansellere og påminnelse booking), fra søkeetterspørsel

## Kjør som Claude-loop (i `/Volumes/Laravel/Loveable/booking-brilliance`, på en ny branch)

```
/loop Skriv og publiser SEO-innhold for emnet "Booking-funks

…(truncated)

</details>
```

Linear: https://linear.app/xala-technologies/issue/XAL-339/content-gap-booking-funksjonalitet-for-sluttbrukere
