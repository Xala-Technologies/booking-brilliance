#!/usr/bin/env bash
#
# Applies infra/nginx/security-headers.conf to the Digilist subdomains the
# audit flags for missing security headers. Safe by construction:
#   1. uploads the snippet to /etc/nginx/snippets/
#   2. backs up every target conf (timestamped) before touching it
#   3. inserts one `include` line into each matching server block
#   4. `nginx -t` — and if it fails, restores ALL backups and aborts
#   5. only reloads nginx when the config validates
#
# Run from the repo root:  ./infra/apply-security-headers.sh
# Idempotent: re-running is a no-op once the include is present.
set -euo pipefail

VPS="root@72.61.23.56"
SNIPPET_LOCAL="infra/nginx/security-headers.conf"
SNIPPET_REMOTE="/etc/nginx/snippets/digilist-security-headers.conf"
INCLUDE_LINE="    include snippets/digilist-security-headers.conf;"

# host  ->  conf file that defines its (443) server block
#
# status.digilist.no, dev.digilist.no and dashboard.dev.digilist.no are
# deliberately NOT listed here even though the original audit flagged them:
# each already has a complete, hand-maintained header block (predating this
# script) that is a superset of infra/nginx/security-headers.conf, including
# CSP/COOP/CORP which this snippet intentionally omits. Adding the include to
# those hosts only duplicates every header — confirmed live (XAL-1110 review
# round 1) — including a duplicate Strict-Transport-Security, which per RFC
# 6797 §8.1 means conforming clients honor whichever STS header arrives
# first and silently ignore the other's `preload`. Re-add a host here only
# after confirming it has no equivalent headers already set elsewhere in its
# server block.
TARGETS=(
  "docs.digilist.no|/etc/nginx/sites-available/docs.digilist.no"
)

echo "→ Uploading snippet to ${SNIPPET_REMOTE}"
scp "${SNIPPET_LOCAL}" "${VPS}:${SNIPPET_REMOTE}"

remote_script=$(cat <<'REMOTE'
set -euo pipefail
INCLUDE_LINE="    include snippets/digilist-security-headers.conf;"
STAMP=$(date +%Y%m%d-%H%M%S)
declare -a BACKUPS=()
rollback() {
  echo "✗ nginx -t failed — rolling back"
  for b in "${BACKUPS[@]}"; do cp -f "$b" "${b%.bak-*}"; done
  exit 1
}
apply_one() {
  local host="$1" file="$2"
  [ -f "$file" ] || { echo "  skip (no file): $file"; return; }
  # Scoped to this host's own server_name line — a plain file-wide grep for
  # the snippet name false-positives when multiple hosts share one conf file
  # (e.g. dev.digilist.no and dashboard.dev.digilist.no both live in
  # digilist-dev) and only one of their blocks has been patched so far.
  if awk -v host="$host" -v line="$INCLUDE_LINE" '
    matched { exit ($0 == line) ? 0 : 1 }
    $0 ~ ("server_name[^;]*[[:space:]]" host "[;[:space:]]") { matched=1 }
    END { if (!matched) exit 1 }
  ' "$file"; then
    echo "  already applied: $host"; return
  fi
  local bak="${file}.bak-${STAMP}"
  cp -f "$file" "$bak"; BACKUPS+=("$bak")
  # Insert the include right after the server_name line that names this host,
  # inside its server block.
  awk -v host="$host" -v line="$INCLUDE_LINE" '
    { print }
    $0 ~ ("server_name[^;]*[[:space:]]" host "[;[:space:]]") { print line }
  ' "$file" > "${file}.tmp" && mv "${file}.tmp" "$file"
  echo "  patched: $host  (backup: $bak)"
}
REMOTE
)

# Build the per-target apply calls and run everything remotely in one shell.
calls=""
for t in "${TARGETS[@]}"; do
  host="${t%%|*}"; file="${t##*|}"
  calls+=$'\n'"apply_one '${host}' '${file}'"
done

ssh "${VPS}" "bash -s" <<REMOTE_EXEC
${remote_script}
${calls}
if nginx -t; then
  systemctl reload nginx
  echo "✓ headers applied + nginx reloaded"
else
  rollback
fi
REMOTE_EXEC

echo "→ Verifying headers are now present"
for t in "${TARGETS[@]}"; do
  host="${t%%|*}"
  printf '  %-30s HSTS=%s XFO=%s\n' "$host" \
    "$(curl -sI "https://${host}/" | grep -ci strict-transport-security)" \
    "$(curl -sI "https://${host}/" | grep -ci x-frame-options)"
done
