# Safe loader for /etc/digilist-api.env — sourced by the VPS agent runners.
# The file is in systemd EnvironmentFile format: values may contain <, >, #,
# spaces (e.g. MAIL_FROM=Digilist <noreply@…>), which break `. file`. Parse it
# line-by-line and export KEY=value literally instead.
if [ -f /etc/digilist-api.env ]; then
  while IFS= read -r __line; do
    case "$__line" in ''|\#*) continue ;; esac
    __k="${__line%%=*}"
    [ "$__k" = "$__line" ] && continue
    export "$__k=${__line#*=}"
  done < /etc/digilist-api.env
  unset __line __k
fi
