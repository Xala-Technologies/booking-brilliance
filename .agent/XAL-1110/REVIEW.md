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

## Round 2

**Lens: REGRESSION** — what ELSE reads this code path, and did anything depend on the
old behaviour (file-scoped idempotency check, all four `TARGETS`, no-`preload` HSTS)?

### What I checked

Grepped the whole repo (not just the two edited files) for every consumer of
`infra/apply-security-headers.sh`, `infra/nginx/security-headers.conf`, the string
`digilist-security-headers.conf`, and the four hostnames themselves, then read each hit:

1. **`infra/sla-watchdog/watchdog.sh`** — probes `docs`/`status`/`app`/`web` every 60s via
   `curl -s -o /dev/null -w '%{http_code}'` and restarts `nginx.service` on 3 consecutive
   non-2xx/3xx. It only reads the HTTP status line, never header content, so neither
   Round 1's header-duplication (now fixed) nor this round's `TARGETS` trim can affect it
   — confirmed no dependency.
2. **`infra/certbot/{install.sh,reload-nginx.sh}`** — the renewal deploy-hook only runs
   `nginx -t && systemctl reload nginx` after a cert renews; it never rewrites
   `sites-available/*` server-block content (no `--nginx` authenticator/installer flag
   anywhere in these scripts, so it's webroot-based and can't clobber the `include` line
   this ticket's rollout inserted into `docs.digilist.no`'s block).
3. **`.github/workflows/deploy.yml`** — read in full. Only rsyncs the built app into
   `releases/rel-<ts>` and atomically flips nginx's `current` symlink; it never touches
   `/etc/nginx/sites-available/*` or `/etc/nginx/snippets/*`, so it can't overwrite or
   race the live nginx edits this ticket (and Round 1's cleanup) made on the VPS.
4. **`tools/site-intelligence/src/auditors/security.ts`** (`evaluateHeaders`) — this is
   the actual scanner that produced the XAL-1110 finding in the first place (rule id
   `security.header.x-frame-options`, same message text as the ticket title). It reads
   `res.headers` from the platform `fetch()` in `tools/site-intelligence/src/fetcher.ts:50`,
   which folds duplicate response headers into one comma-joined string (except
   `Set-Cookie`) rather than erroring — so even during Round 1's now-fixed duplication
   window this auditor would not have crashed, only potentially mis-scored HSTS's
   `max-age` regex against a joined value. Not a live concern: Round 1 already eliminated
   the duplication before any rescan would run. `evaluateHeaders` only checks
   presence + a regex on `max-age`, nothing that pins an exact header string, so adding
   `preload` to the shared HSTS line is safe and won't produce a new finding.
5. **`convex/audits/targets.ts`** and **`tools/site-intelligence/src/targets.ts`** — both
   list all four hosts (`dev`, `docs`, `dashboard-dev`, `status`) as scan targets. These
   read live HTTP responses, not the script or its `TARGETS` array, so trimming the
   script's `TARGETS` to `docs.digilist.no` only doesn't desync anything here — the
   scanner will keep finding `status`/`dev`/`dashboard-dev` header-compliant (their
   pre-existing hand-written blocks are untouched) and `dashboard-dev` still
   non-compliant (the separate, already-flagged inheritance bug), exactly matching
   current live reality either way.
6. **`tools/site-intelligence/REMEDIATION.md`** — describes a *proposed* (`Phase 2`,
   explicitly "not yet wired into a loop") `infra-config → generate nginx snippet → PR`
   pipeline that would read this script. Nothing in the repo currently executes that
   phase, so there is no live automation whose behaviour this round's diff could change.
7. **`.agent/XAL-1156/`** — a different, already-*merged* ticket (`a0c884a`, ancestor of
   `HEAD`) that edits a *different* file (`server/nginx.snippet.conf`, for `digilist.no`
   root only) and only mentions `infra/apply-security-headers.sh` /
   `infra/nginx/security-headers.conf` in prose as a "these are unrelated, false-positive
   substring match" aside in its own review. Confirmed via `git merge-base --is-ancestor`
   — no concurrent-branch collision, no shared code path.
8. Searched for hardcoded expectations of the old (non-`preload`, 4-host) behaviour in
   test files, `infra/*/README.md`, and every other `*.md` in the repo — no test
   references `apply-security-headers.sh`/`security-headers.conf`/`TARGETS`, and no
   runbook prose treats "all four hosts" as a documented invariant (the only `.md` hits
   for the three non-docs hostnames are `tools/site-intelligence/PLAN.md`'s target table,
   already covered by point 5, and an unrelated blog post mentioning `status.digilist.no`
   in prose).
9. Re-curled all four live hosts to confirm the current state matches what SPEC/Round 1
   claim, independent of trusting their prose:
   `docs`/`status`/`dev` each send every one of the five headers **exactly once**, HSTS
   now carrying `preload` on all three; `dashboard.dev.digilist.no` still sends **zero**
   security headers (matches the separately-tracked, out-of-scope inheritance bug — not a
   new regression from this round).

### What I found

No regression. Every consumer of the touched files/hosts either reads live HTTP state
(unaffected either way — duplication already fixed by Round 1, `preload` addition is
additive-only) or reads status codes only (watchdog), and nothing outside
`infra/apply-security-headers.sh` itself depends on its internal `TARGETS` list or its
idempotency-check implementation. `.agent/XAL-1156` looked like a possible concurrent
collision on the same infra files but turned out to be already-merged history on a
different file, confirmed via `git merge-base --is-ancestor`.

### What I changed

Nothing — this lens found no code to fix. No commit needed for the code; this section
itself is the round's output.

## Round 3

**Lens: SECURITY** — authz, tenant isolation, injection, secrets, and anything
user-supplied that reaches a query, a path, or a page.

### What I checked

This diff has no application code, no DB access, and no multi-tenant surface —
it's an nginx header snippet and the deploy script that installs it — so I
worked the lens as: (a) does the fix genuinely close the clickjacking vector
without opening a new one, (b) is there any injection risk in how the script
builds and runs remote commands, (c) are there secrets anywhere in the diff or
its VPS-side effects, (d) does trimming `TARGETS` or reordering exposure leave
any host newly or differently exposed.

1. **Injection in the deploy script.** Read `infra/apply-security-headers.sh`
   end to end. `host`/`file` in `TARGETS` are hardcoded array literals, not
   derived from any external input (no env var, no CLI arg, no file read) —
   so the `awk -v host="$host" ...` regex construction and the
   `apply_one '${host}' '${file}'` call-string built into `calls` have no
   attacker-controlled path reaching them today. Checked whether the outer
   `ssh "${VPS}" "bash -s" <<REMOTE_EXEC` heredoc (unquoted delimiter, so
   subject to expansion) could cause `${remote_script}`'s embedded literal
   text — e.g. `STAMP=$(date +%Y%m%d-%H%M%S)`, captured via the *quoted*
   `<<'REMOTE'` heredoc — to be re-evaluated by the *local* shell before
   being sent over SSH. Confirmed this is safe: parameter/command
   substitution in bash is a single lexical pass over the heredoc's own
   text; a `$(...)` that arrives *as the value* of an expanded `${var}` is
   not re-scanned, it's forwarded as literal characters to the remote
   `bash -s`, which is exactly the intended design (STAMP is meant to be
   computed remotely, at apply time). No injection there, current design.
   Grepped the whole repo for any CI/webhook/cron trigger of this script
   (`grep -rln "apply-security-headers"` → only the script itself,
   `security-headers.conf`, `AGENT-GOAL.md`, and this ticket's own `.agent/`
   docs) — confirms Round 2's finding independently: nothing external ever
   supplies `TARGETS` or invokes this script with variable input.
2. **Secrets.** Read the full diff and the script for embedded credentials,
   tokens, or private key material — none. The VPS address
   (`root@72.61.23.56`) and SSH key path (`~/.ssh/id_xala_deploy`, referenced
   only in SPEC.md prose) are operational details already present on `main`
   before this ticket, not new exposure.
3. **Does the fix actually close the clickjacking hole, live, right now** —
   re-curled all four hosts independently rather than trusting SPEC/Round
   1/Round 2's prose:
   - `docs.digilist.no` → `x-frame-options: DENY` present exactly once,
     alongside HSTS (`preload`), X-Content-Type-Options, Referrer-Policy,
     Permissions-Policy. XAL-1110's actual ask is closed.
   - `status.digilist.no`, `dev.digilist.no` → each header present exactly
     once (Round 1's dedup holds), plus their own pre-existing CSP with
     `frame-ancestors 'self'` / `'none'` respectively — no regression, no
     duplication reintroduced by this round's untouched code.
   - `dashboard.dev.digilist.no` → confirmed still **zero** security headers
     live (no XFO, no CSP, no HSTS) — this is the genuinely worst clickjacking
     exposure of the four hosts (an admin-facing dashboard, unprotected), but
     it is not a new or previously-unflagged finding: SPEC.md's "Did not fix"
     section, Round 1, and the standing memory note
     (`dashboard_dev_spa_add_header_inheritance_bug.md`) already identify the
     exact root cause (`digilist-spa-cache-headers.conf`'s
     `location = /index.html { add_header Cache-Control ...; }` silently
     drops all inherited server-level `add_header`s per nginx's inheritance
     rule) and already scope it to a separate ticket. Re-confirming it here
     under the security lens rather than re-diagnosing it: nothing new to add.
4. **Cross-host bleed / tenant isolation** — these four hosts are Digilist's
   own internal subdomains (docs, status, dev, dashboard-dev), not
   customer-tenant boundaries, so there's no multi-tenant data-isolation
   surface in this diff to evaluate. Checked whether the awk `server_name`
   match could accidentally patch the *wrong* host's block if two hosts'
   names were substrings of each other in the same file — not applicable
   post-Round-1: `TARGETS` now contains exactly one entry
   (`docs.digilist.no`), and its own conf file has no other host sharing a
   substring relationship with it.
5. **Header value correctness as a security property** — `X-XSS-Protection:
   0` (deliberately disables the legacy filter, current best practice, not a
   downgrade), `Permissions-Policy` denies camera/mic/geolocation by default
   and only allows `payment=(self)`, `Referrer-Policy` is
   `strict-origin-when-cross-origin` (no referrer leakage cross-origin
   beyond origin). None of these changed in a way that weakens posture;
   the only value change this round's *diff* (Round 1, already reviewed) made
   was adding `preload` to HSTS, which strengthens it.

### What I found

No new security defects. The deploy script has no attacker-reachable input
path (today), carries no secrets, and the live re-curl confirms the
clickjacking fix is genuinely in effect on `docs.digilist.no` with no
duplicate or conflicting headers on any of the four hosts. The one real
security gap among the four — `dashboard.dev.digilist.no` still sending zero
headers — is pre-existing, already root-caused, and already correctly scoped
out of this ticket by SPEC.md and Round 1; re-confirmed live here, not a new
finding.

### What I changed

Nothing — this lens found no code to fix. No commit needed for the code; this
section itself is the round's output.
