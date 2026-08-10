# XAL-1134 — Adversarial review log

## Round 1 (correctness)

Lens: does the change do what the acceptance criteria say, on the edge
cases too? Checked the ticket's ask against the SPEC and the actual diff
(`git diff origin/main...HEAD`), then re-ran the pipeline myself rather than
trusting the prior session's claims.

Ticket ask, checked point by point:
- "Write and publish SEO content for Spesialiserte idrettssteder (tennis,
  bowling, basketball, gym)" — one new post added, all four sport types
  covered with dedicated per-type requirements (tennisbane dekketype,
  bowlinghall baneantall/utstyr, basketballbane inne/ute/banestørrelse,
  gym-utstyr). Keyword sweep: tennis 18, bowling 14, basketball 15, gym 12
  hits.
- "Idrettslag og privatpersoner søker booking ... for turnering og trening —
  nisjebehov med regelmessig etterspørsel" — post opens with a 3-persona
  vignette (turnering, fast trening, privatperson enkelttime) and has a
  dedicated "Turnering og fast trening stiller ulike krav" section
  contrasting the two booking patterns, plus the "regelmessig etterspørsel"
  framing in the opening/closing. idrettslag 4, privatperson 9, turnering
  14, trening 10 hits.
- "Goal: satisfy search intent for 'spesialiserte'" — in the title, meta
  description, first sentence of the body, and a whole H2 dedicated to what
  "spesialisert" means vs. a generic idrettshall. spesialiserte 9 hits.
- "Blog post itself must be in Norwegian Bokmål" — read the full body,
  Bokmål throughout, no bokmål/nynorsk mixing spotted.

Edge cases / pipeline gates, re-verified live in this checkout (not just
trusted from SPEC.md):
- `node scripts/check-title-lengths.mjs` → `ok 56` for this slug.
- Word count computed directly from the frontmatter-stripped body → 1076
  words, well over the 200-word gate.
- `npx vitest run` → 20 files / 40 tests pass, including the SSR
  `<h1>`/`<main>`-landmark invariant tests that generically cover every
  blog post route.
- `node scripts/guard-blog-redirects.mjs --check --all` → this slug not
  claimed by any standing redirect (`✓ ... → HTTP 200`). Note: `--check`
  alone (no `--all`) reports "0 posts to check" once everything is already
  committed, because it diffs `git status --porcelain`, not `HEAD` vs.
  `origin/main` — that's expected script behavior, not a bug, but worth
  remembering for later rounds so it isn't mistaken for "the guard didn't
  run."
- Cover image `public/images/blog/sanntidskalender_hero_no.webp` exists.
  Internal link target `idrettshall-ledige-tider-per-banetype-lag-foreninger.md`
  exists. Slug is unique across `src/content/blog/*.md`. All frontmatter
  fields match `BlogFrontmatter` in `src/lib/blogFrontmatter.ts`.

Finding — scope creep, confirmed and fixed:
- `pnpm-workspace.yaml` gained an `allowBuilds` block (`@swc/core`,
  better-sqlite3, esbuild, sharp) in the `bd003e2` checkpoint commit. This
  is a side effect of running `pnpm approve-builds --all` during a prior
  session's local verification, swept into the commit by accident — it has
  nothing to do with this content ticket. The exact same class of mistake
  was already caught and reverted in three sibling branches (XAL-1142
  round 4 `665e144`, XAL-1163 round 4 `426226d`, XAL-1166 round 1
  `36b2359`), so this isn't a judgment call, it's a known, established
  correction. Reverted `pnpm-workspace.yaml` back to the `origin/main`
  version in this round; `npx vitest run` still 20/20 files, 40/40 tests
  after the revert.

No other correctness issues found this round.
