#!/usr/bin/env bash
# Improvements agent on the VPS, powered by the Claude Max subscription (no API
# key). Usage: vps-improvements-runner.sh <run|prepare>
#   run     — index Digilist + booking-brilliance, analyze ideas/findings vs the
#             code graph, file genuine work as Linear /loop goals.
#   prepare — set up an isolated implementation branch for each approved issue.
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

echo "[vps-improvements] ${1:-run} on Claude Max…"
pnpm "improvements:${1:-run}"
