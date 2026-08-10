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
