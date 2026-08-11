# XAL-1098 — `/`: 2 domains affected (brand, sustainability)

Ticket findings:
- [brand] Publish a tilgjengelighetserklæring (uustatus.no) and link it in the footer.
- [sustainability] Reduce inlined markup/data, defer non-critical content, and ensure server compression.
- [sustainability] Set an appropriate Cache-Control (with revalidation) on cacheable responses.

## CLARIFICATION on the two sustainability findings

Both sustainability bullets are **word-for-word identical** to two of the four
findings already fixed by **XAL-1156** (`chore(XAL-1156): /: 2 domains
affected (performance, sustainability)`, merged to `main` in `a0c884a` /
PR #246, well before this branch's base `d5a3c5f`):

- `server/nginx.snippet.conf` already has a `gzip on` block (text/plain,
  text/css, text/xml, application/json, application/javascript,
  application/xml+rss, application/atom+xml, application/manifest+json,
  image/svg+xml — verified by reading the file on this branch) — this is the
  "ensure server compression" finding.
- The same file already has three `Cache-Control` locations: `/assets/`
  (`public, max-age=31536000, immutable` — Vite content-hashes these),
  `/fonts/` (`public, max-age=86400, must-revalidate` — fixed filenames, must
  NOT be immutable), and a non-hashed-static-file catch-all
  (png/jpg/jpeg/webp/avif/svg/ico/webmanifest/mp4/webm, same
  `must-revalidate`, 1d) — this is the "Cache-Control with revalidation on
  cacheable responses" finding.
- XAL-1156's own SPEC.md also names the "reduce inlined markup/defer
  non-critical content" half of the finding and fixes it with the
  `MobileMenu.tsx` `/logo.svg` → `/logo-64.webp` swap (108KB removed from
  every page load) — already merged too.

`server/nginx.snippet.conf` is a manually-applied ops doc (confirmed again
here: `grep -rln "nginx.snippet"` still finds only the file itself and prose
references — no script reads it), so whether the *live* digilist.no nginx
has actually been reloaded with this content is unverifiable from the repo
and is an ops/deploy step, not a code gap. But there is nothing left to
*change in this repo* for either sustainability finding — the code-level fix
already shipped. Treating this as a stale/duplicate crawl (same pattern as
memory: [security header findings need deploy, not code]) and not touching
`nginx.snippet.conf` again here to avoid a no-op diff.

## WHAT THIS IS (the one real, unaddressed finding)

The **brand** finding is genuine and not a duplicate of anything already
shipped: `digilist.no` has no tilgjengelighetserklæring (accessibility
statement) page, and no footer link to one — confirmed by reading
`src/components/Footer.tsx`'s `juridisk` array (Personvern, Salgsvilkår,
Cookies only) and by `grep -rn "tilgjengelighetserklæring\|uustatus"` across
`src/` finding zero implementation hits (only prose in blog content).

This isn't just a missing nice-to-have: **the site already publicly claims
this statement exists.** `src/pages/Teknologi.tsx:45` (a live FAQ answer,
also duplicated in `src/content/faq.ts:142`) says: *"Digilist tester mot
WCAG 2.1 AA og kjører automatiserte axe-core-revisjoner på hvert deploy.
Tilgjengelighetserklæring publiseres i samsvar med Digdirs mal."* — i.e. the
site asserts a Digdir-template accessibility statement is published, but no
such page exists anywhere. This ticket makes that claim true instead of
false.

## HOW IT WORKS NOW (files/functions read)

- **Legal/static page pattern**: `src/pages/Personvern.tsx`,
  `src/pages/Cookies.tsx`, `src/pages/Salgsvilkar.tsx` — identical shape:
  `useEffect` scroll-to-top, `<SEO title description canonical breadcrumbs>`,
  `<Navbar>`, `<main id="main"><section className="pt-32 pb-16">` with a
  `max-w-3xl` column of numbered `<h2>` sections using
  `text-muted-foreground leading-relaxed` prose classes, `<Footer>`.
- **Route registration** (three places, all required for a new static page
  to actually ship, confirmed by reading each):
  1. `src/App.tsx` — `const X = lazy(() => import("./pages/X"))` (line ~84
     area, alongside `Personvern`/`Cookies`) + `<Route path="/x" element={<X
     />} />` (line ~368-370 area, inside the main `<Routes>`).
  2. `scripts/prerender.mjs` — a `route`/`title`/`description`/`ogType`
     /`breadcrumbs` object in the routes array (the `/cookies` entry sits at
     line 1936-1945, `/transparens` right after at 1946) that drives the
     per-route static-HTML meta injection (title/OG/canonical/JSON-LD for
     no-JS crawlers), and a `{ loc, priority, changefreq }` entry in the
     sitemap array (`/personvern`/`/salgsvilkar`/`/cookies` sit together at
     lines 2625-2627, all `priority: "0.3", changefreq: "yearly"`).
  3. `src/entry-server.tsx` needs no separate registration — it just renders
     `AppShell` (from `App.tsx`) inside a `StaticRouter`, so once `App.tsx`
     has the route, SSR prerendering picks it up automatically (confirmed by
     reading `entry-server.tsx`'s `render()`).
- **Footer**: `src/components/Footer.tsx`'s `juridisk` array (lines 67-71)
  renders as a `<nav aria-label="Juridisk">` list in the bottom colophon
  (lines 394-414) — this is the exact "link it in the footer" location the
  ticket names.
- **Search corpus**: `src/lib/search/corpus.ts`'s `ROUTE_ITEMS` (lines
  30-43) lists every static/legal page (`r-personvern`, `r-salgsvilkar`,
  `r-cookies`) for the site's search + the chatbot's "relevante sider"
  feature (per the file's own header comment).
- **SSR a11y test suite**: `src/entry-server.h1.test.tsx` asserts exactly
  one `<h1>` per route, including a `"renders exactly one <h1> on a static
  page"` case using `/personvern` (lines 46-50) — the template this new
  page's test case mirrors.
- **Existing public WCAG claims** (read for factual consistency, not
  changed): `TechnologyStackSection.tsx:171` ("Pliktig etter
  Likestillings- og diskrimineringsloven § 17a og forskrift om universell
  utforming av IKT"), `Teknologi.tsx:41-45` (WCAG 2.1 AA, automated
  axe-core audits on every deploy, Digdir-template statement "published"),
  `SecuritySection.tsx:12` ("WCAG 2.1 AA-kompatibel"). The new page's
  content is written to match these existing claims, not invent new ones.

## WHAT CHANGES

1. **`src/pages/Tilgjengelighet.tsx`** (new) — a tilgjengelighetserklæring
   page following the `Personvern.tsx`/`Cookies.tsx` template exactly
   (same `SEO`/`Navbar`/`main`/`Footer` shell, same prose classes). Content:
   standard (WCAG 2.1 nivå AA), legal basis (forskrift om universell
   utforming av IKT / Likestillings- og diskrimineringsloven §17a — matching
   `TechnologyStackSection.tsx`'s existing claim), how it's tested
   (automated axe-core on every deploy — matching `Teknologi.tsx`'s existing
   claim), known gaps (honest, not a blanket "fully compliant" claim),
   feedback/contact route (`kontakt@digilist.no`), and a link to
   **uustatus.no** — the real, existing Norwegian government accessibility
   statement registry (Digitaliseringsdirektoratet / Tilsynet for universell
   utforming av IKT) — as the supervisory body, per the ticket's explicit
   "(uustatus.no)" parenthetical.
2. **`src/App.tsx`** — lazy-import + `<Route path="/tilgjengelighet"
   element={<Tilgjengelighet />} />`, alongside the other legal routes.
3. **`scripts/prerender.mjs`** — a routes-array entry for `/tilgjengelighet`
   (title/description/breadcrumbs, same shape as `/cookies`) plus a sitemap
   entry (`priority: "0.3", changefreq: "yearly"`, matching the other three
   legal pages).
4. **`src/components/Footer.tsx`** — add `{ label: "Tilgjengelighet", href:
   "/tilgjengelighet" }` to the `juridisk` array (this is literally "link it
   in the footer").
5. **`src/lib/search/corpus.ts`** — add an `r-tilgjengelighet` entry to
   `ROUTE_ITEMS`, matching the existing three legal-page entries, so the new
   page is findable via site search / chatbot "relevante sider" like its
   siblings.
6. **`src/entry-server.h1.test.tsx`** — new test case (`"renders exactly one
   <h1> on the tilgjengelighet page"`, route `/tilgjengelighet`), mirroring
   the existing `/personvern` case. This is the test that pins the new page
   into the SSR a11y invariant suite — fitting, since the ticket itself is
   an accessibility finding.

**Explicitly not done**: formally registering an official erklæring with a
government-issued ID on uustatus.no. That's a manual action on an external
government service this repo/agent has no account or API access to — same
"needs a human + deploy, not code" shape as `server/nginx.snippet.conf`
(memory: [security header findings need deploy, not code]). The in-repo page
+ footer link is the actionable code-level piece; linking to uustatus.no's
own site from the new page is what "in the footer" + "(uustatus.no)" can
mean from code alone.

## BLAST RADIUS

- `Footer.tsx` is rendered on every single page (root layout piece, no
  per-page opt-out) — adding one array entry to `juridisk` changes the
  footer's bottom-colophon legal nav on every route, matching the existing
  three-item pattern exactly (same `Link`, same classes, same `key`
  convention). No other consumer of `Footer.tsx` exists to check
  (`grep -rn "from \"@/components/Footer\"" src/` → every page file, all
  identical `<Footer />` usage, no props).
- `Tilgjengelighet.tsx` is a new, standalone page with no imports from
  anywhere else in the app and no other file importing it except the two
  registration points (`App.tsx`, `corpus.ts`) — zero risk of colliding with
  existing behavior.
- `scripts/prerender.mjs`'s routes array and sitemap array are both flat
  arrays of independent objects — appending one entry to each cannot affect
  any existing route's generated HTML/meta or sitemap entry.
- `entry-server.h1.test.tsx`'s new case only reads `render("/tilgjengelighet")`
  — doesn't touch any existing test or shared fixture.
- Nothing here touches `server/nginx.snippet.conf`, `MobileMenu.tsx`, or any
  other file XAL-1156 already changed — zero overlap/merge-conflict risk
  with that ticket's (already-merged) diff.

```mermaid
flowchart TD
    subgraph Repo["This change"]
        Page[src/pages/Tilgjengelighet.tsx new]
        App[src/App.tsx: lazy import + Route /tilgjengelighet]
        Prerender[scripts/prerender.mjs: routes[] + sitemap[] entries]
        FooterFile[src/components/Footer.tsx: juridisk[] +1]
        Corpus[src/lib/search/corpus.ts: ROUTE_ITEMS +1]
        Test[src/entry-server.h1.test.tsx: +1 case]
    end

    App -->|renders route| Page
    Prerender -->|SSR via entry-server.tsx -> AppShell -> StaticRouter| Page
    FooterFile -->|"link: /tilgjengelighet"| Page
    Page -->|"external link"| UUstatus["uustatus.no (Digitaliseringsdirektoratet)"]
    Corpus -->|search + chatbot 'relevante sider'| Page
    Test -->|"assertSingleH1(render('/tilgjengelighet'))"| Page

    subgraph AlreadyShipped["XAL-1156 (merged, main) — NOT touched here"]
        Nginx[server/nginx.snippet.conf: gzip + Cache-Control]
        MobileMenu[MobileMenu.tsx: logo-64.webp]
    end
```
