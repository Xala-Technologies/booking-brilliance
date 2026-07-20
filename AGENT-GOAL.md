# XAL-670: E2E failure: contact paths are reachable from marketing CTAs

> Auto-prepared by Digilist Improvements Agent. Run Claude in this worktree:
> `/loop Fix the E2E failure "contact paths are reachable from marketing CTAs" (against https://digilist.no). Error: TimeoutError: locator.click: Timeout 12000ms exceeded.
Call log:
  - waiting for getByRole('link', { name: /kontakt|book demo|book-demo|møte oss/i }).first()
    - locator resolved to <a href="/book-demo" class="font-sans text-[0.95rem] text-ink-soft hover:text-ink transition-colors duration-quick ease-editorial whitespace-nowrap">Book demo</a>
  - attempting click action
    2 × waiting for eleme. Reproduce with `pnpm e2e:test`, find and fix the root cause, verify the journey is green, run full test/build and open a PR. Do not work on main.`

## Implementation contract — complete this before writing code
- **Problem:** Fix the E2E failure "contact paths are reachable from marketing CTAs" (against https://digilist.no). Error: TimeoutError: locator.click: Timeout 12000ms exceeded.
Call log:
  - waiting for getByRole('link', { name: /kontakt|book demo|book-demo|møte oss/i }).first()
    - locator resolved to <a href="/book-demo" class="font-sans text-[0.95rem] text-ink-soft hover:text-ink transition-colors duration-quick ease-editorial whitespace-nowrap">Book demo</a>
  - attempting click action
    2 × waiting for eleme. Reproduce with `pnpm e2e:test`, find and fix the root cause, verify the journey is green, run full test/build and open a PR. Do not work on main.
- **Business objective:** _why this matters (from the Linear issue)_
- **Repository / branch:** `/root/booking-brilliance` @ `agent/xal-670-e2e-failure-contact-paths-are-reachable-from-mar`
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
- One issue → one branch (`agent/xal-670-e2e-failure-contact-paths-are-reachable-from-mar`) → one independently reviewable change. Never main.
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

The Playwright E2E journey "contact paths are reachable from marketing CTAs" fails against the live marketing site ([https://digilist.no](<https://digilist.no>)). The locator getByRole('link', { name: /kontakt|book demo|book-demo|møte oss/i }).first() resolves to a real <a href="/book-demo">Book demo</a> element, but [locator.click](<http://locator.click>)() times out after 12000ms while attempting the click action. So the CTA link is present in the DOM but the click never completes within the journey.

## Scope

**Innenfor:**

* Reproduce the failing E2E journey "contact paths are reachable from marketing CTAs" (per the issue, via `pnpm e2e:test`)
* Identify the root cause of the click timeout on the resolved <a href="/book-demo"> "Book demo" CTA
* Fix that root cause on the marketing surface so the journey passes
* Confirm no regression in existing user-facing behaviour

**Utenfor:**

* Changes outside the target repository
* Unrelated refactors or drive-by fixes
* Direct merges to main
* Expanding scope beyond reproducing and fixing this reported E2E failure

## Acceptance Criteria

- [ ] The E2E journey "contact paths are reachable from marketing CTAs" passes (green) when run against the same target the issue used
- [ ] The resolved "Book demo" CTA is clickable and, when clicked, navigates to the contact path (/book-demo) within the journey's timeout
- [ ] Full test suite and build pass (green CI)
- [ ] No regression in existing user-facing marketing-site behaviour

## Testing Scenario

* Given the E2E suite is run per the issue (`pnpm e2e:test`), When the "contact paths are reachable from marketing CTAs" journey runs, Then it completes without a TimeoutError on [locator.click](<http://locator.click>).
* Given a user is on the marketing surface where the "Book demo" CTA is shown, When they click it, Then the browser navigates to /book-demo (the contact path) without the click being blocked or intercepted.
* Given the fix is applied, When the full test/build runs in CI, Then all checks pass and no previously-passing test regresses.

## Alvorlighetsgrad: minor

Defect: an E2E journey that was expected to pass is failing. The issue's own classification says 'major/P1', but that is the auto-generated label, not evidence. The only concrete evidence is a single Playwright click timeout against live: the link element resolves and exists, and the failure is on the click action (2× waiting for element) — a symptom equally consistent with a real intercepting overlay/animation blocking the CTA and with test flakiness or a stale selector. The text does not establish that real users are blocked from booking a demo, nor whether an alternate path to /book-demo exists. Per the rule to choose the lower severity when impact cannot be judged, this is set to minor. If investigation confirms the CTA is genuinely unclickable for real users on production with no other route to /book-demo, this rises to major (a conversion flow degraded for some users).

## Målrepo: `marketing`

*Valgt av triage fra sakens innhold; ruter forberedelsen dit.*

## Åpne spørsmål

* Is this a genuine user-facing break (the CTA is actually unclickable in a real browser) or E2E flakiness / a stale selector? The element resolved but the click timed out.
* What is intercepting or blocking the click? The truncated log ('2 × waiting for eleme…') suggests the element wasn't actionable — is it covered by a cookie/consent banner, sticky header, overlay, or mid-animation element?
* Which page(s) does the journey traverse, and which CTA is the failing one — the header 'Book demo' link shown in the log, or another CTA the journey also checks?
* Does /book-demo itself exist and load correctly, or is the failure purely in reaching the click?
* Does the failure reproduce locally / deterministically, or only intermittently against live [digilist.no](<http://digilist.no>)?
* What is the full, untruncated Playwright error and call log?

---

*Strukturert av triage-agenten. Originalteksten er bevart under.*

<details><summary>Opprinnelig beskrivelse</summary>

**Classification:** bug · severity major · priority P1

## Problem statement

E2E failure: contact paths are reachable from marketing CTAs. Playwright journey failed against [https://digilist.no](<https://digilist.no>). Error: TimeoutError: [locator.click](<http://locator.click>): Timeout 12000ms exceeded. Call log: - waiting for getByRole('link', { name: /kontakt|book demo|book-demo|møte oss/i }).first() - locator resolved to <a href="/book-demo" class="font-sans text-[0.95rem] text-ink-soft hover:text-ink transition-colors duration-quick ease-editorial whitespace-nowrap">Book demo</a> - attempting click action 2 × waiting for eleme Classification: bug/major — fixable.

## Scope

Fix the failing E2E journey "contact paths are reachable from marketing CTAs" on the marketing surface.

## Out of scope

Changes outside the target repository for this issue. Unrelated refactors, drive-by fixes, or direct merges to main. Expanding scope beyond reproducing and fixing the reported defect.

## Acceptance criteria

- [ ] Fix the failing E2E journey "contact paths are reachable from marketing CTAs" on the marketing surface.
- [ ] All relevant tests and build pass (green CI).
- [ ] No regression in existing user-facing behaviour.

## Code analysis (evidence, marketing @ live)

Status: **fixable** (confidence 90%)

* (no direct code hits; see details)

## Source

Scan finding: e2e/error

## Run as Claude loop (in `/root/booking-brilliance`, on a new branch)

```
/loop Fix the E2E failure "contact paths are reachable from marketing CTAs" (against https://digilist.no). Error: TimeoutError: locator.click: Timeout 12000ms exceeded.
Call log:
  - waiting for getByRole('link', { name: /kontakt|book demo|book-demo|møte oss/i }).first()
    - locator resolved to <a href="/book-demo" class="font-sans text-[0.95rem] text-ink-soft hover:text-ink transition-colors durati

Linear: https://linear.app/xala-technologies/issue/XAL-670/e2e-failure-contact-paths-are-reachable-from-marketing-ctas
