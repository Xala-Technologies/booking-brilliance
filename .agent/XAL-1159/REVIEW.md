# XAL-1159 Review Log

## Round 1 — Correctness

**Lens:** does the diff do what `.agent/XAL-1159/SPEC.md` says, including the
edge cases — title/meta actually surfacing "Airbnb", keywords/FAQ/JSON-LD
wiring, the internal link route, and the two independent render paths (live
SPA vs. static `prerender.mjs`) staying consistent?

**What I checked:**

- Diffed every changed file (`beste-nettside-leie-lokale-hytte-utstyr-norge.md`,
  `bookingsystem-og-plattformer-for-utleiere.md`, `blogFaq.mjs`) against each
  bullet in SPEC.md §3 ("WHAT CHANGES") line by line — title, meta
  description, keywords array, depth paragraph, new FAQ entry, inbound link.
  All six match the spec's stated content verbatim; nothing claimed-but-not-
  done, nothing done-but-unclaimed.
- Traced the new FAQ entry (5th `POST_FAQ[slug]` item) through both render
  paths: live SPA (`BlogPost.tsx:161` → `SEO.tsx` `faq` prop) and static
  prerender (`scripts/prerender.mjs:2518` `POST_FAQ[post.slug].map(...)`,
  no length cap) — confirmed no hardcoded entry-count limit that would drop
  a 5th question from the `FAQPage` JSON-LD.
- Checked the title-length branch that decides whether `" · Digilist"` /
  `" – Digilist"` gets appended (`BlogPost.tsx:132`,
  `prerender.mjs:2531-2532`): new title is 63 chars, both branches take the
  `> 50` path and skip the suffix identically, so live and static titles
  stay in sync (this was a real risk — the two parsers are independent code
  paths per SPEC.md §2).
- Verified the new keywords entry (`"airbnb hytte utstyr"`) actually flows
  into `Article` JSON-LD via `BlogPost.tsx:158` → `SEO.tsx:318`, and
  confirmed (per SPEC.md's own note) it has no effect on
  `relatedSolutions()` matching since none of its regexes match
  hytte/utstyr/airbnb.
- Confirmed the new inbound link's target (`/blogg/beste-nettside-leie-
  lokale-hytte-utstyr-norge`) resolves via the `/blogg/:slug` wildcard route
  (`App.tsx:362`), and that the source paragraph
  (`bookingsystem-og-plattformer-for-utleiere.md:46`) still reads
  grammatically with the link spliced in.
- Confirmed XAL-1161's prior work on the same file (title's stats box "I
  korte trekk", CTA link to `/bookingsystem-utleie`) is untouched — this
  change doesn't clobber the sibling ticket's edits, per SPEC.md's explicit
  concern about that.
- Ran `npx vitest run` (full suite, 17 files / 36 tests, includes
  `blogFaq.test.ts` which pins `POST_FAQ[slug][0].question` and asserts
  every question/answer string `toContain`-matches the raw markdown body)
  — all green. Ran `npx tsc --noEmit` — clean.

**Findings:** none. Every spec claim matches the actual diff, both render
paths stay consistent, the FAQ test's body-mirror assertion holds for the
new 5th entry, and the full test suite + typecheck are green. No fixes
applied this round.
