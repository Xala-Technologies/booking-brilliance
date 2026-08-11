# XAL-1098 — Review log

## Round 1 — Correctness

**Lens**: does the diff do what the acceptance criteria say, on the edge cases too? Checked against `.agent/XAL-1098/SPEC.md` and `git diff origin/main...HEAD`.

What I checked:
- Read every changed file (`Tilgjengelighet.tsx`, `App.tsx`, `Footer.tsx`, `scripts/prerender.mjs`, `src/lib/search/corpus.ts`, `src/entry-server.h1.test.tsx`) against SPEC.md's stated plan — all six matched what was promised, no drive-by scope creep.
- Diffed `Tilgjengelighet.tsx` against its stated template (`Personvern.tsx`) line-by-line for structural parity (SEO props, `<main id="main">`, prose classes, `<Footer />`) — matches exactly.
- Ran the full suite (`npx vitest run`) — 20 files / 41 tests passed, including the new `entry-server.h1.test.tsx` case.
- Ran `npx tsc --noEmit` — clean, no type errors.
- Wrote two throwaway vitest cases calling `render("/tilgjengelighet")` directly (not committed) to inspect the actual SSR HTML output rather than trust the source read:
  - Exactly one `<h1>`, one `<main>`, footer contains `href="/tilgjengelighet"`, page links to `uustatus.no`.
  - `canonical`/`<title>` are `undefined` in the raw `render()` output — confirmed this is *not* a regression by running the identical check against `/personvern` (existing, shipped page): same `undefined`. Per SPEC.md, `scripts/prerender.mjs` injects title/canonical/OG/JSON-LD as a separate post-render step for no-JS crawlers; `entry-server.tsx`'s `render()` alone was never supposed to carry them. Confirmed `node --check scripts/prerender.mjs` passes.
- Checked `src/entry-server.main-landmark.test.tsx` / `heading-outline.test.tsx` — these assert against a fixed, curated set of representative routes (not every route), so the new page not being added to them is not a gap; it's covered by the same template class as `/personvern`, which those tests already exercise.
- Checked the `mailto:kontakt@digilist.no` address against every other usage in the codebase (`BookingsystemKommune.tsx`, `BookingsystemUtleie.tsx`, `PilotInvitationSection.tsx`, `Footer.tsx`) — matches the site-wide contact address exactly, not a typo'd or invented one.

**Found**: one real bug. `Tilgjengelighet.tsx`'s "Hvordan vi tester" list item used markdown-style backticks — `` (som `main` og `nav`) `` — inside plain JSX text. JSX does not interpret markdown, so those backticks were rendering as literal backtick characters in the actual HTML sent to users. Confirmed via the throwaway SSR-render test above (`backtick present: true` before the fix). Ironic spot for a rendering glitch to land, given the page's subject.

**Fixed**: replaced the markdown backticks with `<code>main</code>` and `<code>nav</code>`, matching the existing `<code>` precedent in `src/pages/Transparens.tsx:385`. Re-ran the full suite (41/41 pass) and `tsc --noEmit` (clean) after the fix.

**Not a finding, scope note carried over from SPEC.md**: SPEC.md already scopes out formally registering the erklæring on uustatus.no itself (external government action, no API access) and treats the two sustainability findings as already shipped by XAL-1156. I re-verified both claims are still true on this branch (`nginx.snippet.conf` unchanged by this diff, `grep -rn "nginx.snippet"` still only finds the file itself) rather than re-litigating the decision — this round's job is correctness of what's built, not re-deciding scope that's already documented and justified.
