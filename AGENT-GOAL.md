# XAL-673: AEO-gap: Digilist usynlig i AI-svar for «alternativer til bookup.no for kommunal booking»

> Auto-prepared by Digilist Improvements Agent. Run Claude in this worktree:
> `/loop In the `marketing` repo (this repo), close an AEO citability gap for the query 'alternativer til bookup.no for kommunal booking'. AI answer engines currently cite bookup.no, Aktiv Kommune, Oslo Booking, Kaddio and Bifrost Booking for this query but not Digilist (visibility 25%, citation 25%, n=8), because no page on digilist.no directly and citably answers it.

Do this by expanding the existing post at src/content/blog/bookup-og-eksisterende-booking-losninger.md (do NOT create a new page/route, and do NOT touch scripts/prerender.mjs, src/entry-server.tsx, scripts/verify-live.mjs, or any other shared build/render script — those are out of scope and cause merge conflicts across parallel SEO branches):

1. Add a short (2-4 sentence) direct-answer block immediately after the H1/intro that explicitly answers 'alternativer til bookup.no for kommunal booking' in plain language — state that Digilist is a Norwegian booking platform positioned as an alternative to bookup.no specifically for kommunal (municipal) booking needs.
2. Add an explicit entity-definition passage: what Digilist is (one digital platform for the Norwegian rental/booking market), who it serves (both private utleiere/businesses AND kommune/offentlig sektor), and which market it operates in (Norway).
3. Add a 'Kilder' (sources) section near the end citing concrete references — e.g. SSA-L 2026 krav, Digilist's own /bookingsystem-kommune page, or other verifiable documentation already in this repo. Do not fabricate external stats.
4. Update the post's frontmatter: title and description should reflect the 'alternativer til bookup.no for kommunal booking' query intent (keep it natural, not keyword-stuffed), add relevant keywords, and set `updated` to the publish date (BlogFrontmatter already supports an optional `updated` field per src/lib/blogFrontmatter.ts — this feeds dateModified in the Article JSON-LD automatically, no template changes needed).
5. Optionally mention, factually and without disparagement, that Digilist is one of several options evaluated for kommunal booking alongside tools like Aktiv Kommune, Oslo Booking, Kaddio and Bifrost Booking — framed as positioning, not attack.
6. Verify author and last-updated date render visibly on the built page (they already do via src/pages/BlogPost.tsx:208-210 and 301 — confirm, don't rebuild).

Acceptance criteria: the built page's server-rendered HTML (fetch without JS execution, e.g. via the existing prerender output or curl against the dev/preview build) contains the direct-answer block text; the entity definition, source references, and visible author+date are present; frontmatter title/description reflect the query intent; `pnpm lint`, `pnpm build`, and any existing test suite pass; git diff touches only this .md file and its own frontmatter (no shared script changes). Open a PR against main (not main directly) once tests are green.`

## Implementation contract — complete this before writing code
- **Problem:** In the `marketing` repo (this repo), close an AEO citability gap for the query 'alternativer til bookup.no for kommunal booking'. AI answer engines currently cite bookup.no, Aktiv Kommune, Oslo Booking, Kaddio and Bifrost Booking for this query but not Digilist (visibility 25%, citation 25%, n=8), because no page on digilist.no directly and citably answers it.

Do this by expanding the existing post at src/content/blog/bookup-og-eksisterende-booking-losninger.md (do NOT create a new page/route, and do NOT touch scripts/prerender.mjs, src/entry-server.tsx, scripts/verify-live.mjs, or any other shared build/render script — those are out of scope and cause merge conflicts across parallel SEO branches):

1. Add a short (2-4 sentence) direct-answer block immediately after the H1/intro that explicitly answers 'alternativer til bookup.no for kommunal booking' in plain language — state that Digilist is a Norwegian booking platform positioned as an alternative to bookup.no specifically for kommunal (municipal) booking needs.
2. Add an explicit entity-definition passage: what Digilist is (one digital platform for the Norwegian rental/booking market), who it serves (both private utleiere/businesses AND kommune/offentlig sektor), and which market it operates in (Norway).
3. Add a 'Kilder' (sources) section near the end citing concrete references — e.g. SSA-L 2026 krav, Digilist's own /bookingsystem-kommune page, or other verifiable documentation already in this repo. Do not fabricate external stats.
4. Update the post's frontmatter: title and description should reflect the 'alternativer til bookup.no for kommunal booking' query intent (keep it natural, not keyword-stuffed), add relevant keywords, and set `updated` to the publish date (BlogFrontmatter already supports an optional `updated` field per src/lib/blogFrontmatter.ts — this feeds dateModified in the Article JSON-LD automatically, no template changes needed).
5. Optionally mention, factually and without disparagement, that Digilist is one of several options evaluated for kommunal booking alongside tools like Aktiv Kommune, Oslo Booking, Kaddio and Bifrost Booking — framed as positioning, not attack.
6. Verify author and last-updated date render visibly on the built page (they already do via src/pages/BlogPost.tsx:208-210 and 301 — confirm, don't rebuild).

Acceptance criteria: the built page's server-rendered HTML (fetch without JS execution, e.g. via the existing prerender output or curl against the dev/preview build) contains the direct-answer block text; the entity definition, source references, and visible author+date are present; frontmatter title/description reflect the query intent; `pnpm lint`, `pnpm build`, and any existing test suite pass; git diff touches only this .md file and its own frontmatter (no shared script changes). Open a PR against main (not main directly) once tests are green.
- **Business objective:** _why this matters (from the Linear issue)_
- **Repository / branch:** `/root/booking-brilliance` @ `agent/xal-673-aeo-gap-digilist-usynlig-i-ai-svar-for`
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
- One issue → one branch (`agent/xal-673-aeo-gap-digilist-usynlig-i-ai-svar-for`) → one independently reviewable change. Never main.
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

Product gap: AEO-gap: Digilist usynlig i AI-svar for «alternativer til [bookup.no](<http://bookup.no>) for kommunal booking». <!-- xaheen-triage -->

## Problem Statement

AI answer engines cite [bookup.no](<http://bookup.no>), Aktiv Kommune, Oslo Booking, Kaddio, and Bifrost Booking as alternatives for kommunal booking but do not cite Digilist, for the query "alternativer til [bookup.no](<http://bookup.no>) for kommunal booking" (visibility 25%, citation 25%, n=8). Digilist has no authoritative, citable page on [digilist.no](<http://digilist.no>) that directly answers this query.

## Scope

**In scope:**

* Create or expand one page on [digilist.no](<http://digilist.no>) (marketing repo) that directly answers "alternativer til [bookup.no](<http://bookup.no>) for kommunal booking"
* Add a short direct-answer block at the top of the page
* Include original documentation/figures (not just marketing copy)
* Include a clear entity definition of Digilist: what it is, who it is for, which market
* Include source references
* Include an author and last-updated date
* Ensure the page is technically citable: indexable, server-rendered, semantic HTML
* Change only the affected page's own content/metadata (its frontmatter title/description, or its own component)

**Out of scope:**

* Build-time validation guards for SEO/AEO citability
* Edits to shared build/render scripts (scripts/prerender.mjs, src/entry-server.tsx, scripts/verify-live.mjs)
* Any changes outside the marketing repo
* Unrelated refactors or drive-by fixes
* Direct merges to main

## Acceptance Criteria

- [ ] A page exists on [digilist.no](<http://digilist.no>) whose initial server-rendered HTML (fetched without executing JS) contains a short block directly answering "alternativer til [bookup.no](<http://bookup.no>) for kommunal booking"
- [ ] The page contains an explicit entity definition of Digilist: what it is, who it serves, and which market it operates in
- [ ] The page includes source references and a visible author name and last-updated date
- [ ] The page's title/description metadata reflect the query intent
- [ ] Existing CI (lint, tests, build) passes with no changes to shared build/render scripts

## Testing Scenario

* Given the published page URL, When fetched via a plain HTTP GET with no JS execution, Then the direct-answer block text is present in the raw HTML response
* Given the page content, When read, Then it states what Digilist is, who it is for, and its market, per the issue's entity-definition requirement
* Given the page content, When read, Then it references [bookup.no](<http://bookup.no>) in the context of answering the "alternativer" query
* Given the page metadata, When inspected, Then an author and a last-updated date are visible on the page
* Given the repo's CI, When the PR runs, Then lint/build/tests pass and no shared build/render script (scripts/prerender.mjs, src/entry-server.tsx, scripts/verify-live.mjs) is modified

## Value: medium

medium because the issue backs the gap with concrete AI-visibility/citation figures (25%/25%) and names specific competitors cited instead of Digilist, but it does not state blocked users, revenue at stake, or a commitment made, and the sample size (n=8) is small — enough evidence to act, not enough to call it high.

## Target repo: `marketing`

*Chosen by triage from the issue's content; routes preparation there.*

## Open questions

* Is this a brand-new page or an expansion of an existing page — the issue says "create or expand" but doesn't say which page, if any, already touches this topic
* How and when will the 25%/25% (n=8) visibility/citation baseline be re-measured to confirm the gap closed post-publish
* Does the page need to individually address all five named competitors ([bookup.no](<http://bookup.no>), Aktiv Kommune, Oslo Booking, Kaddio, Bifrost Booking) or just position Digilist as an alternative to [bookup.no](<http://bookup.no>) specifically
* Who set the P1/major classification and on what basis — the issue text gives no named requester or deadline

---

*Structured by the triage agent.

<details><summary>Reporter's original text</summary>

**SEO route:** content → `content-agent` · repo `marketing`

**Scope — minimal and conflict-free:** fix ONLY the affected page's own content/metadata (its frontmatter title/description, or its own component). Do NOT add build-time validation guards or edit shared build/render scripts (e.g. `scripts/prerender.mjs`, `src/entry-server.tsx`, `scripts/verify-live.mjs`). Every SEO branch funnels through those, so guards added there conflict on merge and NONE of them land — the single biggest reason approved SEO PRs pile up unmerged. If a systemic guard would genuinely help, note it as a separate one-off issue; never add it in this fix.

**Classification:** feature · severity major · priority P1

## Problem statement

Product gap: AEO-gap: Digilist usynlig i AI-svar for «alternativer til [bookup.no](<http://bookup.no>) for kommunal booking». AI-motorer nevner [bookup.no](<http://bookup.no>), Aktiv Kommune, Oslo Booking, Kaddio, Bifrost Booking, men ikke Digilist for spørsmålet «alternativer til [bookup.no](<http://bookup.no>) for kommunal booking» (synlighet 25%, sitering 25%, n=8). Gjør Digilist siterbar: publiser en autoritativ side som svarer direkte på spørsmålet (kort svarblokk øverst), med original dokumentasjon/tall, tydelig entitetsdefinisjon (hva Digilist er, for hvem, marked), kildereferanser, forfatter/oppdateringsdato, og teknisk siterbarhet (indekserbar, server-rendret, semantisk HTML på [digilist.no](<http://digilist.no>)). Current assessment: gap (feature, major).

## 

…(truncated)

</details> Current assessment: partial (improvement, minor). Relevant code: src/content/blog/bookup-og-eksisterende-booking-losninger.md, src/pages/BlogPost.tsx:151-154,208-210,301, src/lib/blogFrontmatter.ts:9-10, src/pages/BookingsystemKommune.tsx, code grap

Linear: https://linear.app/xala-technologies/issue/XAL-673/aeo-gap-digilist-usynlig-i-ai-svar-for-alternativer-til-bookupno-for
