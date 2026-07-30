# XAL-821: Content gap: Musikk- og dans-studioer, øvingsrom og øvesal

> Auto-prepared by Digilist Improvements Agent. Run Claude in this worktree:
> `/loop Write and publish SEO content for "Musikk- og dans-studioer, øvingsrom og øvesal". Cover Privat marked for musikk-undervisning og dans-trening søker øvingsrom — nisje med høy lokalisering, frekvent booking og underutgodtliggjort innholdsgap.. Goal: satisfy search intent for "musikk" on digilist.no. The blog post itself must be in Norwegian Bokmål.`

## Implementation contract — complete this before writing code
- **Problem:** Write and publish SEO content for "Musikk- og dans-studioer, øvingsrom og øvesal". Cover Privat marked for musikk-undervisning og dans-trening søker øvingsrom — nisje med høy lokalisering, frekvent booking og underutgodtliggjort innholdsgap.. Goal: satisfy search intent for "musikk" on digilist.no. The blog post itself must be in Norwegian Bokmål.
- **Business objective:** _why this matters (from the Linear issue)_
- **Repository / branch:** `/root/booking-brilliance` @ `agent/xal-821-content-gap-musikk-og-dans-studioer`
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
- One issue → one branch (`agent/xal-821-content-gap-musikk-og-dans-studioer`) → one independently reviewable change. Never main.
- Smallest valid change. No opportunistic refactoring, no broad formatting changes, no hidden dependency on another open PR.
- Validation is mandatory and staged — "code written" ≠ "compiled" ≠ "tests passed" ≠ "acceptance demonstrated". Collect evidence (test output / logs) before opening the PR.
- If scope expands beyond "Files likely affected", or the change grows large, STOP and escalate ("BLOCKED:") rather than pressing on.
- Open a PR only when green (otherwise a draft PR with a note). Delete this file before opening the PR.

## Full issue — from Linear (the source of truth for scope & acceptance)
> The Linear MCP in this environment may be bound to the WRONG workspace, so
> do NOT rely on it to read this ticket — everything you need is below. If
> something essential is genuinely missing here (e.g. a screenshot), STOP and
> end with "CLARIFICATION:" rather than guessing.

<!-- xaheen-triage -->
**enhancement** · value low — low because the gap is confirmed real (grep shows zero existing coverage) and traces to an actual search cluster the SEO agent detected, but the issue gives no search volume, traffic, or named user demand to justify higher

Digilist's marketing site has no content covering rental of music/dance studios, rehearsal rooms (øvingsrom), or practice halls (øvesal). A grep of booking-brilliance's src/ for "øvingsrom" and "øvesal" returns zero matches; the closest existing page, TjenesteMusiker.tsx, is about hiring a musician for an event, not renting a room to practice in. The gap was flagged by the SEO/improvements agent from a search cluster "leie studio eller øvingsrom musikk og dans".

**Done when**

- [ ] A new or expanded Norwegian Bokmål page targeting music/dance studio and øvingsrom/øvesal rental exists on the marketing site
- [ ] Page has SEO title/description targeting the øvingsrom/musikk search intent
- [ ] Fix touches only the new/expanded page's own content and metadata, not shared build/render scripts (per issue's stated scope restriction)

**How to verify**

* Load the new page route and confirm it renders Norwegian content covering øvingsrom/øvesal rental
* Run the existing SEO crawl/gate check and confirm no new critical errors

**Open questions**

* No target URL/slug or existing route is specified for the new content — where should it live in the site's page structure?
* No search volume, traffic-loss estimate, or booking-demand numbers are given for this cluster, only a qualitative claim of 'frequent booking' and 'high localization'

Target repo: `marketing`

#### Run as Claude loop (in `/root/booking-brilliance`, on a new branch)

```
/loop Write and publish SEO content for "Musikk- og dans-studioer, øvingsrom og øvesal". Cover Privat marked for musikk-undervisning og dans-trening søker øvingsrom — nisje med høy lokalisering, frekvent booking og underutgodtliggjort innholdsgap.. Goal: satisfy search intent for "musikk" on digilist.no. The blog post itself must be in Norwegian Bokmål.
```

Linear: https://linear.app/xala-technologies/issue/XAL-821/content-gap-musikk-og-dans-studioer-ovingsrom-og-ovesal
