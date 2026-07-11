# Knowledge agent (self-learning layer)

The fleet-wide, cross-agent learning loop: **capture -> distill -> inject**.
It generalizes two things that used to live in separate agents — the content
agent's OB1-style content-memory and the improvements agent's `learnings[]` —
into one loop every agent feeds and reads from.

## Six sources

1. **Repository patterns** — mined via `codebase-memory` during distill.
2. **Industry best practice** — for the tracked stack (see `STACK_WATCH` in
   `src/distill.ts`: TypeScript, Convex, React, Vite, Node.js, WCAG/a11y, OWASP).
3. **Its own mistakes** — blocking PR reviews, blocked/no-PR implement runs,
   false-positive verdicts.
4. **User feedback** — direct human corrections (`captureUserFeedback`).
5. **Content signals** — durable house-style notes from the content agent's memory.
6. **Latest technology trends + stack docs** — WebSearch/docs during distill,
   to keep the fleet current as the ecosystem moves (new majors, deprecations,
   best-practice shifts).

## Store: hybrid (Open Brain + wiki)

- **Open Brain** (`tools/improvements-agent/brain/brain.json`, gitignored) is
  the backbone machine store. This module does not stand up a competing
  store: it extends Open Brain with a `signals` inbox (raw, undistilled
  capture) and a `knowledge` array (distilled, provenance-tracked
  `Learning[]`). Agents read it programmatically via `recall()`/`inject.ts`.
- **The wiki** (`KNOWLEDGE.md` + `docs/knowledge/<topic>.md`, tracked in git)
  is a human-readable render of the same data, one topic file per learning
  type. Open Brain is the single source of truth; the wiki is regenerated
  from it on every distill run (`renderWikiFromStore`) — edits to the wiki
  files themselves are overwritten on the next run.

The wiki is **not** wired into `docs-rag`'s public index
(`apps/docs/dist-rag`): that index feeds the customer-facing `/api/docs-ask`
endpoint, and fleet learnings (own mistakes, user corrections about the
agents) must not leak to end users. Humans browse the wiki directly in the
repo; agents recall it programmatically via Open Brain.

## Capture

`src/capture.ts` exposes best-effort helpers (never throw, dedup in the
store) wired at the obvious points:

- `capturePrReview` — a `request-changes` review verdict (`pr-review-agent/src/run.ts`)
- `captureBlockedRun` / `captureNoPr` — an implement run that ended
  BLOKKERT/AVKLARING or produced no PR (`improvements-agent/src/implement-run.ts`)
- `captureFalsePositive` — a scanner verdict that turned out to be
  exists/not-actionable/not-found (`improvements-agent/src/run.ts`)
- `captureUserFeedback` — direct human corrections, call manually
- `captureContentSignals` — pulled automatically at the start of `learning:run`

## Distill

```bash
pnpm learning:run                # distill + persist + render wiki + file advisory upgrades
pnpm learning:run -- --dry-run   # distill + print, persist nothing, file nothing
pnpm learning:run -- --no-web    # skip trend research (repo + signals only)
pnpm learning:run -- --no-file   # persist + render, skip filing Linear issues
pnpm learning:run -- --render-only  # re-render KNOWLEDGE.md from the store, no agent call
```

A capable Opus agent (`runClaudeAgent`, Claude Max via `LLM_PROVIDER=claude-cli`)
reviews the pending signals + existing knowledge, mines repo patterns and
current best practice/trends, and returns deduped, provenance-tracked
learnings as JSON (`src/distill.ts`). Learnings with no `source_ref` are
rejected — nothing is fabricated. Statements the agent flags as stale are
demoted (kept for history, no longer injected or shown in the wiki).

When a tech trend implies an upgrade (e.g. a new TypeScript major), the
distiller can attach an `upgrade` suggestion. `learning:run` files it as an
**advisory** Linear issue in the "Digilist - Improvements Agent" project,
parked in **Backlog** — behind the human Todo gate, same as every other
improvement the fleet proposes. It never runs itself.

## Inject

`src/inject.ts` -> `relevantLearnings(agent, { context })` ranks the store by
`recall()` (applies_to match + keyword overlap + confidence + recency) and
returns a compact, token-budgeted block (default: 6 learnings, ~1200 chars).
`runCapableAgent` (`content-agent/src/claude-agent.ts`) takes an optional
`agent`/`injectContext` and prepends that block to the system prompt when
set — this is wired into `pr-review` and `improvements` (analyze) already.
Wire a new agent by passing `agent: "<name>"` to `runCapableAgent`.

## Tests

```bash
pnpm learning:test
```

Pure unit tests over the store, recall ranking, dedup/compounding, the
distill parser, and wiki rendering. No live network, no file I/O against the
real brain.

## On the VPS

`vps-knowledge-runner.sh` mirrors the other `vps-*-runner.sh` scripts: pulls
`main`, runs `learning:run` on the Claude Max login, and commits+pushes the
regenerated wiki (`KNOWLEDGE.md` + `docs/knowledge/`) straight to `main`
(same pattern as the blog agent's daily posts) when it changed.

Not installed by this repo — a suggested systemd timer, daily or weekly
(distillation is cheap to run more often than the content/improvements
agents since it mostly reads what they already produced):

```ini
# /etc/systemd/system/digilist-knowledge.service
[Unit]
Description=Digilist Knowledge Agent — capture -> distill -> inject
After=network-online.target

[Service]
Type=oneshot
WorkingDirectory=/root/booking-brilliance
ExecStart=/root/booking-brilliance/tools/knowledge-agent/vps-knowledge-runner.sh
```

```ini
# /etc/systemd/system/digilist-knowledge.timer
[Unit]
Description=Run Digilist Knowledge Agent daily at 05:00

[Timer]
OnCalendar=*-*-* 05:00:00
RandomizedDelaySec=600
Persistent=true

[Install]
WantedBy=timers.target
```
