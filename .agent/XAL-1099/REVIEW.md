# XAL-1099 — Review log

## Round 1 — CORRECTNESS

Lens: does the diff do what the acceptance criteria say, on the edge cases
too? Checked SPEC.md against `git diff origin/main...HEAD`, then read the
new post body in full, then ran the tests that touch blog content.

### What I checked

- Frontmatter shape against `src/lib/blogFrontmatter.ts` (`parseFrontmatter`
  / `extractFrontmatter`): all required fields present, `keywords` as a
  bracketed array parses correctly, `date` parses to ISO.
- Frontmatter shape against `scripts/prerender.mjs` `loadBlogPosts()`'s
  separate regex parser (used for `<title>`/meta/Article JSON-LD at build
  time): title with an embedded colon inside the quoted value still parses
  correctly (`[^"]+` doesn't care about colons, only quotes); date, author,
  tag, cover all extract cleanly.
- `description` length: 151 chars, under the ~160-char truncation point
  pinned by `src/lib/digitalt-bookingsystem-description.test.ts`'s pattern.
- `tag: "IT-leder"` — free-form string (not an enforced enum), and matches
  an existing convention used 26 times across other posts.
- All four cross-linked slugs
  (`bookingsystem-integrasjoner-kalender-epost-notifikasjoner`,
  `endre-kansellere-booking-selv-paaminnelser`,
  `sanntidskalender-kommunal-booking`, `brukerstyring-og-tilgangskontroll`)
  and both linked pages (`/bookingsystem-kommune`, `/bookingsystem-utleie`,
  both registered routes in `src/App.tsx`) resolve to real files/routes —
  no dead links.
- Cover image (`digital_booking_importance_hero_no.webp`) exists in
  `public/images/blog/`, reused as the SPEC said (no new asset).
- Body uses `##` headings only (no bare `# H1`), matching the sibling-post
  convention where `post.title` renders the page's H1 separately
  (`BlogPost.tsx:200`) — avoids the duplicate/missing-H1 class of bug this
  repo has hit before.
- `readingMinutes: 7` vs actual body word count (1353 words / ~200wpm ≈
  6.8 min) — consistent, not a stale guess.
- Target keyword "bokingsystem" (one *b*) appears in the title, the first
  sentence, and the keywords array — satisfies the stated search-intent
  goal.
- Ran `post-slugs.test.ts` and `blogFaq.test.ts` — both pass; no slug
  collision.

### Findings

1. **Scope creep: `pnpm-workspace.yaml` was modified and committed, but
   this is a content-only ticket.** The wip checkpoint commit (`079e35a`)
   added an `allowBuilds` block (`@swc/core`, `better-sqlite3`, `esbuild`,
   `sharp`) that isn't present on `origin/main` and has nothing to do with
   the blog post. It's a local-environment byproduct (running
   `pnpm approve-builds --all`, see memory note on this repo needing that
   before `pnpm build`) that got swept into a commit instead of staying
   local. SPEC.md's own "WHAT CHANGES" section says "No code changes —
   this is a content-only addition," so this contradicts the plan of
   record. **Fixed**: reverted `pnpm-workspace.yaml` to match
   `origin/main`.

2. **SPEC.md drift: the "WHAT CHANGES" section claims the post body
   "includes one mermaid diagram of the admin-configuration →
   adoption-outcome relationship," but the shipped post has no mermaid
   block.** Checked why: `BlogPost.tsx` renders body markdown through
   `ReactMarkdown` with only `remarkGfm` (`BlogPost.tsx:2-3, 231-235`) — no
   mermaid plugin anywhere in the repo (`grep -l '```mermaid'
   src/content/blog/*.md` → zero other posts use it either). A ```mermaid
   fenced block in the post body would render as an inert code listing, not
   a diagram — so *not* putting it there was the right call; the diagram
   that exists is in SPEC.md's own BLAST RADIUS section, documenting the
   pipeline, not the post. But the SPEC sentence itself is now a false
   claim about what got shipped, which will mislead the next
   session/reviewer reading it as the record. **Fixed**: corrected that
   sentence in SPEC.md to state the diagram is architecture documentation
   in SPEC.md, not post content, and say why (no mermaid renderer wired
   up).

No correctness defects found in the post content itself — frontmatter,
links, word count vs. reading time, and SEO keyword placement all check
out. Both findings above are about the diff carrying things the SPEC didn't
actually authorize (an unrelated infra file) or no longer accurately
describes (the mermaid claim), not about the article being wrong.
