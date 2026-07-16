# XAL-336: [marketing] [SEO error] h1.missing — /blogg/hvor-booke-idrettshall-kommune

> Auto-prepared by Digilist Improvements Agent. Run Claude in this worktree:
> `/loop Fiks SEO-problemet på https://digilist.no/blogg/hvor-booke-idrettshall-kommune (marketing): No <h1> on page. Verifiser med seo-crawler etter endring.`

## Implementation contract — complete this before writing code
- **Problem:** Fiks SEO-problemet på https://digilist.no/blogg/hvor-booke-idrettshall-kommune (marketing): No <h1> on page. Verifiser med seo-crawler etter endring.
- **Business objective:** The SEO crawler flags pages with no `<h1>` as a ranking/accessibility risk. Fixing it keeps organic search visibility intact for this blog post and prevents the same defect recurring on future posts.
- **Repository / branch:** `/root/booking-brilliance` @ `agent/xal-336-marketing-seo-error-h1-missing-blogg-hvor-booke-`
- **Scope:** Root cause: `scripts/prerender.mjs` prerenders each route via `src/entry-server.tsx`'s `render()`, which used a `renderToString` + fixed 5-pass retry loop to let `React.lazy`-loaded route chunks (e.g. `BlogPost`) resolve before capturing HTML. That retry count was insufficient/racy — reproducibly, the first several `/blogg/:slug` routes processed in a clean build (this post included) got captured before their lazy chunk resolved, shipping a static page with an empty `<div id="root">` and therefore no `<h1>`. Replaced the polling loop with `renderToPipeableStream`'s `onAllReady` callback, which deterministically waits for every Suspense boundary (including the lazy import) to resolve before the HTML is read.
- **Out of scope:** No changes to `BlogPost.tsx`, the blog content file, or any other prerendered route's markup — they already render an `<h1>` correctly once given real content. No dependency bump, no refactor of `prerender.mjs` beyond what's needed, no touching the unrelated pre-existing lint errors in other files.
- **Acceptance criteria:** A clean `pnpm build` deterministically produces a `dist/blogg/hvor-booke-idrettshall-kommune/index.html` containing exactly one `<h1>` with the post title, verified by fetching the static file with a cheerio-based check (same static-HTML-only parsing the seo-crawler uses) across repeated clean builds.
- **Architecture constraints:** Keep `render()`'s public signature (`(url: string) => Promise<string>`) unchanged since `scripts/prerender.mjs` depends on it; stay within Node's `react-dom/server` SSR APIs already used by this file.
- **Files likely affected:** `src/entry-server.tsx` only.
- **Testing requirements:** `npx tsc --noEmit` clean; `pnpm lint` shows no new errors (pre-existing 23 errors/17 warnings unchanged); `pnpm vitest run` green; 3x clean `pnpm build` runs each show 0/84 prerendered pages missing `<h1>` (previously ~8 blog posts intermittently missing it); manual seo-crawler-style fetch+cheerio check of the target URL confirms 1 `<h1>` with correct text.
- **Security considerations:** None — build-time-only SSR change, no user input, no new dependencies.
- **Rollback strategy:** Revert the single commit touching `src/entry-server.tsx`; no data migrations or deploys to unwind.
- **Definition of done:** compiled · tests green · acceptance demonstrated with evidence · one reviewable change · no attribution

## Delivery rules
- One issue → one branch (`agent/xal-336-marketing-seo-error-h1-missing-blogg-hvor-booke-`) → one independently reviewable change. Never main.
- Smallest valid change. No opportunistic refactoring, no broad formatting changes, no hidden dependency on another open PR.
- Validation is mandatory and staged — "code written" ≠ "compiled" ≠ "tests passed" ≠ "acceptance demonstrated". Collect evidence (test output / logs) before opening the PR.
- If scope expands beyond "Files likely affected", or the change grows large, STOP and escalate ("BLOCKED:") rather than pressing on.
- Open a PR only when green (otherwise a draft PR with a note). Delete this file before opening the PR.

Linear: https://linear.app/xala-technologies/issue/XAL-336/marketing-seo-error-h1missing-blogghvor-booke-idrettshall-kommune
