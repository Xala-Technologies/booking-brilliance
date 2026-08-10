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

## Round 2 — Regression

Lens: what else reads this code path — not just the files this diff touched,
but every consumer of `src/content/blog/*.md` and of anything else this diff
changed — and did anything depend on the old behaviour that this diff now
breaks?

Started from `grep -rln "content/blog\|virtual:blog-meta\|getAllPosts"` across
`src/`, `scripts/`, `build-plugins/`, `convex/`, `tools/`, which surfaces two
consumers SPEC.md's blast-radius section didn't enumerate:
`src/pages/Blog.tsx` (listing/tag/pagination page) and
`scripts/dedup-blog-drafts.ts`. Checked both:

- `Blog.tsx` — filters/paginates `getAllPosts()` with `Math.ceil`/`.slice`,
  nothing hardcodes a post count or a specific slug/order, so a new post
  (any tag, any date) is inert to it. Confirmed the `{filtered.length} av
  {allPosts.length}` counter and pagination math are pure functions of
  array length, no fixture to update.
- `dedup-blog-drafts.ts` — operates on a separate untracked "drafts"
  staging directory, never reads `src/content/blog/*.md`; not a consumer of
  the new file at all. Correctly absent from SPEC.md's blast radius.

Checked the other places a new post could silently break something that
depends on the old, smaller corpus:

- `src/components/BlogPreviewSection.tsx` (`getAllPosts().slice(0, 6)`,
  homepage widget) and `BlogPost.tsx`'s related-posts logic (`.slice(0, 3)`
  / `.slice(0, 2)`) — both derive their input from live `getAllPosts()`
  and re-slice every render; nothing snapshots the pre-existing list length
  or order. `entry-server.main-landmark.test.tsx` reads
  `getAllPosts()[0].slug` at test time rather than hardcoding a title, so a
  new same-dated post reshuffling position 0 doesn't break the assertion —
  confirmed by re-running `npx vitest run` (still 20/40 green).
- Cover image reuse (`gdpr_iso27001_hero_no.webp`) — already shared by 8
  other posts before this diff; no consumer keys anything off cover-image
  uniqueness (grepped for `cover` usage in `BlogPost.tsx`/`BlogPreview.tsx`,
  it's rendered as a plain `<img src>`, never used as a dedup/identity key).
  Not a regression.
- `SOLUTION_PAGES` auto-linker in `BlogPost.tsx` — matches per-post against
  that post's own title/tag/keywords; adding this file cannot change which
  money page any *other* existing post links to. Not a regression.
- `scripts/indexnow-submit.mjs` — has a hand-maintained hardcoded URL list,
  not generated from `getAllPosts()`; the new post silently isn't submitted
  to IndexNow, same as every other post in the last several tickets' worth
  of commits. Pre-existing, site-wide, not caused by this diff — not filed.

**Real finding — confirmed and fixed:** `pnpm-workspace.yaml` carries an
`allowBuilds:` block (`@swc/core`, `better-sqlite3`, `esbuild`, `sharp`)
that does not exist on `origin/main` and has nothing to do with this
ticket. It's the side effect `[[project_pnpm_build_needs_approve_builds]]`
warns about — `pnpm approve-builds --all` dirties this file locally, and it
should never ship. `pnpm-workspace.yaml` is monorepo-root config, read by
`pnpm` for every package under `apps/*`, not just this app — exactly the
kind of change a regression pass has to catch, since its blast radius is
every other package's install/build, not this diff's blog post. It reached
this branch via the `wip(...): checkpoint` commit (`060cb08`), which most
likely ran `git add -A` rather than adding the content file by name. This
is not a one-off: a sibling ticket hit the identical issue and reverted it
in commit `0a8427a` ("review(XAL-1134): round 1 correctness — revert
scope-creep pnpm-workspace.yaml edit"). Reverted here the same way:
`git checkout origin/main -- pnpm-workspace.yaml`, then re-ran `npx vitest
run` and `node scripts/check-title-lengths.mjs` to confirm the revert
didn't disturb anything else — both green.

No other regressions found this round.
