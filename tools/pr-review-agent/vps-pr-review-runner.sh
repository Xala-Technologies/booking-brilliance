#!/usr/bin/env bash
# PR-review agent on the VPS, powered by the Claude Max subscription (no API
# key). Finds open PRs in booking-brilliance + Digilist, reviews each with
# Claude, and posts an advisory COMMENT review to GitHub. Extra args are
# forwarded to the npm script (e.g. --dry-run, --limit 10).
# Run by systemd (digilist-pr-review.timer).
set -uo pipefail
export PATH="/root/.local/bin:/usr/local/bin:/usr/bin:/bin"
cd /root/booking-brilliance || exit 1
git fetch origin --quiet && git reset --hard origin/main --quiet

. tools/content-agent/load-env.sh
export LLM_PROVIDER=claude-cli
export DIGILIST_REPO_PATH="${DIGILIST_REPO_PATH:-/root/Digilist}"
unset ANTHROPIC_API_KEY ANTHROPIC_AUTH_TOKEN

# Keep the Digilist checkout current so gh sees fresh PR refs.
[ -d "$DIGILIST_REPO_PATH/.git" ] && git -C "$DIGILIST_REPO_PATH" fetch origin --quiet 2>/dev/null || true

echo "[vps-pr-review] reviewing open PRs on Claude Max…"
if [ "$#" -gt 0 ]; then
  pnpm pr-review:run -- "$@"
else
  pnpm pr-review:run
fi
