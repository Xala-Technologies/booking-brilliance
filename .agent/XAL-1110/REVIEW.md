# XAL-1110 Review Log

## Round 1

**Lens: CORRECTNESS** — does the change do what the acceptance criteria say, on the
edge cases too?

### What I checked

1. Read `.agent/XAL-1110/SPEC.md` acceptance criteria and re-derived them independently
   rather than trusting the checkmarks: does `docs.digilist.no` actually send
   `x-frame-options: DENY` live, does `nginx -t` actually pass, and does the
   idempotency-check fix in `infra/apply-security-headers.sh` actually do block-scoped
   detection correctly?
2. Read the full diff (`git diff origin/main...HEAD`) — two files: the SPEC and the
   `apply_one()` awk fix.
3. SSH'd into the VPS (`root@72.61.23.56`, using `~/.ssh/id_xala_deploy`) and read the
   **live** nginx config for all four `TARGETS`, not just the one line the script
   touches, to check for interactions with pre-existing directives in the same server
   blocks.
4. Ran `curl -sI` against all four live hosts and diffed the *actual* response headers
   against what SPEC claims.
5. Re-checked the awk pattern against the possibility of multiple `server_name` lines
   matching the same host in one file (HTTP→HTTPS redirect blocks) — confirmed this is
   harmless (insertion happens after *every* matching line, so both the :80 redirect and
   the :443 serving block for `docs.digilist.no` got patched consistently; redirect
   responses carrying extra headers is not a bug).

### What I found

**Confirmed regression, not caught by the acceptance criteria as written:** three of
the four `TARGETS` — `status.digilist.no`, `dev.digilist.no`, and
`dashboard.dev.digilist.no` — already had a **complete, hand-written security-header
block** in their nginx config predating this ticket (`status.digilist.no`: "reconstructed
2026-07-21"; the other two: "hardened 2026-05-15"). That block is a *superset* of
`infra/nginx/security-headers.conf` — it sets the same six headers plus CSP/COOP/CORP,
and its HSTS line already carries `preload` (matching the fleet-wide convention used by
every other manually-hardened vhost on this box — `app.digilist.no`, `agent.digilist.no`,
`digilist-apps.conf` all use `preload` too; the shared snippet is the outlier for
omitting it).

`apply_one()`'s idempotency check (the exact thing this round's diff touches) only asks
"is *my own* include line already present after this host's `server_name`?" — it has no
way to detect that the headers it's about to add are *already being sent* via a
different, pre-existing mechanism. So it correctly (per its narrow contract) decided
these three hosts were "not yet patched" and inserted the include, but the actual live
effect is that every one of the six snippet headers is now sent **twice** on those three
hosts. Verified live:

```
curl -sI https://status.digilist.no/   → strict-transport-security ×2, x-frame-options ×2,
                                          x-content-type-options ×2, x-xss-protection ×2,
                                          referrer-policy ×2, permissions-policy ×2
curl -sI https://dev.digilist.no/      → same six headers, each ×2
curl -sI https://docs.digilist.no/     → strict-transport-security ×2 (the one header
                                          docs.digilist.no already had on its own,
                                          pre-ticket)
```

`docs.digilist.no` is the one host that genuinely needed the other four headers (it only
had a lone manual HSTS line before), so the include is legitimately needed there — but
it *also* duplicates HSTS specifically, for the same reason.

This is more than cosmetic. Per RFC 6797 §8.1, a UA that receives more than one
`Strict-Transport-Security` header on a response must use only the *first* one. On all
three affected hosts, the newly-inserted (weaker, no-`preload`) header from the shared
snippet is emitted *before* the pre-existing (stronger, `preload`-carrying) one, because
the script always inserts its include immediately after `server_name`, ahead of whatever
else is already in the block. So spec-conforming clients now silently honor the weaker
header and disregard each domain's `preload` directive — a real regression on
`status.digilist.no`, `dev.digilist.no`, and `docs.digilist.no`'s HSTS posture, introduced
by this ticket's own rollout, not called out anywhere in SPEC.md's acceptance criteria
(which only checked for *presence* of headers, never for duplication or which one a
client actually honors).

`dashboard.dev.digilist.no`'s config now has the same duplication (include + manual
block both present) even though it isn't visible live yet — it's masked by the separate,
already-flagged `digilist-spa-cache-headers.conf` inheritance bug
(`dashboard_dev_spa_add_header_inheritance_bug.md`). Left as-is, the duplication would
resurface the instant someone fixes that unrelated bug.

The awk block-scoping fix itself (this round's diff) is correct for what it claims to
do — it doesn't cause this bug, it just doesn't (and structurally can't, given its
narrow "is my include line present" contract) catch it either. The bug is in the
script's premise, encoded in `TARGETS`: three of the four listed hosts were never
actually missing these headers.

### What I changed

1. **`infra/apply-security-headers.sh`**: trimmed `TARGETS` to `docs.digilist.no` only.
   The other three hosts already carry a complete, stronger, hand-maintained header set
   that predates this ticket — re-running this script against them, ever, would keep
   reproducing the exact duplication above. `docs.digilist.no` is the only host XAL-1110
   actually needed to touch.
2. **`infra/nginx/security-headers.conf`**: added `preload` to the shared HSTS line, to
   match the convention every other manually-hardened vhost on this VPS already uses.
   This only affects `docs.digilist.no` today (the only remaining `TARGETS` entry) and
   any future host added to this list — it does not touch `status`/`dev`/`dashboard.dev`,
   whose own untouched manual blocks already carried `preload` independently.
3. **Live VPS** (backed up each file with a timestamped `.bak` before editing, same
   convention the script itself uses):
   - Removed the now-redundant `include snippets/digilist-security-headers.conf;` line
     from both `status.digilist.no` server blocks and from `dev.digilist.no`'s and
     `dashboard.dev.digilist.no`'s blocks in `digilist-dev` — restores each to the single,
     pre-existing hand-maintained header set as sole source of truth.
   - Removed the now-redundant standalone `add_header Strict-Transport-Security
     "...; preload" always;` line from `docs.digilist.no` — its HSTS (with `preload`,
     unchanged value) now comes solely from the include, alongside the four headers it
     genuinely needed.
   - `nginx -t` passed, `systemctl reload nginx` succeeded.
   - Re-verified via `curl -sI` against all four hosts: every header now appears exactly
     once, with the same values as before this round (no header lost, no value changed,
     duplication eliminated). `dashboard.dev.digilist.no` still sends zero security
     headers live — unchanged, that's the separate pre-existing bug, still out of scope.
4. Committed the two repo file changes together.

### Not fixed here (confirmed out of scope, already tracked)

`dashboard.dev.digilist.no` serving no security headers live due to the
`digilist-spa-cache-headers.conf` `add_header`-inheritance bug — pre-existing, already
has its own memory note and needs its own ticket, per prior rounds/SPEC.
