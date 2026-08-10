# XAL-1161 — Adversarial Review Log

## Round 1 — Correctness

**Lens:** does the change do what the acceptance criteria say, on the edge
cases too? Read `.agent/XAL-1161/SPEC.md`, then
`git diff origin/main...HEAD`, then the tests, then traced every consumer of
the touched fields by hand (not just re-trusting SPEC's claims).

**Checked:**

- Frontmatter fix (`lastUpdated` → `updated`): grepped both parsers
  (`src/lib/blogFrontmatter.ts:72-73`, `scripts/prerender.mjs:203` and its
  `dateModified: post.updated || post.date` use at line 2507) — both read
  `updated`, neither ever read `lastUpdated`. The fix is real, not cosmetic.
- Three new/changed link targets (`/bruksomrader/idrettshaller-gymsaler`,
  `/bruksomrader/moterom`, `/bookingsystem-utleie`) — confirmed all three are
  live `<Route>`s in `src/App.tsx:305,378-379`.
- New "I korte trekk" bullet claims cross-checked against the article body
  for internal consistency: "under 2 uker" (body line 53, same number),
  "15+ utleiere og kommuner" (body line 31, "over 15"), "eneste av de fire
  med ID-porten" (comparison table, cols confirm Digilist=Ja, Airbnb/Hygglo/
  norgesbooking.no=Nei) — no contradictions.
- `faqQuestion`/`faqAnswer` frontmatter fields vs. the actual FAQPage JSON-LD
  source (`blogFaq.mjs`): confirmed unchanged, still matches; SPEC's claim
  that these two frontmatter fields are cosmetic dead weight verified
  independently (not just trusted).
- Markdown structural risk: new content uses `**bold**` lead-ins, a bullet
  list, two inline links, and a standalone link-paragraph CTA. Renderer is
  `react-markdown` + `remark-gfm` (`BlogPost.tsx:2-3`) — all standard,
  supported syntax. The in-article TOC extractor
  (`BlogPost.tsx:67, regex ^##\s+`) only matches real `##` headings, so the
  new `**I korte trekk:**` bold line can't leak into the TOC — verified by
  reading the regex, not assumed.
- Title/meta length: new title is 65 chars, new description 148 chars.
  Sampled length across the full `src/content/blog/*.md` corpus (240+
  files) — the vast majority already run 60-90 char titles and 140-210 char
  descriptions, so this is consistent with the site's existing convention,
  not a regression against it.
- Test suite: targeted (`blogFaq.test.ts`, `entry-server.h1.test.tsx`) and
  full (`npx vitest run`) — 17 files / 36 tests, all green. `npx tsc
  --noEmit` — clean. Confirmed neither `entry-server.h1.test.tsx` nor
  `blog-xal739-aeo.test.ts` hardcodes this post's old title/slug (they pin
  different posts), so the title rewrite can't have silently broken a
  pinned assertion elsewhere.
- Scope: diff touches only the one `.md` file plus `.agent/`/`AGENT-GOAL.md`
  scaffolding — no edits to `scripts/prerender.mjs`, `src/entry-server.tsx`,
  or `pnpm-workspace.yaml`, matching the ticket's explicit "minimal and
  conflict-free" constraint.

**Findings: none.** Every claim in SPEC.md's "WHAT CHANGES" and "BLAST
RADIUS" sections was re-derived independently from the code (not just
re-read from the SPEC) and held up. No correctness defects found this
round.

**Changes made this round:** none — nothing to fix.
