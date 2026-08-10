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
