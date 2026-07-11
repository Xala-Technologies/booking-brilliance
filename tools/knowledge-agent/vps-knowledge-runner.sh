#!/usr/bin/env bash
# Knowledge (self-learning) agent on the VPS, powered by the Claude Max
# subscription (no API key). Usage: vps-knowledge-runner.sh [learning-run args…]
#   (default)      — distill: pull content signals, review pending raw signals,
#                    mine repo patterns + latest stack docs/trends, distil
#                    provenance-tracked learnings, render the wiki, and auto-file
#                    advisory upgrade issues (Backlog, behind the human Todo gate).
# Extra args are forwarded to the npm script, e.g.:
#   vps-knowledge-runner.sh --no-web        (skip trend research)
#   vps-knowledge-runner.sh --dry-run       (distil + print, persist nothing)
#   vps-knowledge-runner.sh --render-only    (re-render the wiki from the store)
# Run by systemd (digilist-knowledge.timer) — see the README for a suggested
# daily/weekly timer (not installed by this repo).
set -uo pipefail
export PATH="/root/.local/bin:/usr/local/bin:/usr/bin:/bin"
cd /root/booking-brilliance || exit 1
git fetch origin --quiet && git reset --hard origin/main --quiet

. tools/content-agent/load-env.sh
export VITE_CONVEX_URL="${VITE_CONVEX_URL:-${CONVEX_URL:-}}"
export LLM_PROVIDER=claude-cli
export DIGILIST_REPO_PATH="${DIGILIST_REPO_PATH:-/root/Digilist}"
unset ANTHROPIC_API_KEY ANTHROPIC_AUTH_TOKEN

# Keep the Digilist checkout current so repo-pattern mining sees the real code.
if [ -d "$DIGILIST_REPO_PATH/.git" ]; then
  git -C "$DIGILIST_REPO_PATH" fetch origin --quiet 2>/dev/null || true
fi

echo "[vps-knowledge] distill on Claude Max…"
if [ "$#" -gt 0 ]; then
  pnpm learning:run -- "$@"
else
  pnpm learning:run
fi

# The distill run re-renders the wiki (KNOWLEDGE.md + docs/knowledge/*.md). Commit
# and push it so the curated knowledge base travels with the repo and docs-rag can
# reindex it. Best-effort; skipped cleanly when nothing changed.
if ! git diff --quiet -- KNOWLEDGE.md docs/knowledge 2>/dev/null; then
  git add KNOWLEDGE.md docs/knowledge 2>/dev/null || true
  git commit -m "chore(knowledge): oppdater kunnskapsbasen (autogenerert)" --quiet 2>/dev/null || true
  git push origin HEAD:main --quiet 2>/dev/null || echo "[vps-knowledge] push hoppet over (ingen tilgang / ingen endring)"
fi
