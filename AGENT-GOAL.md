# XAL-755: X-Frame-Options missing — clickjacking risk (security.header.x-frame-options)

> Auto-prepared by Digilist Improvements Agent. Run Claude in this worktree:
> `/loop In the `marketing` repo (booking-brilliance), fix a security-header gap: docs.digilist.no is missing from the TARGETS array in infra/apply-security-headers.sh, so it never receives the shared security-headers.conf include (X-Frame-Options DENY, HSTS, X-Content-Type-Options, Referrer-Policy, Permissions-Policy), leaving it exposed to clickjacking. status.digilist.no, dev.digilist.no, and dashboard.dev.digilist.no are already covered; docs.digilist.no was never added even though it's a real, separately-deployed static site (see deploy.sh Stage 2.9, which deploys apps/docs to docs.digilist.no via its own nginx vhost).

Do this:
1. In infra/apply-security-headers.sh, add a new line to the TARGETS array (around line 21-25): `"docs.digilist.no|/etc/nginx/sites-available/docs.digilist.no"` — following the same `host|conf-file` format as the existing status.digilist.no entry (a standalone vhost, not shared like the dev pair).
2. Do NOT modify infra/nginx/security-headers.conf — DENY is the correct X-Frame-Options policy for a docs site, no header policy change needed.
3. Do NOT run the script against production as part of this change — a maintainer applies it manually afterward. This PR only adds the TARGETS entry.
4. Update the comment block at the top of infra/nginx/security-headers.conf (lines 3-5) if it explicitly enumerates the affected subdomains, so it also mentions docs.digilist.no.
5. Sanity-check the script's awk insertion logic still makes sense for a single-host vhost file structurally like status.digilist.no's (it should, since it copies that pattern).

Acceptance criteria:
- TARGETS in infra/apply-security-headers.sh includes a docs.digilist.no entry pointing at /etc/nginx/sites-available/docs.digilist.no.
- No changes to the header policy itself (security-headers.conf stays DENY-based, unchanged apart from possibly updating the comment).
- Script logic (backup, insert include, nginx -t, reload-or-rollback) is untouched — only the TARGETS array (and possibly the header comment) changes.
- Any existing tests/lint for this repo pass (run the repo's standard lint/typecheck; there is no dedicated typecheck script here — use an ad-hoc `tsc --noEmit` only if you touch TS files, which this change should not require).
- Do not run the script against the production VPS as part of this PR.

Open a PR against main when done, tests/lint green.`

## Implementation contract — complete this before writing code
- **Problem:** In the `marketing` repo (booking-brilliance), fix a security-header gap: docs.digilist.no is missing from the TARGETS array in infra/apply-security-headers.sh, so it never receives the shared security-headers.conf include (X-Frame-Options DENY, HSTS, X-Content-Type-Options, Referrer-Policy, Permissions-Policy), leaving it exposed to clickjacking. status.digilist.no, dev.digilist.no, and dashboard.dev.digilist.no are already covered; docs.digilist.no was never added even though it's a real, separately-deployed static site (see deploy.sh Stage 2.9, which deploys apps/docs to docs.digilist.no via its own nginx vhost).

Do this:
1. In infra/apply-security-headers.sh, add a new line to the TARGETS array (around line 21-25): `"docs.digilist.no|/etc/nginx/sites-available/docs.digilist.no"` — following the same `host|conf-file` format as the existing status.digilist.no entry (a standalone vhost, not shared like the dev pair).
2. Do NOT modify infra/nginx/security-headers.conf — DENY is the correct X-Frame-Options policy for a docs site, no header policy change needed.
3. Do NOT run the script against production as part of this change — a maintainer applies it manually afterward. This PR only adds the TARGETS entry.
4. Update the comment block at the top of infra/nginx/security-headers.conf (lines 3-5) if it explicitly enumerates the affected subdomains, so it also mentions docs.digilist.no.
5. Sanity-check the script's awk insertion logic still makes sense for a single-host vhost file structurally like status.digilist.no's (it should, since it copies that pattern).

Acceptance criteria:
- TARGETS in infra/apply-security-headers.sh includes a docs.digilist.no entry pointing at /etc/nginx/sites-available/docs.digilist.no.
- No changes to the header policy itself (security-headers.conf stays DENY-based, unchanged apart from possibly updating the comment).
- Script logic (backup, insert include, nginx -t, reload-or-rollback) is untouched — only the TARGETS array (and possibly the header comment) changes.
- Any existing tests/lint for this repo pass (run the repo's standard lint/typecheck; there is no dedicated typecheck script here — use an ad-hoc `tsc --noEmit` only if you touch TS files, which this change should not require).
- Do not run the script against the production VPS as part of this PR.

Open a PR against main when done, tests/lint green.
- **Business objective:** _why this matters (from the Linear issue)_
- **Repository / branch:** `/root/booking-brilliance` @ `agent/xal-755-x-frame-options-missing-clickjacking-risk`
- **Scope:** _the one change this branch delivers_
- **Out of scope:** _what you will NOT touch — no opportunistic refactor, no formatting sweeps_
- **Acceptance criteria:** _observable, demonstrable outcomes_
- **Architecture constraints:** _boundaries + patterns to follow_
- **Files likely affected:** _list them; if this grows well beyond the list, escalate_
- **Testing requirements:** _what proves it works_
- **Security considerations:** _secrets, RBAC, injection, dependencies_
- **Rollback strategy:** _how to revert safely_
- **Definition of done:** compiled · tests green · acceptance demonstrated with evidence · one reviewable change · no attribution

## Delivery rules
- One issue → one branch (`agent/xal-755-x-frame-options-missing-clickjacking-risk`) → one independently reviewable change. Never main.
- Smallest valid change. No opportunistic refactoring, no broad formatting changes, no hidden dependency on another open PR.
- Validation is mandatory and staged — "code written" ≠ "compiled" ≠ "tests passed" ≠ "acceptance demonstrated". Collect evidence (test output / logs) before opening the PR.
- If scope expands beyond "Files likely affected", or the change grows large, STOP and escalate ("BLOCKED:") rather than pressing on.
- Open a PR only when green (otherwise a draft PR with a note). Delete this file before opening the PR.

## Full issue — from Linear (the source of truth for scope & acceptance)
> The Linear MCP in this environment may be bound to the WRONG workspace, so
> do NOT rely on it to read this ticket — everything you need is below. If
> something essential is genuinely missing here (e.g. a screenshot), STOP and
> end with "CLARIFICATION:" rather than guessing.

**Classification:** bug · severity minor · priority P2

Product gap: X-Frame-Options missing — clickjacking risk (security.header.x-frame-options). <!-- xaheen-triage -->
**defect** · severity minor — Matches the auditor's own warn severity for this rule and the issue's stated minor/P2 — one docs page missing a defense-in-depth header, no data loss, no core flow broken.

[docs.digilist.no](<http://docs.digilist.no>) serves pages without X-Frame-Options (clickjacking risk) because its nginx server block only sets Strict-Transport-Security manually and never includes the shared security-headers snippet. infra/apply-security-headers.sh's TARGETS array — the automation that rolls this out — never listed [docs.digilist.no](<http://docs.digilist.no>), only [status.digilist.no](<http://status.digilist.no>), [dev.digilist.no](<http://dev.digilist.no>), and [dashboard.dev.digilist.no](<http://dashboard.dev.digilist.no>).

**Done when**

- [ ] TARGETS in infra/apply-security-headers.sh gains a [docs.digilist.no](<http://docs.digilist.no>) entry pointing at /etc/nginx/sites-available/docs.digilist.no
- [ ] Running the script against that target inserts the include line, passes nginx -t, and reloads without triggering rollback
- [ ] curl -I [https://docs.digilist.no/](<https://docs.digilist.no/>) returns X-Frame-Options and the other headers from security-headers.conf

**Not included**

* Changing the header policy in infra/nginx/security-headers.conf itself — DENY is correct for a docs site
* Running the script against production as part of this PR — a maintainer applies it manually afterward

**How to verify**

* curl -I [https://docs.digilist.no/](<https://docs.digilist.no/>) before and after — confirm X-Frame-Options: DENY appears after the fix is applied
* nginx -t on the VPS after the script runs — confirm no syntax error and no rollback

Target repo: `marketing`

<details><summary>Reporter's original text</summary>

**Classification:** bug · severity minor · priority P2

X-Frame-Options missing — clickjacking risk (security.header.x-frame-options). X-Frame-Options missing — clickjacking risk
Regel: security.header.x-frame-options
Overflate: Docs — [docs.digilist.no](<http://docs.digilist.no>)
Affiserte sider: 1
Eksempel-URL: [https://docs.digilist.no/](<https://docs.digilist.no/>) Observed at [https://docs.digilist.no/](<https://docs.digilist.no/>). Classification: bug/minor — gap. Relevant code: infra/nginx/security-headers.conf, infra/apply-security-headers.sh, tools/site-intelligence/src/auditors/security.ts:38-42.

**Scope**
Add [docs.digilist.no](<http://docs.digilist.no>) as a new TARGETS entry in infra/apply-security-headers.sh pointing at its nginx sites-available conf file on the VPS ([root@72.61.23.56](<mailto:root@72.61.23.56>)), so the existing safe include-snippet workflow (backup, insert include, nginx -t, reload-or-rollback) also covers the docs subdomain. The security-headers.conf snippet itself needs no change — DENY policy is fine for a docs site. Touch points: infra/nginx/security-headers.conf (header snippet exists (X-Frame-Options DENY, HSTS, etc.) with a comment saying only [status.digilist.no](<http://status.digilist.no>), [dev.digilist.no](<http://dev.digilist.no>), [dashboard.dev.digilist.no](<http://dashboard.dev.digilist.no>) are missing it — [docs.digilist.no](<http://docs.digilist.no>) is not mentioned); infra/apply-security-headers.sh (TARGETS array only lis

…(truncated)

</details> Current assessment: gap (bug, minor). Relevant code: infra/apply-security-headers.sh:21-25, infra/nginx/security-headers.conf:14-19, deploy.sh:396-421, tools/site-intelligence/src/targets.ts:124-125 / convex/audits/targets.ts:100-101.

**Scope**
Add a [docs.digilist.no](<http://docs.digilist.no>) entry to the TARGETS array in infra/apply-security-headers.sh, pointing at /etc/nginx/sites-available/docs.digilist.no (matching the file-naming convention already used for the standalone [status.digilist.no](<http://status.digilist.no>) entry). No changes needed to infra/nginx/security-headers.conf (DENY policy is correct) or to the script's apply/backup/nginx-t/rollback logic, which already generalizes to any TARGETS entry. Touch points: infra/apply-security-headers.sh:21-25 (TARGETS array lists [status.digilist.no](<http://status.digilist.no>), [dev.digilist.no](<http://dev.digilist.no>), [dashboard.dev.digilist.no](<http://dashboard.dev.digilist.no>) only — [docs.digilist.no](<http://docs.digilist.no>) is absent); infra/nginx/security-headers.conf:14-19 (shared snippet already sets X-Frame-Options DENY plus HSTS/nosniff/Referrer-Policy/Permissions-Policy; header policy itself needs no change); deploy.sh:396-421 (confirms [docs.digilist.no](<http://docs.digilist.no>) is a real deployed static site (apps/docs) served via its own nginx vhost, root ${DOCS_DIR}); tools/site-intelligence/src/targets.ts:124-125 / convex/audits/targets.ts:100-101 ([docs.digilist.no](<http://docs.digilist.no>) is a tracked audit target, consistent with the auditor finding this gap).

**Done when**

- [ ] Add a [docs.digilist.no](<http://docs.digilist.no>) entry to the TARGETS array in infra/apply-security-headers.sh, pointing at /etc/nginx/sites-available/docs.digilist.no (matching the file-naming convention already used for the standalone [status.digilist.no](<http://status.digilist.no>) entry). No changes needed to infra/nginx/security-headers.conf (DENY policy is correct) or to the script's apply/backup/nginx-t/rollback logic, which already generalizes to any TARGETS entry.

## Code analysis (evidence, marketing @ 74bf7ef8)

Status: **gap** (confidence 90%)

* `infra/apply-security-headers.sh:21-25` — TARGETS array lists [status.digilist.no](<http://status.digilist.no>), [dev.digilist.no](<http://dev.digilist.no>), [dashboard.dev.digilist.no](<http://dashboard.dev.digilist.no>) only — [docs.digilist.no](<http://docs.digilist.no>) is absent
* `infra/nginx/security-headers.conf:14-19` — shared snippet already se

Linear: https://linear.app/xala-technologies/issue/XAL-755/x-frame-options-missing-clickjacking-risk-securityheaderx-frame
