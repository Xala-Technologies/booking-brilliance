# XAL-1090 Review Log

## Round 1 — Correctness

Lens: does the change do what the acceptance criteria say, including on edge
cases? Read `.agent/XAL-1090/SPEC.md` in full, then the diff
(`git diff origin/main...HEAD`, 2 files: `SPEC.md` and the new post), then
exercised the actual pipeline rather than just eyeballing markdown.

Note on the round's own framing: the task prompt claimed "AGENT-SPEC.md does
NOT exist — step 0 was never finished." That's stale — `.agent/XAL-1090/SPEC.md`
already existed, fully written (content survey, blast radius, mermaid
diagram, no-CLARIFICATION verdict), before this round started. Per
[[project_root_agent_spec_deleted_trap]] the correct location is
`.agent/<ISSUE>/SPEC.md`, not a root `AGENT-SPEC.md` (deleted on purpose,
main 15c7b14). Treated step 0 as already satisfied and did not recreate a
root file. Linear attachment was not attempted:
[[project_no_linear_mcp_tools_available]] confirms no Linear MCP tools are
reachable in this environment.

Checks performed and results:

1. **Frontmatter completeness/correctness** — all required fields present
   (`slug`, `title`, `description`, `date`, `author`, `role`,
   `readingMinutes`, `tag`, `cover`, `keywords`). Slug matches filename.
   `cover` asset (`booking_calendar_hero_no.webp`) exists on disk.
   `readingMinutes: 7` vs. actual 1203-word body (~6 min at 200wpm) — checked
   against the closest sibling post (XAL-1099, 1353 words also claims 7) and
   it's consistent with repo convention, not an outlier.
2. **Description length** — 171 chars, vs. the SPEC's own stated "<160
   chars" target. Checked this against the rest of the corpus:
   `>160` is actually the *norm* across the repo (140+ of ~150 sampled posts
   exceed it, several past 200). Not a real defect — SPEC's own bar was
   aspirational and not something the codebase enforces or that this post
   deviates from. Not fixed; noting so a future round doesn't rediscover it
   as new.
3. **Internal links** — extracted every `/blogg/<slug>` link in the body (6)
   and confirmed each resolves to an existing post's `slug:` frontmatter
   field (not just filename). All 6 resolve. Also checked the two non-blog
   links, `/bookingsystem-kommune` and `/bookingsystem-utleie`, against
   `src/App.tsx`'s route table — both are registered routes.
4. **Markdown well-formedness** — bracket/paren counts balanced (9/9, 9/9),
   bold markers even (16 = 8 pairs), heading levels are all `##` (no stray
   `#` that would create a second H1 alongside the page-level title H1).
5. **Duplicate-content check against the closest sibling** (XAL-1099's
   `bokingsystem-funksjonalitet-admin-paaminnelser-kalender-brukerkontroll.md`,
   flagged in SPEC as closest in shape) — sentence-level set comparison
   (>40-char sentences), zero verbatim overlap.
6. **Title/slug collision check** — `grep` for duplicate `title:` lines
   across all posts: none. Slug uniqueness already covered by the standing
   `post-slugs.test.ts`.
7. **Ran the actual test suite**: `post-slugs.test.ts` and
   `entry-server.main-landmark.test.tsx` — both pass (4/4 tests). The latter
   is the one SPEC flagged as relevant because this post shares its
   `date: 2026-08-11` with several others (tie on sort key); confirmed
   passing, not just theoretically unaffected.
8. **Ran the content.thin gate directly**: `node
   scripts/check-blog-word-count.mjs` — source-only pass, 1203 words well
   above the 200-word floor.
9. **Ran a full production build** (`pnpm build`, ~included
   `optimize-images` + `vite build` + SSR build + `prerender.mjs` +
   word-count check) specifically to catch the class of bug the
   word-count script's own comment warns about: XAL-313's SSR-Suspense-
   fallback race, where a post can have a full markdown source but ship a
   3-word page because SSR baked in only the loading fallback. This is
   exactly the kind of edge case a correctness lens should chase rather than
   trust from source inspection alone. Result: build succeeded, all 327
   posts (up from 326) pass the *rendered*-HTML word-count check, and
   inspected the actual shipped
   `dist/blogg/booking-administrasjon-arbeidsflyt-godkjenning-paaminnelser-regler/index.html`
   directly:
   - exactly one `<h1>`, correct text
   - `<title>`, meta description, canonical URL, `og:image` all correct and
     match frontmatter
   - JSON-LD: `Article` schema (headline/description/dates/author/image/
     articleSection) and a `BreadcrumbList` entry, both correctly populated
     from frontmatter — not empty, not falling back to defaults
   - URL present in `dist/sitemap.xml` (1 match)
10. **Audience/scope match against the ticket** — ticket: "Administratorer i
    kommuner og utleieselskaper søker verktøy for godkjenning, påminnelser og
    regelhåndtering for å redusere no-show og misforståelser." Body has a
    dedicated `##` section for each of the three controls
    (godkjenning/påminnelser/regelhåndtering), a synthesis section
    explicitly arguing the combination — not any one control — is what
    reduces no-show/misforståelser, and both audiences (kommune and
    utleieselskap) are named in the opening paragraph and the closing
    Digilist section (linking to both `/bookingsystem-kommune` and
    `/bookingsystem-utleie`). Matches ticket scope.

**Findings: none that required a code change.** One SPEC-vs-output
discrepancy noted in item 2 above (description length) — investigated,
confirmed it matches established repo convention rather than being a defect,
left as-is, and recorded here so round 2–4 don't re-spend time on it.

**Changes made this round: none.** No fixes were needed; nothing was
committed beyond this REVIEW.md file.
