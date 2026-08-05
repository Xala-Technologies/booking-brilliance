# XAL-956: [SEO ROI 53] Fang etterspørsel: barnebursdag lokale

> Auto-prepared by Digilist Improvements Agent. Run Claude in this worktree:
> `/loop [SEO ROI 53] Fang etterspørsel: barnebursdag lokale`

## Implementation contract — complete this before writing code
- **Problem:** [SEO ROI 53] Fang etterspørsel: barnebursdag lokale
- **Business objective:** _why this matters (from the Linear issue)_
- **Repository / branch:** `/root/booking-brilliance` @ `agent/xal-956-fang-ettersporsel-barnebursdag-lokale`
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
- One issue → one branch (`agent/xal-956-fang-ettersporsel-barnebursdag-lokale`) → one independently reviewable change. Never main.
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

Product gap: [SEO ROI 53] Fang etterspørsel: barnebursdag lokale. **enhancement** · value unknown — unknown because the only evidence is 17 impressions/0 clicks at position 18 for one query — no data on revenue, traffic volume, or how this compares to other opportunities; prior sibling issues (XAL-942, XAL-933, XAL-688) at similar or higher ROI scores were all corrected to value:low, so this is very likely in the same tier, not higher

Digilist ranks position 18 for the query "barnebursdag lokale" (17 impressions, 0 clicks, per GSC data in booking-brilliance/.xaheen/seo/gsc-report.json). The opportunity-agent auto-flagged it as commercial-intent demand worth capturing with new or deeper content.

**Done when**

- [ ] Content targeting "barnebursdag lokale" published or existing page deepened
- [ ] Next GSC pull shows improved position and/or clicks > 0 for this query

**How to verify**

* Re-run opportunity-agent's GSC pull after publish and confirm position moved up from ~18

**Open questions**

* What does '[SEO ROI 53]' mean relative to the other capture-demand tickets already scored low (XAL-942 ROI 52, XAL-933 ROI 50, XAL-688 ROI 52) — is 53 meaningfully different, or noise in the same band?
* Is 17 impressions/0 clicks enough search volume to justify dedicated content, or should this be batched with the other 'Fang etterspørsel' tickets per XWEB content-gaps precedent?

Target repo: `marketing` Current assessment: exists (nice-to-have, minor). Relevant code: src/pages/LeieBursdagslokale.tsx:16, src/pages/LeieBursdagslokale.tsx:137-149, src/App.tsx:322.

**Scope**
No code action. Content targeting this query already exists and is published; the low GSC position/clicks (17 impressions, pos 18, 0 clicks) reflects ranking maturity/authority, not a content gap, and matches the pattern of sibling 'Fang etterspørsel' tickets (XAL-942, XAL-933, XAL-688) already corrected to value:low. If desired, monitor next GSC pull rather than ship new content. Touch points: src/pages/LeieBursdagslokale.tsx:16 (seoDescription/keywords already contain the exact phrase 'barnebursdag lokale'); src/pages/LeieBursdagslokale.tsx:137-149 (dedicated FAQ item 'Hvor finner jeg lokale til barnebursdag?' answers the query intent directly); src/App.tsx:322 (page is live and routed at /leie/bursdagslokale).

**Done when**

- [ ] No code action. Content targeting this query already exists and is published; the low GSC position/clicks (17 impressions, pos 18, 0 clicks) reflects ranking maturity/authority, not a content gap, and matches the pattern of sibling 'Fang etterspørsel' tickets (XAL-942, XAL-933, XAL-688) already corrected to value:low. If desired, monitor next GSC pull rather than ship new content.

#### Run as Claude loop (in `/root/booking-brilliance`, on a new branch)

```
/loop [SEO ROI 53] Fang etterspørsel: barnebursdag lokale
```

*Auto-generated by Digilist Improvements Agent (Linear specialist) from XAL-956 + code analysis (graph @ e81b44b2). Move to the approval state to prepare an implementation branch.*

Linear: https://linear.app/xala-technologies/issue/XAL-956/seo-roi-53-fang-ettersporsel-barnebursdag-lokale
