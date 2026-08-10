## Round 1

**Lens: correctness** — does the change do what the acceptance criteria say, on the edge cases too?

What I checked, against `.agent/XAL-1123/SPEC.md`'s acceptance criteria and
`git diff origin/main...HEAD`:

1. **Tag taxonomy.** `tag: "Lag og foreninger"` — compared against every distinct
   `tag:` value across `src/content/blog/*.md`; it's an existing, correctly-spelled
   value, not a near-miss new tag.
2. **Topic coverage vs. the stated gap.** Read the three sections
   (styremøte / årsmøte-generalforsamling / sosiale sammenkomster) against the
   spec's claim that no existing post covers a forening's own internal meetings.
   Cross-read the four adjacent posts the new post links to
   (`sesongleie-fordeling-lag-foreninger.md`,
   `sal-generalforsamling-borettslag-styreleder.md`,
   `frivillig-organisasjon-bookingsystem-medlemstilgang.md`,
   `moterom-kommune-finn-og-book-ledige-lokaler.md`) — confirmed each covers a
   genuinely different angle (municipal season-slot allocation, borettslag AGM
   pricing, member login/access, citizen real-time room search) and the new
   post doesn't restate their content, only references it. No duplication.
3. **Factual consistency with linked posts.** The new post claims foreninger
   "søker som regel om lavere frivillighetssats enn et boligselskap, siden
   foreningen normalt ikke regnes som næringsvirksomhet" — checked against
   `sal-generalforsamling-borettslag-styreleder.md`, which independently states
   "Frivillige lag og foreninger betaler ofte redusert sats... men et
   boligselskap regnes normalt som næringsvirksomhet." Consistent, not
   contradictory.
4. **Internal links resolve.** All 5 internal `/blogg/<slug>` links point at
   files that actually exist under `src/content/blog/` (verified each path on
   disk, not just plausible-looking slugs).
5. **Build gates.**
   - `node scripts/check-blog-word-count.mjs` → passes, all 322 posts
     (including the new one) ≥ 200 words in Markdown source.
   - Ad hoc word count on the new post body: 1382 words, well over the
     threshold — not a borderline pass.
   - `node scripts/check-title-lengths.mjs` → `ok 55 foreninger-lag-mote-arrangement-booking.md`,
     under the 65-char rendered limit.
   - `npx vitest run` → 20 test files, 40 tests, all green, including
     `src/lib/post-slugs.test.ts` (slug uniqueness) and the generic
     cross-post structural tests (`entry-server.h1.test.tsx`,
     `entry-server.main-landmark.test.tsx`, `webp-sources.test.ts`).
   - `npx eslint` on the new file → only the expected "file ignored, no
     matching configuration" warning for `.md` (Markdown isn't linted, per
     spec); no errors. Ran full-project `eslint . --max-warnings=0` too — the
     40 warnings that surface are all pre-existing, in unrelated
     `src/pages/admin/Intelligence*.tsx` files, untouched by this diff.
6. **Frontmatter shape.** Checked every field against the `BlogFrontmatter`
   interface in `src/lib/blogFrontmatter.ts` (slug, title, description, date,
   author, role, readingMinutes, tag, cover, keywords) — all present, all
   correctly typed for the custom YAML-subset parser (quoted strings,
   bracketed array for `keywords`). `date: 2026-08-10` matches the format of
   every other post and today's date. `readingMinutes: 7` is consistent with
   the 1382-word body (~200 wpm).
7. **Keyword cannibalization.** Grepped the exact keyword `"foreninger"`
   across every post's `keywords:` array — only this new post uses it, so no
   internal competition for that exact-match term.

**Finding: none.** Every acceptance-criteria line item checks out, including
the edge cases (slug collision, factual consistency with cross-linked posts,
non-duplication of the two adjacent audiences the spec called out by name).
No code changes made this round — this was a pure verification pass.

## Round 2

**Lens: regression** — what else reads this code path (not just the files
the diff touched), and did anything depend on the old behaviour (322 posts,
no `foreninger-lag-mote-arrangement-booking` slug, no "Foreninger og lag:
book lokale..." title)?

Re-derived the consumer list independently of the SPEC's own "Blast radius"
section (grepped `content/blog\|getAllPosts\|virtual:blog-meta\|postContent\|
BlogFrontmatter` across `src` + `scripts` fresh, rather than trusting the
list already written down) to catch anything Round 1 or the SPEC missed:

1. **Two consumers not named in the SPEC's blast-radius list**, both real
   build/deploy gates:
   - `scripts/verify-live.mjs` — post-deploy check with a
     `findDuplicateTitles()` pass that groups every post by the exact
     `<title>` `prerender.mjs` would emit and fails the deploy if two posts
     collide. Ran it offline (imported the exported pure `parseFrontmatter`/
     `findDuplicateTitles` helpers, no live fetch) against all 322 posts
     including the new one: **0 duplicate-title groups.** Also let the script
     run its live probe (network was reachable from this sandbox) — 322
     posts detected, 10 newest sampled, all green, no duplicate titles live
     either.
   - `scripts/guard-blog-redirects.mjs` — pre-push guard that quarantines a
     new post if its slug already resolves (via server-side 301) to a
     *different* existing article, i.e. the topic was previously consolidated
     away. `changedBlogFiles()` reads `git status`, so it only checks
     uncommitted files — since this post is already committed from the prior
     session, the guard wouldn't see it on a normal run. Probed the exact
     scenario by hand: `GET https://digilist.no/blogg/foreninger-lag-mote-arrangement-booking`
     with `redirect: "manual"` → `200`, no `Location` header. Classifies as
     `"free"` (not `"claimed"`) under the guard's own `classifyRedirect()`
     logic — confirmed the 200 is the SPA's catch-all shell (`<title>Digilist
     · Én plattform for alt som leies ut</title>`, same as a deliberately
     nonexistent slug I probed for comparison), not a real 301 collision. No
     standing redirect claims this slug.
2. **Homepage preview (`BlogPreviewSection.tsx`)** does `getAllPosts().slice(0,
   6)` — the new post (`date: 2026-08-10`, today) becomes the newest and will
   now displace whatever was previously slot 6 on the homepage. This is the
   *intended* automatic-pickup behaviour the SPEC describes, not a regression
   — grepped for any test or snapshot that hardcodes which posts appear in
   the homepage preview or asserts a specific "latest post"; found none.
3. **Search corpus (`src/lib/search/corpus.ts`)** builds `blogItems` by
   mapping over `getAllPosts()` at line 100 — no hardcoded list, new post
   becomes searchable automatically as the SPEC claimed. No stale/duplicate
   entry risk since there's exactly one `SearchItem` per post, keyed off the
   post itself.
4. **Chatbot RAG (`src/lib/chatbot/rag.ts`)**, initially flagged because it
   wasn't in the SPEC's list either — read it fully: `retrieve()` only scores
   against `FAQ_CATEGORIES`/`allFAQEntries`, never touches blog posts. Not a
   consumer of this change at all; false lead, ruled out.
5. **Sitemap** — `public/sitemap.xml` exists on disk but is fully
   regenerated by `scripts/prerender.mjs` (`sitemapEntries` built from
   `getAllPosts()`, written to `dist/sitemap.xml`) at build time, not
   hand-maintained. No stale-sitemap risk from adding a file directly to
   `src/content/blog/`.
6. **`scripts/indexnow-submit.mjs`** has a hardcoded `DEFAULT_PATHS` array
   that does *not* include most blog posts (by design — it's a manually
   invoked CLI for submitting a specific set of URLs, not a build gate that
   iterates every post). Confirmed it isn't wired into any automated
   pipeline step that would need updating for a new post.
7. **Full test suite** re-run after all of the above: `npx vitest run` → 20
   files, 40 tests, all green (same counts as Round 1 — nothing shifted).
   `node scripts/check-blog-word-count.mjs` → "All 322 blog posts have at
   least 200 words." `node scripts/check-title-lengths.mjs` →
   `ok 55 foreninger-lag-mote-arrangement-booking.md`.

**Finding: none.** Nothing depended on the pre-change post count or slug
set in a way this addition breaks. The two consumers missing from the SPEC's
blast-radius list are a documentation gap in Round 0's SPEC, not a code
regression — noting it here so a future SPEC pass for a similar content-only
ticket greps for `findDuplicateTitles`/`verify-live`/`guard-blog-redirects`
explicitly rather than only the metadata-pipeline files. No code changes
made this round.
