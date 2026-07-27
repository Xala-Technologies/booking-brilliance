# XAL-169: PB2 · Bookings — Zones, calendar-blocks, allocations, multi-resource events

> Auto-prepared by Digilist Improvements Agent. Run Claude in this worktree:
> `/loop PB2 · Bookings — Zones, calendar-blocks, allocations, multi-resource events`

## Implementation contract — complete this before writing code
- **Problem:** PB2 · Bookings — Zones, calendar-blocks, allocations, multi-resource events
- **Business objective:** _why this matters (from the Linear issue)_
- **Repository / branch:** `/root/booking-brilliance` @ `agent/xal-169-pb2-bookings-zones-calendar-blocks`
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
- One issue → one branch (`agent/xal-169-pb2-bookings-zones-calendar-blocks`) → one independently reviewable change. Never main.
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

Product gap: PB2 · Bookings — Zones, calendar-blocks, allocations, multi-resource events. <!-- xaheen-triage -->

## Problem Statement

The booking system needs four new entities — Zone, CalendarBlock, Allocation, and MultiResourceEvent — each with its own migration, to serve as the data-model foundation for zone-aware availability/pricing, calendar blocking, resource allocation, and multi-resource events. This is Wave 4 of a staged plan (PB2).

## Scope

**In scope:**

* Zone entity + its own migration
* CalendarBlock entity + its own migration
* Allocation entity + its own migration
* MultiResourceEvent entity + its own migration
* Migrations run serialized (one completes before the next starts), not concurrently

**Out of scope:**

* Actual zone-aware availability/pricing calculation logic
* Calendar-block enforcement in booking flows
* Full multi-resource booking flow using MultiResourceEvent
* Allocation read APIs/endpoints

## Acceptance Criteria

- [ ] Zone, CalendarBlock, Allocation, and MultiResourceEvent each have their own distinct migration file/step
- [ ] All four migrations complete successfully when run in sequence
- [ ] Migrations run serialized: no two run concurrently, each fully completes before the next begins
- [ ] After migrating, each new entity's table/collection exists and is queryable with zero rows

## Testing Scenario

* Given a clean deploy, when the Wave 4 migrations run, then Zone, CalendarBlock, Allocation, and MultiResourceEvent all exist in the schema.
* Given the four migrations are triggered, when they execute, then logs/timestamps show each one completes before the next starts (no overlap).
* Given one migration in the sequence fails, when the sequence is re-run, then it does not silently skip ahead — the serialized order is respected.

## Value: high

High value — the issue explicitly states this is a blocking prerequisite for four downstream capabilities (zones, calendar-blocks, full multi-resource bookings, allocation reads), so it gates a chunk of the booking roadmap, even though no specific user, deadline, or revenue figure is named.

## Target repo: `marketing`

*Chosen by triage from the issue's content; routes preparation there.*

## Open questions

* Exact field/schema definitions for Zone, CalendarBlock, Allocation, and MultiResourceEvent are not given.
* Required migration order among the four entities (e.g. does Zone need to precede others for FK references?) isn't specified.
* What 'PB2' and 'Wave 4' refer to — is there a master epic defining prior waves and conventions this should follow?
* Repo mapping concern: the 'marketing' key maps to Xala-Technologies/booking-brilliance, but Digilist's own docs confirm that repo is the actual product monorepo with the Convex schema, bookings component, and a dedicated migrations component — exactly this issue's surface — despite being labeled 'marketing'. Needs human confirmation.

---

*Structured by the triage agent.

<details><summary>Reporter's original text</summary>

Wave 4. New entities + migrations: Zone (makes availability/pricing zone-aware), CalendarBlock, Allocation, MultiResourceEvent. Each its own migration, serialized. Unblocks: zones, blocks, multi-resource-bookings (full), allocation reads.

</details> Current assessment: gap (feature, minor). Relevant code: convex/schema.ts (469 lines, 24 tables), convex/audits/targets.ts:78, src/pages/BookingsystemKommune.tsx, BookingsystemUtleie.tsx.

**Scope**
Do not implement in this repo. This 'marketing' repo (digilist-booking-system) is Digilist's own marketing/content-ops codebase (SEO/content pipeline, PSI/audit monitoring, GDPR compliance) — it has no bookings component, no product Convex schema, and Convex doesn't even use per-entity migration files (schema changes are atomic edits to schema.ts), so the ticket's premise of four serialized per-entity migrations doesn't map onto this stack either. Zone/CalendarBlock/Allocation/MultiResourceEvent belong in the actual booking product monorepo referenced in Digilist's architecture (booking-core/discovery-core/billing/ticketing-core packages), which is a different repo than this triage 'marketing' key resolves to. Route back to human triage to fix the repo mapping before any implementation work. Touch points: convex/schema.ts (469 lines, 24 tables) (entirely content-agent/site-intelligence/compliance tables (keywords, briefs, drafts, audit_targets, audit_runs, compliance_controls, alerts, ...); zero Zone/CalendarBlock/Allocation/MultiResourceEvent/Reservation tables or any booking domain); convex/audits/targets.ts:78 (only 'booking' hit is a description string for an external audit target, not app code); src/pages/BookingsystemKommune.tsx, BookingsystemUtleie.tsx (the 2 'bookings' code-graph hits are marketing landing pages describing the product, not application logic).

**Done when**

- [ ] Do not implement in this repo. This 'marketing' repo (digilist-booking-system) is Digilist's own marketing/content-ops codebase (SEO/content pipeline, PSI/audit monitoring, GDPR compliance) — it has no bookings component, no product Convex schema, and Convex doesn't even use per-entity migration files (schema changes are atomic edits to schema.ts), so the ticket's premise of four serialized per-entity migrations doesn't map onto this stack either. Zone/CalendarBlock/Allocation/MultiResourceEvent belong in the actual booking product monorepo referenced in Digilist's architecture (booking-core/discovery-core/billing/ticketing-core packages), which is a different repo than this triage 'marketing' key resolves to. Route back to human triage to fix the repo mapping before any implementation work.

## Code analysis (evidence, marketing @ fdb830d6)

Status: **gap** (confidence 95%)

* `convex/schema.ts (469 lines, 24 tables)` — entirely content-agent/site-intelligence/compliance tables (keywords, briefs, drafts, audit_targets, audit_runs, compliance_co

Linear: https://linear.app/xala-technologies/issue/XAL-169/pb2-bookings-zones-calendar-blocks-allocations-multi-resource-events
