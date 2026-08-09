# XAL-1137: Deep review log

Change under review: new post `src/content/blog/lokalbooking-geografisk-sok.md`,
a new FAQ entry in `src/content/blogFaq.mjs`, and one small cross-link edit each
in three existing posts (`bookup-og-eksisterende-booking-losninger.md`,
`idrettshall-ledige-tider-sok-book-varsling-tvers-kommuner.md`,
`leie-sal-kommune-guide-fra-sok-til-booking.md`). Content-only change — no
application code touched. Lenses were adapted from code-review defaults to fit
a content change: correctness (facts/links/schema), regression (build/tests/
sitemap/redirects), SEO/security (structured data, claims, no injected
markup), scope (smallest valid change, no forbidden shared files touched).

## Round 1 — correctness / regression / SEO+security / scope

Four parallel agents, each told to REFUTE the change over `git diff`.

**Correctness** — Verified frontmatter parses correctly against
`BlogFrontmatter`/`parseFrontmatter` (date, slug, keywords array all valid),
the new `POST_FAQ["lokalbooking-geografisk-sok"]` entry matches the post's
"## Vanlige spørsmål" section word-for-word (same invariant enforced for one
other slug by `src/content/blogFaq.test.ts`), all internal markdown links
resolve to real posts/routes, the cover image exists, and the GFM table
parses correctly. **Found a real issue**: the Oslo/Bergen/Trondheim
comparison table stated unsourced price-level rankings ("Prisnivå: Generelt
høyest" for Oslo, "Generelt lavest" for Trondheim) as if factual, one
paragraph above a disclaimer stating Digilist doesn't set prices at all —
internally contradictory. **Fixed**: removed the "Prisnivå" row entirely,
reworded the remaining rows to explicit "Typisk ..." framing, and added a
sentence before the table stating it's a general tendency, not
Digilist-set pricing.

**Regression** — `pnpm test` (35/35), `pnpm build` (248 posts, +1 from base's
247, exactly the new post; sitemap.xml gained exactly one `<url>`, no
duplicates, no drops), `guard-blog-redirects.mjs` (all 4 changed posts clear,
no 3xx collisions). No hardcoded slug list, featured-posts array, or feed
generator needed updating. Confirmed `AGENT-SPEC.md` is documentation-only
(not imported anywhere) and is intentionally overwritten per-branch (same
pattern as the prior merged XAL-1053 ticket). Non-blocking observation (not a
regression): the post discusses Oslo/Bergen/Trondheim but didn't originally
link to the existing dedicated city pages at `/lokaler-til-leie/<by>`
(`src/content/lokalerByer.ts`) — **addressed**: added links to those three
city pages in the "Oslo, Bergen, Trondheim" section, since this directly
strengthens the ticket's own geographic-search goal.

**SEO/security** — Keywords array has no exact duplicates and the
city-specific variants reflect real body content, not stuffing. Title/
description length is within the range of sibling posts. FAQPage JSON-LD
validated as parseable and the Q&A text is byte-for-byte present in the
rendered HTML (no Search Console visible-content mismatch risk). No secrets/
PII/injected markup anywhere in the diff. Author attribution matches every
other post in the corpus. **Found a minor issue**: one sentence about BookUp
("Det de ikke løser, er søket som går på tvers...") stated a claim about a
real third-party product's feature set as flat fact, less hedged than the
rest of the post and less hedged than the sibling BookUp-comparison post's
style. **Fixed**: reworded to "Det de vanligvis ikke er bygget for..." and
softened the closing clause to match the hedged tone used elsewhere.

**Scope** — Diff touches exactly the new post, its FAQ entry, and one-line/
one-sentence cross-links in three existing posts — all justified by the
ticket. Confirmed none of the explicitly forbidden shared files
(`scripts/prerender.mjs`, `src/entry-server.tsx`, `scripts/verify-live.mjs`,
`build-plugins/*`, `vite.config.ts`) were touched. Confirmed `AGENT-GOAL.md`
is still present (correct at this stage — deleted only immediately before
opening the PR) and that overwriting `AGENT-SPEC.md` per-branch is the
established, not novel, pattern. No unrelated formatting/dependency changes.

**Round 1 verdict:** two real issues found and fixed (unsourced price-ranking
claim contradicting the platform's own pricing disclaimer; one under-hedged
competitor claim), one improvement made (added links to the existing
Oslo/Bergen/Trondheim city landing pages). Re-ran `pnpm build`, `pnpm test`,
`npx tsc --noEmit`, and `node scripts/guard-blog-redirects.mjs` after the
fixes — all green (248 posts, 35/35 tests, 0 type errors, 4/4 posts clear of
redirect collisions).

## Round 2 — sharpened lenses (adversarial fact-check, independent skepticism on ticket intent)

**Adversarial fact-check** — Re-read the post fresh (not trusting round 1's
summary) and diffed the FAQ body text against `blogFaq.mjs` programmatically:
still an exact word-for-word match, round 1's edits to the table/BookUp
paragraph didn't disturb it. Verified the three new `/lokaler-til-leie/<by>`
links resolve by reading `src/App.tsx`'s route, `LokalerTilLeieBy.tsx`'s
lookup, and `lokalerByer.ts`'s `BYER` keys directly (not assumed). Re-ran
`pnpm build`/`pnpm test` independently — both green. No remaining unhedged
factual claims found. One stylistic note (the city-links sentence reads
slightly promotional) — not blocking, left as a judgment call.

**Independent skepticism on ticket intent** — Checked whether the post
actually explains "lokal-first søkemønster" as a real behavioral concept
(it does, in a dedicated section) and whether "lokalbooking" has genuine
on-page emphasis, not just frontmatter presence (it does: title, first
paragraph, "Kort svar", two H2s, FAQ heading). **Found a real issue this
round's narrower lens was built to catch and round 1 wasn't**: the "på tvers
av kommunegrenser" section and the "ikke et gjennomsnitt" table intro were a
near-paraphrase of an argument already published the same day in
`idrettshall-ledige-tider-sok-book-varsling-tvers-kommuner.md` — same
construction, genericized from idrettshaller to lokaler broadly, thin
differentiation from a post it also links to. **Fixed**: reworded the table
intro sentence to a different construction (per-city actual terms shown
separately, not a stated "not-an-average" claim), and reworded the
kommunegrense section to explicitly generalize beyond idrettshaller ("ikke
bare idrettshaller") with an inline link deferring the sport-specific case to
the existing post, instead of re-deriving the same argument — makes the two
posts complementary (general lokalbooking vs. idrettshall-specific) rather
than redundant. Also confirmed `readingMinutes: 7` is consistent with the
corpus's words-per-minute convention (167.7 wpm vs. 153-192 wpm on 3 sibling
posts checked), and that `tag: "Privatperson"` on a post covering both
private and business use cases matches established practice (70/248 posts in
the corpus do the same, including the topically similar idrettshall post) —
neither needed a change.

Re-ran `pnpm build`, `pnpm test`, `npx tsc --noEmit` after the round-2 edits
— all green (248 posts, 35/35 tests, 0 type errors).

## Round 3 — rendered output + full link-graph audit

Read the entire rendered `dist/blogg/lokalbooking-geografisk-sok/index.html`,
not just the source markdown. Confirmed: the comparison table renders
correctly through `BlogTable.tsx`'s established stacked-layout behavior (this
site never renders GFM tables as literal `<table>` — a pre-existing,
intentional design, not a defect); the 7 TOC anchors and 7 `<h2 id>` elements
match byte-for-byte in slug, text, and order; no leaked markdown syntax
(`**`, unresolved `[]()`, stray `#`/`|---`) anywhere in the rendered text.
`dist/sitemap.xml` has exactly one entry for the new slug with a `<lastmod>`
matching its frontmatter date, no duplicate `<loc>` values anywhere in the
332-URL sitemap. Extracted and checked all 9 links in the current post
state (not sampled) — all 9 resolve to a real post file or registered route.
Re-read the 3 edited existing posts in full current context — round 2's
edits to the new post didn't leave any dangling reference in them; all three
still read naturally and link correctly. Fresh `pnpm test` (35/35), `pnpm
build` (248 posts, sitemap intact), `npx tsc --noEmit` (0 errors), and a
direct production redirect-classification probe of all 4 changed slugs
(bypassing `guard-blog-redirects.mjs`'s git-diff-based no-op on a clean tree)
— all 4 classified "free" (HTTP 200, no 3xx claim).

**Round 3 verdict:** clean, no changes made.

## Round 4 — final sign-off (skeptical re-read + full diff/commit audit)

**Diff/commit audit** — Diffed every changed file (`git diff
origin/main...HEAD`) against what this log claims was done. All three
cross-link edits and the `blogFaq.mjs` FAQ entry matched the log exactly
(Prisnivå row removed, BookUp sentence softened, city links added, FAQ
word-for-word match to the post's "## Vanlige spørsmål" section). **Found a
real gap**: Round 3's write-up of this file (the "Round 3" section above) had
never actually been committed — `git status` showed `AGENT-REVIEW.md` as
modified against `HEAD` (971704f), which only contains Round 1 + Round 2.
Round 3 made no code changes, so nothing was at risk of being lost, but the
log itself was sitting uncommitted this whole time. Fixed by committing it
along with this round's changes.

**Fresh skeptical re-read** — Read the full post front-to-back as a first-time
reader. Found one real leftover from layering edits across rounds: the last
sentence of "Slik filtrerer du..." ("Legger du til flere byer i samme søk,
... viser Digilist treff for begge steder side om side, med egne priser og
egen tilgjengelighet per sted.") and the opening sentence of the very next
section, "Oslo, Bergen, Trondheim: hvorfor prisregulativet ikke er det
samme" ("Legger du på flere byer i samme søk, vises hvert enkelt sted med
sine egne, faktiske vilkår, ikke slått sammen til ett tall."), made the same
point — multiple-city search results are shown separately, not merged —
back-to-back with only an `<h2>` between them. This is the round-2 table-intro
rewrite (meant to differentiate from the idrettshall post) landing right next
to a pre-existing sentence saying almost the same thing, never reconciled
against its immediate neighbor. **Fixed**: replaced the redundant opening
sentence with a leaner transition ("Vilkårene varierer mer mellom byene enn
mange forventer, selv om søket viser dem side om side i samme kalender.")
that keeps the "terms vary more than expected" point (needed to justify the
table) without repeating the "shown separately" claim already made one
sentence earlier. Verified in the rebuilt `dist/blogg/lokalbooking-geografisk-sok/index.html`
that the old duplicate phrase is gone and the new sentence renders correctly.

Also checked and found no issue: the H2 "hvorfor prisregulativet ikke er det
samme" is a defensible heading even though Round 1 removed the literal
"Prisnivå" data row — the section still explains price *variation* via
demand differences, municipal discount schemes, and the closing sentence
that price/cancellation terms are always set by the individual utleier/
kommune, not Digilist. No typos found. FAQ block in `blogFaq.mjs` re-diffed
programmatically against the post's "## Vanlige spørsmål" section — still an
exact word-for-word match after the fix (the fix only touched the earlier
"Oslo, Bergen, Trondheim" section, not the FAQ). `AGENT-GOAL.md` confirmed
still present (correct — deleted only immediately before opening the PR).

**Full verification stack, fresh** — `npx tsc --noEmit`: 0 errors. `pnpm
test`: 16 files, 35/35 passed. `pnpm build`: 248 posts, 332-URL sitemap
regenerated, word-count floor passes on all 248 posts (source and rendered).
`pnpm lint`: 0 errors, 40 pre-existing warnings, none in `blogFaq.mjs` or any
`src/content/blog/*.md` file — confirmed markdown/`.mjs` content files are a
no-op for the react-hooks/react-refresh lint rules, as expected.

**Round 4 verdict:** one real issue found and fixed (back-to-back redundant
sentence from layered rounds 1-2 edits landing next to each other), one
process gap fixed (Round 3's log entry committed for the first time). Full
verification stack green. Branch is ready for PR.
