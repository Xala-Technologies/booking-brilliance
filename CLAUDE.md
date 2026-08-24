# CLAUDE.md

Guidance for Claude Code when working in this repository.

## What this is

`booking-brilliance` is the **marketing site for digilist.no** — a React/Vite
SPA that is prerendered to static HTML at build time and served from nginx on a
Hostinger VPS. It is not the product. The product (the marketplace and the
dashboard) lives in the separate `Digilist` repo and runs on Convex at
`app.digilist.no` / `dashboard.digilist.no`.

So the job here is search, not features. Almost every page is a landing page
whose reason to exist is a Norwegian query somebody types into Google. Two
things follow from that and inform nearly every decision below:

- **Norwegian first.** `nb` is the default locale, all body copy is Norwegian,
  and the English site is a staged, partial mirror — see *The `/en` trap*.
- **The static HTML is the product surface.** Crawlers, AI scrapers and social
  unfurlers read `dist/`, not the hydrated DOM. A thing that only appears after
  JavaScript runs has, for this repo's purposes, not shipped.

The standing growth objective is [`GOALS.md`](GOALS.md) — the measurable
definition of "#1 on SEO, AEO and GEO", the 2026-08-24 baseline, and the known
blockers. Read it before starting SEO work; it will usually tell you what to
work on.

`README.md` is **stale** — it describes React 19, Fastify, Drizzle and Redis,
none of which are here. Trust this file and the code.

## Commands

Package manager is **pnpm** (pinned by `packageManager`, 10.33.4). Node 20.

```bash
pnpm install
pnpm dev                # api (:3001) + vite (:8080) together, via concurrently
pnpm dev:client         # vite only
pnpm dev:api            # node --watch server/index.mjs only

pnpm lint               # eslint .
pnpm typecheck          # tsc --noEmit -p tsconfig.app.json — a RATCHET, see below
pnpm test               # vitest run — src/, infra/ and server/
pnpm exec vitest run src/lib/i18n.test.ts

pnpm build              # optimize-images → vite build → SSR build → prerender → word-count
pnpm preview
```

`pnpm build` is five steps, not one, and the last three are the ones that matter
here: it builds an SSR bundle, runs `scripts/prerender.mjs` to write real HTML
for every route, regenerates `dist/sitemap.xml`, and fails on a thin blog post.
**Any SEO change has to be verified against `dist/`, after a build.** Checking it
in the dev server proves nothing.

Standalone checks, none of them wired into `pnpm test`:

```bash
pnpm check:links            # every internal link against the real route table
pnpm check:english          # Norwegian text leaking into prerendered /en pages
pnpm check:title-lengths    # blog titles vs the ~65-char limit (informational)
pnpm content:guard          # blog slugs colliding with standing 301s
```

CI: `pr-check.yml` runs lint + test + build on every PR; `lint-main.yml` lints
direct pushes to main (the nightly blog runner commits straight to main and
bypasses the PR gate); `deploy.yml` runs `deploy.sh` on every push to main.
**Deploys are automatic on merge.** Do not run `deploy.sh` by hand, and do not
commit or push unless you were asked to.

## `tools/` is dead — do not work in it

`tools/content-agent`, `tools/knowledge-agent`, `tools/improvements-agent` and
`tools/site-intelligence` are the **previous generation** of the SEO/content
agents. They were superseded by the `@xaheen/growth-fleet` package
(`/Users/ibrahim/Projects/Internal/growth-fleet`) and nothing has touched them
since 2026-07-14. An agent that starts reading or editing `tools/` is working on
code that does not run.

Two traps that make it look alive:

- **`package.json` still has scripts that call it.** `audit:*`, `content:*`,
  `improvements:*` shell out to `xala-agents`, a binary that **is not installed**
  in this repo — `node_modules/.bin` has no `xala-agents` and no `growth`. Those
  scripts fail immediately. They are leftovers, not a workflow.
- **`convex/schema.ts` is explicitly modelled on it** ("mirroring
  `tools/content-agent/src/db.ts`"). The Convex tables are live; the SQLite code
  they were copied from is not.

If content or SEO automation is genuinely the task, it belongs in growth-fleet,
not here. Which brings us to the reason this file exists at all.

## Two SEO systems that cannot see each other

This is the standing structural problem, and it is worth knowing before you are
asked to "add SEO tracking" to anything.

```
(a)  digilist-observability collectors  →  growth.* Postgres  →  Grafana
(b)  growth-fleet's 11 agents           →  .xaheen/seo/*.json →  Convex
```

Neither reads the other. A `xaheen.config.json` now exists at the repo root, so
`core/host.ts` — which walks up from `cwd` looking for exactly that file — can
resolve this project. That is the *only* half that has landed: there is still no
`.xaheen/` directory, no agent has run here, and nothing writes to
`growth.agent_runs` / `growth.agent_findings`. So the agents still cannot read
`GOALS.md`'s targets out of `growth.goals`, and still cannot put findings
anywhere the dashboards can see them.

`growth.agent_runs` / `growth.agent_findings`
(`digilist-observability/collectors/migrations/005_agent_findings.sql`) exist as
the seam for closing this. Finishing the install is a deliberate, separate piece
of work — do not half-start the rest of it by creating a `.xaheen/` directory as
a side effect of something else.

## The `/en` trap — robots.txt and `TRANSLATED_PATHS`

Read this before touching routing, i18n, or `public/robots.txt`.

Every route is mirrored under `/en`, but only 26 paths have English copy
written. The rest **render the Norwegian components at an English URL**, which
Google files as duplicate content against the Norwegian original — the page that
actually ranks. So the untranslated mirror must not be indexed.

`TRANSLATED_PATHS` in `src/lib/i18n.ts` is the one hand-maintained list. It
drives hreflang emission, the language switcher, and — via `isIndexableEnglish`
— whether a page prerenders `index, follow` or `noindex, follow` with a
canonical to the Norwegian original.

**`public/robots.txt` deliberately carries NO `/en` rule.** It used to carry
`Disallow: /en/` plus one `$`-anchored `Allow:` per translated path, and that
failed in both directions at once:

- `Disallow` does not de-index a URL — it blocks the *crawler*, so the URL stays
  indexed as a title-less, snippet-less listing at a structural 0% CTR.
  `/en/leie/kontorlokaler` was our single largest impression source (753
  impressions in 28 days) and earned zero clicks for exactly this reason. Worse,
  a page Google may not fetch is a page whose `noindex` Google can never read,
  so the URL could not be cleanly removed either. Blocking and de-indexing are
  not the same instruction, and you cannot do the second through the first.
- `$` anchors an `Allow` to one exact URL, so `Allow: /en/blogg$` never matched
  `/en/blogg/<slug>`. Both real English articles were blocked while
  `sitemap.xml` asked Google to index them.

The rule now: **a page we want out of the index must be crawlable and carry
`noindex` itself.** `scripts/prerender.mjs` writes a static file for every `/en`
URL, so nothing falls through to the SPA shell any more — which is the thing
that made a robots-level block look necessary in the first place. Real English
copy gets `index, follow`, a self-canonical and hreflang; every untranslated
mirror gets a `noindex, follow` stub canonical to the Norwegian original. Where
`server/nginx.snippet.conf` is deployed those stubs become 301s instead, and an
`/en` path with no file at all is a 404.

`src/lib/robots-staging.test.ts` enforces the invariant that replaced the list:
no rule in `robots.txt` may block a `/en` page that `dist/` prerenders — neither
an indexable one (it would never rank) nor a `noindex` one (it would be trapped
in the index). It also pins `sitemap.xml` against the prerendered output in both
directions. Its dist-dependent half is skipped on a clean checkout, so build
before you trust a pass.

**Adding a page to `TRANSLATED_PATHS` is the last step of translating it, not the
first.** The order is: write the English copy → add the path → `pnpm build` →
`pnpm exec vitest run src/lib/robots-staging.test.ts`. There is no `Allow` line
to add any more, and no `Disallow` to keep in step — do not re-add either.

## Directory map

```
src/
  App.tsx            the route table — ~97 routes, mounted twice (at / and /en)
  entry-server.tsx   SSR entry; renders each route to a string for the prerender
  pages/             one file per route. Norwegian filenames match the URLs
  pages/admin/       /admin/intelligence/* — internal dashboards, Convex-backed
  components/        section components + components/ui (shadcn primitives)
  content/           page copy as data + blog/ (370 markdown posts)
  lib/               i18n.ts, copy.ts, posts.ts, lazyRoute.ts, search/, chatbot/
  integrations/      Supabase and friends

scripts/             the build pipeline and the standalone checks (plain .mjs/.ts)
  prerender.mjs      3.5k lines. Writes per-route HTML, JSON-LD and sitemap.xml
build-plugins/       blogMetaPlugin — blog frontmatter at build time
server/              digilist-api: zero-dependency Node service, /api/chat + /api/inquiry
convex/              content/SEO/audit tables consumed by /admin/intelligence/*
infra/               nginx, certbot, security headers, sla-watchdog (shell + conf)
apps/docs/           a separate Astro docs site
public/              robots.txt, sitemap.xml, llms.txt, images, fonts
tools/               DEAD — see above
```

Import alias: `@/` → `src/`, defined in **both** `vite.config.ts` and
`vitest.config.ts`. Change one, change both.

## Conventions that are load-bearing

- **Copy lives outside components.** `src/lib/copy.ts` holds chrome strings
  (nav, footer, consent, chat widget) keyed per locale, with keys named for
  *meaning* rather than for the Norwegian words. Page body prose is **not** put
  through that table — an article forced through a key-value dictionary reads as
  machine-made. Long-form pages get twin files instead (`faq.ts` / `faq.en.ts`).
- **No raw Norwegian in a user-visible JSX attribute of a bilingual component.**
  `aria-label`, `placeholder`, `alt`, `title` are invisible to `check:english`
  (it reads text nodes in `dist/`), which is how a screen-reader user on the
  English site ended up hearing Norwegian while every check passed.
  `src/lib/no-norwegian-literals.test.ts` guards it.
- **Every route except the homepage is lazy**, via `lazyRoute` from
  `src/lib/lazyRoute.ts` — not bare `React.lazy`. It recovers a tab that
  outlived a deploy and is asking for chunk names the current release no longer
  serves; bare `React.lazy` let that rejection reach the root and blank the page.
- **`pnpm typecheck` is a ratchet, not a gate.** Pre-existing errors are counted
  per file in `ts-baseline.json` and enforced by `src/lib/typecheck.test.ts`.
  Lowering a number is always welcome; the count may only go down. `pnpm build`
  is Vite, which strips types without checking them, so this test is the only
  thing running `tsc`.
- **A "we removed X" claim gets a test, not a grep.** `no-react-query.test.ts`
  and `no-toaster.test.ts` exist because the provider was deleted as dead
  weight, and a single reintroduced `useQuery()` or `toast()` call would
  white-screen or silently no-op on whatever lazy route used it — invisible from
  a homepage smoke test. Follow the pattern when you remove something global.
- **`<source type="image/webp">` that 404s renders broken and does not fall back
  to the `<img>`.** The webp siblings are generated and committed by
  `scripts/optimize-images.mjs`; `webp-sources.test.ts` asserts every path the
  components would emit already exists on disk.
- **`server/` is plain ESM with zero dependencies** because it is rsynced to the
  VPS as loose files and run by bare `node` — no build, no `node_modules`, no
  tsx. It is nonetheless tested here (`server/**/*.test.mjs` is in the vitest
  include list), as is `infra/`, because nothing else reads shell and nginx conf
  and a broken deploy script or a CSP that blocks the site's own search would
  otherwise ship green.
- **Blog posts are `.md` under `src/content/blog/` and deploy on push.**
  `deploy.yml` deliberately does *not* ignore `**/*.md`; ignoring them once meant
  a whole day of generated posts silently never went live. A new slug must also
  survive `pnpm content:guard`, which probes it against the standing 301
  consolidation redirects that live in nginx on the VPS (not in this repo) and
  quarantines a post whose slug was already merged away.

## Things that have actually gone wrong

Not hypotheticals. Each of these is why a test or a comment exists.

- **A 200 does not mean a route exists.** Unknown paths fall through to the SPA
  shell, which renders NotFound client-side. `/en/blog` sat broken in the English
  nav through every curl-based check — the server redirect worked, the in-app
  `<Link>` did not. Only `check:links`, which reads the route table, can tell
  them apart.
- **`renderToString` renders Suspense fallbacks, not content.** Blog posts and
  `/transparens` shipped with an empty `<div id="root">`, no `<h1>` and no
  `<main>` in the HTML a non-JS crawler sees. The prerender loop now retries
  until React's unresolved-boundary marker is gone, and **throws** past a
  deadline rather than shipping the shell — byte-equality between passes is a
  false "settled" signal, because a pending boundary renders identical fallback
  HTML every time.
- **A 900-word markdown file can ship as a 3-word page.** `check-blog-word-count`
  therefore counts words in the built `dist/blogg/<slug>/index.html`, not in the
  source; the markdown check underneath it is only a cheap floor.
- **`check:english` has two blind spots** and both were found in production: it
  reads `dist/`, so it cannot see anything rendered from fetched data
  (`/transparens` reported 26/0 while the live page carried 22 Norwegian
  strings), and it reads text nodes, so attributes are invisible to it. A clean
  run is necessary, not sufficient.
- **A duplicate key in `copy.ts` silently wins.** Two components shared
  `pilot.cta` with different meanings, so one was rendering the other's button
  label. That was one of the 26 type errors that had accumulated while `tsc` had
  never once run in CI.
- **main was never lint-gated**, which is how ~50 lint errors accumulated
  unnoticed. `lint-main.yml` exists because the blog runner pushes straight to
  main.

## Where the other repos are

| Repo | What |
|---|---|
| `/Users/ibrahim/Projects/Internal/Digilist` | the actual product — Convex, marketplace, dashboard |
| `/Users/ibrahim/Projects/Internal/digilist-observability` | growth collectors, `growth.*` Postgres, Grafana dashboards (uid `digilist-goals` is the goal burn-down) |
| `/Users/ibrahim/Projects/Internal/growth-fleet` | `@xaheen/growth-fleet`, the 11 SEO/content agents. **Read-only** unless told otherwise |
