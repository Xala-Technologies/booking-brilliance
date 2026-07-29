# XAL-787: [SEO ROI 52] Løft rangering: leie festutstyr

> Auto-prepared by Digilist Improvements Agent. Run Claude in this worktree:
> `/loop In `marketing` repo (booking-brilliance), file `src/pages/UtstyrFestutstyr.tsx`: shorten the `seoDescription` prop (currently ~164 chars, line ~15) to 150-160 characters max, keeping the exact-match keyword 'leie festutstyr' near the start and preserving the call-to-action tone (Vipps booking, henting/levering). Leave `seoTitle` (57 chars, already fine) and `title`/H1 ('Leie festutstyr', already exact-match) unchanged — do not touch keywords, audience, or problems arrays. Verify: `grep -n seoDescription src/pages/UtstyrFestutstyr.tsx` and confirm char count <=160 with `python3 -c "print(len('...'))"`. Run the repo's existing lint/build checks (e.g. `pnpm lint`, `pnpm build` if present) and ensure they're green before opening a PR. Note an existing stale branch `agent/xal-787-loft-rangering-leie-festutstyr` only has a placeholder AGENT-GOAL.md commit with no real change — safe to start fresh from main. Open a PR titled like `fix(XAL-787): trim meta description on festutstyr page` once green.`

## Implementation contract — complete this before writing code
- **Problem:** In `marketing` repo (booking-brilliance), file `src/pages/UtstyrFestutstyr.tsx`: shorten the `seoDescription` prop (currently ~164 chars, line ~15) to 150-160 characters max, keeping the exact-match keyword 'leie festutstyr' near the start and preserving the call-to-action tone (Vipps booking, henting/levering). Leave `seoTitle` (57 chars, already fine) and `title`/H1 ('Leie festutstyr', already exact-match) unchanged — do not touch keywords, audience, or problems arrays. Verify: `grep -n seoDescription src/pages/UtstyrFestutstyr.tsx` and confirm char count <=160 with `python3 -c "print(len('...'))"`. Run the repo's existing lint/build checks (e.g. `pnpm lint`, `pnpm build` if present) and ensure they're green before opening a PR. Note an existing stale branch `agent/xal-787-loft-rangering-leie-festutstyr` only has a placeholder AGENT-GOAL.md commit with no real change — safe to start fresh from main. Open a PR titled like `fix(XAL-787): trim meta description on festutstyr page` once green.
- **Business objective:** _why this matters (from the Linear issue)_
- **Repository / branch:** `/root/booking-brilliance` @ `agent/xal-787-loft-rangering-leie-festutstyr`
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
- One issue → one branch (`agent/xal-787-loft-rangering-leie-festutstyr`) → one independently reviewable change. Never main.
- Smallest valid change. No opportunistic refactoring, no broad formatting changes, no hidden dependency on another open PR.
- Validation is mandatory and staged — "code written" ≠ "compiled" ≠ "tests passed" ≠ "acceptance demonstrated". Collect evidence (test output / logs) before opening the PR.
- If scope expands beyond "Files likely affected", or the change grows large, STOP and escalate ("BLOCKED:") rather than pressing on.
- Open a PR only when green (otherwise a draft PR with a note). Delete this file before opening the PR.

## Full issue — from Linear (the source of truth for scope & acceptance)
> The Linear MCP in this environment may be bound to the WRONG workspace, so
> do NOT rely on it to read this ticket — everything you need is below. If
> something essential is genuinely missing here (e.g. a screenshot), STOP and
> end with "CLARIFICATION:" rather than guessing.

**Classification:** improvement · severity minor · priority P3

Product gap: [SEO ROI 52] Løft rangering: leie festutstyr. <!-- xaheen-triage -->
**enhancement** · value low — Revenue potential assessed at 33/100 by automated analysis only.

The keyword 'leie festutstyr' ranks position 11 for commercial searches, just outside top 10. Opportunity Agent assessed this as ROI 52/100 with low revenue potential (33/100) and low effort (25/100).

**Done when**

- [ ] Keyword ranks in top 10 on commercial-intent searches.

**How to verify**

* Check GSC/SERP rank for 'leie festutstyr' before and after the change.

**Open questions**

* Which URL currently ranks position 11?
* What specific on-page changes are recommended?
* Should this be batched with XAL-713/715/736?

Target repo: `marketing`

<details><summary>Reporter's original text</summary>

**ROI-score 52/100** — rangert av Opportunity Agent på verdi, ikke søkevolum.

| Faktor | Verdi |
| -- | -- |
| Inntektspotensial | 33 |
| Innsats | 25 |
| Konkurranse | 40 |
| Datasikkerhet | 65 |
| Intensjon | commercial |

**Hvorfor:** rangerer pos 11 — løft til topp-10

Kilde: digital tvilling (GSC + SERP + page_intel). Type: `improve-ranking`.

</details> Current assessment: partial (improvement, minor). Relevant code: src/pages/UtstyrFestutstyr.tsx:11-16, src/components/UseCasePage.tsx:137-195, agent/xal-787-loft-rangering-leie-festutstyr@3912f09.

**Scope**
On-page SEO for 'leie festutstyr' is already close to optimal (exact-match H1/title, keyword-rich meta, keyword list). The only concrete, verifiable defect is the meta description running to 164 chars, past Google's ~155-160 char truncation guideline — same class of fix as the already-merged XAL-724 (Fredrikstad page). Trim it. Do not expect this alone to move rank 11→top10 (that's competition/backlinks/content-depth driven per the ROI note), so treat as a minor, low-confidence nudge, not a guaranteed ranking fix. Touch points: src/pages/UtstyrFestutstyr.tsx:11-16 (title/H1 'Leie festutstyr' is already exact-match; seoTitle 57 chars (fine); seoDescription is 164 chars, over the ~155-160 char guideline used in the already-merged XAL-724 fix); src/components/UseCasePage.tsx:137-195 (seoTitle/seoDescription feed <SEO> head tags and canonical; h1 renders `title` prop verbatim, already exact-match keyword); agent/xal-787-loft-rangering-leie-festutstyr@3912f09 (existing branch only adds a placeholder AGENT-GOAL.md, no real on-page change yet — safe to redo).

**Done when**

- [ ] On-page SEO for 'leie festutstyr' is already close to optimal (exact-match H1/title, keyword-rich meta, keyword list). The only concrete, verifiable defect is the meta description running to 164 chars, past Google's ~155-160 char truncation guideline — same class of fix as the already-merged XAL-724 (Fredrikstad page). Trim it. Do not expect this alone to move rank 11→top10 (that's competition/backlinks/content-depth driven per the ROI note), so treat as a minor, low-confidence nudge, not a guaranteed ranking fix.

## Code analysis (evidence, marketing @ 4aa24610)

Status: **partial** (confidence 55%)

* `src/pages/UtstyrFestutstyr.tsx:11-16` — title/H1 'Leie festutstyr' is already exact-match; seoTitle 57 chars (fine); seoDescription is 164 chars, over the ~155-160 char guideline used in the already-merged XAL-724 fix
* `src/components/UseCasePage.tsx:137-195` — seoTitle/seoDescription feed <SEO> head tags and canonical; h1 renders `title` prop verbatim, already exact-match keyword
* `agent/xal-787-loft-rangering-leie-festutstyr@3912f09` — existing branch only adds a placeholder AGENT-GOAL.md, no real on-page change yet — safe to redo

## Source

Product idea (XAL-787), from search demand

## Run as Claude loop (in `/root/booking-brilliance`, on a new branch)

```
/loop In `marketing` repo (booking-brilliance), file `src/pages/UtstyrFestutstyr.tsx`: shorten the `seoDescription` prop (currently ~164 chars, line ~15) to 150-160 characters max, keeping the exact-match keyword 'leie festutstyr' near the start and preserving the call-to-action tone (Vipps booking, henting/levering). Leave `seoTitle` (57 chars, already fine) and `title`/H1 ('Leie festutstyr', already exact-match) unchanged — do not touch keywords, audience, or problems arrays. Verify: `grep -n seoDescription src/pages/UtstyrFestutstyr.tsx` and confirm char count <=160 with `python3 -c "print(len('...'))"`. Run the repo's existing lint/build checks (e.g. `pnpm lint`, `pnpm build` if present) and ensure they're green before opening a PR. Note an existing stale branch `agent/xal-787-loft-rangering-leie-festutstyr` only has a placeholder AGENT-GOAL.md commit with no real change — safe to start fresh from main. Open a PR titled like `fix(XAL-787): trim meta description on festutstyr page` once green.
```

---

*Auto-generated by Digilist Improvements Agent (Linear specialist) from XAL-787 + code analysis (graph @ 4aa24610). Move to the approval state to prepare an implementation branch.*

Linear: https://linear.app/xala-technologies/issue/XAL-787/seo-roi-52-loft-rangering-leie-festutstyr
