# XAL-451: Content gap: Registrering og administrasjon av lag og organisasjoner

> Auto-prepared by Digilist Improvements Agent. Run Claude in this worktree:
> `/loop Write and publish SEO content for "Registrering og administrasjon av lag og organisasjoner". Cover Idrettslag og frivillige organisasjoner trenger enkel registrering og mulighet for lagkoordinatorer til å administrere og delegere bookinger til medlemmene.. Goal: satisfy search intent for "registrering" on digilist.no. The blog post itself must be in Norwegian Bokmål.`

## Implementation contract — complete this before writing code
- **Problem:** Write and publish SEO content for "Registrering og administrasjon av lag og organisasjoner". Cover Idrettslag og frivillige organisasjoner trenger enkel registrering og mulighet for lagkoordinatorer til å administrere og delegere bookinger til medlemmene.. Goal: satisfy search intent for "registrering" on digilist.no. The blog post itself must be in Norwegian Bokmål.
- **Business objective:** _why this matters (from the Linear issue)_
- **Repository / branch:** `/root/booking-brilliance` @ `agent/xal-451-content-gap-registrering-og-administrasjon-av-la`
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
- One issue → one branch (`agent/xal-451-content-gap-registrering-og-administrasjon-av-la`) → one independently reviewable change. Never main.
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

No content on [digilist.no](<http://digilist.no>) covers 'Registrering og administrasjon av lag og organisasjoner' — how sports clubs and voluntary organisations register and how team coordinators administer and delegate bookings to members. The issue reports this as a content gap (92% confidence, no direct code hits) sourced from the search-demand cluster 'registrere idrettslag for å booke kommunale lokaler'. The requested work is to write and publish an SEO blog post in Norwegian Bokmål that satisfies search intent for 'registrering'.

## Scope

**In scope:**

* Create or expand SEO content covering registration and administration of teams (lag) and organisations
* Cover how coordinators (lagkoordinatorer) administer and delegate bookings to members
* Target the search cluster/intent 'registrering' / 'registrere idrettslag for å booke kommunale lokaler'
* Publish the blog post in Norwegian Bokmål on [digilist.no](<http://digilist.no>)

**Out of scope:**

* Building the actual product capability for team registration or coordinator delegation (this is a content task, not a feature build)
* Changes outside the marketing repository
* Unrelated refactors or drive-by fixes
* Direct merges to main

## Acceptance Criteria

- [ ] A Norwegian Bokmål blog post/page exists on [digilist.no](<http://digilist.no>) covering registration and administration of lag/organisasjoner
- [ ] The content explains how a lagkoordinator administers and delegates bookings to members
- [ ] The content targets and is discoverable for the 'registrering' search intent (title/headings/keywords aligned to the cluster)
- [ ] CI is green (relevant tests and build pass)
- [ ] No regression in existing published content or user-facing behaviour

## Testing Scenario

* Given the content is published, When a reader searches/browses [digilist.no](<http://digilist.no>) for 'registrere idrettslag', Then a page on registering and administering lag/organisasjoner is returned and readable in Norwegian Bokmål.
* Given the published page, When a reviewer reads it, Then it describes the coordinator (lagkoordinator) role administering and delegating bookings to members.
* Given the change is merged, When CI runs, Then build and tests pass and no existing page is broken or removed.

## Value: low

low fordi det finnes et søkeetterspørsel-signal (klynge 'registrere idrettslag for å booke kommunale lokaler', 92% gap) som er reell verdi for SEO-innhold, men ingen navngitte blokkerte brukere, inntekt, forpliktelse eller volumtall er oppgitt.

## Target repo: `marketing`

*Chosen by triage from the issue's content; routes preparation there.*

## Open questions

* Does the product actually support team/organisation registration and coordinator delegation of bookings today? If not, the content would describe unbuilt functionality — confirm before writing, or narrow the content to what exists.
* Who is the target audience — offentlig/kommune (booking municipal facilities, as the cluster implies) or also privat/utleie? The issue names municipal facilities but the topic title is generic.
* What form should this take — a marketing blog post (per the loop), a product/help page, or both?
* What specific target keywords and search volume back the 'registrering' cluster, so the content can be optimised and its value assessed?
* Where on [digilist.no](<http://digilist.no>) should it be published (which section/URL)?

---

*Structured by the triage agent. Original text preserved below.*

<details><summary>Opprinnelig beskrivelse</summary>

**SEO route:** content → `content-agent` · repo `marketing`

**Classification:** feature · severity major · priority P2

## Problem statement

Product gap: Content gap: Registrering og administrasjon av lag og organisasjoner. Idrettslag og frivillige organisasjoner trenger enkel registrering og mulighet for lagkoordinatorer til å administrere og delegere bookinger til medlemmene. Current assessment: gap (feature, major).

## Scope

Create or expand content covering "Registrering og administrasjon av lag og organisasjoner" aligned with Idrettslag og frivillige organisasjoner trenger enkel registrering og mulighet for lagkoordinatorer til å administrere og delegere bookinger til medlemmene.

## Out of scope

Changes outside the target repository for this issue. Unrelated refactors, drive-by fixes, or direct merges to main. Scope creep beyond the stated feature or improvement goal.

## Acceptance criteria

- [ ] Create or expand content covering "Registrering og administrasjon av lag og organisasjoner" aligned with Idrettslag og frivillige organisasjoner trenger enkel registrering og mulighet for lagkoordinatorer til å administrere og delegere bookinger til medlemmene.
- [ ] All relevant tests and build pass (green CI).
- [ ] No regression in existing user-facing behaviour.

## Code analysis (evidence, marketing @ seo-run)

Status: **gap** (confidence 92%)

* (no direct code hits; see details)

## Source

Product idea (cluster:registrere idrettslag for å booke kommunale lokaler), from search demand

## Run as Claude loop (in `/root/booking-brilliance`, on a new branch)

```
/loop Write and publish SEO content for "Registrering og administrasjon av lag og organisasjoner". Cover Idrettslag og frivillige organisasjoner trenger enkel registrering og mulighet for lagkoordinatorer til å administrere og delegere bookinger til medlemmene.. Goal: satisfy search intent for "registrering" on digilist.no. The blog post itself must be in Norwegian Bokmål.
```

---

*Auto-generated by Digilist Improvements Agent (Linear specialist) from cluster:registrere idrettslag for å booke kommunale lokaler + code analysis (graph @ seo-run). Move to the approval state to prepare an implementation branch.*

</details>

Linear: https://linear.app/xala-technologies/issue/XAL-451/content-gap-registrering-og-administrasjon-av-lag-og-organisasjoner
