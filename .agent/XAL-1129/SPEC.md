# XAL-1129 — Content gap: Booking-funksjonalitet og systemkrav

## WHAT THIS IS

A content-gap ticket for the Digilist marketing blog (this repo is
marketing/content-ops only — no booking product code lives here, per
[[project_repo_has_no_booking_domain]]). The ask: publish one new SEO blog
post satisfying search intent for the head term "booking" itself, targeted
at both kommunale innkjøpere and private utleiere who are evaluating
booking software on concrete technical functionality: GDPR/personvern,
SMS-varsler, kalender(sync), and tilgangsstyring — positioned as a product-
competence/differentiation piece, not a narrow persona post.

Confirmed this is a real, distinct gap, not a duplicate, after reading the
closest existing posts in full:
- `gdpr-iso-datalokasjon-norge.md` — deep GDPR/ISO 27001/27701/DPA piece,
  kommune-only audience, no SMS/kalender content.
- `teknisk-funksjonalitet-sikkerhet-bookingsystem.md` — sikker innlogging /
  revisjonsspor / rollestyrt administrasjon, kommune-IT-leder only, no SMS
  or kalender content.
- `bookingsystem-idrettshall-kravspesifikasjon-it-leder.md` — idrettshall-
  specific kravspesifikasjon, kommune-only, no SMS, no dedicated kalender
  section (only "sanntidsdata" framing).
- `bookingsystem-kommune-leverandor-valg.md` — kommune leverandørvalg
  checklist (ID-porten, økonomiintegrasjon, GDPR), kommune-only, no SMS.
- `beste-plattform-private-utleiere-leie-ut-lokale.md` — the only post that
  addresses private utleiere directly, but GDPR/kalender/SMS/tilgang are
  each one bullet or table cell, not the subject.
- `brukerstyring-og-tilgangskontroll.md` — dedicated tilgangsstyring piece,
  no GDPR/SMS/kalender.
- `realtime-varsler-driftsroller.md` / `endre-kansellere-booking-selv-paaminnelser.md`
  — SMS-påminnelse mentioned as one notification channel among push/e-post,
  not framed as a systemkrav.
- `magic-link-sms-bankid-sikker-innlogging.md` — "SMS" here is an OTP login
  channel, a different feature than SMS-varsler/påminnelser; kept distinct
  in the new post to avoid conflating the two.
- `sanntidskalender-kommunal-booking.md` — kalender-sync depth exists, but
  again kommune-only, no GDPR/SMS/tilgang tie-in.

So every existing post covers at most one or two of the four pillars for a
single audience. No post bundles GDPR + SMS + kalender + tilgang as one
buyer-facing "systemkrav" checklist for both audiences under the generic
"booking" head term — that combination and audience is the actual gap. The
new post is written as a hub that links out to each of the deeper existing
posts above rather than re-deriving their depth, following the same
hub/spoke pattern `teknisk-funksjonalitet-sikkerhet-bookingsystem.md`
already uses.

Two dedicated money pages already exist and are the link targets:
`src/pages/BookingsystemKommune.tsx` (`/bookingsystem-kommune`) and
`src/pages/BookingsystemUtleie.tsx` (`/bookingsystem-utleie`), confirmed at
`src/App.tsx:300` and `:305`.

## HOW IT WORKS NOW

Same pipeline verified directly in this checkout as the immediately
preceding content-gap tickets (XAL-1131/1134/1135), re-verified here rather
than recalled:

- `src/content/blog/*.md` — one file per post, frontmatter (slug, title,
  description, date, author, role, readingMinutes, tag, cover, keywords) +
  Markdown body. Parsed by `src/lib/blogFrontmatter.ts`.
- `build-plugins/blogMetaPlugin.ts` exposes parsed frontmatter as the
  `virtual:blog-meta` Vite virtual module; `src/lib/posts.ts` imports it,
  sorts by date descending — single source `BlogPreview.tsx` / `BlogPost.tsx`
  / sitewide search corpus read from.
- `src/lib/postContent.ts` loads the raw Markdown body at render time for
  `src/pages/BlogPost.tsx`.
- `src/pages/BlogPost.tsx` `SOLUTION_PAGES` (line 31-37) keyword-matches
  slug/title/tag/keywords against a money-page auto-linker. The regex for
  `/bookingsystem-kommune` is `/kommun|bookingsystem|it-leder|anbud|ssa-l|innkjøp|leverand/i`
  — this new post's title/keywords legitimately contain "bookingsystem", so
  it auto-links there. `/bookingsystem-utleie` is NOT in `SOLUTION_PAGES`,
  so it's hand-linked in-body, same technique the catering post (XAL-1131)
  used for `/tjenester/catering`.
- `scripts/prerender.mjs` bakes every post to static
  `dist/blogg/<slug>/index.html` at build time (SSR).
- `scripts/check-blog-word-count.mjs` — build-wired gate (`pnpm build`
  final step). MIN_WORDS = 200, checked against both the raw `.md` body and
  the prerendered HTML's `<article>` text.
- `scripts/check-title-lengths.mjs` — informational only. Rendered title
  (title, or title + " — Digilist" if ≤50 chars) must stay ≤65 chars.
- `scripts/guard-blog-redirects.mjs --check` — probes the new slug against
  the live site's 301s; quarantines any slug already claimed by a standing
  redirect.
- `src/lib/post-slugs.test.ts` (vitest) — asserts no two `.md` files
  resolve to the same `/blogg/<slug>`.
- `src/content/blogFaq.mjs` — optional per-slug `POST_FAQ` map for FAQPage
  JSON-LD, opt-in. Not used by this post (plain "## Vanlige spørsmål"
  prose), matching the established convention in the recent batch.
- `src/pages/BlogPost.tsx` CTA dedup: `isCta()` strips a trailing paragraph
  if it contains an inline "book demo"-style link, since the article page
  already renders its own CTA band below (bug found and fixed for XAL-1131,
  see [[project_repo_has_no_booking_domain]] sibling commit 8e64cc2). The
  new post's closing paragraph is written as pure summary prose with no
  inline demo link, so it will not be silently stripped; verified in the
  prerendered output below.

## WHAT CHANGES

One new file:
`src/content/blog/booking-funksjonalitet-systemkrav-gdpr-sms-kalender-tilgang.md`

- slug: `booking-funksjonalitet-systemkrav-gdpr-sms-kalender-tilgang`
- title: "Booking-funksjonalitet: GDPR, SMS, kalender og tilgang" (54 chars
  → rendered as-is, 54 chars, verified via `node scripts/check-title-lengths.mjs`)
- description: ~200 chars summarizing the four-pillar systemkrav framing
- date: 2026-08-10, author "Ibrahim Rahmani", role "Grunnlegger, Digilist",
  readingMinutes 7, tag "Plattform" (matches the existing cross-audience/
  platform-capability tag used elsewhere, rather than an audience-specific
  tag like "IT-leder" or "Utleier" since this post explicitly targets both),
  cover `/images/blog/gdpr_iso27001_hero_no.webp` (same cover already used
  by the closest sibling posts on this exact systemkrav theme)
- keywords targeting "booking" as the head term plus the four pillars:
  ["booking", "bookingfunksjonalitet", "systemkrav bookingsystem",
  "GDPR booking", "SMS-varsler booking", "kalendersync booking",
  "tilgangsstyring bookingsystem", "teknisk funksjonalitet booking"]
- Body (Bokmål, ~1000 words): opens with the dual-audience framing (kommune
  innkjøper + privat utleier both evaluating the same four technical
  pillars), one section per pillar (GDPR/personvern, SMS-varsler, kalender/
  kalendersync, tilgangsstyring) each with concrete Digilist specifics and
  an outbound link to the deeper existing post on that pillar, a combined
  sjekkliste section, and a closing summary paragraph (no inline demo link,
  to avoid the `isCta()` strip) followed by the standalone CTA link the
  established convention uses. Direct in-body links to both money pages
  `/bookingsystem-kommune` and `/bookingsystem-utleie`.

No code changes — content-only. `blogMetaPlugin.ts`, `blogFrontmatter.ts`,
`prerender.mjs`, etc. are read-only consumers that pick the new file up
automatically via their existing glob over `src/content/blog/*.md`.

## BLAST RADIUS

Every caller/consumer of `src/content/blog/*.md`, confirmed via
`grep -rln "content/blog"` (excluding `node_modules`/`dist`) and by
actually running the build/test pipeline in this checkout:

- `build-plugins/blogMetaPlugin.ts` — globs the directory; new file picked
  up automatically, no allowlist to edit.
- `src/lib/posts.ts` — consumes `virtual:blog-meta`; new post appears in
  listing/search/preview automatically, sorted by date.
- `src/lib/postContent.ts` — loads raw body for `BlogPost.tsx` at the new
  slug's route.
- `src/pages/BlogPost.tsx` `SOLUTION_PAGES` auto-linker — new post's
  keywords/title legitimately match `/bookingsystem-kommune` (contains
  "bookingsystem"), confirmed by grepping the prerendered HTML for
  `href="/bookingsystem-kommune"`. Direct in-body link to
  `/bookingsystem-utleie` (existing route, `src/App.tsx:305`) also
  confirmed present in the prerendered HTML.
- `scripts/prerender.mjs` — SSR'd the new post to
  `dist/blogg/booking-funksjonalitet-systemkrav-gdpr-sms-kalender-tilgang/index.html`
  — confirmed via full `pnpm build` run in this checkout, `<h1>` renders
  the exact title text, all in-body links present in the output.
- `scripts/check-blog-word-count.mjs` — ran as part of `pnpm build`, all
  posts (previous count + 1) pass both the markdown and rendered-HTML floor.
- `scripts/check-title-lengths.mjs` — ran directly, new post reports 54
  chars, within the 65-char limit.
- `scripts/guard-blog-redirects.mjs --check` — ran directly, confirmed the
  new slug returns HTTP 200 (not claimed by any standing 301 redirect).
- `src/lib/post-slugs.test.ts` — ran via `npx vitest run`, passed; new slug
  unique against all other posts.
- Full `npx vitest run` — all test files pass (includes entry-server SSR
  `<h1>`/`<main>`-landmark invariants that touch every blog post route
  generically).
- `src/content/blogFaq.mjs` — not touched (no `POST_FAQ` entry added);
  `blogFaq.test.ts` still passes since it only validates existing entries.
- Sitewide search corpus (`Navbar` → `search/corpus.ts`) — reads through
  `src/lib/posts.ts`, new post becomes searchable automatically.
- `src/pages/BookingsystemKommune.tsx` / `src/pages/BookingsystemUtleie.tsx`
  — receiving ends of the new post's in-body links; read-only, not modified.
- `scripts/sync-convex-blog-to-fs.ts`, `tools/content-agent/src/publish.ts`,
  `convex/content/publish.ts` — Convex content-agent sync tooling; out of
  scope, this post is authored directly as a file in this repo/branch, same
  as every other post in this recent batch, not generated through that
  pipeline.

```mermaid
flowchart TD
    MD["src/content/blog/booking-funksjonalitet-systemkrav-gdpr-sms-kalender-tilgang.md<br/>(new file)"]

    MD -->|glob at build| Plugin["build-plugins/blogMetaPlugin.ts<br/>virtual:blog-meta"]
    Plugin --> Posts["src/lib/posts.ts<br/>getAllPosts()"]
    Posts --> Preview["src/pages/BlogPreview.tsx<br/>(listing)"]
    Posts --> Search["search/corpus.ts<br/>(sitewide search)"]
    MD -->|raw body| PostContent["src/lib/postContent.ts"]
    PostContent --> BlogPost["src/pages/BlogPost.tsx<br/>(/blogg/<slug>)"]
    BlogPost -->|keyword auto-match "bookingsystem"| LinkerK["SOLUTION_PAGES auto-linker<br/>→ /bookingsystem-kommune"]
    BlogPost -->|hand-placed in-body link| LinkerU["src/pages/BookingsystemUtleie.tsx<br/>/bookingsystem-utleie"]
    BlogPost -->|contextual outbound links| Spokes["gdpr-iso-datalokasjon-norge.md<br/>teknisk-funksjonalitet-sikkerhet-bookingsystem.md<br/>brukerstyring-og-tilgangskontroll.md<br/>realtime-varsler-driftsroller.md<br/>sanntidskalender-kommunal-booking.md"]

    MD -->|SSR bake| Prerender["scripts/prerender.mjs"]
    Prerender --> Dist["dist/blogg/booking-funksjonalitet-systemkrav-gdpr-sms-kalender-tilgang/index.html"]

    Dist -->|word count check| WordCount["scripts/check-blog-word-count.mjs<br/>(build-wired gate, MIN 200 words) ✓"]
    MD -->|title length| TitleCheck["scripts/check-title-lengths.mjs<br/>(informational, LIMIT 65) ✓ 54"]
    MD -->|slug vs live 301s| RedirectGuard["scripts/guard-blog-redirects.mjs<br/>✓ HTTP 200, no collision"]
    Posts -->|uniqueness| SlugTest["src/lib/post-slugs.test.ts (vitest) ✓"]

    style MD fill:#e8f5e9,stroke:#2e7d32
```

## Verification run in this checkout

- `pnpm install` + `pnpm approve-builds --all` (per
  [[feedback_pnpm_build_needs_approve_builds]])
- `node scripts/check-title-lengths.mjs` → new post 54 chars, within limit
- `node scripts/guard-blog-redirects.mjs --check` → clear, HTTP 200
- `pnpm build` → prerendered successfully, word-count gate passed for all
  posts including the new one; confirmed `<h1>` text and all in-body links
  present in the prerendered `dist/blogg/.../index.html`
- `npx vitest run` → all test files passed

## Linear attachment note

No Linear MCP server is reachable in this environment (`ToolSearch` for
Linear-related tools returns nothing) — matches
[[project_no_linear_mcp_tools_available]] from XAL-1151, re-confirmed here.
This SPEC could not be attached to the XAL-1129 issue nor commented on
directly; it's committed to the branch instead so the review phase carries
the same evidence an attachment would.
