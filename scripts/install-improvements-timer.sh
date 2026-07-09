#!/usr/bin/env bash
# Install (or remove) the local launchd timers that run the Digilist Improvements
# Agent autonomously on this machine — on the Claude Max subscription, no API key.
#
#   improvements.run     — weekly (Mon 06:00): index + analyze ideas/findings →
#                          file genuine work as Linear /loop goals.
#   improvements.prepare — hourly: prepare a branch for every approved issue.
#
# Both run with LLM_PROVIDER=claude-cli, so they use the Claude Code login on
# this machine. Requires: `claude` logged in (Max/Pro), .env.local present,
# codebase-memory-mcp on PATH.
#
# Usage: scripts/install-improvements-timer.sh [--uninstall]
set -euo pipefail

REPO="$(cd "$(dirname "$0")/.." && pwd)"
LA="$HOME/Library/LaunchAgents"
RUN_LABEL="no.digilist.improvements.run"
PREP_LABEL="no.digilist.improvements.prepare"
WRAPPER="$REPO/tools/improvements-agent/run-agent.sh"

uninstall() {
  for L in "$RUN_LABEL" "$PREP_LABEL"; do
    launchctl bootout "gui/$(id -u)/$L" 2>/dev/null || launchctl unload "$LA/$L.plist" 2>/dev/null || true
    rm -f "$LA/$L.plist"
  done
  echo "Uninstalled improvements timers."
}

if [ "${1:-}" = "--uninstall" ]; then uninstall; exit 0; fi

mkdir -p "$LA" "$REPO/tools/improvements-agent/logs"

# Wrapper: minimal launchd PATH → add common bin dirs; source env; run the task.
cat > "$WRAPPER" <<EOF
#!/usr/bin/env bash
set -euo pipefail
export PATH="\$HOME/.local/bin:\$HOME/.npm-global/bin:/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin"
cd "$REPO"
set -a; [ -f .env.local ] && . ./.env.local; set +a
export LLM_PROVIDER=claude-cli
exec pnpm "improvements:\$1" \${2:-}
EOF
chmod +x "$WRAPPER"

# run — weekly (Monday 06:00)
cat > "$LA/$RUN_LABEL.plist" <<EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0"><dict>
  <key>Label</key><string>$RUN_LABEL</string>
  <key>ProgramArguments</key><array><string>$WRAPPER</string><string>run</string></array>
  <key>WorkingDirectory</key><string>$REPO</string>
  <key>StartCalendarInterval</key><dict><key>Weekday</key><integer>1</integer><key>Hour</key><integer>6</integer><key>Minute</key><integer>0</integer></dict>
  <key>StandardOutPath</key><string>$REPO/tools/improvements-agent/logs/run.log</string>
  <key>StandardErrorPath</key><string>$REPO/tools/improvements-agent/logs/run.err.log</string>
</dict></plist>
EOF

# prepare — hourly
cat > "$LA/$PREP_LABEL.plist" <<EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0"><dict>
  <key>Label</key><string>$PREP_LABEL</string>
  <key>ProgramArguments</key><array><string>$WRAPPER</string><string>prepare</string></array>
  <key>WorkingDirectory</key><string>$REPO</string>
  <key>StartInterval</key><integer>3600</integer>
  <key>StandardOutPath</key><string>$REPO/tools/improvements-agent/logs/prepare.log</string>
  <key>StandardErrorPath</key><string>$REPO/tools/improvements-agent/logs/prepare.err.log</string>
</dict></plist>
EOF

for L in "$RUN_LABEL" "$PREP_LABEL"; do
  launchctl bootout "gui/$(id -u)/$L" 2>/dev/null || true
  launchctl bootstrap "gui/$(id -u)" "$LA/$L.plist"
done

echo "Installed:"
echo "  $RUN_LABEL     — weekly (Mon 06:00): analyze → file Linear goals"
echo "  $PREP_LABEL — hourly: prepare branch for approved issues"
echo "Both run on the Claude Max subscription (LLM_PROVIDER=claude-cli). Logs in tools/improvements-agent/logs/."
echo "Remove with: scripts/install-improvements-timer.sh --uninstall"
