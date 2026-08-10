# XAL-1127 — Adversarial Review

## Round 1 — Correctness

**Lens:** does the change do what the acceptance criteria say, including the
edge cases the build gates actually check? Read `.agent/XAL-1127/SPEC.md`,
`git diff origin/main...HEAD`, then verified every claim the SPEC makes
against the real gates and rendered output — not just the raw `.md`.

**Checked, all passed:**

- Title: 63 chars raw, >50 so rendered verbatim (per
  `scripts/check-title-lengths.mjs`'s own rule) → 63 ≤ 65. Confirmed via the
  script's own output (`ok 63 bookingsystem-integrasjoner-kalender-epost-notifikasjoner.md`),
  not just hand-counted.
- Description: 152 chars, ≤155 as claimed (hand-counted, no automated gate
  exists for this field).
- Slug uniqueness: `src/lib/post-slugs.test.ts` passes; exactly one file
  resolves to this slug.
- Word count: markdown source and, critically, the **prerendered**
  `dist/blogg/<slug>/index.html` both clear the 200-word `content.thin` gate
  (`scripts/check-blog-word-count.mjs` — this is the gate that matters per
  its own comment, since a thin markdown file can still SSR to a 3-word page;
  confirmed dist was rebuilt *after* the last markdown edit via mtime, then
  independently recounted the rendered `<article>` text: 1588 words).
- CTA dedup: body ends with `**[Book demo →](/book-demo)**`, matches
  `BlogPost.tsx`'s `isCta()` regex and the sibling-post convention exactly.
- Cross-links: all 3 referenced blog slugs
  (`booking-funksjonalitet-systemkrav-gdpr-sms-kalender-tilgang`,
  `sanntidskalender-kommunal-booking`, `realtime-varsler-driftsroller`) and
  the 4th inline link (`idrettshall-no-show-avbestilling-driftsleder-kapasitet`)
  exist as real files; both marketing-page links (`/bookingsystem-kommune`,
  `/bookingsystem-utleie`) are real routes. Verified every `href` in the
  prerendered HTML resolves to a real route or blog post — no broken links.
- Cover image (`availability_calendar_hero_no.webp`) exists in `public/`.
- Technical claims (iCal/CalDAV/Outlook/Google sync, per-lokale channel
  choice) cross-checked against `Kanaler.tsx`, `BookingsystemUtleie.tsx`,
  `UseCaseMoterom.tsx` and the sibling GDPR/SMS/kalender post — consistent,
  nothing invented.
- No-show stat ("10–12 % → under 5 %") cross-checked against the linked
  idrettshall post's own numbers ("8 til 12 prosent", "fra 11 til 4
  prosent") — same order of magnitude, not contradictory.
- Full suite: `npx vitest run` — 20/20 files, 40/40 tests green, including
  the SSR `<h1>`/`<main>`-landmark invariants and `entry-server` tests.
  Rendered `<h1>` and `<title>` match the frontmatter title exactly.
- `tag: "Plattform"` is a real, already-used tag value (not invented).

**Found — 1 issue, fixed:**

- `pnpm-workspace.yaml` carried an `allowBuilds` block (added by
  `pnpm approve-builds --all` during local setup, swept into the `0ee3fab`
  checkpoint commit via `git add -A`). This is monorepo-root config read by
  every `apps/*` package — shipping it in a content-only PR risks build
  behavior changes with zero relation to this diff. **This exact pattern was
  already caught and reverted twice on sibling tickets** (XAL-1129's
  `8ad1d5f`, XAL-1134's `0a8427a`), so it's a known recurring failure mode
  of the `git add -A` checkpoint habit, not a one-off. Reverted
  `pnpm-workspace.yaml` to `origin/main`'s version; re-ran the full test
  suite (20/20 files, 40/40 tests) to confirm nothing depended on it.

## Round 2 — Regression

**Lens:** this diff is a single new `.md` file — what ELSE reads the blog
corpus that a new entry could disturb? Grepped every consumer of
`src/lib/posts.ts` (not just the three SPEC named — `BlogPreview.tsx`,
`BlogPost.tsx`, `search/corpus.ts`) and every build-time script that scans
`src/content/blog/*.md`, then re-ran the full gates to confirm none of them
regressed with the new file present.

**Consumers found beyond what SPEC.md listed, all checked:**

- `src/pages/Blog.tsx` — listing/search/tag-filter page. Tag "Plattform" is
  already a used value (confirmed round 1), so it doesn't create an
  orphan filter bucket. Filtering/pagination logic is generic over
  `getAllPosts()`, no hardcoded count or slug.
- `src/components/BlogPreviewSection.tsx` (homepage "Innsikt" carousel) —
  `getAllPosts().slice(0, 6)`, sorted by date desc. The new post is dated
  2026-08-10 (today), so it now displaces the oldest of the previous top-6
  from the homepage carousel. This is intended editorial behavior (newest
  post should surface), not a bug.
- `src/lib/webp-sources.test.ts` — iterates `getAllPosts()` and asserts
  every post's cover has a committed webp preview sibling on disk. Runs
  against the new post's cover (`availability_calendar_hero_no.webp`,
  reused from ~33 other posts) — passed, so the preview asset is already
  committed.
- `src/entry-server.main-landmark.test.tsx` — takes `getAllPosts()[0]`
  (the *current* most-recent post, whatever that is) and SSR-renders it to
  assert exactly one `<main>` landmark. Because the new post is dated
  2026-08-10, it's now (or ties for) `firstPost`, so this run actually
  exercised the new post's own SSR output for the first time, not just a
  sibling's. Passed.
- `src/lib/digitalt-bookingsystem-description.test.ts`,
  `src/lib/leie-selskapslokale-description.test.ts` — both hardcode a
  specific *other* slug and assert its description length; unaffected by
  an added post, confirmed by reading (not just running).
- `src/lib/search/corpus.ts` — merges `getAllPosts()` into the search/
  chatbot corpus with no cap, no dedup-by-title logic that a new entry
  could trip.
- Static `public/sitemap.xml` does **not** contain the new slug (nor do
  two other existing sibling posts' slugs) — traced this to
  `scripts/prerender.mjs` (~line 2599), which regenerates
  `dist/sitemap.xml` from scratch at build time; `public/sitemap.xml` is a
  separate, pre-existing, unused-by-build static file. Not a regression
  introduced by this diff.
- `scripts/push-clean-blog-to-convex.ts`, `auto-publish-blogs.ts`,
  `sync-convex-blog-to-fs.ts`, `dedup-blog-drafts.ts`,
  `diag-blog-drafts.ts` — a separate Convex-backed draft pipeline exists,
  but none of these are wired into `pnpm build`, `pnpm test`, or
  `.github/workflows/pr-check.yml` (which runs only lint/test/build). They
  are operator-invoked (`content:sync`, `content:autopublish`, etc.) and
  out of this diff's blast radius.

**Verified, not just read:**

- `npx vitest run` — 20/20 files, 40/40 tests green (same count as round
  1), including the two tests above that now touch the new post's own SSR
  output for the first time.
- `pnpm lint` — 0 errors; the 40 warnings reported are all pre-existing,
  in files this diff never touches.
- `git status --porcelain` — clean before and after this round.

**Found:** nothing. No consumer outside the ones SPEC.md already named
broke, and the two consumers SPEC.md missed (`Blog.tsx`'s tag filter,
`entry-server.main-landmark.test.tsx`'s dynamic `firstPost`) both turned
out to depend only on generic, already-passing invariants (a real tag
value; a post that SSRs cleanly), not anything this specific post could
violate. No changes made this round.
