# XAL-215: Build test run list and detail views

> Auto-prepared by Digilist Improvements Agent. Run Claude in this worktree:
> `/loop Build test run list and detail views`

## Implementation contract — complete this before writing code
- **Problem:** Build test run list and detail views
- **Business objective:** _why this matters (from the Linear issue)_
- **Repository / branch:** `/root/booking-brilliance` @ `agent/xal-215-build-test-run-list-and-detail-views`
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
- One issue → one branch (`agent/xal-215-build-test-run-list-and-detail-views`) → one independently reviewable change. Never main.
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

Product gap: Build test run list and detail views. <!-- xaheen-triage -->

## Problem Statement

There is no way to see test run history or inspect an individual test run's details in the UI.

## Scope

**In scope:**

* A run list view with filters for status, project, environment, and suite
* A run detail view showing status, timing, trigger source, command, logs, artifacts, and metadata
* Prioritized/surfaced diagnostics for failed runs on the detail view
* Polished empty and loading states for both views

**Out of scope:**

* Triggering, retrying, or canceling a test run (not mentioned)
* Editing or deleting run records (not mentioned)
* Real-time/live streaming of in-progress run logs (not mentioned)
* Notifications or alerting on run status (not mentioned)

## Acceptance Criteria

- [ ] Run list can be filtered by status
- [ ] Run list can be filtered by project
- [ ] Run list can be filtered by environment
- [ ] Run list can be filtered by suite
- [ ] Run detail displays status
- [ ] Run detail displays timing
- [ ] Run detail displays trigger source
- [ ] Run detail displays the command that was executed
- [ ] Run detail displays logs
- [ ] Run detail displays artifacts
- [ ] Run detail displays metadata
- [ ] For a failed run, diagnostic information is presented before other details
- [ ] The run list shows a polished empty state when no runs match
- [ ] The run list shows a polished loading state while fetching
- [ ] The run detail shows a polished empty state when no run/data is available
- [ ] The run detail shows a polished loading state while fetching

## Testing Scenario

* Given test runs exist across multiple statuses, when a user filters the run list by status, then only runs matching that status are shown
* Given test runs exist across multiple projects, when a user filters by project, then only runs for that project are shown
* Given test runs exist across multiple environments, when a user filters by environment, then only runs for that environment are shown
* Given test runs exist across multiple suites, when a user filters by suite, then only runs for that suite are shown
* Given a completed run, when a user opens its detail view, then status, timing, trigger source, command, logs, artifacts, and metadata are all visible
* Given a failed run, when a user opens its detail view, then diagnostic information (e.g. failure logs/error) is shown before other less-relevant details
* Given no runs match the current filters, when the run list loads, then a polished empty state is shown instead of a blank or broken table
* Given the run list is fetching data, when the page loads, then a polished loading state is shown
* Given the run detail is fetching data, when the page loads, then a polished loading state is shown

## Value: unknown — no priority set; a human decides the value

Enhancement — this is a request to build new views; the issue does not state who is blocked, what workaround (if any) exists today without this, or what triggered the request, so value cannot be scored above unknown.

## Open questions

* Which system's test runs are these — CI pipeline runs, an internal QA/e2e tool (e.g. journeylab), agent-fleet e2e runs, or something else? The issue does not say.
* Which repository owns this feature? Nothing in the issue ties it to app, marketing, or platform, and no existing 'test run' list/detail concept with these fields (suite, environment, trigger source, command, artifacts) was found in either the app or platform codebase.
* Who requested this and why — is any current work blocked without it?
* What defines 'useful diagnostics' for a failed run (e.g. stack trace, first failing assertion, screenshot) beyond 'surface them first'?
* Is there an existing data source/API for test runs to build these views against, or does that also need to be built?

---

*Structured by the triage agent.

<details><summary>Reporter's original text</summary>

Expose test run history and run details.

Acceptance criteria:

* Run list supports status, project, environment, and suite filters.
* Run detail shows status, timing, trigger source, command, logs, artifacts, and metadata.
* Failed runs surface useful diagnostics first.
* Empty and loading states are polished.

</details> Current assessment: gap (nice-to-have, minor). Relevant code: src/pages/Status.tsx, tools/content-agent, tools/knowledge-agent, tools/improvements-agent, package.json name digilist-booking-system.

**Scope**
No action in this repo. 'Test run list/detail' (status, environment, suite, trigger source, command, artifacts) is a CI/QA observability concept with zero surface area in this marketing/blog codebase — there is no test-run data model, API, or UI to extend. The ticket's own open questions admit the owning system is unknown (CI pipeline? e2e-agent fleet? journeylab?) and that no such concept was found in app or platform either. Building this here would mean inventing an entire unrelated feature in the wrong repo. If this is wanted, it belongs in whatever system actually runs/tracks the tests (e.g. the xaheen-agent-fleet e2e-agent), not the Digilist marketing site. Touch points: src/pages/Status.tsx (only 'list'-ish hit is SurfaceList; this is a public status page, not a test-run browser); tools/content-agent, tools/knowledge-agent, tools/improvements-agent (all 'run' hits are internal content/learning automation runs, not CI/QA test executions); package.json name digilist-booking-system (target repo is the public marketing/blog site, not a CI/QA/test-observability tool).

**Done when**

- [ ] No action in this repo. 'Test run list/detail' (status, environment, suite, trigger source, command, artifacts) is a CI/QA observability concept with zero surface area in this marketing/blog codebase — there is no test-run data model, API, or UI to extend. The ticket's own open questions admit the owning system is unknown (CI pipeline? e2e-agent fleet? j

Linear: https://linear.app/xala-technologies/issue/XAL-215/build-test-run-list-and-detail-views
