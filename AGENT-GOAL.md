# XAL-570: Content gap: Trenings- og badeanlegg

> Auto-prepared by Digilist Improvements Agent. Run Claude in this worktree:
> `/loop Write and publish SEO content for "Trenings- og badeanlegg". Cover Treningsgrupper og svømmeklubbe trenger enkel booking av gym, styrkerom og basseng med fleksible tidsslotter og gruppetakster.. Goal: satisfy search intent for "trenings" on digilist.no. The blog post itself must be in Norwegian Bokmål.`

## Implementation contract — complete this before writing code
- **Problem:** Write and publish SEO content for "Trenings- og badeanlegg". Cover Treningsgrupper og svømmeklubbe trenger enkel booking av gym, styrkerom og basseng med fleksible tidsslotter og gruppetakster.. Goal: satisfy search intent for "trenings" on digilist.no. The blog post itself must be in Norwegian Bokmål.
- **Business objective:** _why this matters (from the Linear issue)_
- **Repository / branch:** `/root/booking-brilliance` @ `agent/xal-570-content-gap-trenings-og-badeanlegg`
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
- One issue → one branch (`agent/xal-570-content-gap-trenings-og-badeanlegg`) → one independently reviewable change. Never main.
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

Auto-generated SEO content-gap request: [digilist.no](<http://digilist.no>) has no content targeting 'Trenings- og badeanlegg' (training and swimming facilities). The stated angle is that training groups and swim clubs ('Treningsgrupper og svømmeklubber') want simple booking of gym, strength rooms and pools with flexible time slots and group rates. The deliverable, per Scope and the run instruction, is a published Norwegian Bokmål blog post satisfying search intent for 'trenings' on [digilist.no](<http://digilist.no>) — not the booking feature itself.

## Scope

**Innenfor:**

* Create or expand marketing/SEO content covering 'Trenings- og badeanlegg'
* Content written in Norwegian Bokmål
* Cover the angle: booking of gym, styrkerom and basseng with flexible tidsslotter and gruppetakster for treningsgrupper og svømmeklubber
* Target search intent for the keyword 'trenings' on [digilist.no](<http://digilist.no>)

**Utenfor:**

* Building or changing the actual booking product feature (gym/pool booking, time slots, group-rate engine)
* Changes outside the marketing repository
* Unrelated refactors or drive-by fixes
* Direct merges to main

## Acceptance Criteria

- [ ] A Norwegian Bokmål page/post covering 'Trenings- og badeanlegg' exists and is published on [digilist.no](<http://digilist.no>)
- [ ] The content addresses booking of gym, styrkerom and basseng, flexible tidsslotter, and gruppetakster
- [ ] The page targets the search term 'trenings' (title/heading/body reference the theme)
- [ ] Existing tests and build pass (green CI)
- [ ] No regression in existing published content or user-facing behaviour

## Testing Scenario

* Given the content is published, When a reader visits the new page on [digilist.no](<http://digilist.no>), Then it renders in Norwegian Bokmål and describes booking of gym, styrkerom and basseng with flexible time slots and group rates
* Given a search for 'trenings'-related intent, When the site is crawled/indexed, Then the new page is present and on-topic for training/swimming facilities
* Given CI runs on the branch, When the build and tests execute, Then they pass with no regression to existing content

## Verdi: unknown — ingen prioritet satt; et menneske vurderer verdien

Enhancement, so no severity. Value is unknown: the only stated justification is an auto-generated 'from search demand' assertion plus a keyword cluster (cluster:booking treningsanlegg timeplan styrketrening) with no search-volume data, no named blocked user, and no commitment. A plausible target audience (treningsgrupper/svømmeklubber) is named but that is the generator's hypothesis, not validated demand. A human should attach real demand evidence before this is prioritised.

## Målrepo: `marketing`

*Valgt av triage fra sakens innhold; ruter forberedelsen dit.*

## Åpne spørsmål

* What actual search-demand data backs this (keyword volume, impressions, or ranking gap for 'trenings')? The issue asserts demand but provides no figures.
* Is the deliverable strictly content, or does it imply the described booking capability (gym/pool booking, flexible slots, group rates) must exist in the product? If the capability does not exist, does the content overpromise?
* Which market does this target — offentlig/kommune facilities or privat/utleie, or both? The examples (svømmeklubber, treningsgrupper) span both.
* Where should the content live and in what format (new blog post, landing page, expansion of an existing page)?
* Are there specific target keywords beyond the stem 'trenings', and is there an existing page this should expand rather than duplicate?

---

*Strukturert av triage-agenten. Originalteksten er bevart under.*

<details><summary>Opprinnelig beskrivelse</summary>

**SEO route:** content → `content-agent` · repo `marketing`

**Classification:** feature · severity major · priority P1

## Problem statement

Product gap: Content gap: Trenings- og badeanlegg. Treningsgrupper og svømmeklubbe trenger enkel booking av gym, styrkerom og basseng med fleksible tidsslotter og gruppetakster. Current assessment: gap (feature, major).

## Scope

Create or expand content covering "Trenings- og badeanlegg" aligned with Treningsgrupper og svømmeklubbe trenger enkel booking av gym, styrkerom og basseng med fleksible tidsslotter og gruppetakster.

## Out of scope

Changes outside the target repository for this issue. Unrelated refactors, drive-by fixes, or direct merges to main. Scope creep beyond the stated feature or improvement goal.

## Acceptance criteria

- [ ] Create or expand content covering "Trenings- og badeanlegg" aligned with Treningsgrupper og svømmeklubbe trenger enkel booking av gym, styrkerom og basseng med fleksible tidsslotter og gruppetakster.
- [ ] All relevant tests and build pass (green CI).
- [ ] No regression in existing user-facing behaviour.

## Code analysis (evidence, marketing @ seo-run)

Status: **gap** (confidence 95%)

* (no direct code hits; see details)

## Source

Product idea (cluster:booking treningsanlegg timeplan styrketrening), from search demand

## Run as Claude loop (in `/root/booking-brilliance`, on a new branch)

```
/loop Write and publish SEO content for "Trenings- og badeanlegg". Cover Treningsgrupper og svømmeklubbe trenger enkel booking av gym, styrkerom og basseng med fleksible tidsslotter og gruppetakster.. Goal: satisfy search intent for "trenings" on digilist.no. The blog post itself must be in Norwegian Bokmål.
```

---

*Auto-generated by Digilist Improvements Agent (Linear specialist) from cluster:booking treningsanlegg timeplan styrketrening + code analysis (graph @ seo-run). Move to the approval state to prepare an implementation branch.*

</details>

Linear: https://linear.app/xala-technologies/issue/XAL-570/content-gap-trenings-og-badeanlegg
