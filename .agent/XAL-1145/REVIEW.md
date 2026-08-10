# XAL-1145 Review

## Round 1 — Correctness

Lens: does the change do what the acceptance criteria (SPEC.md's "WHAT
CHANGES" + the ticket's search-intent goal) say, on the edge cases too?
Checked against the spec, the diff (`git diff origin/main...HEAD`), and a
fresh build, not just the markdown source.

Checked:

- **Slug/filename consistency** — frontmatter `slug:` matches the filename
  exactly (`teambuilding-lokaler-bedrift-mote-veiledning-booking`), no other
  post claims the same slug. Pass.
- **readingMinutes correctness** — `BlogPost.tsx:100` computes
  `Math.round(words/200)` off the raw markdown body at render time.
  Recomputed it standalone with Node against the actual file: 1220 words →
  6. Frontmatter says `readingMinutes: 6`. Matches exactly (this is the
  exact class of bug XAL-1149 round 1 caught in a sibling post).
- **Word-count gate** — ran `node scripts/check-blog-word-count.mjs` fresh:
  passes both the markdown-source floor (200 words min, this post has
  1220) and the rendered-HTML check against `dist/blogg/<slug>/index.html`
  (1357 words in the rendered `<article>`, confirmed with the same
  extraction regex the script uses).
- **Build freshness** — `dist/blogg/teambuilding-lokaler-bedrift-mote-veiledning-booking/`
  was already present from an earlier session; verified via `stat` that the
  dist HTML's mtime is *after* the markdown source's mtime, i.e. not stale.
  Confirmed `<h1>`, `<title>`, canonical URL, and the sitemap.xml entry all
  render correctly and match the frontmatter.
- **Frontmatter shape** — every field matches `BlogFrontmatter` in
  `src/lib/blogFrontmatter.ts` (slug/title/description/date/author/role/
  readingMinutes/tag/cover/keywords). `date: 2026-08-10` parses as a bare
  string (not misparsed as a number — the frontmatter parser's integer/float
  regexes require the *whole* value to be numeric, so the dashes protect
  it), consistent with every sibling post. `cover` points at an image that
  actually exists on disk (`public/images/blog/booking_calendar_hero_no.webp`,
  167KB, already used by other Bedrift/Privatperson posts per SPEC).
- **Dedup / content-gap claim re-verified independently** (not trusting
  SPEC's own grep output) — re-ran
  `grep -rli "teambuilding" src/content/blog/*.md` and confirmed the three
  named near-neighbor posts (`idrettshall-bedrift-*`,
  `moterom-kurslokale-*`, `leie-lokale-privat-fest-*`) don't cover the
  combined aktivitetslokale + møterom + veiledningsrom same-day scenario.
  No duplicate `title:` or `description:` across all 313 posts.
- **CTA-stripping edge case** — `BlogPost.tsx:121-127` pops a trailing
  paragraph from the rendered body if it matches a "book a demo" CTA
  regex, to avoid duplicating the CTA band below the article. This post's
  final paragraph ("Se det i praksis") contains the literal phrase
  "Book en demo" mid-sentence. Checked all three regexes
  (`\[book (en )?demo`, `^\*\*\s*book en demo`, `book demo\s*→`) against
  the actual paragraph text — none match, so the paragraph survives
  correctly. No silent content loss.
- **Product-claim consistency** — this repo has no booking backend (content
  is pure marketing copy); verified the post doesn't invent capabilities
  unique to itself. `samlefaktura` (23 other posts), `sanntid`/
  `sanntidskalender` (206), `ombooking` (10), `attestasjon` (2) are all
  established site vocabulary used elsewhere, not new claims.

**Found (fixed this round):**

- `scripts/check-title-lengths.mjs` (informational, not build-blocking)
  flagged the post's `<title>` at 75 chars against the site's 65-char
  convention (only 2 pre-existing posts, both about weddings, already
  violate this — not a pattern to extend). Since the whole point of this
  ticket is to satisfy search intent for "teambuilding" in the SERP, and
  Google truncates titles around this length, a truncated title works
  against the ticket's own goal. Shortened `title` from
  "Teambuilding for bedrifter: book lokaler til aktivitet, møter og
  veiledning" (75 chars) to "Teambuilding for bedrifter: book lokaler til
  møter og veiledning" (64 chars) — keeps the primary keyword at the front
  and the ticket's own phrase "møter og veiledning" intact, drops the
  redundant "aktivitet" (aktivitetslokale is still covered extensively in
  the body and in the `keywords` list). `<h1>` is unaffected — components
  render `h1` from the post title, an `<h1>` isn't length-constrained the
  way a SERP `<title>` is, so no need to touch it separately beyond the
  frontmatter `title` field itself, which both `<title>` and `<h1>` derive
  from.

No other correctness issues found this round.
