# XAL-1129 — Review log

## Round 1 — Correctness

Lens: does the change do what SPEC.md's acceptance criteria say, on the edge
cases too? Read SPEC.md, then `git diff origin/main...HEAD`, then re-ran
every check SPEC.md claims passed, plus a few it didn't explicitly claim.

Checks re-run in this checkout (not just trusted from SPEC.md's prose):
- `node scripts/check-title-lengths.mjs` → new post reports 54 chars, within
  the 65-char limit. Confirmed.
- `node scripts/guard-blog-redirects.mjs --check` → 0 posts to check, because
  the guard only diffs `git status --porcelain` (uncommitted changes) and the
  new file was already committed in the prior session. Not a re-verification;
  SPEC.md's HTTP-200 claim from the earlier session stands unverified this
  round (would need network access + `--all` to re-check, not attempted).
- `npx vitest run src/lib/post-slugs.test.ts` → passed, new slug unique.
- Full `pnpm build` → succeeded, prerendered `dist/blogg/booking-funksjonalitet-systemkrav-gdpr-sms-kalender-tilgang/index.html`.
  Grepped the output directly:
  - `<h1>` renders the exact title text.
  - All 6 spoke links present: `/blogg/gdpr-iso-datalokasjon-norge`,
    `/blogg/realtime-varsler-driftsroller`,
    `/blogg/endre-kansellere-booking-selv-paaminnelser`,
    `/blogg/sanntidskalender-kommunal-booking`,
    `/blogg/brukerstyring-og-tilgangskontroll`,
    `/blogg/teknisk-funksjonalitet-sikkerhet-bookingsystem`.
  - Both money-page links present: `/bookingsystem-kommune`,
    `/bookingsystem-utleie`.
  - Word-count gate (`scripts/check-blog-word-count.mjs`, MIN 200) passed for
    all 319 posts including the new one, both the `.md` source and the
    rendered HTML.
- Full `npx vitest run` → 20 files / 40 tests, all passed (includes the SSR
  `<h1>`/`<main>`-landmark invariants that exercise every blog post route
  generically, and the CTA-band component tests).
- Confirmed all 6 spoke-post slugs exist as real files with matching
  frontmatter `slug:` values (grepped `src/content/blog/*.md` directly, not
  trusted from SPEC.md's list).
- Confirmed the cover image `public/images/blog/gdpr_iso27001_hero_no.webp`
  exists on disk.

Finding (real, fixed this round):
- **Broken CTA link (`/demo` instead of `/book-demo`).** The post's final
  standalone-CTA paragraph, `**[Book demo →](/demo)**`, points at a route
  that does not exist — `src/App.tsx` only registers `/book-demo` (line 299);
  `/demo` falls through to the catch-all `*` → `NotFound` route. SPEC.md
  itself describes this line as "the standalone CTA link the established
  convention uses," and the actual established-convention sibling post
  (`valg-og-implementering-bookingsystem-kommune.md`) uses the correct URL,
  `**[Book demo →](/book-demo)**` — this post's copy of the pattern typo'd
  the route.
  - Currently **invisible on the live site**: `BlogPost.tsx`'s `isCta()`
    dedup strips exactly this trailing paragraph (it matches
    `/book\s+demo\s*→/i`) because the article page already renders its own
    working `/book-demo` CTA band below — confirmed by grepping the
    prerendered HTML: zero `href="/demo"`, four `href="/book-demo"` (all
    from the CTA band, not the stripped paragraph). So no user hits the
    dead link today.
  - Fixed anyway: it's wrong source content regardless of whether today's
    stripping logic happens to hide it, and leaving it wrong invites the
    bug to resurface if that stripping regex or the paragraph's wording
    ever changes. Changed `/demo` → `/book-demo` in the new post.
  - Not a new class of bug: four *pre-existing* posts
    (`hva-er-et-forsamlingslokale.md`,
    `leie-lokale-kommune-anledning-guide-innbygger.md`,
    `moterom-kommune-finn-og-book-ledige-lokaler.md`,
    `sesongtildeling-idrettshall-saksbehandler-guide.md`) have the same
    `/demo` typo, inline mid-paragraph rather than as a standalone line —
    those are out of scope for this ticket (not part of this diff) and were
    left untouched.

Everything else checked came back correct: word count, title length, slug
uniqueness, h1 rendering, all outbound links (spoke posts + both money
pages), cover image, build + full test suite. No other correctness defects
found this round.

Frontmatter `readingMinutes: 7` doesn't match the post's actual ~5-minute
read at the site's own words/200 estimate — investigated and **not** filed
as a finding: `BlogPost.tsx`'s article page computes its own dynamic reading
time from live word count and never reads the frontmatter field at all: it's
only read by the *listing* pages (`Blog.tsx`, `BlogPreviewSection.tsx`). Spot
-checked three unrelated existing posts and all three show the same kind of
mismatch (`gdpr-iso-datalokasjon-norge`: labelled 7, actual 3;
`teknisk-funksjonalitet-sikkerhet-bookingsystem`: labelled 7, actual 5;
`sanntidskalender-kommunal-booking`: labelled 6, actual 3) — this is a
site-wide, pre-existing inconsistency in how `readingMinutes` is authored
across the whole corpus, not a defect introduced by this diff. Fixing the
site-wide reading-time computation is out of scope for a content-gap ticket.
