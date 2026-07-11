# XAL-326: CTO / orchestrator agent — advisory fleet orchestration (Phase 1)

> Auto-forberedt av Digilist Improvements Agent. Kjør Claude i denne worktreen:
> `/loop Build a CTO / orchestrator agent (new module tools/orchestrator-agent/) that manages the Digilist agent fleet on a HEARTBEAT: it reads fleet state, drives the human-approved work queue, reasons about priorities, and assigns work to the right specialist. REUSE the existing primitives (do not rewrite): runClaudeAgent (tools/content-agent/src/claude-agent.ts), OpenBrain (tools/improvements-agent/src/brain.ts), LinearClient (tools/content-agent/src/linear.ts), and CRITICALLY the existing prepare/implement functions — prepareApproved (tools/improvements-agent/src/prepare.ts) and implementPending (tools/improvements-agent/src/implement-run.ts). Specialists: content-agent, improvements-agent (analyze/prepare/implement), pr-review-agent, e2e-agent, docs-rag.

THE HEARTBEAT LOOP (core behavior). On each cycle (a loop with a configurable interval, and/or a systemd timer):
1. Read Linear "Todo" — whatever the user approved. Sort the Todo issues by LINEAR PRIORITY (Urgent=1 first, then High=2, Normal=3, Low=4; ties by createdAt). For EVERY Todo issue IN PRIORITY ORDER (highest first), PICK it and DRIVE it through prepare -> implement -> PR automatically: call prepareApproved (creates the branch, moves Todo -> In Progress) then implementPending (runs the coding agent on the shared runner, opens a PR, moves -> In Review, or posts a BLOKKERT/AVKLARING comment + label if stuck). This makes the orchestrator the active driver of the approved queue — the user just drops work in Todo and the fleet builds it.
2. Read the rest of the fleet state into a FleetState object — Linear issues (all states, labels, priority), the Open Brain (items/verdicts/prepared/learnings), open PRs across the Digilist repos via gh (checks, review verdict), recent CI/deploy status, latest intelligence + e2e findings.
3. Reasoning (runClaudeAgent, model Opus): decide what matters now, which specialist should handle each non-Todo item, suggested priority/severity, and any blockers needing the user. Return a structured plan { assignments, blockers, summary }.
4. Actions: apply SAFE parts — set Linear priority/labels, post a "CTO briefing" comment/summary, record plan + learnings to the Open Brain, and surface blockers to the user. It drives Todo -> PR (step 1) but NEVER merges or deploys, and never auto-moves things INTO Todo (that stays the human's decision) unless CTO_AUTOPILOT=1.

Modules: src/state.ts (FleetState gathering), src/drive.ts (the Todo -> prepare -> implement loop, reusing prepareApproved + implementPending), src/orchestrate.ts (Opus reasoning -> plan), src/run.ts ("cto:run", single cycle) and src/loop.ts ("cto:loop", heartbeat with interval), a briefing writer to tools/orchestrator-agent/state/briefing-<sha>.md (gitignored).

Runner + schedule: tools/orchestrator-agent/vps-cto-runner.sh (mirror the other vps runners: git reset origin/main, source load-env.sh, LLM_PROVIDER=claude-cli, unset ANTHROPIC_API_KEY). package.json "cto:run" + "cto:loop". Suggest a frequent systemd timer (e.g. every 15-30 min) in the README so the Todo-driver heartbeat runs continuously; this can REPLACE the separate digilist-improvements-prepare + digilist-improvements-implement timers (note that in the README, don't uninstall them in the PR). .gitignore tools/orchestrator-agent/state/.

Docs + tests: README (heartbeat loop, Todo-driver, advisory-vs-autopilot), and a lightweight test for state-normalization + plan-parsing (no live network).

Constraints: the Todo-driver is safe by design (Todo = human approval gate; output is a PR, never an auto-merge/deploy). Reuse prepareApproved + implementPending — do NOT reimplement prepare/implement. Reuse the shared runner/brain/Linear client. Norwegian bokmaal in user-facing text, no em-dash. pnpm typecheck + lint + build green before the PR. If genuinely blocked, end with "BLOKKERT:".`

## Mål
Build a CTO / orchestrator agent (new module tools/orchestrator-agent/) that manages the Digilist agent fleet on a HEARTBEAT: it reads fleet state, drives the human-approved work queue, reasons about priorities, and assigns work to the right specialist. REUSE the existing primitives (do not rewrite): runClaudeAgent (tools/content-agent/src/claude-agent.ts), OpenBrain (tools/improvements-agent/src/brain.ts), LinearClient (tools/content-agent/src/linear.ts), and CRITICALLY the existing prepare/implement functions — prepareApproved (tools/improvements-agent/src/prepare.ts) and implementPending (tools/improvements-agent/src/implement-run.ts). Specialists: content-agent, improvements-agent (analyze/prepare/implement), pr-review-agent, e2e-agent, docs-rag.

THE HEARTBEAT LOOP (core behavior). On each cycle (a loop with a configurable interval, and/or a systemd timer):
1. Read Linear "Todo" — whatever the user approved. Sort the Todo issues by LINEAR PRIORITY (Urgent=1 first, then High=2, Normal=3, Low=4; ties by createdAt). For EVERY Todo issue IN PRIORITY ORDER (highest first), PICK it and DRIVE it through prepare -> implement -> PR automatically: call prepareApproved (creates the branch, moves Todo -> In Progress) then implementPending (runs the coding agent on the shared runner, opens a PR, moves -> In Review, or posts a BLOKKERT/AVKLARING comment + label if stuck). This makes the orchestrator the active driver of the approved queue — the user just drops work in Todo and the fleet builds it.
2. Read the rest of the fleet state into a FleetState object — Linear issues (all states, labels, priority), the Open Brain (items/verdicts/prepared/learnings), open PRs across the Digilist repos via gh (checks, review verdict), recent CI/deploy status, latest intelligence + e2e findings.
3. Reasoning (runClaudeAgent, model Opus): decide what matters now, which specialist should handle each non-Todo item, suggested priority/severity, and any blockers needing the user. Return a structured plan { assignments, blockers, summary }.
4. Actions: apply SAFE parts — set Linear priority/labels, post a "CTO briefing" comment/summary, record plan + learnings to the Open Brain, and surface blockers to the user. It drives Todo -> PR (step 1) but NEVER merges or deploys, and never auto-moves things INTO Todo (that stays the human's decision) unless CTO_AUTOPILOT=1.

Modules: src/state.ts (FleetState gathering), src/drive.ts (the Todo -> prepare -> implement loop, reusing prepareApproved + implementPending), src/orchestrate.ts (Opus reasoning -> plan), src/run.ts ("cto:run", single cycle) and src/loop.ts ("cto:loop", heartbeat with interval), a briefing writer to tools/orchestrator-agent/state/briefing-<sha>.md (gitignored).

Runner + schedule: tools/orchestrator-agent/vps-cto-runner.sh (mirror the other vps runners: git reset origin/main, source load-env.sh, LLM_PROVIDER=claude-cli, unset ANTHROPIC_API_KEY). package.json "cto:run" + "cto:loop". Suggest a frequent systemd timer (e.g. every 15-30 min) in the README so the Todo-driver heartbeat runs continuously; this can REPLACE the separate digilist-improvements-prepare + digilist-improvements-implement timers (note that in the README, don't uninstall them in the PR). .gitignore tools/orchestrator-agent/state/.

Docs + tests: README (heartbeat loop, Todo-driver, advisory-vs-autopilot), and a lightweight test for state-normalization + plan-parsing (no live network).

Constraints: the Todo-driver is safe by design (Todo = human approval gate; output is a PR, never an auto-merge/deploy). Reuse prepareApproved + implementPending — do NOT reimplement prepare/implement. Reuse the shared runner/brain/Linear client. Norwegian bokmaal in user-facing text, no em-dash. pnpm typecheck + lint + build green before the PR. If genuinely blocked, end with "BLOKKERT:".

## Regler
- Jobb kun på denne branchen (`agent/xal-326-cto-orchestrator-agent-advisory-fleet-orchestrat`), aldri main.
- Kjør bygg + tester. Åpne PR bare når de er grønne (ellers draft-PR med notat).
- Slett denne filen før du åpner PR.

Linear: https://linear.app/xala-technologies/issue/XAL-326/cto-orchestrator-agent-advisory-fleet-orchestration-phase-1
