# XAL-724: [SEO ROI 46] Fiks side: https://digilist.no/lokaler-til-leie/fredrikstad

> Auto-prepared by Digilist Improvements Agent. Run Claude in this worktree:
> `/loop [SEO ROI 46] Fiks side: https://digilist.no/lokaler-til-leie/fredrikstad`

## Implementation contract — complete this before writing code
- **Problem:** [SEO ROI 46] Fiks side: https://digilist.no/lokaler-til-leie/fredrikstad
- **Business objective:** _why this matters (from the Linear issue)_
- **Repository / branch:** `/root/booking-brilliance` @ `agent/xal-724-fiks-side-https-digilist-no-lokaler-til`
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
- One issue → one branch (`agent/xal-724-fiks-side-https-digilist-no-lokaler-til`) → one independently reviewable change. Never main.
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

Product gap: [SEO ROI 46] Fiks side: [https://digilist.no/lokaler-til-leie/fredrikstad](<https://digilist.no/lokaler-til-leie/fredrikstad>). <!-- xaheen-triage -->
**defect** · severity minor — only one city landing page is affected, no core flow or data loss is implicated, and the issue gives no detail on what the 2 findings are or their real-world impact, so impact cannot be judged as higher

The digital twin's SEO opportunity scan flagged [https://digilist.no/lokaler-til-leie/fredrikstad](<https://digilist.no/lokaler-til-leie/fredrikstad>) with 2 SEO findings on the existing page content, giving it an ROI score of 46/100 (revenue potential 26, effort 20, competition 20, data confidence 30, commercial intent). The issue does not describe what the 2 findings actually are.

**Done when**
*Ikke oppgitt i saken.*

**How to verify**

* Re-run the SEO audit against /lokaler-til-leie/fredrikstad after the fix and confirm the 2 previously flagged findings no longer appear

**Open questions**

* What are the 2 specific SEO findings on this page (which elements/metadata/content are flagged)?
* Is this page's underperformance already affecting real traffic/rankings, or is 46/100 purely a modeled score?

Target repo: `marketing`

<details><summary>Reporter's original text</summary>

**ROI-score 46/100** — rangert av Opportunity Agent på verdi, ikke søkevolum.

| Faktor | Verdi |
| -- | -- |
| Inntektspotensial | 26 |
| Innsats | 20 |
| Konkurranse | 20 |
| Datasikkerhet | 30 |
| Intensjon | commercial |

**Hvorfor:** 2 SEO-funn på siden — fiks eksisterende innhold

Kilde: digital tvilling (GSC + SERP + page_intel). Type: `fix-page`.

</details> Current assessment: exists (nice-to-have, minor). Relevant code: src/content/lokalerByer.ts:367-395 (fredrikstad entry), src/pages/LokalerTilLeieBy.tsx, PR #157 'geo cities wave 3' (merged 2026-07-23, e67696a).

**Scope**
No concrete fix possible: the ticket itself states the underlying digital-twin scan gave no detail on what the 2 SEO findings actually are, and direct inspection of the live page (title, meta description length ~180 chars, canonical, [schema.org](<http://schema.org>) FAQ/breadcrumb/article markup, single H1, unique per-city prose, internal linking) shows nothing broken or thin that is specific to this one city — the template and content are already correct and shared identically across all city pages. Acting on this would mean guessing at findings that were never specified, risking speculative churn on a page that already ships real, unique, well-structured content. Recommend closing as not-actionable and asking the reporter/scan source for the actual 2 findings (e.g. via GSC/page_intel raw output) before opening a new ticket. Touch points: src/content/lokalerByer.ts:367-395 (fredrikstad entry) (unique, substantive intro/landscape/local/planning/example/FAQ content specific to Fredrikstad, not a thin templated swap); src/pages/LokalerTilLeieBy.tsx (page already has unique <SEO> title, meta description, canonical, OG image, FAQ schema, breadcrumbs, article schema, single H1 + proper H2 hierarchy, and internal links (types grid, footer, related pages)); PR #157 'geo cities wave 3' (merged 2026-07-23, e67696a) (Fredrikstad page was purpose-built with rich SEO content just days before this ticket; the title/meta pattern is shared verbatim across all 8 wave-3 cities, so nothing here is Fredrikstad-specific).

**Done when**

- [ ] No concrete fix possible: the ticket itself states the underlying digital-twin scan gave no detail on what the 2 SEO findings actually are, and direct inspection of the live page (title, meta description length ~180 chars, canonical, [schema.org](<http://schema.org>) FAQ/breadcrumb/article markup, single H1, unique per-city prose, internal linking) shows nothing broken or thin that is specific to this one city — the template and content are already correct and shared identically across all city pages. Acting on this would mean guessing at findings that were never specified, risking speculative churn on a page that already ships real, unique, well-structured content. Recommend closing as not-actionable and asking the reporter/scan source for the actual 2 findings (e.g. via GSC/page_intel raw output) before opening a new ticket.

## Code analysis (evidence, marketing @ 725c87de)

Status: **exists** (confidence 72%)

* `src/content/lokalerByer.ts:367-395 (fredrikstad entry)` — unique, substantive intro/landscape/local/planning/example/FAQ content specific to Fredrikstad, not a thin templated swap
* `src/pages/LokalerTilLeieBy.tsx` — page already has unique <SEO> title, meta description, canonical, OG image, FAQ schema, breadcrumbs, article schema, single H1 + proper H2 hierarchy, and internal links (types grid, footer, related pages)
* `PR #157 'geo cities wave 3' (merged 2026-07-23, e67696a)` — Fredrikstad page was purpose-built with rich SEO content just days before this ticket; the title/meta pattern is shared verbatim across all 8 wave-3 cities, so nothing here is Fredrikstad-specific

## Source

Product idea (XAL-724), from search demand

## Run as Claude loop (in `/root/booking-brilliance`, on a new branch)

```
/loop [SEO ROI 46] Fiks side: https://digilist.no/lokaler-til-leie/fredrikstad
```

---

*Auto-generated by Digilist Improvements Agent (Linear specialist) from XAL-724 + code analysis (graph @ 725c87de). Move to the approval state to prepare an implementation branch.*

Linear: https://linear.app/xala-technologies/issue/XAL-724/seo-roi-46-fiks-side-httpsdigilistnolokaler-til-leiefredrikstad
