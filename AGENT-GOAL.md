# XAL-340: Content gap: Rapportering og Analyse

> Auto-prepared by Digilist Improvements Agent. Run Claude in this worktree:
> `/loop Skriv og publiser SEO-innhold for emnet "Rapportering og Analyse". Dekk Ledere trenger rapporter og statistikk over lokalbruk for planlegging, budsjettanalyse og ressursoptimalisering.. Mål: dekke søkeintensjon for "rapportering" på digilist.no.`

## Implementation contract — complete this before writing code
- **Problem:** Skriv og publiser SEO-innhold for emnet "Rapportering og Analyse". Dekk Ledere trenger rapporter og statistikk over lokalbruk for planlegging, budsjettanalyse og ressursoptimalisering.. Mål: dekke søkeintensjon for "rapportering" på digilist.no.
- **Business objective:** _why this matters (from the Linear issue)_
- **Repository / branch:** `/root/booking-brilliance` @ `agent/xal-340-content-gap-rapportering-og-analyse`
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
- One issue → one branch (`agent/xal-340-content-gap-rapportering-og-analyse`) → one independently reviewable change. Never main.
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

Auto-generated content-gap issue: [digilist.no](<http://digilist.no>) has no SEO content covering "Rapportering og Analyse" (reporting & analytics). The stated audience is managers ("Ledere") who need reports and statistics on facility usage ("lokalbruk") for planning, budget analysis, and resource optimization. The gap was derived from a search-demand cluster ("rapporter og statistikk booking") with 95% confidence that no matching content exists; there was no direct code match. Goal: cover the search intent for "rapportering" on [digilist.no](<http://digilist.no>).

## Scope

**In scope:**

* Create new, or expand existing, SEO/marketing content on [digilist.no](<http://digilist.no>) covering the topic "Rapportering og Analyse"
* Address the three manager needs named in the issue: planning, budget analysis ("budsjettanalyse"), and resource optimization ("ressursoptimalisering") based on facility-usage statistics
* Target the search intent for the keyword "rapportering"
* Publish in Norwegian Bokmål (product copy on [digilist.no](<http://digilist.no>))
* Keep CI green and introduce no regression in existing user-facing behaviour

**Out of scope:**

* Building or changing the actual reporting/analytics product feature in the app (this issue is content only)
* Changes outside the marketing/booking-brilliance repository
* Unrelated refactors, drive-by fixes, or direct merges to main
* Scope creep beyond the stated topic

## Acceptance Criteria

- [ ] A page/article covering "Rapportering og Analyse" is published on [digilist.no](<http://digilist.no>) and reachable from the site (a URL exists that did not before, or a named existing page is expanded)
- [ ] The content explicitly addresses all three needs from the issue: planning, budget analysis, and resource optimization from facility-usage statistics
- [ ] The content targets the "rapportering" search intent (topic present in title/headings/body)
- [ ] CI is green (all relevant tests and build pass)
- [ ] No regression in existing user-facing behaviour

## Testing Scenario

* Given the marketing site before this work, When you search [digilist.no](<http://digilist.no>) for "rapportering", Then no dedicated page covering reporting & analytics for managers is returned; After the change, a page on that topic is returned.
* Given the new/expanded page, When a reader opens it, Then it names facility-usage statistics for planning, budget analysis, and resource optimization aimed at managers.
* Given the branch, When CI runs, Then build and all relevant tests pass with no regression in existing pages.

## Value: low

low fordi belegget er tynt: saken navngir en persona (ledere) og en søkeetterspørsel-cluster, men gir ingen trafikk- eller volumtall, ingen inntekt og ingen forpliktelse — kun en auto-generert gap-vurdering.

## Target repo: `marketing`

*Chosen by triage from the issue's content; routes preparation there.*

## Open questions

* What is the actual search volume / target keywords behind the "rapporter og statistikk booking" cluster? The issue gives no numbers to justify P1/major priority.
* Which product capability should the content describe? Docs show real reporting exists (a `reporting` component for aggregated tenant/platform reporting + export, per-queue CSV export, SAF-T XML) — should the copy be grounded in these shipped features, or in aspirational manager dashboards for "lokalbruk" that may not yet exist?
* Which market/persona: offentlig/kommune managers, private utleiere, or both? "Ledere" and "lokalbruk" read public-sector, but the issue does not say.
* Is this a new page or an expansion of an existing one, and what does "done" mean for content quality (word count, internal links, CTA)? The auto-generated acceptance criteria are not checkable as written.
* The issue's own "Kjør som Claude-loop" block points at a local path `/Volumes/Laravel/Loveable/booking-brilliance` — confirm the marketing repo is Xala-Technologies/booking-brilliance and that content, not app code, is the target.

---

*Structured by the triage agent. Original text preserved below.*

<details><summary>Opprinnelig beskrivelse</summary>

**SEO route:** content → `content-agent` · repo `marketing`

**Klassifisering:** feature · alvorlighet major · prioritet P1

## Problem statement

Product gap: Content gap: Rapportering og Analyse. Ledere trenger rapporter og statistikk over lokalbruk for planlegging, budsjettanalyse og ressursoptimalisering. Current assessment: gap (feature, major).

## Scope

Create or expand content covering "Rapportering og Analyse" aligned with Ledere trenger rapporter og statistikk over lokalbruk for planlegging, budsjettanalyse og ressursoptimalisering.

## Out of scope

Changes outside the target repository for this issue. Unrelated refactors, drive-by fixes, or direct merges to main. Scope creep beyond the stated feature or improvement goal.

## Acceptance criteria

- [ ] Create or expand content covering "Rapportering og Analyse" aligned with Ledere trenger rapporter og statistikk over lokalbruk for planlegging, budsjettanalyse og ressursoptimalisering.
- [ ] All relevant tests and build pass (green CI).
- [ ] No regression in existing user-facing behaviour.

## Kodeanalyse (bevis, marketing @ seo-run)

Status: **gap** (konfidens 95 %)

* (ingen direkte kodetreff; se detaljer)

## Kilde

Produktidé (cluster:rapporter og statistikk booking), fra søkeetterspørsel

## Kjør som Claude-loop (i `/Volumes/Laravel/Loveable/booking-brilliance`, på en ny branch)

```
/loop Skriv og publiser SEO-innhold for emnet "Rapportering og Analyse". Dekk Ledere trenger rapporter og statistikk over lokalbruk for planlegging, budsjettanalyse og ressursoptimalisering.. Mål: dekke søkeintensjon for "rapportering" på digilist.no.
```

---

*Auto-generert av Digilist Improvements Agent (Linear specialist) fra cluster:rapporter og statistikk booking + kodeanalyse (graf @ seo-run). Flytt til godkjenningstilstand

Linear: https://linear.app/xala-technologies/issue/XAL-340/content-gap-rapportering-og-analyse
