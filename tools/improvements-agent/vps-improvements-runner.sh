#!/usr/bin/env bash
# Improvements agent on the VPS, powered by the Claude Max subscription (no API
# key). Usage: vps-improvements-runner.sh <run|prepare|implement> [extra args…]
#   run       — index Digilist + booking-brilliance, analyze ideas/findings vs the
#               code graph, file genuine work as Linear /loop goals.
#   prepare   — set up an isolated implementation branch for each approved issue.
#   implement — run Claude in each prepared worktree to build the goal → PR,
#               moving the Linear issue Todo→In Progress→In Review (or Blocked).
# Extra args after the mode are forwarded to the npm script (e.g. --limit 1).
# Run by systemd (digilist-improvements-*.timer).
set -uo pipefail
export PATH="/root/.local/bin:/usr/local/bin:/usr/bin:/bin"
cd /root/booking-brilliance || exit 1
git fetch origin --quiet && git reset --hard origin/main --quiet

. tools/content-agent/load-env.sh
export VITE_CONVEX_URL="${VITE_CONVEX_URL:-${CONVEX_URL:-}}"
export LLM_PROVIDER=claude-cli
export DIGILIST_REPO_PATH="${DIGILIST_REPO_PATH:-/root/Digilist}"
export IMPROVEMENTS_IDEAS_REPO="${IMPROVEMENTS_IDEAS_REPO:-xalatechnologies/booking-brilliance}"
unset ANTHROPIC_API_KEY ANTHROPIC_AUTH_TOKEN

# Keep the Digilist checkout current before (re)indexing on a run.
if [ "${1:-run}" = "run" ] && [ -d "$DIGILIST_REPO_PATH/.git" ]; then
  git -C "$DIGILIST_REPO_PATH" fetch origin --quiet 2>/dev/null || true
fi

MODE="${1:-run}"
echo "[vps-improvements] ${MODE} on Claude Max…"
if [ "$#" -gt 1 ]; then
  pnpm "improvements:${MODE}" -- "${@:2}"
else
  pnpm "improvements:${MODE}"
fi
