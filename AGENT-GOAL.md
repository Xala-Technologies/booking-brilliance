# XAL-365: [marketing] [SEO error] h1.missing — /blogg/bookingsoftware-kommune-sammenligning-pris

> Auto-prepared by Digilist Improvements Agent. Run Claude in this worktree:
> `/loop [marketing] [SEO error] h1.missing — /blogg/bookingsoftware-kommune-sammenligning-pris`

## Implementation contract — complete this before writing code
- **Problem:** [marketing] [SEO error] h1.missing — /blogg/bookingsoftware-kommune-sammenligning-pris
- **Business objective:** _why this matters (from the Linear issue)_
- **Repository / branch:** `/root/booking-brilliance` @ `agent/xal-365-blogg-bookingsoftware-kommune`
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
- One issue → one branch (`agent/xal-365-blogg-bookingsoftware-kommune`) → one independently reviewable change. Never main.
- Smallest valid change. No opportunistic refactoring, no broad formatting changes, no hidden dependency on another open PR.
- Validation is mandatory and staged — "code written" ≠ "compiled" ≠ "tests passed" ≠ "acceptance demonstrated". Collect evidence (test output / logs) before opening the PR.
- If scope expands beyond "Files likely affected", or the change grows large, STOP and escalate ("BLOCKED:") rather than pressing on.
- Open a PR only when green (otherwise a draft PR with a note). Delete this file before opening the PR.

## Full issue — from Linear (the source of truth for scope & acceptance)
> The Linear MCP in this environment may be bound to the WRONG workspace, so
> do NOT rely on it to read this ticket — everything you need is below. If
> something essential is genuinely missing here (e.g. a screenshot), STOP and
> end with "CLARIFICATION:" rather than guessing.

**Classification:** bug · severity minor · priority P3

Product gap: [marketing] [SEO error] h1.missing — /blogg/bookingsoftware-kommune-sammenligning-pris. <!-- xaheen-triage -->
**defect** · severity minor — Only one blog article is affected, the page still renders and is readable, and no core booking/rental flow, data, or security is impacted — a missing semantic heading is an SEO/accessibility markup gap, not a broken flow, despite the issue's own 'major' label.

The blog page [https://digilist.no/blogg/bookingsoftware-kommune-sammenligning-pris](<https://digilist.no/blogg/bookingsoftware-kommune-sammenligning-pris>) renders with no <h1> element, per an SEO crawler finding (marketing:crawl:h1.missing). This is an on-page SEO/semantic-markup gap on a single blog article.

**Done when**

- [ ] The page renders exactly one <h1> containing the article's primary heading
- [ ] Re-running the seo-crawler against the URL no longer reports h1.missing
- [ ] No regression to the page's existing visible content or layout

**How to verify**

* Load the URL and inspect the DOM for a single <h1> element
* Re-run seo-crawler against the URL and confirm h1.missing is cleared

**Open questions**

* Why is the h1 missing — template markup issue, CMS content missing a title field, or heading level mis-mapped (e.g. h1 rendered as h2)? The issue only reports the crawler finding, not the root cause.

Target repo: `marketing`

<details><summary>Reporter's original text</summary>

**SEO route:** technical → `improvements-agent` · repo `marketing`

**Classification:** bug · severity major · priority P1

## Problem statement

[marketing] [SEO error] h1.missing — /blogg/bookingsoftware-kommune-sammenligning-pris. No <h1> on page Observed at [https://digilist.no/blogg/bookingsoftware-kommune-sammenligning-pris](<https://digilist.no/blogg/bookingsoftware-kommune-sammenligning-pris>). Classification: bug/major — fixable. Relevant code: [https://digilist.no/blogg/bookingsoftware-kommune-sammenligning-pris](<https://digilist.no/blogg/bookingsoftware-kommune-sammenligning-pris>).

## Scope

Fix technical SEO issue (marketing:crawl:h1.missing:[https://digilist.no/blogg/bookingsoftware-kommune-sammenligning-pris](<https://digilist.no/blogg/bookingsoftware-kommune-sammenligning-pris>)): No <h1> on page Touch points: [https://digilist.no/blogg/bookingsoftware-kommune-sammenligning-pris](<https://digilist.no/blogg/bookingsoftware-kommune-sammenligning-pris>) (No <h1> on page).

## Out of scope

Changes outside the target repository for this issue. Unrelated refactors, drive-by fixes, or direct merges to main. Expanding scope beyond reproducing and fixing the reported defect.

## Acceptance criteria

- [ ] Fix technical SEO issue (marketing:crawl:h1.missing:[https://digilist.no/blogg/bookingsoftware-kommune-sammenligning-pris](<https://digilist.no/blogg/bookingsoftware-kommune-sammenligning-pris>)): No <h1> on page
- [ ] All relevant tests and build pass (green CI).

…(truncated)

</details> Current assessment: exists (bug, minor). Relevant code: src/pages/BlogPost.tsx:198, src/entry-server.tsx + src/entry-server.h1.test.tsx, direct SSR render test run against current main for /blogg/bookingsoftware-kommune-sammenligning-pris, origin/agent/xal-331-marketing-seo-error-h1-missing-blogg-bookingsoft.

**Scope**
No code change needed. Re-run the seo-crawler against the URL — the finding predates or missed the shared entry-server SSR fix (PR #74 / XAL-310 guard) that already renders a single correct <h1> for every blog post, confirmed by direct SSR render of this exact route on current main. Touch points: src/pages/BlogPost.tsx:198 (renders EditorialHeading as="h1" with post.title for every blog post via the shared template); src/entry-server.tsx + src/entry-server.h1.test.tsx (SSR prerender guard (XAL-310) throws the build if any route resolves without content; regression tests assert exactly one <h1> per route); direct SSR render test run against current main for /blogg/bookingsoftware-kommune-sammenligning-pris (produced exactly 1 <h1> containing the post title — verified live, not assumed); origin/agent/xal-331-marketing-seo-error-h1-missing-blogg-bookingsoft (stale prior agent attempt: no PR, no real fix, branch is hundreds of files diverged from main — not the source of the current (correct) behavior).

**Done when**

- [ ] No code change needed. Re-run the seo-crawler against the URL — the finding predates or missed the shared entry-server SSR fix (PR #74 / XAL-310 guard) that already renders a single correct <h1> for every blog post, confirmed by direct SSR render of this exact route on current main.

## Code analysis (evidence, marketing @ e55c0be1)

Status: **exists** (confidence 93%)

* `src/pages/BlogPost.tsx:198` — renders EditorialHeading as="h1" with post.title for every blog post via the shared template
* `src/entry-server.tsx + src/entry-server.h1.test.tsx` — SSR prerender guard (XAL-310) throws the build if any route resolves without content; regression tests assert exactly one <h1> per route
* `direct SSR render test run against current main for /blogg/bookingsoftware-kommune-sammenligning-pris` — produced exactly 1 <h1> containing the post title — verified live, not assumed
* `origin/agent/xal-331-marketing-seo-error-h1-missing-blogg-bookingsoft` — stale prior agent attempt: no PR, no real fix, branch is hundreds of files diverged from main — not the source of the current (correct) behavior

## Source

Product idea (XAL-365), from search demand

## Run as Claude loop (in `/root/booking-brilliance`, on a new branch)

```
/loop [marketing] [SEO error] h1.missing — /blogg/bookingsoftware-kommune-sammenligning-pris
```

---

*Auto-generated by Digilist Improvements Agent (Linear specialist) from XAL-365 + code analysis (graph @ e55c0be1). Move to the approval state to prepare an implementation branch.*

Linear: https://linear.app/xala-technologies/issue/XAL-365/marketing-seo-error-h1missing-bloggbookingsoftware-kommune
