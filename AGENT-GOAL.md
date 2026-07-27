# XAL-758: [SEO ROI 67] Fang AI-svar: beste nettside for å leie lokale, hytte eller utstyr i Norge

> Auto-prepared by Digilist Improvements Agent. Run Claude in this worktree:
> `/loop [SEO ROI 67] Fang AI-svar: beste nettside for å leie lokale, hytte eller utstyr i Norge`

## Implementation contract — complete this before writing code
- **Problem:** [SEO ROI 67] Fang AI-svar: beste nettside for å leie lokale, hytte eller utstyr i Norge
- **Business objective:** _why this matters (from the Linear issue)_
- **Repository / branch:** `/root/booking-brilliance` @ `agent/xal-758-fang-ai-svar-beste-nettside-for-a-leie`
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
- One issue → one branch (`agent/xal-758-fang-ai-svar-beste-nettside-for-a-leie`) → one independently reviewable change. Never main.
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

Product gap: [SEO ROI 67] Fang AI-svar: beste nettside for å leie lokale, hytte eller utstyr i Norge. <!-- xaheen-triage -->
**enhancement** · value medium — Commercial-intent query with competitor presence, but value estimate (88/100) from Opportunity Agent only—no independent demand data.

AI engines (Claude, Google, Perplexity) and search results cite competitors (Airbnb, [norgesbooking.no](<http://norgesbooking.no>), Hygglo, [FINN.no](<http://FINN.no>)) for renting venues, cabins, and equipment in Norway, but never Digilist. This costs us SEO traffic and answer-engine citations for a commercial-intent query.

**Done when**

- [ ] Publish authoritative, citable page on [digilist.no](<http://digilist.no>) answering 'beste nettside for å leie lokale, hytte eller utstyr i Norge' with structured data for AI extraction
- [ ] Post-publish: Digilist appears in Google page 1 and is cited by AI engines (Claude/Perplexity/Google)

**How to verify**

* Ask Claude/Perplexity the query post-publish and verify [digilist.no](<http://digilist.no>) is cited
* Search the exact Norwegian phrase in Google and confirm Digilist page 1 ranking

**Open questions**

* Content type and location unspecified—new blog post, landing page, or edit existing page?
* No independent search volume or user demand data beyond Opportunity Agent scoring

Target repo: `marketing`

<details><summary>Reporter's original text</summary>

**ROI-score 67/100** — rangert av Opportunity Agent på verdi, ikke søkevolum.

| Faktor | Verdi |
| -- | -- |
| Inntektspotensial | 88 |
| Innsats | 85 |
| Konkurranse | 70 |
| Datasikkerhet | 100 |
| Intensjon | commercial |

**Hvorfor:** AI-motorer siterer Airbnb, [norgesbooking.no](<http://norgesbooking.no>), Hygglo men ikke oss for «beste nettside for å leie lokale, hytte eller utstyr i Norge» — publiser autoritativt, siterbart svar

Kilde: AEO-observasjon — synlighet i AI-svar (Claude/Google/OpenAI/Perplexity). Type: `capture-ai-answer`.

</details> Current assessment: exists (nice-to-have, minor). Relevant code: src/content/blog/beste-nettside-leie-lokale-hytte-utstyr-norge.md, 076ae52 (PR #189, XAL-675), a291729 (PR #193).

**Scope**
No code work needed. The 'Done when' content requirement (authoritative, citable, structured-data page answering the query) is already published on main. Remaining 'Done when' items are post-publish external verification (Google ranking, AI citation checks) which are marketing/observability follow-ups, not repo code changes. Touch points: src/content/blog/beste-nettside-leie-lokale-hytte-utstyr-norge.md (published post titled 'Beste nettside for å leie lokale, hytte eller utstyr i Norge (2026)', schema: FAQPage with faqQuestion/faqAnswer matching the exact query, comparison table vs Airbnb/Hygglo/norgesbooking.no/Finn.no/Selskapslokaler.no/Leiet.no/Inatur.no, sourced and dated); 076ae52 (PR #189, XAL-675) (created the post naming [Finn.no/Selskapslokaler/Leiet/Inatur](<http://Finn.no/Selskapslokaler/Leiet/Inatur>) for AEO); a291729 (PR #193) (most recent copy/language pass touching this post, confirmed merged: git merge-base --is-ancestor 076ae52 origin/main => YES).

**Done when**

- [ ] No code work needed. The 'Done when' content requirement (authoritative, citable, structured-data page answering the query) is already published on main. Remaining 'Done when' items are post-publish external verification (Google ranking, AI citation checks) which are marketing/observability follow-ups, not repo code changes.

## Code analysis (evidence, marketing @ 725c87de)

Status: **exists** (confidence 95%)

* `src/content/blog/beste-nettside-leie-lokale-hytte-utstyr-norge.md` — published post titled 'Beste nettside for å leie lokale, hytte eller utstyr i Norge (2026)', schema: FAQPage with faqQuestion/faqAnswer matching the exact query, comparison table vs Airbnb/Hygglo/norgesbooking.no/Finn.no/Selskapslokaler.no/Leiet.no/Inatur.no, sourced and dated
* `076ae52 (PR #189, XAL-675)` — created the post naming [Finn.no/Selskapslokaler/Leiet/Inatur](<http://Finn.no/Selskapslokaler/Leiet/Inatur>) for AEO
* `a291729 (PR #193)` — most recent copy/language pass touching this post, confirmed merged: git merge-base --is-ancestor 076ae52 origin/main => YES

## Source

Product idea (XAL-758), from search demand

## Run as Claude loop (in `/root/booking-brilliance`, on a new branch)

```
/loop [SEO ROI 67] Fang AI-svar: beste nettside for å leie lokale, hytte eller utstyr i Norge
```

---

*Auto-generated by Digilist Improvements Agent (Linear specialist) from XAL-758 + code analysis (graph @ 725c87de). Move to the approval state to prepare an implementation branch.*

Linear: https://linear.app/xala-technologies/issue/XAL-758/seo-roi-67-fang-ai-svar-beste-nettside-for-a-leie-lokale-hytte-eller
