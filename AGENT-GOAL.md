# XAL-421: /: 3 domains affected (performance, brand, sustainability)

> Auto-prepared by Digilist Improvements Agent. Run Claude in this worktree:
> `/loop In the `marketing` repo (this repo, a React+Vite+SSR-prerendered site for digilist.no), fix a homepage audit finding with 6 sub-items across performance/brand/sustainability. Work only in this repo, no drive-by refactors, no direct merge to main — open a PR.

1. Organisasjonsnummer (brand, confirmed gap — grep for orgnr/organisasjonsnummer across the repo returns zero hits): Add the company's real 9-digit Norwegian organisasjonsnummer to the footer colophon in src/components/Footer.tsx, near the existing 'Et produkt av Xala Technologies AS' line (bottom colophon section, ~line 300). Do NOT invent a number — get the real one from Brønnøysundregisteret (search 'Xala Technologies AS' or whatever entity operates Digilist) or ask the user/product owner for it before committing.

2. Tilgjengelighetserklæring (brand, confirmed gap — no /tilgjengelighetserklaering or similar route exists in src/App.tsx, no such page file): Create a new page (follow the existing pattern in src/pages/Personvern.tsx for structure/SEO meta) with an accessibility statement per uustatus.no's required format (WCAG 2.2 AA conformance status, known issues, contact for accessibility feedback). Add the route in src/App.tsx alongside the other /personvern, /salgsvilkar, /cookies routes, and add a link to it in the 'juridisk' array in src/components/Footer.tsx. First resolve the open question: confirm whether digilist.no's marketing site is actually in scope for uu-forskriften (this applies to public-sector and some private digital services) — if in doubt check with the reporter/product owner rather than assuming out of scope.

3. LCP 6.61s / Lighthouse Performance 61 (performance, confirmed real, partially mitigated already): scripts/prerender.mjs already does critical-CSS inlining via Beasties (~line 2710-2750) specifically to address this same LCP problem, but the inlined block (~47KB) is nearly a third of the full 136KB stylesheet — tighten Beasties' critical-path detection (e.g. try pruneSource or a stricter viewport config) so less non-critical CSS ships inline. Separately, vite.config.ts's manualChunks (~line 38-53) already splits vendor-motion/vendor-radix/vendor-icons into separate chunks, but the SSR/prerender output modulepreloads all of them unconditionally on every route — audit whether the homepage's LCP element (likely the hero) actually needs framer-motion/radix/icons before first paint, and if not, switch those specific chunks from modulepreload to a deferred/async load so they don't compete with the LCP-critical path. Re-run Lighthouse against a local `pnpm build && pnpm preview` before/after to confirm LCP drops below 2.5s and Performance score reaches ≥90 — do not rely on estimates.

4. Cache-Control (sustainability, likely false positive — VERIFY BEFORE CHANGING): curl -I https://digilist.no/ currently returns `cache-control: no-cache, must-revalidate` plus a strong ETag, set from infra/nginx/sites-enabled/digilist-apps.conf line 53. This is a real, working revalidation header (browsers/CDNs will send conditional GETs and get 304s), not an absent one. Only touch this if you can confirm the specific audit rule requires a positive max-age/s-maxage value — if so, weigh a short max-age (e.g. `public, max-age=60, must-revalidate`) against the fact this is a frequently-updated prerendered site (blog posts, pricing). If the rule can't be confirmed, leave this alone and note it as a likely scanner false-positive in the PR description.

5. HTML weight 309KB (sustainability, likely measurement-method artifact — VERIFY BEFORE SPENDING EFFORT): the raw prerendered HTML is ~269-309KB but gzip is already enabled (nginx digilist-apps.conf) and the actual wire transfer is ~47KB (confirmed via curl with Accept-Encoding: gzip). If the audit tool measures raw/uncompressed bytes, reducing the Beasties critical-CSS inline block (see item 3) is the main lever available since that alone is ~47KB of the raw HTML. Don't chase this budget in isolation — it should improve as a side effect of item 3's CSS trimming.

Acceptance criteria: org number visible in footer (real number, not placeholder); tilgjengelighetserklæring page published and linked from footer; Lighthouse Performance ≥90 and LCP <2.5s measured locally via `pnpm build` + Lighthouse against `pnpm preview`, not estimated; existing `pnpm test` and `pnpm lint` pass with no regressions; PR description explicitly states the verified status (confirmed-fixed vs likely-false-positive) for each of the 6 sub-findings rather than claiming blanket completion.`

## Implementation contract — complete this before writing code
- **Problem:** In the `marketing` repo (this repo, a React+Vite+SSR-prerendered site for digilist.no), fix a homepage audit finding with 6 sub-items across performance/brand/sustainability. Work only in this repo, no drive-by refactors, no direct merge to main — open a PR.

1. Organisasjonsnummer (brand, confirmed gap — grep for orgnr/organisasjonsnummer across the repo returns zero hits): Add the company's real 9-digit Norwegian organisasjonsnummer to the footer colophon in src/components/Footer.tsx, near the existing 'Et produkt av Xala Technologies AS' line (bottom colophon section, ~line 300). Do NOT invent a number — get the real one from Brønnøysundregisteret (search 'Xala Technologies AS' or whatever entity operates Digilist) or ask the user/product owner for it before committing.

2. Tilgjengelighetserklæring (brand, confirmed gap — no /tilgjengelighetserklaering or similar route exists in src/App.tsx, no such page file): Create a new page (follow the existing pattern in src/pages/Personvern.tsx for structure/SEO meta) with an accessibility statement per uustatus.no's required format (WCAG 2.2 AA conformance status, known issues, contact for accessibility feedback). Add the route in src/App.tsx alongside the other /personvern, /salgsvilkar, /cookies routes, and add a link to it in the 'juridisk' array in src/components/Footer.tsx. First resolve the open question: confirm whether digilist.no's marketing site is actually in scope for uu-forskriften (this applies to public-sector and some private digital services) — if in doubt check with the reporter/product owner rather than assuming out of scope.

3. LCP 6.61s / Lighthouse Performance 61 (performance, confirmed real, partially mitigated already): scripts/prerender.mjs already does critical-CSS inlining via Beasties (~line 2710-2750) specifically to address this same LCP problem, but the inlined block (~47KB) is nearly a third of the full 136KB stylesheet — tighten Beasties' critical-path detection (e.g. try pruneSource or a stricter viewport config) so less non-critical CSS ships inline. Separately, vite.config.ts's manualChunks (~line 38-53) already splits vendor-motion/vendor-radix/vendor-icons into separate chunks, but the SSR/prerender output modulepreloads all of them unconditionally on every route — audit whether the homepage's LCP element (likely the hero) actually needs framer-motion/radix/icons before first paint, and if not, switch those specific chunks from modulepreload to a deferred/async load so they don't compete with the LCP-critical path. Re-run Lighthouse against a local `pnpm build && pnpm preview` before/after to confirm LCP drops below 2.5s and Performance score reaches ≥90 — do not rely on estimates.

4. Cache-Control (sustainability, likely false positive — VERIFY BEFORE CHANGING): curl -I https://digilist.no/ currently returns `cache-control: no-cache, must-revalidate` plus a strong ETag, set from infra/nginx/sites-enabled/digilist-apps.conf line 53. This is a real, working revalidation header (browsers/CDNs will send conditional GETs and get 304s), not an absent one. Only touch this if you can confirm the specific audit rule requires a positive max-age/s-maxage value — if so, weigh a short max-age (e.g. `public, max-age=60, must-revalidate`) against the fact this is a frequently-updated prerendered site (blog posts, pricing). If the rule can't be confirmed, leave this alone and note it as a likely scanner false-positive in the PR description.

5. HTML weight 309KB (sustainability, likely measurement-method artifact — VERIFY BEFORE SPENDING EFFORT): the raw prerendered HTML is ~269-309KB but gzip is already enabled (nginx digilist-apps.conf) and the actual wire transfer is ~47KB (confirmed via curl with Accept-Encoding: gzip). If the audit tool measures raw/uncompressed bytes, reducing the Beasties critical-CSS inline block (see item 3) is the main lever available since that alone is ~47KB of the raw HTML. Don't chase this budget in isolation — it should improve as a side effect of item 3's CSS trimming.

Acceptance criteria: org number visible in footer (real number, not placeholder); tilgjengelighetserklæring page published and linked from footer; Lighthouse Performance ≥90 and LCP <2.5s measured locally via `pnpm build` + Lighthouse against `pnpm preview`, not estimated; existing `pnpm test` and `pnpm lint` pass with no regressions; PR description explicitly states the verified status (confirmed-fixed vs likely-false-positive) for each of the 6 sub-findings rather than claiming blanket completion.
- **Business objective:** _why this matters (from the Linear issue)_
- **Repository / branch:** `/root/booking-brilliance` @ `agent/xal-421-3-domains-affected-performance-brand`
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
- One issue → one branch (`agent/xal-421-3-domains-affected-performance-brand`) → one independently reviewable change. Never main.
- Smallest valid change. No opportunistic refactoring, no broad formatting changes, no hidden dependency on another open PR.
- Validation is mandatory and staged — "code written" ≠ "compiled" ≠ "tests passed" ≠ "acceptance demonstrated". Collect evidence (test output / logs) before opening the PR.
- If scope expands beyond "Files likely affected", or the change grows large, STOP and escalate ("BLOCKED:") rather than pressing on.
- Open a PR only when green (otherwise a draft PR with a note). Delete this file before opening the PR.

## Full issue — from Linear (the source of truth for scope & acceptance)
> The Linear MCP in this environment may be bound to the WRONG workspace, so
> do NOT rely on it to read this ticket — everything you need is below. If
> something essential is genuinely missing here (e.g. a screenshot), STOP and
> end with "CLARIFICATION:" rather than guessing.

**Classification:** improvement · severity major · priority P1

Product gap: /: 3 domains affected (performance, brand, sustainability). <!-- xaheen-triage -->

## Problem Statement

The [digilist.no](<http://digilist.no>) marketing homepage fails multiple measured budgets/requirements at once: LCP is 6.61s against a <2.5s target, Lighthouse Performance score is 61/100 against a ≥90 target, the page has no visible Norwegian organisasjonsnummer, no linked tilgjengelighetserklæring (accessibility statement), the HTML document is 309KB against a 100KB budget, and the response has no effective Cache-Control header.

## Scope

**In scope:**

* LCP on [https://digilist.no](<https://digilist.no>) down to <2.5s (cwv.lcp)
* Lighthouse Performance score on [https://digilist.no](<https://digilist.no>) up to ≥90 (lighthouse.performance)
* Add a 9-digit Norwegian organisasjonsnummer to the footer/contact/about page (brand.missing-org-number)
* Publish and link a tilgjengelighetserklæring per [uustatus.no](<http://uustatus.no>) (brand.missing-accessibility-statement)
* Reduce homepage HTML document weight from 309KB toward the 100KB budget (sustain.html-weight)
* Set an appropriate Cache-Control header with revalidation on the homepage response (sustain.no-cache)

**Out of scope:**

* Changes outside the target repository for this issue
* Unrelated refactors, drive-by fixes, or direct merges to main
* Scope creep beyond the six listed findings

## Acceptance Criteria

- [ ] Homepage LCP on [https://digilist.no](<https://digilist.no>) measures below 2.5s in Lighthouse/CWV tooling
- [ ] Lighthouse Performance score for [https://digilist.no](<https://digilist.no>) is ≥90
- [ ] Footer/contact/about page displays a 9-digit Norwegian organisasjonsnummer
- [ ] Footer links to a published tilgjengelighetserklæring page
- [ ] Homepage HTML document size is reduced from 309KB toward the 100KB budget
- [ ] Homepage HTTP response includes a Cache-Control header enabling revalidation/caching
- [ ] Existing CI (lint, tests, build) passes green with no regression in current user-facing behaviour

## Testing Scenario

* Given the homepage at [https://digilist.no](<https://digilist.no>), when measured with Lighthouse/CWV tooling, then LCP is <2.5s and the Performance score is ≥90
* Given a visitor scrolls to the footer of [digilist.no](<http://digilist.no>), when looking for legal/contact info, then a 9-digit organisasjonsnummer is visible
* Given a visitor on [digilist.no](<http://digilist.no>), when they click the accessibility link in the footer, then they land on a published tilgjengelighetserklæring page
* Given a fresh, uncached load of [https://digilist.no](<https://digilist.no>), when inspecting the HTML response, then document size is measurably reduced toward 100KB and the response carries a Cache-Control header

## Severity: major

LCP 6.61s and a Lighthouse score of 61/100 are measured (not estimated) numbers on the homepage that every marketing-site visitor hits, so the degradation applies broadly with no user-side workaround — that clears the bar for major even though nothing is fully broken; the bundled brand/sustainability findings are individually tagged minor/info by the scan and don't raise the ceiling further.

## Target repo: `marketing`

*Chosen by triage from the issue's content; routes preparation there.*

## Open questions

* Is the [digilist.no](<http://digilist.no>) marketing homepage itself subject to the Norwegian uu-forskrift tilgjengelighetserklæring requirement, or does that only apply to the booking/app product surface? The issue asserts the requirement but doesn't establish which surface it binds to.
* Does an organisasjonsnummer already exist elsewhere on the site (e.g. terms/privacy page) and this is only a footer-visibility gap, or is it absent site-wide?
* Is the 100KB HTML budget a hard pass/fail gate or an aspirational target — how much reduction from 309KB counts as resolving the finding?

---

*Structured by the triage agent.

<details><summary>Reporter's original text</summary>

**Classification:** improvement · severity major · priority P1

## Problem statement

/: 3 domains affected (performance, brand, sustainability).

**Root cause:** `page` [digilist.no](<http://digilist.no>) —

**3 impact domains**

**Frameworks:** Core-Web-Vitals, NO-Company-Identity, WCAG-2.2-AA, NO-uu-forskrift, Sustainable-Web-Design

### performance (2) -

**\[major\]** LCP 6.61s (kritisk — mål <2,5s) (cwv.lcp) - LCP 6.61s (kritisk — mål <2,5s) Regel: cwv.lcp Overflate: Marketing — [digilist.no](<http://digilist.no>) Affiserte sider: 1 Eksempel-URL: [https://digilist.no](<https://digilist.no>) -

**\[minor\]** Lighthouse Ytelse-score 61/100 (mål ≥90). (lighthouse.performance) - Lighthouse Ytelse-score 61/100 (mål ≥90). Regel: lighthouse.performance Overflate: Marketing — [digilist.no](<http://digilist.no>) Affiserte sider: 1 Eksempel-URL: [https://digilist.no](<https://digilist.no>)

### brand (2) -

**\[minor\]** No Norwegian organisasjonsnummer found — required to identify the legal entity behind the service. - No Norwegian organisasjonsnummer found — required to identify the legal entity behind the service. - fix: Show the organisasjonsnummer (9 digits) in the footer / contact / about page. -

**\[minor\]** No accessibility statement (tilgjengelighetserklæring) link — required for Norwegian public-sector services. - No accessibility statement (tilgjengelighetserklæring) link — required for Norwegian public-sector services. - fix: Publish a tilgjengelighetserklæring ([[u

…(truncated)

</details> Current assessment: partial (improvement, major). Relevant code: src/components/Footer.tsx, src/App.tsx:298-379, infra/nginx/sites-enabled/digilist-apps.conf:53 (live, curl-verified), curl [https://digilist.no/](<https://digilist.no/>) (live measurement), scripts/prerender.mjs:2710-2750, vite.config.ts:38-53 manualChunks.

**Scope**
Two of the six sub-findings are genuine, confirmed gaps with no existing

Linear: https://linear.app/xala-technologies/issue/XAL-421/3-domains-affected-performance-brand-sustainability
