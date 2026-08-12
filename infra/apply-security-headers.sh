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

# Per-app snippets: host | conf file | local snippet | remote snippet.
#
# Unlike TARGETS above (one blanket snippet, safe everywhere), these carry
# policy that is only correct for one app. The CSP is the reason the split
# exists — infra/nginx/security-headers.conf says so in its own header: a
# CSP that is right for the docs site breaks the next vhost that loads a
# resource the docs don't. Keep one entry per host and never reuse a
# snippet across hosts without re-deriving its origins.
APP_SNIPPETS=(
  "docs.digilist.no|/etc/nginx/sites-available/docs.digilist.no|infra/nginx/docs-csp.conf|/etc/nginx/snippets/digilist-docs-csp.conf"
)

echo "→ Uploading snippet to ${SNIPPET_REMOTE}"
scp "${SNIPPET_LOCAL}" "${VPS}:${SNIPPET_REMOTE}"

for s in "${APP_SNIPPETS[@]}"; do
  IFS='|' read -r _host _file local_snippet remote_snippet <<<"$s"
  echo "→ Uploading app snippet to ${remote_snippet}"
  scp "${local_snippet}" "${VPS}:${remote_snippet}"
done

remote_script=$(cat <<'REMOTE'
set -euo pipefail
STAMP=$(date +%Y%m%d-%H%M%S)
declare -a BACKUPS=()
rollback() {
  echo "✗ nginx -t failed — rolling back"
  for b in "${BACKUPS[@]}"; do cp -f "$b" "${b%.bak-*}"; done
  exit 1
}
apply_one() {
  local host="$1" file="$2" line="$3"
  [ -f "$file" ] || { echo "  skip (no file): $file"; return; }
  # Two passes over the conf, then a diff, because a host now gets more than
  # one include (shared headers + its own CSP).
  #
  # Pass 1 walks each server block that names this host — matching braces so
  # the scan stops at the block's end — and records whether the include is
  # already somewhere inside it. Pass 2 re-emits the file, adding the include
  # after server_name only in the blocks that lacked it.
  #
  # Scoping to the block (not the whole file) is what makes a shared conf
  # safe: dev.digilist.no and dashboard.dev.digilist.no live in one file, so
  # a file-wide grep would report the second host as done when only the first
  # was patched. Scanning the whole block rather than just the line after
  # server_name is what makes *two* snippets safe: the old check compared
  # only the immediately-following line, so once the CSP include sat there
  # the shared-header check no longer recognised its own line and re-inserted
  # it on every run, duplicating headers indefinitely.
  awk -v host="$host" -v line="$line" '
    BEGIN { hostre = "server_name[^;]*[[:space:]]" host "[;[:space:]]" }
    NR==FNR {
      if (!inblock && $0 ~ hostre) { inblock=1; depth=1; start=FNR; has[start]=0; next }
      if (inblock) {
        if ($0 == line) has[start]=1
        # [{] rather than \{ — an escaped brace is an interval expression to
        # some awks; a bracket expression is a literal to all of them, and
        # this runs under mawk on the VPS and in CI.
        depth += gsub(/[{]/,"{") - gsub(/[}]/,"}")
        if (depth <= 0) inblock=0
      }
      next
    }
    { print }
    (FNR in has) && !has[FNR] { print line }
  ' "$file" "$file" > "${file}.tmp"
  # No diff means every matching block already had it — the idempotent path.
  if cmp -s "$file" "${file}.tmp"; then
    rm -f "${file}.tmp"; echo "  already applied: $host  (${line##*/})"; return
  fi
  local bak="${file}.bak-${STAMP}"
  cp -f "$file" "$bak"; BACKUPS+=("$bak")
  mv "${file}.tmp" "$file"
  echo "  patched: $host  (${line##*/}, backup: $bak)"
}
REMOTE
)

# Build the per-target apply calls and run everything remotely in one shell.
calls=""
for t in "${TARGETS[@]}"; do
  host="${t%%|*}"; file="${t##*|}"
  calls+=$'\n'"apply_one '${host}' '${file}' '${INCLUDE_LINE}'"
done
for s in "${APP_SNIPPETS[@]}"; do
  IFS='|' read -r host file _local remote_snippet <<<"$s"
  # nginx resolves a relative include against its prefix, so the include line
  # is snippets/<basename> — same shape as INCLUDE_LINE above.
  calls+=$'\n'"apply_one '${host}' '${file}' '    include snippets/${remote_snippet##*/};'"
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

# CSP is verified on a nested page as well as the root. An `add_header` in
# any `location` block silently drops every header inherited from `server`,
# so a policy that is present on / can still be missing on the pages people
# actually read. Each count below must be 1.
for s in "${APP_SNIPPETS[@]}"; do
  IFS='|' read -r host _file _local _remote <<<"$s"
  for path in "/" "/kom-i-gang/"; do
    printf '  %-30s CSP%-14s=%s\n' "$host" "$path" \
      "$(curl -sI "https://${host}${path}" | grep -ci content-security-policy)"
  done
done
