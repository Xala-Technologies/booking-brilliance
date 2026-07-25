# XAL-338: Content gap: Brukerstyring og Tilgangskontroll

> Auto-prepared by Digilist Improvements Agent. Run Claude in this worktree:
> `/loop Skriv og publiser SEO-innhold for emnet "Brukerstyring og Tilgangskontroll". Dekk Systemet må håndt

…(truncated)

</details>`

## Implementation contract — complete this before writing code
- **Problem:** Skriv og publiser SEO-innhold for emnet "Brukerstyring og Tilgangskontroll". Dekk Systemet må håndt

…(truncated)

</details>
- **Business objective:** _why this matters (from the Linear issue)_
- **Repository / branch:** `/root/booking-brilliance` @ `agent/xal-338-content-gap-brukerstyring-og-tilgangskontroll`
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
- One issue → one branch (`agent/xal-338-content-gap-brukerstyring-og-tilgangskontroll`) → one independently reviewable change. Never main.
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

Auto-generated SEO content-gap issue (from cluster:brukerroller og tilgangskontroll, flagged 'gap' at 95% confidence with no direct code hits): [digilist.no](<http://digilist.no>) lacks content on 'Brukerstyring og Tilgangskontroll' (user management and access control). The issue frames the topic as the system needing to handle different user types (lag/teams, privatpersoner/private individuals, bedrifter/businesses) with differing access and booking rights, and wants content that covers search intent for 'brukerstyring'. This is a request for new/expanded marketing content, not a report of broken functionality.

## Scope

**In scope:**

* Create or expand content on [digilist.no](<http://digilist.no>) covering 'Brukerstyring og Tilgangskontroll'
* Content should reflect the described capability: different user types (lag, privatpersoner, bedrifter) with differing access and booking rights
* Aim the content at search intent for 'brukerstyring'

**Out of scope:**

* Changes outside the target (marketing) repository
* Unrelated refactors, drive-by fixes, or direct merges to main
* Scope creep beyond the stated content goal
* Building or changing the actual user-management / access-control product functionality — this issue is content only

## Acceptance Criteria

- [ ] A page on [digilist.no](<http://digilist.no>) (new or expanded) covers 'Brukerstyring og Tilgangskontroll' and describes the three user types named in the issue (lag, privatpersoner, bedrifter) and that they have differing access and booking rights
- [ ] Relevant tests and build pass (green CI)
- [ ] No regression in existing user-facing behaviour on the marketing site

## Testing Scenario

* Given the content is published, When a reader visits the target page on [digilist.no](<http://digilist.no>), Then it explains user management and access control and names lag, privatpersoner and bedrifter as user types with differing access/booking rights
* Given the change is on a branch, When CI runs, Then tests and build pass with no new failures
* Given the marketing site before and after the change, When existing pages are viewed, Then no previously working page or behaviour regresses

## Value: unknown — no priority set; a human decides the value

unknown fordi saken kun oppgir «søkeetterspørsel» og en produktidé-cluster som belegg — ingen navngitte brukere, inntekt eller forpliktelse er tallfestet, og «major/P1» er auto-satt av agenten uten underlag.

## Target repo: `marketing`

*Chosen by triage from the issue's content; routes preparation there.*

## Open questions

* What is the actual search-demand evidence (keywords, volume) behind 'brukerstyring' that justifies this content?
* Should this be a new page or an expansion of an existing one, and which URL?
* What are the target keywords and the success metric (e.g. ranking/traffic) that define 'done'?
* Does Digilist actually support the described model — lag, privatpersoner and bedrifter with differing access and booking rights? This must be verified against the product before writing, so the content does not describe a capability that isn't built.
* What impact justified the auto-assigned 'major/P1' — the issue gives none?

---

*Structured by the triage agent.

<details><summary>Reporter's original text</summary>

**SEO route:** content → `content-agent` · repo `marketing`

**Klassifisering:** feature · alvorlighet major · prioritet P1

## Problem statement

Product gap: Content gap: Brukerstyring og Tilgangskontroll. Systemet må håndtere ulike brukertyper (lag, privatpersoner, bedrifter) med ulike tilgangs- og bookingretter. Current assessment: gap (feature, major).

## Scope

Create or expand content covering "Brukerstyring og Tilgangskontroll" aligned with Systemet må håndtere ulike brukertyper (lag, privatpersoner, bedrifter) med ulike tilgangs- og bookingretter.

## Out of scope

Changes outside the target repository for this issue. Unrelated refactors, drive-by fixes, or direct merges to main. Scope creep beyond the stated feature or improvement goal.

## Acceptance criteria

- [ ] Create or expand content covering "Brukerstyring og Tilgangskontroll" aligned with Systemet må håndtere ulike brukertyper (lag, privatpersoner, bedrifter) med ulike tilgangs- og bookingretter.
- [ ] All relevant tests and build pass (green CI).
- [ ] No regression in existing user-facing behaviour.

## Kodeanalyse (bevis, marketing @ seo-run)

Status: **gap** (konfidens 95 %)

* (ingen direkte kodetreff; se detaljer)

## Kilde

Produktidé (cluster:brukerroller og tilgangskontroll), fra søkeetterspørsel

## Kjør som Claude-loop (i `/Volumes/Laravel/Loveable/booking-brilliance`, på en ny branch)

```
/loop Skriv og publiser SEO-innhold for emnet "Brukerstyring og Tilgangskontroll". Dekk Systemet må håndt

…(truncated)

</details>
```

Linear: https://linear.app/xala-technologies/issue/XAL-338/content-gap-brukerstyring-og-tilgangskontroll
