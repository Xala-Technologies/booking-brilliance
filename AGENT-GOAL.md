# XAL-1053: E2E failure: blog index lists posts and a post opens with its cover + body

> Auto-prepared by Digilist Improvements Agent. Run Claude in this worktree:
> `/loop Fix the E2E failure "blog index lists posts and a post opens with its cover + body" (against https://digilist.no). Error: TimeoutError: locator.click: Timeout 12000ms exceeded.
Call log:
  - waiting for locator('a[href^="/blogg/"]').first()
    - locator resolved to <a href="/blogg/velge-bryllupslokale-guide-2026" class="group block relative py-8 lg:py-12 transition-colors duration-quick ease-editorial hover:bg-paper-deep/40">…</a>
  - attempting click action
    - waiting for element to be visible, enabled and stabl. Reproduce with `pnpm e2e:test`, find and fix the root cause, verify the journey is green, run full test/build and open a PR. Do not work on main.`

## Implementation contract — complete this before writing code
- **Problem:** Fix the E2E failure "blog index lists posts and a post opens with its cover + body" (against https://digilist.no). Error: TimeoutError: locator.click: Timeout 12000ms exceeded.
Call log:
  - waiting for locator('a[href^="/blogg/"]').first()
    - locator resolved to <a href="/blogg/velge-bryllupslokale-guide-2026" class="group block relative py-8 lg:py-12 transition-colors duration-quick ease-editorial hover:bg-paper-deep/40">…</a>
  - attempting click action
    - waiting for element to be visible, enabled and stabl. Reproduce with `pnpm e2e:test`, find and fix the root cause, verify the journey is green, run full test/build and open a PR. Do not work on main.
- **Business objective:** _why this matters (from the Linear issue)_
- **Repository / branch:** `/root/booking-brilliance` @ `agent/xal-1053-e2e-failure-blog-index-lists-posts-and-a`
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
- One issue → one branch (`agent/xal-1053-e2e-failure-blog-index-lists-posts-and-a`) → one independently reviewable change. Never main.
- Smallest valid change. No opportunistic refactoring, no broad formatting changes, no hidden dependency on another open PR.
- Validation is mandatory and staged — "code written" ≠ "compiled" ≠ "tests passed" ≠ "acceptance demonstrated". Collect evidence (test output / logs) before opening the PR.
- If scope expands beyond "Files likely affected", or the change grows large, STOP and escalate ("BLOCKED:") rather than pressing on.
- Open a PR only when green (otherwise a draft PR with a note). Delete this file before opening the PR.

## Full issue — from Linear (the source of truth for scope & acceptance)
> The Linear MCP in this environment may be bound to the WRONG workspace, so
> do NOT rely on it to read this ticket — everything you need is below. If
> something essential is genuinely missing here (e.g. a screenshot), STOP and
> end with "CLARIFICATION:" rather than guessing.

**defect** · severity critical — E2E failure on marketing surface.

Blog index E2E journey times out on [https://digilist.no](<https://digilist.no>) when waiting to click the first blog link. Playwright waits 12 seconds for the link (href='/blogg/velge-bryllupslokale-guide-2026') to become visible and stable, then exceeds the timeout.

**Done when**

- [ ] Blog index E2E journey passes when run with `pnpm e2e:test`

**How to verify**

* Run `pnpm e2e:test` and verify the first blog link becomes clickable within the 12s timeout

**Open questions**

* Why doesn't the element stabilize within 12 seconds—is it network latency, a layout shift, or an interaction blocker?
* What is the complete error after 'waiting for element to be visible, enabled and stabl'?

Target repo: `marketing`

#### Run as Claude loop (in `/root/booking-brilliance`, on a new branch)

```
/loop Fix the E2E failure "blog index lists posts and a post opens with its cover + body" (against https://digilist.no). Error: TimeoutError: locator.click: Timeout 12000ms exceeded.
Call log:
  - waiting for locator('a[href^="/blogg/"]').first()
    - locator resolved to <a href="/blogg/velge-bryllupslokale-guide-2026" class="group block relative py-8 lg:py-12 transition-colors duration-quick ease-editorial hover:bg-paper-deep/40">…</a>
  - attempting click action
    - waiting for element to be visible, enabled and stabl. Reproduce with `pnpm e2e:test`, find and fix the root cause, verify the journey is green, run full test/build and open a PR. Do not work on main.
```

Linear: https://linear.app/xala-technologies/issue/XAL-1053/e2e-failure-blog-index-lists-posts-and-a-post-opens-with-its-cover
