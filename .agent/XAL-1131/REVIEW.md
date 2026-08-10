# XAL-1131 Review Log

## Round 1 — Correctness

**Lens:** Does the change do what the acceptance criteria in SPEC.md say, including edge cases? Checked: (1) the deliverable actually lands as committed history, not just working-tree state, since a fresh session next round can only see what's on disk/in git; (2) the blog post content matches the persona/angle the ticket asked for (caterer/mattjeneste/privatperson/bedrift, kjøkkenfasiliteter as a graded spec, non-wedding); (3) every gate SPEC.md claims was run actually passes when re-run independently in this session; (4) internal links and frontmatter resolve to real routes/files.

**Findings:**

1. **Critical — the prior round's commit was empty.** `git show 8179744` (`chore(XAL-1131): Content gap: Catering og Servering`) has zero diff. Both `.agent/XAL-1131/SPEC.md` and the new blog post existed only as *staged* changes in the working tree, never actually committed. SPEC.md's own text claims "it's committed to the branch instead so the review phase carries the same evidence an attachment would" — that claim was false at the time it was written. Since the next phase runs in a fresh session that can only see what's on disk/in git history, an empty commit followed by an uncommitted working tree is indistinguishable from lost work if anything (e.g. a container restart) reset the working tree without preserving staged-but-uncommitted state.
   **Fix:** committed the staged files (`SPEC.md`, the blog post) in a new commit on top of the empty one, rather than amending, per the git safety protocol (prefer new commits over amend). Left `pnpm-workspace.yaml`'s local `allowBuilds` change out of the commit — it's a local `pnpm approve-builds --all` artifact, not part of this ticket's content (confirmed: absent from both `fb235b4` and `origin/main`'s copy of the file), per [[project_pnpm_build_needs_approve_builds]].

**Verified correct (no changes needed):**

- No-wedding-angle constraint: `grep -in "bryllup"` over the new post → zero hits. Persona coverage (caterer, privatperson 50-årsdag, bedrift julebord) and all three ticket-named anledninger (bursdag, bedriftsfest, høytid) are present in the body.
- Kjøkkenfasiliteter is graded across three tiers (storhusholdningskjøkken / enklere serveringskjøkken / kjøkkenkrok) as the ticket implied, not treated as yes/no.
- Both booking models the ticket names (fast servering vs. selv-bestilt/frittstående catering) are covered, plus selvcatering as a documented third variant.
- Internal links resolve to real targets: `/tjenester/catering` is a live route (`src/App.tsx:344`), `/blogg/leie-utstyr-til-fest-telt-bord-lyd-servering` is a real sibling post file, cover image `public/images/blog/en_plattform_hero_no.webp` exists on disk.
- `SOLUTION_PAGES` auto-linker in `src/pages/BlogPost.tsx` legitimately matches `/bruksomrader/selskapslokaler` via `/fest/i` (slug contains "bedriftsfest") — confirmed by reading the regex directly, not just trusting SPEC.md's claim.
- Frontmatter parses correctly under `src/lib/blogFrontmatter.ts`'s regex-based parser: title's internal colon doesn't truncate the value (value capture is greedy to end-of-line), `keywords` array and `readingMinutes: 7` int both parse as expected types.
- Re-ran every gate SPEC.md claims, independently, this session (not trusting the prior round's output):
  - `node scripts/check-title-lengths.mjs` → `ok 57 catering-servering-lokale-med-kjokken-bursdag-bedriftsfest.md`
  - `node scripts/guard-blog-redirects.mjs --check` → `✓ /blogg/catering-servering-lokale-med-kjokken-bursdag-bedriftsfest → HTTP 200`, no redirect collision
  - `npx vitest run` → 20 test files / 40 tests, all passed, including the slug-uniqueness test and the generic SSR `<h1>`/`<main>`-landmark invariants
  - Word count of the body (frontmatter stripped): 1003 words, well over the 200-word gate
- Minor, non-actionable: SPEC.md states the title is 48 chars and the description is 213 chars; actual values are 46 and 209. Cosmetic inaccuracies in the spec's prose, not in the shipped content — both are still well under their respective limits either way, so no fix applied.

## Round 2 — Regression

**Lens:** what ELSE reads the blog-content pipeline besides the files SPEC.md's blast-radius section already named — grepped every consumer of `content/blog`, `virtual:blog-meta`, `getAllPosts`, `BlogPost` across `src/`, `scripts/`, `build-plugins/` (not just the files this branch touched), and checked whether any of them depend on assumptions this new post could violate.

**Consumers checked beyond SPEC.md's list:**

- `public/sitemap.xml` — a static, stale 19-URL placeholder checked into the repo (dated May–July 2026). Confirmed it is NOT what ships: `scripts/prerender.mjs:2599-2706` regenerates the real `dist/sitemap.xml` from `posts.map(...)` with no date filter, so the new post is included automatically (`pnpm build` output: "✓ /sitemap.xml regenerated (402 URLs)"). Pre-existing repo structure, unrelated to this diff.
- `src/components/BlogPreviewSection.tsx` (`getAllPosts().slice(0, 6)`, homepage "latest posts" widget) — the new post is dated 2026-08-10 (today), so it becomes the new #1 entry, pushing the prior 6th post off the homepage strip. This is the intended behavior of a dated content system, not a regression.
- `src/pages/Blog.tsx`, `src/lib/search/corpus.ts` (sitewide search, reads through `getAllPosts()`), `src/vite-env.d.ts` (`virtual:blog-meta` type decl) — all generic, glob-driven, no per-post allowlist to update. Nothing depends on the prior post count (317) or the absence of a "catering" post.
- `scripts/dedup-blog-drafts.ts` — one-off Convex draft-cleanup script, operates on Convex draft records, not on `src/content/blog/*.md`; not a consumer of this file.

**Finding — critical, fixed: the new post's closing CTA paragraph was silently deleted by an existing stripper.**

`src/pages/BlogPost.tsx:118-127` strips trailing "book a demo" paragraph(s) from every post body, because the article page already renders its own "NESTE STEG" CTA band (`BlogPost.tsx:411`) below the content — an in-body CTA at the very end would be a duplicate. The strip is keyed by `isCta()`, which matches `/\[book\s+(?:en\s+)?demo/i` anywhere in the paragraph, not just paragraphs that are *only* a CTA.

The new post's final paragraph (under "## Book lokale og catering samlet, uten gjetting om kjøkkenet") mixed a substantive closing summary with an inline `[Book en demo](https://digilist.no/demo)` link mid-sentence. Since it was the last paragraph and matched `isCta()`, the entire paragraph — summary and all — was silently deleted at render time, confirmed directly in a real `pnpm build`: the prerendered `dist/blogg/.../index.html` showed the closing `<h2>` immediately followed by the sidebar `<aside>`, with zero body text under that heading.

This code path is not new — the same stripper already truncates a pre-existing, unrelated post the same way (`src/content/blog/hva-er-et-forsamlingslokale.md`'s last paragraph also matches `isCta()` and is stripped in production today). That's a latent bug predating this branch; fixing it generically (e.g. only stripping paragraphs that are *purely* a CTA) would touch shared code and every other post's rendering, out of scope for a content-only ticket. What *is* in scope: my own post shouldn't lose content to it.

**Fix:** removed the inline `[Book en demo](...)` link from the post's closing paragraph (the CTA band directly below the article already provides that link, so it was redundant, per the existing code's own stated intent). Re-ran `pnpm build`: the closing paragraph now renders under its heading in `dist/blogg/catering-servering-lokale-med-kjokken-bursdag-bedriftsfest/index.html`, word-count gate still holds ("✓ All 318 blog posts render at least 200 words"), and `npx vitest run` still passes 20/20 files, 40/40 tests.

**Verified correct (no changes needed):**

- `readingMinutes: 7` in frontmatter vs. the "5 min lesetid" `BlogPost.tsx` actually renders (computed independently from `post.content.length / 200`, not from frontmatter) — a pre-existing, corpus-wide discrepancy between the frontmatter field (used only by `BlogPreviewSection.tsx`'s homepage cards) and the per-page live computation. Not introduced by this branch, not worth a special-case fix here.
- `pnpm-workspace.yaml`'s `allowBuilds` block, present in this branch's diff since the `3aa1265` checkpoint commit — a local `pnpm approve-builds --all` artifact needed to build in this environment at all ([[feedback_pnpm_build_needs_approve_builds]]), not scope creep tied to the content change.
