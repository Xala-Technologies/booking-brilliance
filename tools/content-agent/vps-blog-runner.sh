#!/usr/bin/env bash
# Daily blog agent on the VPS, powered by the Claude Max subscription (no API
# key). generate → auto-publish → sync → commit → push; the push triggers
# deploy.yml (build + deploy + verify). Run by systemd (digilist-blog.timer).
set -uo pipefail
export PATH="/root/.local/bin:/usr/local/bin:/usr/bin:/bin"
cd /root/booking-brilliance || exit 1
git fetch origin --quiet && git reset --hard origin/main --quiet

. tools/content-agent/load-env.sh
export VITE_CONVEX_URL="${VITE_CONVEX_URL:-${CONVEX_URL:-}}"
export LLM_PROVIDER=claude-cli
export CONTENT_AGENT_DRAFTS_PER_RUN="${CONTENT_AGENT_DRAFTS_PER_RUN:-3}"
# The agents strip ANTHROPIC_API_KEY themselves before calling claude, but unset
# it here too so nothing lets the (dead) key shadow the Max login.
unset ANTHROPIC_API_KEY ANTHROPIC_AUTH_TOKEN

echo "[vps-blog] generate (Claude Max)…"
pnpm content:all -- --trigger cron
pnpm content:autopublish
pnpm content:sync

changed=$(git status --porcelain src/content/blog | awk '{print $2}')
today=$(date -u +%F)
for f in $changed; do sed -i "s/^date:.*/date: $today/" "$f"; done
git add src/content/blog tools/content-agent/memory
if git diff --cached --quiet; then echo "[vps-blog] no new content today."; exit 0; fi
n=$(git diff --cached --name-only -- src/content/blog | grep -c '\.md$' || true)
git commit -m "Daily blog agent (VPS+Max): ${n} post(s) [$today]"
git push origin main
echo "[vps-blog] pushed ${n} post(s) → deploy.yml will build + deploy + verify."
