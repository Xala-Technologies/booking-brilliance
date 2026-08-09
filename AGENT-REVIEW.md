# XAL-1139: Deep review log

Change under review: one new file,
`src/content/blog/praktisk-guide-prosedyrer-krav-prising-booking.md`
(a Norwegian blog post), plus `AGENT-SPEC.md`.

## Round 1 — correctness / regression-duplication / security / scope

Four parallel agents, each told to REFUTE the change over the actual file
contents and `git diff 67601bf..HEAD`.

**Correctness** — found three real defects:
1. The kommune-vs-privat comparison table claimed a rejection must contain
   "dokumentasjonskrav i anskaffelsen (SSA-L)", conflating SSA-L's actual
   requirement (the vendor's *system* must log who/when/why per approval
   step) with the content of an individual rejection letter to a citizen or
   lag — those are different things, and the table stated the wrong one.
2. The table listed "depositum" as a private-utleier krav-til-leietaker item,
   contradicting the post's own structure two paragraphs earlier, which
   places depositum under Prising, not Krav.
3. A genuinely broken sentence in the Krav section: a comma splice
   ("...i søknaden, mangler her er den vanligste årsaken...") that lost its
   antecedent and didn't parse.
   Everything else checked out: all four internal links resolve (verified
   against both frontmatter and the actual `dist/blogg/*` build output,
   including the non-ASCII `ø` slug), krav/prosedyre/pris claims matched the
   linked source posts, Norwegian grammar was otherwise clean.

**Regression / duplication** — the most substantive finding of the round: the
post's content overlaps with 4-5 already-published, persona-specific posts
(`leiepriser-kommunale-lokaler-driftsleder-guide.md`,
`prissetting-sal-kommune-driftsleder-differensiert-pris.md`,
`leie-ut-pa-digilist-guide-for-utleiere.md`,
`saksbehandler-godkjenne-avvise-kommunisere.md`), and the opening hook was a
near-verbatim reuse of `leiepriser-kommunale-lokaler-driftsleder-guide.md`'s
own opening framing ("De fleste guider ... er skrevet for leietakeren ...
Denne er for deg som sitter på andre siden"). Also flagged: the new
`tag: "Bookingansvarlig"` is a single-use, 30th distinct tag value.
Slug/filename and cover image were both confirmed clean (no collision,
`booking_calendar_hero_no.webp` exists and is already shared by 49 posts).

**Security** — no issues. `react-markdown` + `remark-gfm` only, no
`rehype-raw` anywhere in the render pipeline and no `dangerouslySetInnerHTML`
in `BlogPost.tsx`/`BlogPreview.tsx`, so raw HTML in the `.md` (there is none)
wouldn't execute regardless. No secrets or internal infra in either file. The
one SSA-L mention doesn't claim Digilist certification and is strictly
lighter than existing posts' compliance claims. One functional (non-security)
defect found: the `/demo` CTA link 404s — the real route is `/book-demo`
(`src/App.tsx:299`) — a pre-existing broken-link convention shared by 4 other
live posts, but worth fixing in this file regardless of being pre-existing
elsewhere.

**Scope** — clean. Diff is exactly the new post and `AGENT-SPEC.md`; none of
the forbidden shared files (`scripts/prerender.mjs`, `src/entry-server.tsx`,
`scripts/verify-live.mjs`, `vite.config.ts`,
`build-plugins/blogMetaPlugin.ts`) appear in the diff, `git status --short`
was clean, and `AGENT-GOAL.md` is present and tracked as expected at this
stage (scheduled for deletion right before the PR, not before).

### What I changed after round 1
- Rewrote the intro so it makes the same "administrator, not renter" framing
  point without echoing the leiepriser post's specific wording — the intro
  now explicitly names the gap this post fills (the three topics are usually
  written up separately; this is the sequence a bookingansvarlig actually
  uses them in) rather than restating another post's hook.
- Fixed the SSA-L table cell to describe the actual requirement (a logged
  approval step in the driftsavtale), not an invented claim about rejection-
  letter contents.
- Removed "depositum" from the table's krav-til-leietaker row (replaced with
  "Husregler ved booking") so the table matches the prose's own krav/pris
  split.
- Fixed the broken comma-splice sentence in the Krav section.
- Fixed `/demo` → `/book-demo` (the actual route in `src/App.tsx`).
- Recomputed word count (1009 words) against the other four read posts'
  actual words-per-`readingMinutes` ratio (~156-193 wpm) and corrected
  `readingMinutes` from 7 to 6 to match.
- Re-ran the full build (optimize-images, vite build, SSR build, prerender,
  word-count check) and `pnpm vitest run` — both green after the edit
  (16 files / 35 tests, word-count check passes on both markdown and
  prerendered HTML).

**Decision on the duplication finding, not a defect fix**: the pattern this
post follows — a consolidated practical hub that links out to existing
persona-specific deep dives instead of repeating them — is the established
precedent in this repo for exactly this kind of ticket (see the prior
XAL-1141 post, which explicitly states "This is NOT a case of writing
something from scratch ... What's missing is a single consolidated piece").
The real, fixable problem was the near-verbatim opening line (fixed above),
not the hub structure itself: no existing post targets "bookingansvarlig" as
a persona spanning both kommune and private markets at once, or sequences
krav → prosedyre → pris as one operational flow — every existing post is
scoped to one market and one of the three topics. Kept the hub approach.

**Decision on the new tag, not a defect fix**: `tag: "Bookingansvarlig"` is
a single-use value, but single-use tags are already the norm in this corpus
(15+ existing tags — `Onboarding`, `Mobil`, `Kurs`, `Kommunikasjon`,
`Sesongleie`, etc. — appear exactly once). No existing tag (`Driftsleder`,
`Saksbehandler`, `Utleier`) names a persona spanning both markets, and using
one of those would misrepresent this post as belonging to a single market.
Kept the new tag value.

## Round 2 — deeper fact-check + build/SEO regression

Two parallel agents: one re-verified round 1's five fixes landed correctly
and then did a fresh line-by-line re-read of every remaining factual/process
claim against six related posts (the four from round 1 plus
`saksbehandler-godkjenne-avvise-kommunisere.md` and
`prissetting-sal-kommune-driftsleder-differensiert-pris.md`, both flagged by
round 1's duplication lens as additional overlapping posts); the other ran a
full production build from a clean `dist`/`dist-server` and inspected the
prerendered HTML, sitemap, and blog listing page directly.

**Fact-check lens** — all five round-1 fixes verified correctly applied.
Re-checked every claim in the post (documentation requirements, the
rejection/re-request principle, lokale-frigjøring/dobbeltbooking risk,
avbestilling/refusjon, private pricing practice, all four comparison-table
cells, all four cross-links' target slugs) against the six source posts —
no new contradiction, overstatement, or wrong detail found. One phrasing
difference noted and judged not a real conflict: this post calls
depositum/avbestillingsgebyr part of "prisstrukturen," while
`prissetting-sal-kommune-driftsleder-differensiert-pris.md` calls depositum
"ikke inntekt, det er en risikobuffer" — different framings (setup process
vs. revenue accounting), not a factual disagreement.

**Build/SEO lens** — ran the full pipeline once from a clean state
(`rm -rf dist dist-server` → `optimize-images.mjs` → `vite build` → SSR
build → `prerender.mjs` → `check-blog-word-count.mjs` → `pnpm vitest run`):
all steps passed, 16/16 test files, 35/35 tests green, word-count check
green on both markdown and prerendered HTML. Direct inspection of
`dist/blogg/praktisk-guide-prosedyrer-krav-prising-booking/index.html`
confirmed exactly one `<h1>` matching the title, correct `Article` JSON-LD,
canonical URL, Open Graph/Twitter tags, and exactly one sitemap entry — all
green.

One real, but out-of-scope, gap surfaced: the post does **not** appear on
the static `/blogg` listing page's first page. `src/pages/Blog.tsx`
prerenders only the first `PAGE_SIZE = 6` posts, and `src/lib/posts.ts`
sorts by `date` with day-only granularity (no time-of-day). 57 other posts
in `src/content/blog/*.md` already share this post's `date: 2026-08-09`
value (same-day "Daily blog agent" batches per git log), so among same-date
posts the tie-break falls to `fs.readdir()`'s filesystem order, not any real
recency signal — a pre-existing structural gap in the listing/sort logic
affecting many same-day posts, not something this post's content introduced
or that a single-file content change can fix. Fixing it would mean editing
`src/lib/posts.ts` and/or `src/pages/Blog.tsx` (shared rendering code used
by every post), which this ticket's own scope note explicitly says not to
do, since every SEO branch funnels through shared files like that and
conflicts on merge. Noting it here as a separate, systemic follow-up rather
than acting on it in this change. The individual post page, its SEO
metadata, and its sitemap entry are unaffected and all correct — only its
position on the *listing* page is affected.

The build/SEO agent also hit and self-corrected a `scripts/prerender.mjs`
non-idempotency artifact from running the script twice on an already-built
`dist/` during its own investigation (second run reuses a stale
already-injected homepage body as the template for every route). That is an
artifact of running the shared script twice, not of this change, and does
not occur in the actual single-run build path. Also out of scope per the
"don't touch shared build scripts" rule — noted for the record, not acted
on.

### What I changed after round 2
Nothing in the post content — round 2 confirmed all round-1 fixes and found
no new defect in the file itself. The listing-pagination gap and the
prerender double-run artifact are both pre-existing, systemic, and outside
this ticket's scope (shared files), so neither was touched.
