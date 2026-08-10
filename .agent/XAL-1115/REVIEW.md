# XAL-1115 review log

## Round 1 — CORRECTNESS

Lens: does the change do what the acceptance criteria in `.agent/XAL-1115/SPEC.md`
say, including edge cases? Checked the diff against `origin/main`
(`.agent/XAL-1115/SPEC.md` + `pnpm-workspace.yaml` + the new post — 259 lines
total), then re-ran every gate the acceptance criteria name, then read the
post itself line by line for internal consistency.

### What I checked

- **Build/test gates named in the acceptance criteria**, run directly rather
  than trusted from the SPEC's prose:
  - `node scripts/check-title-lengths.mjs` → `ok   60
    bryllupsmottak-bankettsaler-storre-selskaper-hoy-kontraktverdi.md`
    (title renders at 60 chars, under the 65 cap).
  - `node scripts/check-blog-word-count.mjs` → all 324 posts (323 + this one)
    pass both the raw-markdown and the rendered-`dist/blogg` word-count gates.
  - `npx vitest run src/lib/post-slugs.test.ts` → pass (slug is unique).
  - `npx vitest run` (full suite) → 20 files, 40 tests, all green, including
    `entry-server.h1.test.tsx` and `entry-server.main-landmark.test.tsx`.
  - `pnpm lint` → 0 errors (40 pre-existing warnings in unrelated files, none
    touched by this diff).
  - Confirmed `dist/blogg/bryllupsmottak-bankettsaler-storre-selskaper-hoy-kontraktverdi/index.html`
    exists and its rendered `<h1>` matches the frontmatter `title` exactly.
- **Internal links** the SPEC claims "verified to resolve": grepped each
  target slug (`bryllupslokale-typer-gard-hotell-selskapslokale-ute`,
  `bryllupslokale-utleier-pris-booking-kontrakt`,
  `spesiallokaler-niche-utleie-teaterscene-kjeller`,
  `utleieobjekt-veiviser-steg-for-steg`) against `src/content/blog/*.md` — all
  four exist. The CTA link style (`https://digilist.no/demo` vs relative
  `/demo`) matches the majority house style (31 posts vs 4).
- **Duplication claim** ("no existing post covers bankettsal/bryllupsmottak
  as a distinct topic"): re-ran the SPEC's own greps independently rather
  than trusting them. `bryllupsmottak` — zero other hits, confirmed. But
  `grep -liE "bankettsal|banquet"` turns up **one file the SPEC missed**:
  `bryllupslokale-filtrer-stil-uteareal-tilgjengelighet.md` uses the word
  once, describing a hotel's "ferdig oppdekket bankettsal" as one bullet in a
  style comparison for couples. Read it — it's a single incidental mention in
  a consumer-facing venue-style post, not a treatment of banquet capacity or
  owner economics, so it doesn't actually duplicate this post. The SPEC's
  "zero hits" claim for that grep was imprecise, but the underlying
  distinctness claim in the acceptance criteria holds. Not worth a content
  change; flagging so the SPEC's evidence trail is accurate for whoever reads
  it next.
- **POST_FAQ registration**: the new post has a "Vanlige spørsmål" section but
  no entry in `src/content/blogFaq.mjs`. Checked whether this is required —
  it isn't: only 7 of 47 posts with a FAQ section have a `POST_FAQ` entry
  (it's what drives FAQPage JSON-LD, opt-in and rare). No finding.
- **Numeric self-consistency of the content itself** (this is the
  acceptance-criteria's core claim — "higher average contract value" — so a
  wrong number here is a correctness bug in the substance of the post, not
  just prose quality): read every kroner figure in the post and checked they
  compose correctly.

### Finding (fixed)

The intro (paragraph 1) claimed the **full contract** (venue + catering + bar
+ lodging combined) "ofte passerer 150 000–300 000 kroner". Section 2 then
computes **catering alone**, before venue rental is even added
("kuvertprisen... 225 000–350 000 kroner, før lokaleleien er lagt til") — a
sub-component of the total that already meets or exceeds the intro's stated
total-contract ceiling. A reader doing the arithmetic the post itself walks
through would find the pieces don't add up to the headline number, which
undermines the exact economic argument ("higher contract value") the
acceptance criteria require the post to make credibly.

**Fix:** changed the intro's total-contract range from "150 000–300 000
kroner" to "300 000–500 000 kroner" in
`src/content/blog/bryllupsmottak-bankettsaler-storre-selskaper-hoy-kontraktverdi.md`
— now consistent with catering-alone (225k–350k) plus venue/bar/lodging on
top, and still consistent with the "300 000-kroners bryllupshelg" deposit
example later in the post (now sits near the low end of the range instead of
above the stated ceiling).

**Fix:** corrected the SPEC's grep evidence in
`.agent/XAL-1115/SPEC.md` — noted the one incidental `bankettsal` mention in
`bryllupslokale-filtrer-stil-uteareal-tilgjengelighet.md` that the original
"zero hits" claim missed, and why it doesn't affect the distinctness
conclusion.

### Not fixed / not findings

- `pnpm-workspace.yaml`'s `allowBuilds` addition (from the checkpoint commit)
  is environment setup (`pnpm approve-builds --all`, per
  `project_pnpm_build_needs_approve_builds` in memory), not scope creep by
  the content change — left as-is.
- Package minimum-guest figures ("100–150 gjester" for pricing tiers vs.
  "120–150" for the bankettsal definition threshold in the FAQ) are two
  different concepts — a package's minimum can legitimately sit below the
  categorization threshold — not a contradiction.

All gates re-run green after the fix: `npx vitest run` (40/40),
`node scripts/check-blog-word-count.mjs`, `node scripts/check-title-lengths.mjs`,
`pnpm lint` (0 errors).
