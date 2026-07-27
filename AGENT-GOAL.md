# XAL-360: /: 2 domains affected (brand, sustainability)

> Auto-prepared by Digilist Improvements Agent. Run Claude in this worktree:
> `/loop In the booking-brilliance repo (marketing site for digilist.no), fix 3 of 4 findings from an automated brand/sustainability scan of the homepage. Do NOT attempt the 4th (see note at the end).

1) Organisasjonsnummer visibility (brand.missing-org-number): The org number '920 972 454' (Xala Technologies AS) is already published on /personvern (src/pages/Personvern.tsx:63) but the scan only crawled the homepage and found none there. Add it to the site-wide footer: in src/components/Footer.tsx's bottom colophon block (around line 372-393, next to '© {year} Digilist · Et produkt av Xala Technologies AS'), add a short line like 'Org.nr. 920 972 454'. Also add the org number to the Organization JSON-LD schema in src/components/SEO.tsx (around lines 140-176) using an appropriate schema.org property (e.g. `identifier` or `taxID`, value '920972454') so it's machine-readable too. Keep formatting consistent with the existing editorial-mono-caption styling used elsewhere in Footer.tsx.

2) Homepage HTML weight (sustain.html-weight, 309KB baseline vs 100KB budget): Run `pnpm build` (or `pnpm build:dev` if faster) and check the actual byte size of the built homepage HTML (dist/index.html after prerender, since scripts/prerender.mjs writes static HTML per route). Investigate scripts/prerender.mjs lines ~2272 and ~2546 where JSON-LD blocks are inlined via `JSON.stringify` into `<script type="application/ld+json">` tags — check whether these blocks are unnecessarily large or duplicated across the blocks pushed in src/components/SEO.tsx, and trim/dedupe them. Also check for any other large inlined data on the homepage (e.g. embedded blog/post lists, large data arrays) that isn't deferred/lazy-loaded. Do not guess at causes — measure the actual HTML first (e.g. `wc -c dist/index.html`, or grep for the biggest inline `<script>` blocks) and only cut what's actually large. Confirm server-side gzip/brotli compression is enabled (check whatever nginx config governs the live digilist.no server block; if it's not tracked in this repo, note that and hand off the compression check as an infra step per finding 3 below). Target: measurably smaller than 309KB, ideally near or under 100KB.

3) Cache-Control on homepage (sustain.no-cache): This repo does not track the live nginx server block for digilist.no's root path — only server/nginx.snippet.conf (api proxy) and infra/nginx/security-headers.conf (security headers for other subdomains) are tracked, both applied to the VPS via infra/apply-security-headers.sh over SSH. Follow that exact pattern: write a new infra/nginx/cache-headers.conf snippet (or extend security-headers.conf) that adds `Cache-Control: public, max-age=300, must-revalidate` (adjust max-age if you have reason to prefer a different value, but must include a revalidation directive) to cacheable HTML responses, plus a matching apply script (infra/apply-cache-headers.sh) modeled on infra/apply-security-headers.sh's backup/nginx -t/rollback logic, targeting the digilist.no server block specifically. Do not run the deploy script yourself against production — write it, test `nginx -t` logic locally if possible, and leave the actual remote apply for a human to run and confirm (this touches live production infrastructure).

Out of scope / do NOT attempt: the tilgjengelighetserklæring (accessibility statement) link (brand.missing-accessibility-statement). No such statement exists yet — grep confirms zero references to uustatus.no or tilgjengelighetserklæring anywhere in the codebase. A URL to a real, registered statement cannot be fabricated; this needs a human to register/publish one at uustatus.no first. Leave this finding as blocked and say so explicitly in your PR description; do not add a fake or placeholder link to Footer.tsx.

Acceptance criteria: org number visible in Footer.tsx and SEO.tsx Organization schema; homepage HTML size measurably reduced with the before/after byte counts documented in the PR description; a cache-headers infra snippet + apply script added (not run) following the existing apply-security-headers.sh pattern; all existing tests, lint, and `pnpm build` pass; no regressions in other footer/SEO behavior. Keep the change scoped to these three findings only, no drive-by refactors.`

## Implementation contract — complete this before writing code
- **Problem:** In the booking-brilliance repo (marketing site for digilist.no), fix 3 of 4 findings from an automated brand/sustainability scan of the homepage. Do NOT attempt the 4th (see note at the end).

1) Organisasjonsnummer visibility (brand.missing-org-number): The org number '920 972 454' (Xala Technologies AS) is already published on /personvern (src/pages/Personvern.tsx:63) but the scan only crawled the homepage and found none there. Add it to the site-wide footer: in src/components/Footer.tsx's bottom colophon block (around line 372-393, next to '© {year} Digilist · Et produkt av Xala Technologies AS'), add a short line like 'Org.nr. 920 972 454'. Also add the org number to the Organization JSON-LD schema in src/components/SEO.tsx (around lines 140-176) using an appropriate schema.org property (e.g. `identifier` or `taxID`, value '920972454') so it's machine-readable too. Keep formatting consistent with the existing editorial-mono-caption styling used elsewhere in Footer.tsx.

2) Homepage HTML weight (sustain.html-weight, 309KB baseline vs 100KB budget): Run `pnpm build` (or `pnpm build:dev` if faster) and check the actual byte size of the built homepage HTML (dist/index.html after prerender, since scripts/prerender.mjs writes static HTML per route). Investigate scripts/prerender.mjs lines ~2272 and ~2546 where JSON-LD blocks are inlined via `JSON.stringify` into `<script type="application/ld+json">` tags — check whether these blocks are unnecessarily large or duplicated across the blocks pushed in src/components/SEO.tsx, and trim/dedupe them. Also check for any other large inlined data on the homepage (e.g. embedded blog/post lists, large data arrays) that isn't deferred/lazy-loaded. Do not guess at causes — measure the actual HTML first (e.g. `wc -c dist/index.html`, or grep for the biggest inline `<script>` blocks) and only cut what's actually large. Confirm server-side gzip/brotli compression is enabled (check whatever nginx config governs the live digilist.no server block; if it's not tracked in this repo, note that and hand off the compression check as an infra step per finding 3 below). Target: measurably smaller than 309KB, ideally near or under 100KB.

3) Cache-Control on homepage (sustain.no-cache): This repo does not track the live nginx server block for digilist.no's root path — only server/nginx.snippet.conf (api proxy) and infra/nginx/security-headers.conf (security headers for other subdomains) are tracked, both applied to the VPS via infra/apply-security-headers.sh over SSH. Follow that exact pattern: write a new infra/nginx/cache-headers.conf snippet (or extend security-headers.conf) that adds `Cache-Control: public, max-age=300, must-revalidate` (adjust max-age if you have reason to prefer a different value, but must include a revalidation directive) to cacheable HTML responses, plus a matching apply script (infra/apply-cache-headers.sh) modeled on infra/apply-security-headers.sh's backup/nginx -t/rollback logic, targeting the digilist.no server block specifically. Do not run the deploy script yourself against production — write it, test `nginx -t` logic locally if possible, and leave the actual remote apply for a human to run and confirm (this touches live production infrastructure).

Out of scope / do NOT attempt: the tilgjengelighetserklæring (accessibility statement) link (brand.missing-accessibility-statement). No such statement exists yet — grep confirms zero references to uustatus.no or tilgjengelighetserklæring anywhere in the codebase. A URL to a real, registered statement cannot be fabricated; this needs a human to register/publish one at uustatus.no first. Leave this finding as blocked and say so explicitly in your PR description; do not add a fake or placeholder link to Footer.tsx.

Acceptance criteria: org number visible in Footer.tsx and SEO.tsx Organization schema; homepage HTML size measurably reduced with the before/after byte counts documented in the PR description; a cache-headers infra snippet + apply script added (not run) following the existing apply-security-headers.sh pattern; all existing tests, lint, and `pnpm build` pass; no regressions in other footer/SEO behavior. Keep the change scoped to these three findings only, no drive-by refactors.
- **Business objective:** _why this matters (from the Linear issue)_
- **Repository / branch:** `/root/booking-brilliance` @ `agent/xal-360-2-domains-affected-brand-sustainability`
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
- One issue → one branch (`agent/xal-360-2-domains-affected-brand-sustainability`) → one independently reviewable change. Never main.
- Smallest valid change. No opportunistic refactoring, no broad formatting changes, no hidden dependency on another open PR.
- Validation is mandatory and staged — "code written" ≠ "compiled" ≠ "tests passed" ≠ "acceptance demonstrated". Collect evidence (test output / logs) before opening the PR.
- If scope expands beyond "Files likely affected", or the change grows large, STOP and escalate ("BLOCKED:") rather than pressing on.
- Open a PR only when green (otherwise a draft PR with a note). Delete this file before opening the PR.

## Full issue — from Linear (the source of truth for scope & acceptance)
> The Linear MCP in this environment may be bound to the WRONG workspace, so
> do NOT rely on it to read this ticket — everything you need is below. If
> something essential is genuinely missing here (e.g. a screenshot), STOP and
> end with "CLARIFICATION:" rather than guessing.

**Classification:** improvement · severity minor · priority P2

Product gap: /: 2 domains affected (brand, sustainability). <!-- xaheen-triage -->

## Problem Statement

[digilist.no](<http://digilist.no>)'s homepage is missing two Norwegian legal/compliance disclosures (organisasjonsnummer, tilgjengelighetserklæring link) and has performance/sustainability shortfalls (309KB HTML against a 100KB budget; no effective Cache-Control), per an automated brand/sustainability scan of the root page.

## Scope

**In scope:**

* Show a 9-digit Norwegian organisasjonsnummer in the footer / contact / about page (brand.missing-org-number)
* Publish a tilgjengelighetserklæring (accessibility statement, via [uustatus.no](<http://uustatus.no>)) and link it in the footer (brand.missing-accessibility-statement)
* Reduce inlined markup/data on the homepage, defer non-critical content, ensure server compression to bring HTML size down from 309KB toward the 100KB budget (sustain.html-weight)
* Set an appropriate Cache-Control header with revalidation on cacheable homepage responses (sustain.no-cache)

**Out of scope:**

* Changes outside the repository that serves [digilist.no](<http://digilist.no>)'s root page
* Unrelated refactors, drive-by fixes, or direct merges to main
* Scope creep beyond the four named findings

## Acceptance Criteria

- [ ] A 9-digit Norwegian organisasjonsnummer is visible in the footer, contact, or about page of [digilist.no](<http://digilist.no>)
- [ ] A working link to a published tilgjengelighetserklæring ([uustatus.no](<http://uustatus.no>)) is present in the footer
- [ ] The homepage HTML response size is measurably reduced from the 309KB baseline
- [ ] Homepage responses include a Cache-Control header with revalidation directives
- [ ] All existing tests and build pass; no regression in existing user-facing behaviour

## Testing Scenario

* Given a visitor loads [https://digilist.no](<https://digilist.no>), When they view the footer, Then a 9-digit organisasjonsnummer is displayed
* Given a visitor loads [https://digilist.no](<https://digilist.no>), When they view the footer, Then a link to the tilgjengelighetserklæring on [uustatus.no](<http://uustatus.no>) is present and resolves
* Given the homepage HTML response, When its size is measured, Then it is smaller than the 309KB baseline (target ≤100KB)
* Given a repeat visit to [https://digilist.no](<https://digilist.no>), When the response headers are inspected, Then Cache-Control is present with an appropriate revalidation directive

## Value: unknown — no priority set; a human decides the value

The issue gives no evidence of blocked users, revenue at stake, or a specific commitment — only automated scan findings against generic compliance/sustainability frameworks — so value is unknown rather than guessed; kept anyway because two of the four findings (missing organisasjonsnummer, missing tilgjengelighetserklæring) are concrete Norwegian legal-identity/accessibility disclosures named in the issue's own frameworks (NO-Company-Identity, NO-uu-forskrift), which is a real, traceable argument distinct from the two lower-weight sustainability items.

## Target repo: `marketing`

*Chosen by triage from the issue's content; routes preparation there.*

## Open questions

* Is [digilist.no](<http://digilist.no>)'s root page served by the marketing repo (booking-brilliance) or the app repo (Digilist)? The issue doesn't state which; repo choice below is inferred from the page being a homepage/footer/about-page concern.
* Does Digilist qualify as a public-sector service requiring a tilgjengelighetserklæring, or does the requirement depend on whether kommune/offentlig customers are served? Not established in the issue text.
* What specific organisasjonsnummer and legal entity name should be shown? Not provided in the issue.
* No numeric Cache-Control max-age or revalidation strategy is specified — needs a decision before implementation.

---

*Structured by the triage agent.

<details><summary>Reporter's original text</summary>

**Classification:** improvement · severity minor · priority P2

## Problem statement

/: 2 domains affected (brand, sustainability).

**Root cause:** `page` [digilist.no](<http://digilist.no>) —

**2 impact domains**

**Frameworks:** NO-Company-Identity, WCAG-2.2-AA, NO-uu-forskrift, Sustainable-Web-Design

### brand (2) -

**\[minor\]** No Norwegian organisasjonsnummer found — required to identify the legal entity behind the service. - No Norwegian organisasjonsnummer found — required to identify the legal entity behind the service. - fix: Show the organisasjonsnummer (9 digits) in the footer / contact / about page. -

**\[minor\]** No accessibility statement (tilgjengelighetserklæring) link — required for Norwegian public-sector services. - No accessibility statement (tilgjengelighetserklæring) link — required for Norwegian public-sector services. - fix: Publish a tilgjengelighetserklæring ([uustatus.no](<http://uustatus.no>)) and link it in the footer.

### sustainability (2) -

**\[minor\]** HTML document is 309 KB (budget 100 KB) — ~0.16 gCO₂e/view. - HTML document is 309 KB (budget 100 KB) — ~0.16 gCO₂e/view. (309KB) - fix: Reduce inlined markup/data, defer non-critical content, and ensure server compression. -

**\[info\]** No effective Cache-Control on the document — repeat visits re-download unnecessarily. - No effective Cache-Control on the document — repeat visits re-download unnecessarily. - fix: Set an appropriate Cache-Control (with revalidation) on cacheable re

…(truncated)

</details> Current assessment: partial (improvement, minor). Relevant code: src/pages/Personvern.tsx:63, src/components/Footer.tsx:372-393, src/components/SEO.tsx:140-176, scripts/prerender.mjs:2272,2546, server/nginx.snippet.conf, infra/nginx/security-headers.conf, infra/apply-security-headers.sh.

**Scope**
Add the existing organisasjonsnummer (920 972 454, Xala Technologies AS) to Footer.tsx's bottom colophon and to the Org

Linear: https://linear.app/xala-technologies/issue/XAL-360/2-domains-affected-brand-sustainability
