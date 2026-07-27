#!/usr/bin/env bash
#
# Applies infra/nginx/cache-headers.conf to the digilist.no root server
# block (sustain.no-cache + sustain.html-weight findings). Safe by
# construction, same pattern as apply-security-headers.sh:
#   1. checks whether the ngx_brotli module is compiled in, and only keeps
#      the brotli directives if so (an unknown directive fails `nginx -t`)
#   2. uploads the (possibly brotli-stripped) snippet to /etc/nginx/snippets/
#   3. backs up the target conf (timestamped) before touching it
#   4. inserts one `include` line into the digilist.no server block
#   5. `nginx -t` — and if it fails, restores the backup and aborts
#   6. only reloads nginx when the config validates
#
# Run from the repo root:  ./infra/apply-cache-headers.sh
# Idempotent: re-running is a no-op once the include is present.
#
# NOT run as part of this change — this touches live production
# infrastructure, so a human runs it and confirms the result.
set -euo pipefail

VPS="root@72.61.23.56"
SNIPPET_LOCAL="infra/nginx/cache-headers.conf"
SNIPPET_REMOTE="/etc/nginx/snippets/digilist-cache-headers.conf"
INCLUDE_LINE="    include snippets/digilist-cache-headers.conf;"

# host  ->  conf file that defines its (443) server block
TARGETS=(
  "digilist.no|/etc/nginx/sites-enabled/digilist-apps.conf"
)

echo "→ Preparing snippet (brotli directives only if ngx_brotli is compiled in)"
STAGED="$(mktemp)"
cp "${SNIPPET_LOCAL}" "${STAGED}"
if ssh "${VPS}" "nginx -V 2>&1 | grep -q brotli"; then
  echo "  ngx_brotli detected on ${VPS} — enabling brotli directives"
  sed -i -E 's/^# ?(brotli.*)$/\1/' "${STAGED}"
else
  echo "  ngx_brotli not detected — leaving brotli directives commented out"
fi

echo "→ Uploading snippet to ${SNIPPET_REMOTE}"
scp "${STAGED}" "${VPS}:${SNIPPET_REMOTE}"
rm -f "${STAGED}"

remote_script=$(cat <<'REMOTE'
set -euo pipefail
INCLUDE_LINE="    include snippets/digilist-cache-headers.conf;"
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
  if grep -q "digilist-cache-headers.conf" "$file"; then
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
  echo "✓ cache headers applied + nginx reloaded"
else
  rollback
fi
REMOTE_EXEC

echo "→ Verifying headers are now present"
for t in "${TARGETS[@]}"; do
  host="${t%%|*}"
  printf '  %-30s Cache-Control=%s Content-Encoding=%s\n' "$host" \
    "$(curl -sI "https://${host}/" | grep -ci cache-control)" \
    "$(curl -sI -H 'Accept-Encoding: gzip' "https://${host}/" | grep -ci content-encoding)"
done
