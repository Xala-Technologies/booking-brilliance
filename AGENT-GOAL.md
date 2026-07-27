# XAL-750: 1 heading level skip(s) (e.g. h2 → h4) (a11y.heading.skip)

> Auto-prepared by Digilist Improvements Agent. Run Claude in this worktree:
> `/loop In the marketing repo (Digilist marketing site), fix an accessibility heading-outline skip (h1→h3, missing h2) on the Audience section of the shared UseCasePage.tsx component, which renders all ~38 /leie/* use-case pages (e.g. /leie/konfirmasjonslokale).

Root cause: in src/components/UseCasePage.tsx, the Audience section (around lines 256-278) renders `<SectionRule label="HVEM BRUKER DETTE" />` followed directly by persona cards whose titles are `<h3>` (line 265). `SectionRule` (src/components/editorial/SectionRule.tsx:9-28) always renders a `div`/`span`, never a heading element, so no `h2` exists between the page's `h1` (UseCasePage.tsx:190) and the persona `h3`s, producing a heading-level skip flagged by axe/a11y rule `a11y.heading.skip`.

Fix scope (single shared component, no page-by-page changes needed):
- In UseCasePage.tsx, add a semantically real but visually consistent `h2` directly above the persona grid in the Audience section, matching how the Problems section already does it correctly (UseCasePage.tsx:282-290 renders `SectionRule label="UTFORDRINGEN"` plus a separate visible `h2` "Det vi ser i dag").
- Do NOT change SectionRule's default rendering or add a default heading-level prop to it — it is reused as a decorative eyebrow label (not a real heading) across 100+ other call sites (OmOss.tsx, Transparens.tsx, MarketplaceHub.tsx, Status.tsx, BookingsystemUtleie.tsx, LokalerTilLeie*.tsx, etc.), so a global default change would introduce new heading-skip regressions elsewhere.
- Simplest safe option: insert an `<h2>` element (visually styled to fit the section, e.g. visually-hidden if no visible copy is wanted, or a small visible label like 'Hvem bruker dette' matching the Problems section's h2 styling) immediately before the `audience.map(...)` grid at UseCasePage.tsx:258, leaving `SectionRule` and the per-persona `h3` untouched.

Acceptance criteria:
- On /leie/konfirmasjonslokale (and by extension all ~38 pages using UseCasePage), the DOM heading sequence in the Audience section reads h1 → h2 → h3 with no skipped level.
- Visual appearance of the Audience section is unchanged (no visible layout/style regression) unless a small addition to match the Problems section's h2 pattern is deemed the right call.
- No other SectionRule usage elsewhere in the codebase gains or loses a heading element as an unintended side effect (grep for `SectionRule` usages and confirm none were touched).
- Run the project's existing test suite and any lint/typecheck scripts; all must be green before opening a PR.
- Open a PR against main with a description referencing this a11y.heading.skip fix.`

## Implementation contract — complete this before writing code
- **Problem:** In the marketing repo (Digilist marketing site), fix an accessibility heading-outline skip (h1→h3, missing h2) on the Audience section of the shared UseCasePage.tsx component, which renders all ~38 /leie/* use-case pages (e.g. /leie/konfirmasjonslokale).

Root cause: in src/components/UseCasePage.tsx, the Audience section (around lines 256-278) renders `<SectionRule label="HVEM BRUKER DETTE" />` followed directly by persona cards whose titles are `<h3>` (line 265). `SectionRule` (src/components/editorial/SectionRule.tsx:9-28) always renders a `div`/`span`, never a heading element, so no `h2` exists between the page's `h1` (UseCasePage.tsx:190) and the persona `h3`s, producing a heading-level skip flagged by axe/a11y rule `a11y.heading.skip`.

Fix scope (single shared component, no page-by-page changes needed):
- In UseCasePage.tsx, add a semantically real but visually consistent `h2` directly above the persona grid in the Audience section, matching how the Problems section already does it correctly (UseCasePage.tsx:282-290 renders `SectionRule label="UTFORDRINGEN"` plus a separate visible `h2` "Det vi ser i dag").
- Do NOT change SectionRule's default rendering or add a default heading-level prop to it — it is reused as a decorative eyebrow label (not a real heading) across 100+ other call sites (OmOss.tsx, Transparens.tsx, MarketplaceHub.tsx, Status.tsx, BookingsystemUtleie.tsx, LokalerTilLeie*.tsx, etc.), so a global default change would introduce new heading-skip regressions elsewhere.
- Simplest safe option: insert an `<h2>` element (visually styled to fit the section, e.g. visually-hidden if no visible copy is wanted, or a small visible label like 'Hvem bruker dette' matching the Problems section's h2 styling) immediately before the `audience.map(...)` grid at UseCasePage.tsx:258, leaving `SectionRule` and the per-persona `h3` untouched.

Acceptance criteria:
- On /leie/konfirmasjonslokale (and by extension all ~38 pages using UseCasePage), the DOM heading sequence in the Audience section reads h1 → h2 → h3 with no skipped level.
- Visual appearance of the Audience section is unchanged (no visible layout/style regression) unless a small addition to match the Problems section's h2 pattern is deemed the right call.
- No other SectionRule usage elsewhere in the codebase gains or loses a heading element as an unintended side effect (grep for `SectionRule` usages and confirm none were touched).
- Run the project's existing test suite and any lint/typecheck scripts; all must be green before opening a PR.
- Open a PR against main with a description referencing this a11y.heading.skip fix.
- **Business objective:** _why this matters (from the Linear issue)_
- **Repository / branch:** `/root/booking-brilliance` @ `agent/xal-750-1-heading-level-skip-s-e-g-h2-h4-a11y`
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
- One issue → one branch (`agent/xal-750-1-heading-level-skip-s-e-g-h2-h4-a11y`) → one independently reviewable change. Never main.
- Smallest valid change. No opportunistic refactoring, no broad formatting changes, no hidden dependency on another open PR.
- Validation is mandatory and staged — "code written" ≠ "compiled" ≠ "tests passed" ≠ "acceptance demonstrated". Collect evidence (test output / logs) before opening the PR.
- If scope expands beyond "Files likely affected", or the change grows large, STOP and escalate ("BLOCKED:") rather than pressing on.
- Open a PR only when green (otherwise a draft PR with a note). Delete this file before opening the PR.

## Full issue — from Linear (the source of truth for scope & acceptance)
> The Linear MCP in this environment may be bound to the WRONG workspace, so
> do NOT rely on it to read this ticket — everything you need is below. If
> something essential is genuinely missing here (e.g. a screenshot), STOP and
> end with "CLARIFICATION:" rather than guessing.

**Classification:** bug · severity minor · priority P2

Product gap: 1 heading level skip(s) (e.g. h2 → h4) (a11y.heading.skip). <!-- xaheen-triage -->
**defect** · severity minor — Heading outline broken for screen readers but content still accessible; fix is cheap (one shared component affecting 38 pages).

Rule a11y.heading.skip flagged heading outline breaks on leie/* marketing pages. Inspecting /leie/konfirmasjonslokale shows the Audience section jumps from h1 directly to h3, skipping h2. SectionRule in UseCasePage.tsx renders only a div instead of a heading tag. Affects ~38 pages via this shared component.

**Done when**

- [ ] Audience section on leie/* pages renders h2 before h3 persona items (h1→h2→h3 sequence)
- [ ] Visual appearance of Audience section unchanged
- [ ] No other SectionRule usage has heading level changes as side effect

**How to verify**

* Inspect /leie/konfirmasjonslokale DOM: Audience section shows h1→h2→h3 sequence with no skip

Target repo: `marketing`

<details><summary>Reporter's original text</summary>

**Classification:** bug · severity minor · priority P2

1 heading level skip(s) (e.g. h2 → h4) (a11y.heading.skip). 1 heading level skip(s) (e.g. h2 → h4)
Regel: a11y.heading.skip
Overflate: Marketing — [digilist.no](<http://digilist.no>)
Affiserte sider: 38
Eksempel-URL: [https://digilist.no/leie/konfirmasjonslokale](<https://digilist.no/leie/konfirmasjonslokale>) Observed at [https://digilist.no/leie/konfirmasjonslokale](<https://digilist.no/leie/konfirmasjonslokale>). Classification: bug/minor — gap. Relevant code: src/components/UseCasePage.tsx:190, src/components/UseCasePage.tsx:256-278, src/components/editorial/SectionRule.tsx:9-28, src/components/UseCasePage.tsx:282-290, src/pages/LeieKonfirmasjonslokale.tsx:1,6.

**Scope**
Add a semantic h2 heading for the Audience section in UseCasePage.tsx (around line 256-264), matching the pattern used by the other sections (e.g. Problems/'UTFORDRINGEN' at line 285). Keep the existing SectionRule visual label and the per-persona h3 items unchanged — either give SectionRule an optional 'headingLevel'/'as' prop that renders the label text as h2 while preserving current styling, or add a visually-consistent h2 (e.g. 'Hvem bruker dette') directly above the persona grid. This is a single shared-component fix that will remediate all 38 affected leie/* pages at once. Touch points: src/components/UseCasePage.tsx:190 (page h1 (hero title) is the only top-level heading before the Audience section); src/components/UseCasePage.tsx:256-278 (Au

…(truncated)

</details> Current assessment: gap (bug, minor). Relevant code: src/components/UseCasePage.tsx:190, src/components/UseCasePage.tsx:256-278, src/components/editorial/SectionRule.tsx:9-28, src/components/UseCasePage.tsx:282-290, src/pages/LeieKonfirmasjonslokale.tsx:1,6.

**Scope**
Add a visually-consistent h2 directly above the persona grid in the Audience section of UseCasePage.tsx (around line 257-258), matching the pattern already used in the Problems section (line 285-290). Do not change SectionRule's default output since it is reused as a non-heading eyebrow label across 100+ other call sites in the codebase. Touch points: src/components/UseCasePage.tsx:190 (page h1, the only top-level heading before Audience section); src/components/UseCasePage.tsx:256-278 (Audience section: SectionRule (div) then h3 persona names directly, no h2 in between); src/components/editorial/SectionRule.tsx:9-28 (SectionRule always renders a div/span, never a heading tag — used as decorative eyebrow label in 100+ call sites across the marketing site, so its default cannot be changed); src/components/UseCasePage.tsx:282-290 (sibling Problems section already does this correctly: SectionRule eyebrow + explicit visible h2 'Det vi ser i dag'); src/pages/LeieKonfirmasjonslokale.tsx:1,6 (one of ~38 pages rendered via UseCasePage, all affected identically).

**Done when**

- [ ] Add a visually-consistent h2 directly above the persona grid in the Audience section of UseCasePage.tsx (around line 257-258), matching the pattern already used in the Problems section (line 285-290). Do not change SectionRule's default output since it is reused as a non-heading eyebrow label across 100+ other call sites in the codebase.

## Code analysis (evidence, marketing @ 725c87de)

Status: **gap** (confidence 95%)

* `src/components/UseCasePage.tsx:190` — page h1, the only top-level heading before Audience section
* `src/components/UseCasePage.tsx:256-278` — Audience section: SectionRule (div) then h3 persona names directly, no h2 in between
* `src/components/editorial/SectionRule.tsx:9-28` — SectionRule always renders a div/span, never a heading tag — used as decorative eyebrow label in 100+ call sites across the marketing site, so its default cannot be changed
* `src/components/UseCasePage.tsx:282-290` — sibling Problems section already does this correctly: SectionRule eyebrow + explicit visible h2 'Det vi ser i dag'
* `src/pages/LeieKonfirmasjonslokale.tsx:1,6` — one of ~38 pages rendered via UseCasePage, all affected identically

## Source

Product idea (XAL-750), from search demand

## Run as Claude loop (in `/root/booking-brilliance`, on a new branch)

```
/loop In the marketing repo (Digilist marketing site), fix an accessibility heading-outline skip (h1→h3, missing h2) on the Audience section of the shared UseCasePage.tsx component, which renders all ~38 /leie/* use-case pages (e.g. /leie/konfirmasjonslokale).

Root cause: in src/components/UseCasePage.tsx, the Audience section (around lines 256-278) renders `<SectionRule label="HVEM BRUKER DETTE" />` followed directly by persona cards whose titles are `<h3>` (line 265). `SectionRule` (src/components/editorial/SectionRule.tsx:9-28) always renders a `div`/`span`, never a heading element, so no `h2` exists between the page's `h1` (UseCasePage.tsx:190) and the persona `h3`s, producing a heading-level skip flagged by axe/a11y rule `a11y.heading.skip`.

Fix sco

Linear: https://linear.app/xala-technologies/issue/XAL-750/1-heading-level-skips-eg-h2-h4-a11yheadingskip
