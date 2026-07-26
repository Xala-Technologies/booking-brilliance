# XAL-209: Implement test run queue and worker lifecycle

> Auto-prepared by Digilist Improvements Agent. Run Claude in this worktree:
> `/loop Implement test run queue and worker lifecycle`

## Implementation contract — complete this before writing code
- **Problem:** Implement test run queue and worker lifecycle
- **Business objective:** _why this matters (from the Linear issue)_
- **Repository / branch:** `/root/booking-brilliance` @ `agent/xal-209-implement-test-run-queue-and-worker`
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
- One issue → one branch (`agent/xal-209-implement-test-run-queue-and-worker`) → one independently reviewable change. Never main.
- Smallest valid change. No opportunistic refactoring, no broad formatting changes, no hidden dependency on another open PR.
- Validation is mandatory and staged — "code written" ≠ "compiled" ≠ "tests passed" ≠ "acceptance demonstrated". Collect evidence (test output / logs) before opening the PR.
- If scope expands beyond "Files likely affected", or the change grows large, STOP and escalate ("BLOCKED:") rather than pressing on.
- Open a PR only when green (otherwise a draft PR with a note). Delete this file before opening the PR.

## Full issue — from Linear (the source of truth for scope & acceptance)
> The Linear MCP in this environment may be bound to the WRONG workspace, so
> do NOT rely on it to read this ticket — everything you need is below. If
> something essential is genuinely missing here (e.g. a screenshot), STOP and
> end with "CLARIFICATION:" rather than guessing.

**Classification:** feature · severity minor · priority P3

Product gap: Implement test run queue and worker lifecycle. <!-- xaheen-triage -->

## Problem Statement

There is no queue path from API trigger to worker execution for test runs: no way to enqueue a run via API, no safe worker claim mechanism, no persistence of run state transitions, and no observability/retry for failed worker attempts.

## Scope

**In scope:**

* API capability to enqueue a run
* Worker mechanism to safely claim queued runs
* Persistence of run state transitions
* Observability of failed worker attempts
* Retry mechanism for failed worker attempts

**Out of scope:**
*Ikke oppgitt i saken.*

## Acceptance Criteria

- [ ] Given a valid trigger request, when the API is called, then a new run is created and enqueued.
- [ ] Given a queued run and multiple workers polling concurrently, when a claim is attempted, then exactly one worker successfully claims the run and others cannot claim it again.
- [ ] Given a run progressing through its lifecycle, when a state transition occurs, then the new state is persisted and retrievable.
- [ ] Given a worker attempt fails, when the failure occurs, then the failure is observable (visible in run state/logs) and the run is retryable.

## Testing Scenario

* Given no existing run, when a client calls the enqueue API, then a run is created in queued state with a retrievable identifier.
* Given one queued run and two workers polling at the same time, when both attempt to claim it, then only one worker's claim succeeds and the other sees it already claimed.
* Given a claimed run, when the worker moves it through its lifecycle states, then each transition is persisted and the run's current state is queryable at every step.
* Given a worker attempt that fails mid-execution, when the failure happens, then the run is marked failed with the failure reason observable, and the run can be retried.

## Value: unknown — no priority set; a human decides the value

Value is unknown because the issue lists only functional acceptance criteria — no users, workflows, deadlines, or business impact named that this unblocks.

## Open questions

* Which repository does this belong to? Nothing in the issue indicates whether 'test run' means product-level test execution, platform-level job infrastructure, or something else — too thin to assign app/marketing/platform with confidence.
* What does 'test run' refer to concretely (e.g., e2e/QA test execution, a customer-facing feature, internal CI)?
* Who or what are the 'workers' — existing processes/agents, or new infrastructure to be built?
* What retry policy is expected (max attempts, backoff, manual vs automatic retry)?
* What queue/storage technology should back this (existing system vs new)?

---

*Structured by the triage agent.

<details><summary>Reporter's original text</summary>

Create the queue path from API trigger to worker execution.

Acceptance criteria:

* API can enqueue a run.
* Worker claims queued runs safely.
* Run state transitions are persisted.
* Failed worker attempts are observable and retryable.

</details> Current assessment: gap (feature, minor). Relevant code: tools/improvements-agent/src/implement-run.ts:45-183 (acquireImplementLock, runImplementQueue, implementPending), tools/content-agent/src/orchestrate.ts:19-32 (worker), convex/content/runs.ts, convex/seo/runs.ts, convex/audits/runs.ts, repo scope.

**Scope**
Do not build blind. This ticket describes generic job-queue/worker infrastructure ('test run' enqueue, safe claim, state persistence, retry) with no concrete consumer anywhere in this repo — the repo's Convex 'run' tables (content/seo/audits) are synchronous start/finish trackers, not a queue, and the only claim/lock pattern that exists (improvements-agent's PID lockfile) is for content-improvement code-gen, not tests. The ticket's own open questions admit it can't be confidently assigned to app/marketing/platform and doesn't define what 'test run' or 'worker' means concretely. Route this back to a human for re-triage to identify the correct target repo and a concrete use case (e.g. actual e2e/CI test execution service) before any implementation; building generic queue scaffolding here would produce unused infrastructure. Touch points: tools/improvements-agent/src/implement-run.ts:45-183 (acquireImplementLock, runImplementQueue, implementPending) (closest existing analog: PID-lockfile safe-claim + file-based queue, but for content-improvement code-gen runs, not test runs; no retry/backoff on failure, just log-and-drop); tools/content-agent/src/orchestrate.ts:19-32 (worker) (generic bounded-concurrency task runner, not a persisted/claimed job system); convex/content/runs.ts, convex/seo/runs.ts, convex/audits/runs.ts (existing 'run' tables are simple synchronous start/finish mutations with no queue, claim, or retry semantics); repo scope (git log (last 15 commits) is 100% marketing/blog-post PRs; no 'test run'/QA/e2e/CI-run product concept exists anywhere in this repo (grep confirmed zero hits outside unrelated prose)).

**Done when**

- [ ] Do not build blind. This ticket describes generic job-queue/worker infrastructure ('test run' enqueue, safe claim, state persistence, retry) with no concrete consumer anywhere in this repo — the repo's Convex 'run' tables (content/seo/audits) are synchronous start/finish trackers, not a queue, and the only claim/lock pattern that exists (improvements-agent's PID lockfile) is for content-improvement code-gen, not tests. The ticket's own open questions admit it can't be confidently assigned to app/marketing/platform and doesn't define what 'test run' or 'worker' means concretely. Route this back to a human for re-triage to identify the correct target repo and a concrete use case (e.g. actual e2e/CI test execution service) before any implementation; building generic queue scaffolding here would produce unused infrastructure.

## Code analysis (evidence, marketing @ fdb830d6)

Status

Linear: https://linear.app/xala-technologies/issue/XAL-209/implement-test-run-queue-and-worker-lifecycle
