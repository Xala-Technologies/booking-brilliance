# XAL-632: AEO-gap: Digilist usynlig i AI-svar for «alternativer til sharefox.no for kommunal booking»

> Auto-prepared by Digilist Improvements Agent. Run Claude in this worktree:
> `/loop In the booking-brilliance repo (marketing/content-ops repo, no backend booking domain — content lives in src/content/blog/*.md, rendered via src/pages/BlogPost.tsx, SEO handled by src/components/SEO.tsx), create a new Norwegian Bokmål blog post that directly and authoritatively answers the query 'alternativer til sharefox.no for kommunal booking'.

Context: AEO measurement shows AI engines cite competitors (BookUp, Aktiv Kommune, Checkfront, Sharefox, Gibbs) for this query but never Digilist (visibility 13%, citation 13%, n=8). Confirmed via grep that no existing file in src/content/blog or src/pages mentions 'sharefox' or 'alternativer' — this is a genuine content gap, not an update to an existing page.

Steps:
1. Create src/content/blog/alternativer-til-sharefox-kommunal-booking.md (or similar slug) using the exact frontmatter schema from an existing post (see src/content/blog/bookingsystem-smakommuner-kostnadseffektive-losninger.md for the pattern: slug, title, description, date, author: "Ibrahim Rahmani", role: "Grunnlegger, Digilist", readingMinutes, tag, cover, keywords). Set date to today and keep author/role consistent with other posts.
2. Structure the post so the FIRST content block (immediately after any intro sentence, before any other heading) is a short, direct answer: name Digilist as an alternative to Sharefox for kommunal booking, state what Digilist is, who it's for (kommuner/offentlig sektor AND private utleiere — Digilist serves both markets), and in 2-4 sentences why it's a relevant alternative.
3. Include an explicit entity-definition section describing Digilist: what it is (booking + rental platform for the Norwegian rental market), target users (kommune/offentlig B2B and privat B2C/utleiere), and market scope.
4. Include original documentation or concrete data points (not just marketing copy) — e.g. concrete feature/capability comparisons, pricing model differences, or Digdir/ID-porten/BankID integration facts already referenced elsewhere in this repo's blog content (grep src/content/blog for 'Digdir', 'ID-porten', 'BankID' for facts already established and reusable). Do not invent unverifiable competitor claims; where comparing to Sharefox/BookUp/etc, stick to publicly verifiable, generic capability categories (e.g. innbyggerselvbetjening, saksbehandlerflyt, integrasjon mot ID-porten) rather than specific unverified claims about competitors.
5. Add source references (links to Digdir standards, offentlige anskaffelsesregler, or other posts in this repo) as a references/kilder section near the end.
6. Ensure the post displays author and last-updated date visibly — verify this renders correctly via src/pages/BlogPost.tsx (check how it reads frontmatter and renders author/date; do not modify BlogPost.tsx unless the existing rendering doesn't already surface author+date, in which case make the minimal change needed).
7. Ensure indexability: no noindex meta should be set for this route (check how src/pages/BlogPost.tsx invokes src/components/SEO.tsx's `robots` prop — default should be index,follow, do not pass noindex).
8. Add the new post's canonical URL to public/sitemap.xml following the existing entries' format.
9. Consider adding an internal link from src/pages/BookingsystemKommune.tsx to the new post if that page has a related-content or blog-links section (check first; do not force it if there's no natural slot).
10. Verify the page is server-rendered (this repo pre-renders/SSRs blog posts already, per src/pages/BlogPost.tsx — do not introduce client-only rendering for the answer block).

Acceptance criteria: page publishes with a direct-answer block naming Digilist as the top-of-page content; includes entity definition, original data points, source references, visible author+date; is indexable and present in sitemap.xml; uses semantic HTML (proper heading hierarchy, no div-soup for the answer block). Run existing lint/build/test commands for this repo and confirm they pass before opening a PR. Do not merge directly to main — open a PR. Do not touch files outside src/content/blog, public/sitemap.xml, and (only if strictly necessary) src/pages/BlogPost.tsx or src/pages/BookingsystemKommune.tsx.`

## Implementation contract — complete this before writing code
- **Problem:** In the booking-brilliance repo (marketing/content-ops repo, no backend booking domain — content lives in src/content/blog/*.md, rendered via src/pages/BlogPost.tsx, SEO handled by src/components/SEO.tsx), create a new Norwegian Bokmål blog post that directly and authoritatively answers the query 'alternativer til sharefox.no for kommunal booking'.

Context: AEO measurement shows AI engines cite competitors (BookUp, Aktiv Kommune, Checkfront, Sharefox, Gibbs) for this query but never Digilist (visibility 13%, citation 13%, n=8). Confirmed via grep that no existing file in src/content/blog or src/pages mentions 'sharefox' or 'alternativer' — this is a genuine content gap, not an update to an existing page.

Steps:
1. Create src/content/blog/alternativer-til-sharefox-kommunal-booking.md (or similar slug) using the exact frontmatter schema from an existing post (see src/content/blog/bookingsystem-smakommuner-kostnadseffektive-losninger.md for the pattern: slug, title, description, date, author: "Ibrahim Rahmani", role: "Grunnlegger, Digilist", readingMinutes, tag, cover, keywords). Set date to today and keep author/role consistent with other posts.
2. Structure the post so the FIRST content block (immediately after any intro sentence, before any other heading) is a short, direct answer: name Digilist as an alternative to Sharefox for kommunal booking, state what Digilist is, who it's for (kommuner/offentlig sektor AND private utleiere — Digilist serves both markets), and in 2-4 sentences why it's a relevant alternative.
3. Include an explicit entity-definition section describing Digilist: what it is (booking + rental platform for the Norwegian rental market), target users (kommune/offentlig B2B and privat B2C/utleiere), and market scope.
4. Include original documentation or concrete data points (not just marketing copy) — e.g. concrete feature/capability comparisons, pricing model differences, or Digdir/ID-porten/BankID integration facts already referenced elsewhere in this repo's blog content (grep src/content/blog for 'Digdir', 'ID-porten', 'BankID' for facts already established and reusable). Do not invent unverifiable competitor claims; where comparing to Sharefox/BookUp/etc, stick to publicly verifiable, generic capability categories (e.g. innbyggerselvbetjening, saksbehandlerflyt, integrasjon mot ID-porten) rather than specific unverified claims about competitors.
5. Add source references (links to Digdir standards, offentlige anskaffelsesregler, or other posts in this repo) as a references/kilder section near the end.
6. Ensure the post displays author and last-updated date visibly — verify this renders correctly via src/pages/BlogPost.tsx (check how it reads frontmatter and renders author/date; do not modify BlogPost.tsx unless the existing rendering doesn't already surface author+date, in which case make the minimal change needed).
7. Ensure indexability: no noindex meta should be set for this route (check how src/pages/BlogPost.tsx invokes src/components/SEO.tsx's `robots` prop — default should be index,follow, do not pass noindex).
8. Add the new post's canonical URL to public/sitemap.xml following the existing entries' format.
9. Consider adding an internal link from src/pages/BookingsystemKommune.tsx to the new post if that page has a related-content or blog-links section (check first; do not force it if there's no natural slot).
10. Verify the page is server-rendered (this repo pre-renders/SSRs blog posts already, per src/pages/BlogPost.tsx — do not introduce client-only rendering for the answer block).

Acceptance criteria: page publishes with a direct-answer block naming Digilist as the top-of-page content; includes entity definition, original data points, source references, visible author+date; is indexable and present in sitemap.xml; uses semantic HTML (proper heading hierarchy, no div-soup for the answer block). Run existing lint/build/test commands for this repo and confirm they pass before opening a PR. Do not merge directly to main — open a PR. Do not touch files outside src/content/blog, public/sitemap.xml, and (only if strictly necessary) src/pages/BlogPost.tsx or src/pages/BookingsystemKommune.tsx.
- **Business objective:** _why this matters (from the Linear issue)_
- **Repository / branch:** `/root/booking-brilliance` @ `agent/xal-632-aeo-gap-digilist-usynlig-i-ai-svar-for`
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
- One issue → one branch (`agent/xal-632-aeo-gap-digilist-usynlig-i-ai-svar-for`) → one independently reviewable change. Never main.
- Smallest valid change. No opportunistic refactoring, no broad formatting changes, no hidden dependency on another open PR.
- Validation is mandatory and staged — "code written" ≠ "compiled" ≠ "tests passed" ≠ "acceptance demonstrated". Collect evidence (test output / logs) before opening the PR.
- If scope expands beyond "Files likely affected", or the change grows large, STOP and escalate ("BLOCKED:") rather than pressing on.
- Open a PR only when green (otherwise a draft PR with a note). Delete this file before opening the PR.

## Full issue — from Linear (the source of truth for scope & acceptance)
> The Linear MCP in this environment may be bound to the WRONG workspace, so
> do NOT rely on it to read this ticket — everything you need is below. If
> something essential is genuinely missing here (e.g. a screenshot), STOP and
> end with "CLARIFICATION:" rather than guessing.

**Classification:** feature · severity major · priority P1

Product gap: AEO-gap: Digilist usynlig i AI-svar for «alternativer til [sharefox.no](<http://sharefox.no>) for kommunal booking». <!-- xaheen-triage -->

## Problem Statement

AI engines mention competitor products (BookUp, Aktiv Kommune, Checkfront, Sharefox, Gibbs) but not Digilist when asked "alternativer til [sharefox.no](<http://sharefox.no>) for kommunal booking" — measured visibility 13%, citation 13% (n=8). No existing Digilist content directly and authoritatively answers this query.

## Scope

**In scope:**

* Publish (or expand) an authoritative Norwegian Bokmål page on [digilist.no](<http://digilist.no>) that directly answers "alternativer til [sharefox.no](<http://sharefox.no>) for kommunal booking"
* Short direct-answer block near the top of the page
* Original documentation/data points supporting the answer
* Clear entity definition of Digilist (what it is, for whom, which market)
* Source references/citations
* Visible author and last-updated date
* Technical citability: indexable, server-rendered, semantic HTML

**Out of scope:**

* Changes outside the marketing (booking-brilliance) repository
* Unrelated refactors or drive-by fixes
* Direct merges to main
* Scope creep beyond answering this specific query

## Acceptance Criteria

- [ ] A published page on [digilist.no](<http://digilist.no>) directly answers "alternativer til [sharefox.no](<http://sharefox.no>) for kommunal booking" with a short answer block near the top
- [ ] The page includes original documentation or figures, not only marketing copy
- [ ] The page includes an explicit entity definition of Digilist (what it is, target users, market)
- [ ] The page includes source references
- [ ] The page displays an author and a last-updated date
- [ ] The page is server-rendered, indexable (no noindex, present in sitemap), and uses semantic HTML
- [ ] CI is green and no existing user-facing behavior regresses

## Testing Scenario

* Given the published page, when fetched via a plain HTTP request (no JS execution), then the direct-answer content mentioning Digilist is present in the initial server response
* Given the page, when checked for indexability, then it has no noindex directive and appears in the sitemap
* Given the page, when inspected visually, then an author name and an updated date are visible near the content
* Given the page, when reading the top section, then a short block directly answers the "alternativer til [sharefox.no](<http://sharefox.no>) for kommunal booking" question before any other content

## Value: medium

medium: verdien er dokumentert med konkrete tall (synlighet 13%, sitering 13%, n=8) og navngitte konkurrenter som blir sitert i stedet for Digilist, men saken oppgir ingen eksplisitt bruker-, inntekts- eller forpliktelseseffekt, og n=8 er et lite utvalg.

## Target repo: `marketing`

*Chosen by triage from the issue's content; routes preparation there.*

## Open questions

* Is n=8 a large enough sample to justify content investment now, or should more AEO measurement data be gathered first?
* Does an existing [digilist.no](<http://digilist.no>) page already target this or an adjacent keyword that should be expanded rather than creating a new page — the issue says "create or expand" without specifying which?
* What specific original documentation/numbers should the page include — the issue says 'original documentation/tall' but does not specify which data?
* What is the next AEO re-measurement point that will confirm whether this closed the visibility/citation gap?

---

*Structured by the triage agent.

<details><summary>Reporter's original text</summary>

**SEO route:** content → `content-agent` · repo `marketing`

**Classification:** feature · severity major · priority P1

## Problem statement

Product gap: AEO-gap: Digilist usynlig i AI-svar for «alternativer til [sharefox.no](<http://sharefox.no>) for kommunal booking». AI-motorer nevner BookUp, Aktiv Kommune, Checkfront, Sharefox, Gibbs, men ikke Digilist for spørsmålet «alternativer til [sharefox.no](<http://sharefox.no>) for kommunal booking» (synlighet 13%, sitering 13%, n=8). Gjør Digilist siterbar: publiser en autoritativ side som svarer direkte på spørsmålet (kort svarblokk øverst), med original dokumentasjon/tall, tydelig entitetsdefinisjon (hva Digilist er, for hvem, marked), kildereferanser, forfatter/oppdateringsdato, og teknisk siterbarhet (indekserbar, server-rendret, semantisk HTML på [digilist.no](<http://digilist.no>)). Current assessment: gap (feature, major).

## Scope

Create or expand content covering "AEO-gap: Digilist usynlig i AI-svar for «alternativer til [sharefox.no](<http://sharefox.no>) for kommunal booking»" aligned with AI-motorer nevner BookUp, Aktiv Kommune, Checkfront, Sharefox, Gibbs, men ikke Digilist for spørsmålet «alternativer til [sharefox.no](<http://sharefox.no>) for kommunal booking» (synlighet 13%, sitering 13%, n=8). Gjør Digilist siterbar: publiser en autoritativ side som svarer direkte på spørsmålet (kort svarblokk øverst), med original dokumentasjon/tall, tydelig entitetsdefinisjon (hva Digilist er, for hvem, marked), kilderefe

…(truncated)

</details> Current assessment: gap (feature, major). Relevant code: src/content/blog/ (97 posts, none mention sharefox or 'alternativer'), src/content/blog/bookingsystem-smakommuner-kostnadseffektive-losninger.md, src/pages/BlogPost.tsx, src/components/SEO.tsx, public/sitemap.xml, src/pages/BookingsystemKommune.tsx.

**Scope**
Publish a new authoritative Norwegian Bokmål blog post on [digilist.no](<http://digilist.no>) answering 'alternativer til [sharefox.no](<http://sharefox.no>) for kommunal booking' directly, following the existing blog content pattern. Touch points: src/content/blog/ (97 posts, none mention sharefox or 'alternativer') (no existing content addresses this query); src/content/blog/bookingsystem-smakommuner-kostnadseffektive-losninger.md (reference frontmatter pattern: sl

Linear: https://linear.app/xala-technologies/issue/XAL-632/aeo-gap-digilist-usynlig-i-ai-svar-for-alternativer-til-sharefoxno-for
