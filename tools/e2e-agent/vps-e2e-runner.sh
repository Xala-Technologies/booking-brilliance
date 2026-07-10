#!/usr/bin/env bash
# E2E agent on the VPS. Runs the Playwright public-surface suite against the live
# site and files failing journeys into Linear as categorized bugs. No LLM/API
# key needed (it's the deterministic guardrail); Claude comes in when you /loop
# a filed fix goal. Run by systemd (digilist-e2e.timer).
set -uo pipefail
export PATH="/root/.local/bin:/usr/local/bin:/usr/bin:/bin"
cd /root/booking-brilliance || exit 1
git fetch origin --quiet && git reset --hard origin/main --quiet
pnpm install --frozen-lockfile >/dev/null 2>&1 || pnpm install >/dev/null 2>&1

. tools/content-agent/load-env.sh
export E2E_BASE_URL="${E2E_BASE_URL:-https://digilist.no}"
export PLAYWRIGHT_BROWSERS_PATH="${PLAYWRIGHT_BROWSERS_PATH:-/root/.cache/ms-playwright}"

echo "[vps-e2e] running public-surface suite…"
pnpm e2e:run
