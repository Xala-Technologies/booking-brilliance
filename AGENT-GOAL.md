# XAL-450: AEO-gap: Digilist usynlig i AI-svar for «beste bookingsystem for kommuner i Norge»

> Auto-prepared by Digilist Improvements Agent. Run Claude in this worktree:
> `/loop In the Digilist marketing repo (booking-brilliance, this repo — plain markdown-in blog pipeline, posts auto-load via import.meta.glob in src/lib/postContent.ts, no framework changes needed), create a new blog post file at src/content/blog/beste-bookingsystem-kommune-norge.md that directly answers the query 'beste bookingsystem for kommuner i Norge'. Model it closely on the existing src/content/blog/alternativer-til-sharefox-kommunal-booking.md (published 2026-07-27) and src/content/blog/bookup-og-eksisterende-booking-losninger.md — both already implement the required AEO pattern successfully, reuse their frontmatter shape (slug, title, description, date, author: 'Ibrahim Rahmani', role: 'Grunnlegger, Digilist', readingMinutes, tag, cover, keywords) and section structure. Requirements (all must be satisfied, matching the ticket's acceptance criteria): (1) a short 'Kort svar' answer block appears in the first screen, directly answering what the best booking system for Norwegian municipalities is / how to evaluate one, without scrolling past unrelated content; (2) an entity-definition section 'Hva er Digilist?' stating clearly what Digilist is, that it serves BOTH the KOMMUNE/OFFENTLIG (B2B) market and PRIVAT (B2C) market, and is built for the Norwegian rental/booking market specifically; (3) include at least one original data point or piece of Digilist's own documentation as a link (e.g. link to /blogg/ssa-l-2026-bookingsystem-kommune or /blogg/bookingsystem-kommune-sammenligning-matrise-tco) rather than inventing statistics; (4) at least one external source reference (e.g. Digdir, anskaffelser.no, or DFØ terskelverdier, same pattern as the Sharefox post's links); (5) author name and last-updated date visible in frontmatter (this already renders server-side via the existing BlogPost.tsx template — verify by checking src/pages/BlogPost.tsx and src/lib/postContent.ts render author/date, do not add new UI); (6) do NOT invent or claim specific negative/positive facts about named competitors Aktiv Kommune, BookUp, Rubic, Bookle, or Reservio — follow the exact disclaimer pattern used in alternativer-til-sharefox-kommunal-booking.md ('Vi sammenligner ikke navngitte funksjoner hos...') and instead give a neutral evaluation-categories table (innbyggerselvbetjening, saksbehandlerflyt, ID-porten/BankID, EHF-fakturering, sesongleie, prismodell, universell utforming, migrering) showing how Digilist answers each category, mentioning the named competitors only by name in the intro as context for why the article exists, never with fabricated comparative claims. Content only — no changes outside src/content/blog/. Once the file is added, run the project's existing build/lint checks (check package.json for the actual script names, e.g. pnpm build / pnpm lint) and confirm they pass, then verify the new post renders by checking that its slug resolves through the existing glob-based content loader (src/lib/postContent.ts) the same way alternativer-til-sharefox-kommunal-booking.md does — no new routing or component code should be needed since posts are auto-discovered. Open a PR against main only after checks are green.`

## Implementation contract — complete this before writing code
- **Problem:** In the Digilist marketing repo (booking-brilliance, this repo — plain markdown-in blog pipeline, posts auto-load via import.meta.glob in src/lib/postContent.ts, no framework changes needed), create a new blog post file at src/content/blog/beste-bookingsystem-kommune-norge.md that directly answers the query 'beste bookingsystem for kommuner i Norge'. Model it closely on the existing src/content/blog/alternativer-til-sharefox-kommunal-booking.md (published 2026-07-27) and src/content/blog/bookup-og-eksisterende-booking-losninger.md — both already implement the required AEO pattern successfully, reuse their frontmatter shape (slug, title, description, date, author: 'Ibrahim Rahmani', role: 'Grunnlegger, Digilist', readingMinutes, tag, cover, keywords) and section structure. Requirements (all must be satisfied, matching the ticket's acceptance criteria): (1) a short 'Kort svar' answer block appears in the first screen, directly answering what the best booking system for Norwegian municipalities is / how to evaluate one, without scrolling past unrelated content; (2) an entity-definition section 'Hva er Digilist?' stating clearly what Digilist is, that it serves BOTH the KOMMUNE/OFFENTLIG (B2B) market and PRIVAT (B2C) market, and is built for the Norwegian rental/booking market specifically; (3) include at least one original data point or piece of Digilist's own documentation as a link (e.g. link to /blogg/ssa-l-2026-bookingsystem-kommune or /blogg/bookingsystem-kommune-sammenligning-matrise-tco) rather than inventing statistics; (4) at least one external source reference (e.g. Digdir, anskaffelser.no, or DFØ terskelverdier, same pattern as the Sharefox post's links); (5) author name and last-updated date visible in frontmatter (this already renders server-side via the existing BlogPost.tsx template — verify by checking src/pages/BlogPost.tsx and src/lib/postContent.ts render author/date, do not add new UI); (6) do NOT invent or claim specific negative/positive facts about named competitors Aktiv Kommune, BookUp, Rubic, Bookle, or Reservio — follow the exact disclaimer pattern used in alternativer-til-sharefox-kommunal-booking.md ('Vi sammenligner ikke navngitte funksjoner hos...') and instead give a neutral evaluation-categories table (innbyggerselvbetjening, saksbehandlerflyt, ID-porten/BankID, EHF-fakturering, sesongleie, prismodell, universell utforming, migrering) showing how Digilist answers each category, mentioning the named competitors only by name in the intro as context for why the article exists, never with fabricated comparative claims. Content only — no changes outside src/content/blog/. Once the file is added, run the project's existing build/lint checks (check package.json for the actual script names, e.g. pnpm build / pnpm lint) and confirm they pass, then verify the new post renders by checking that its slug resolves through the existing glob-based content loader (src/lib/postContent.ts) the same way alternativer-til-sharefox-kommunal-booking.md does — no new routing or component code should be needed since posts are auto-discovered. Open a PR against main only after checks are green.
- **Business objective:** _why this matters (from the Linear issue)_
- **Repository / branch:** `/root/booking-brilliance` @ `agent/xal-450-aeo-gap-digilist-usynlig-i-ai-svar-for`
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
- One issue → one branch (`agent/xal-450-aeo-gap-digilist-usynlig-i-ai-svar-for`) → one independently reviewable change. Never main.
- Smallest valid change. No opportunistic refactoring, no broad formatting changes, no hidden dependency on another open PR.
- Validation is mandatory and staged — "code written" ≠ "compiled" ≠ "tests passed" ≠ "acceptance demonstrated". Collect evidence (test output / logs) before opening the PR.
- If scope expands beyond "Files likely affected", or the change grows large, STOP and escalate ("BLOCKED:") rather than pressing on.
- Open a PR only when green (otherwise a draft PR with a note). Delete this file before opening the PR.

## Full issue — from Linear (the source of truth for scope & acceptance)
> The Linear MCP in this environment may be bound to the WRONG workspace, so
> do NOT rely on it to read this ticket — everything you need is below. If
> something essential is genuinely missing here (e.g. a screenshot), STOP and
> end with "CLARIFICATION:" rather than guessing.

**Classification:** feature · severity minor · priority P2

Product gap: AEO-gap: Digilist usynlig i AI-svar for «beste bookingsystem for kommuner i Norge». <!-- xaheen-triage -->
**enhancement** · value medium — Named competitive gap on core kommune query with 0% citation, but evidence is n=2 preliminary sample with no stated user or revenue impact

AI answer engines cite competitors (Aktiv Kommune, BookUp, Rubic, Bookle, Reservio) when asked for the best booking system for Norwegian municipalities, but never cite Digilist (0% in n=2 test queries). [Digilist.no](<http://Digilist.no>) has no page directly answering this question, so it's uncitable.

**Done when**

- [ ] Published page contains direct answer in first screen
- [ ] Includes at least one original data point or documentation
- [ ] Explicitly states what Digilist is, who it serves, which market
- [ ] Lists at least one source reference
- [ ] Displays author name and last-updated date
- [ ] Server-rendered semantic HTML, indexable without client-side JS

**Not included**

* Changes outside marketing repo
* Unrelated refactors or scope creep

**How to verify**

* Fetch page without executing JavaScript; HTML contains answer block, entity definition, and sources
* First screen shows direct answer without scrolling past unrelated content

**Open questions**

* Is n=2 sample sufficient signal, or preliminary probe?
* What specific original data/figures about Digilist should be published?
* What URL/slug is expected for the page?
* Is follow-up measurement planned to confirm gap closed after publish?

Target repo: `marketing`

<details><summary>Reporter's original text</summary>

**SEO route:** content → `content-agent` · repo `marketing`

**Classification:** feature · severity major · priority P1

## Problem statement

Product gap: AEO-gap: Digilist usynlig i AI-svar for «beste bookingsystem for kommuner i Norge». AI-motorer nevner Aktiv Kommune, BookUp, Rubic, Bookle, Reservio, men ikke Digilist for spørsmålet «beste bookingsystem for kommuner i Norge» (synlighet 0%, sitering 0%, n=2). Gjør Digilist siterbar: publiser en autoritativ side som svarer direkte på spørsmålet (kort svarblokk øverst), med original dokumentasjon/tall, tydelig entitetsdefinisjon (hva Digilist er, for hvem, marked), kildereferanser, forfatter/oppdateringsdato, og teknisk siterbarhet (indekserbar, server-rendret, semantisk HTML på [digilist.no](<http://digilist.no>)). Current assessment: gap (feature, major).

## Scope

Create or expand content covering "AEO-gap: Digilist usynlig i AI-svar for «beste bookingsystem for kommuner i Norge»" aligned with AI-motorer nevner Aktiv Kommune, BookUp, Rubic, Bookle, Reservio, men ikke Digilist for spørsmålet «beste bookingsystem for kommuner i Norge» (synlighet 0%, sitering 0%, n=2). Gjør Digilist siterbar: publiser en autoritativ side som svarer direkte på spørsmålet (kort svarblokk øverst), med original dokumentasjon/tall, tydelig entitetsdefinisjon (hva Digilist er, for hvem, marked), kildereferanser, forfatter/oppdateringsdato, og teknisk siterbarhet (indekserbar, server-rendret, semantisk HTML på [digilist.no](<http://digilist.no>)).

…(truncated)

</details> Current assessment: partial (feature, minor). Relevant code: src/content/blog/alternativer-til-sharefox-kommunal-booking.md, src/content/blog/bookup-og-eksisterende-booking-losninger.md, src/content/blog/bookingsystem-kommune-sammenligning-matrise-tco.md, src/lib/postContent.ts:13.

**Scope**
Add one new blog post at src/content/blog/beste-bookingsystem-kommune-norge.md following the exact structure already proven in alternativer-til-sharefox-kommunal-booking.md: frontmatter with slug/title/description/date/author/role/readingMinutes/tag/cover/keywords, a 'Kort svar' answer block in the first screen, a 'Hva er Digilist?' entity-definition section (what it is, who it serves — KOMMUNE/OFFENTLIG B2B and PRIVAT B2C, market), a neutral evaluation-categories table (do NOT make disparaging or fabricated claims about Aktiv Kommune/BookUp/Rubic/Bookle/Reservio — follow the Sharefox post's disclaimer pattern of listing categories to check rather than claiming feature superiority), at least one link to Digilist's own published documentation as the 'original data point' (e.g. link to ssa-l-2026-bookingsystem-kommune.md or bookingsystem-kommune-sammenligning-matrise-tco.md), source references to external authorities (Digdir, [anskaffelser.no](<http://anskaffelser.no>)), and author name + date matching the site's existing convention. Touch points: src/content/blog/alternativer-til-sharefox-kommunal-booking.md (proven AEO template: kort-svar block, entity definition, author+date, source refs, comparison table without disparaging named competitors); src/content/blog/bookup-og-eksisterende-booking-losninger.md (second working example of the same template, published 2026-07-25); src/content/blog/bookingsystem-kommune-sammenligning-matrise-tco.md (already targets keyword 'beste bookingsystem kommune' but has no direct-answer block and doesn't name the AI-cited competitors); src/lib/postContent.ts:13 (blog posts are auto-discovered via import.meta.glob on src/content/blog/*.md — no code/infra change needed, just add a markdown file).

**Done when**

- [ ] Add one new blog post at src/content/blog/beste-bookingsystem-kommune-norge.md following the exact structure already proven in alternativer-til-sharefox-kommunal-booking.md: frontmatter with slug/title/description/date/author/role/readingMinutes/tag/cover/keywords, a 'Kort svar' answer block in the first screen, a 'Hva er Digilist?' entity-definition section (what it is, who it serves — KOMMUNE/OFFENTLIG B2B and PRIVAT B2C, market), a neutral evaluation-categories table (do NOT make disparaging or fabricated claims about Aktiv Kommune/BookUp/Rubic/Bookle/Reservio — follow the Sharefox post's disclaimer pattern of listing categories to check rather than claiming feature superiority), at least one link to Digilist's own published 

Linear: https://linear.app/xala-technologies/issue/XAL-450/aeo-gap-digilist-usynlig-i-ai-svar-for-beste-bookingsystem-for
