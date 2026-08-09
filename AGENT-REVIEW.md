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
