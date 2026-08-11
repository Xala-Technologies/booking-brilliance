# XAL-1089: Content gap — Booking av spesialiserte trening- og kunstnerlokaler

## WHAT THIS IS

A new Norwegian-Bokmål blog post targeting the broad "booking" search intent
described in the ticket: "Musikere, fotografer, kunstnere og
treningsinstruktører i private markeder søker etter spesialiserte lokaler
for øving, undervisning og produksjon."

Digilist already has four dedicated posts, each written from the
**lokaleeier's (Utleier) side**, one per persona/room-type:
`leie-ovingsrom-musikk-dans-studio.md` (the one exception — written
Privatperson-side, for musikklærere/danseinstruktører),
`studio-fotografi-videografi-privatproduksjon-booking.md` (fotografer/
videografer), `kunstner-verksteder-studio-dansesaler-kreative-lokaler.md`
(kunstnere/dansesaler), and
`treningsrom-gymhaller-personlig-trener-fitnessinstruktor.md`
(personlige trenere/fitnessinstruktører). All four are dated 2026-08-10 —
published the day before this ticket — and each covers its own persona in
full technical depth from the room-owner's perspective.

What none of them do is the thing this ticket actually asks for: a single
**searcher-side (Privatperson)** guide that treats "jeg er musiker/fotograf/
kunstner/treningsinstruktør og trenger å booke et spesialisert lokale" as
one search journey, compares what each of the four room types costs and how
they're booked side by side, and then routes the reader to whichever
existing deep-dive matches their persona. `leie-ovingsrom-musikk-dans-studio.md`
does this pattern already, but only for musikk/dans — fotografer, kunstnere
(visual arts) and treningsinstruktører have no equivalent "I'm looking for
this kind of room, here's what it costs and how to book it" entry point;
their only existing coverage is the Utleier-side "how do I rent this room
out" framing. That's the gap: a comparison/hub post for the demand side,
not a fifth persona-specific deep-dive that would duplicate the four
existing ones.

The post is discovered automatically by the existing content pipeline (no
code changes) once it lands in `src/content/blog/`.

## HOW IT WORKS NOW

Blog posts are plain Markdown files with YAML frontmatter in
`src/content/blog/*.md`. The publishing pipeline is entirely file-glob-driven,
confirmed by reading:

- `src/lib/blogFrontmatter.ts` — `BlogFrontmatter` interface and
  `parseFrontmatter`/`extractFrontmatter`.
- `vite.config.ts` — `virtual:blog-meta` plugin extracts frontmatter only,
  at Node build time.
- `src/lib/posts.ts` — `getAllPosts()` reads `virtual:blog-meta`, sorts by
  `date` descending. Consumed by `src/components/BlogPreviewSection.tsx`
  (homepage), `src/pages/Blog.tsx` / `src/pages/BlogPreview.tsx` (index),
  and `src/lib/search/corpus.ts` (sitewide search).
- `src/lib/postContent.ts` — `import.meta.glob("/src/content/blog/*.md",
  {query: "?raw", eager: true})`, matched to metadata by `slug`, imported
  only by `src/pages/BlogPost.tsx`.
- `src/pages/BlogPost.tsx` — renders the post; `relatedSolutions()` (line 39)
  matches slug/title/tag/keywords against a fixed `SOLUTION_PAGES` regex
  list (line 31-37: kommune/bookingsystem, idrettshaller-gymsaler, møterom,
  selskapslokaler, kulturhus-kantiner). "trening" in this post's copy/
  keywords will match the idrettshaller-gymsaler pattern
  (`idrettshall|gymsal|sesong|hall|forening|trening|anlegg`), so it gets a
  real related-solution link rather than the generic fallback.
- `scripts/prerender.mjs` — SSR-prerenders every post to
  `dist/blogg/<slug>/index.html` at build time.
- `scripts/check-blog-word-count.mjs` — fails the build if the rendered
  `<article>` (or the raw Markdown body, as a cheap floor) is under 200
  words.
- `scripts/check-title-lengths.mjs` — informational: rendered title
  (verbatim if >50 chars, else `"<title> — Digilist"`) should stay <=65
  chars.
- `src/lib/post-slugs.test.ts` — vitest guard: every post's `slug` must be
  globally unique.

Confirmed the gap and existing coverage by reading the four sibling posts
in full (`leie-ovingsrom-musikk-dans-studio.md`,
`studio-fotografi-videografi-privatproduksjon-booking.md`,
`kunstner-verksteder-studio-dansesaler-kreative-lokaler.md`,
`treningsrom-gymhaller-personlig-trener-fitnessinstruktor.md`) plus:
- `grep -rli "fotograf\b" src/content/blog/*.md` and
  `grep -rli "treningsinstruktør\|personlig trener|gruppetrening"
  src/content/blog/*.md` — confirmed each persona's only existing coverage
  is the Utleier-side post named above (plus unrelated bryllup posts
  mentioning a wedding photographer in passing, not this topic).
- `grep -l 'tag: "Privatperson"' src/content/blog/*.md` (108 files) piped
  through the same persona grep — zero hits besides the music/dance guide,
  confirming no existing Privatperson-side post covers fotograf/kunstner/
  treningsinstruktør search intent.

## WHAT CHANGES

- New file: `src/content/blog/booking-spesialiserte-trening-kunstnerlokaler.md`
  - `tag: "Privatperson"` (searcher/demand side, matching the one existing
    sibling with this framing, `leie-ovingsrom-musikk-dans-studio.md`).
  - `cover: "/images/blog/booking_calendar_hero_no.webp"` (existing, reused
    across this whole post family — no new image asset).
  - Content: frames the four personas (musikere, fotografer, kunstnere,
    treningsinstruktører) as one shared search journey — private
    individuals looking for a specialized room (øvingsrom/øvesal,
    fotostudio, atelier/verksted, treningsrom) for øving, undervisning or
    produksjon. Covers what distinguishes each room type, the three
    booking patterns common across all four (enkelttime, fast ukentlig,
    sammenhengende produksjon/kurs — the same shape each sibling post
    already documents for its own persona, made explicit as a
    cross-persona pattern here rather than re-explained), a comparative
    price table across all four room types, how Digilist's real-time
    calendar/serietidsbestilling/differensiert pris serves all four at
    once, and a short FAQ. Explicitly funnels each persona to its existing
    deep-dive post instead of re-covering the technical detail already
    written there.
  - Internal links: to all four sibling posts (the persona-specific
    deep-dives) plus `spesiallokaler-niche-utleie-teaterscene-kjeller.md`
    (adjacent niche-room angle) — all verified to exist in
    `src/content/blog/`.
  - No code, schema, or script changes.

## BLAST RADIUS

Grepped `getAllPosts\|virtual:blog-meta\|content/blog` across `src` — same
consumers as every prior content-only blog post in this repo:

- `src/lib/posts.ts` (`getAllPosts`) → `src/components/BlogPreviewSection.tsx`,
  `src/pages/Blog.tsx`, `src/pages/BlogPreview.tsx`, `src/lib/search/corpus.ts`,
  `src/pages/BlogPost.tsx` (list + `sidebarRelated`) — all pick up the new
  post automatically through the same glob/`getAllPosts()` machinery; no
  consumer assumes a fixed post count or slug set.
- `src/lib/postContent.ts` → `src/pages/BlogPost.tsx` — raw markdown body,
  same `import.meta.glob` mechanism.
- `src/pages/BlogPost.tsx` `relatedSolutions()` — new post's copy contains
  "trening", so it resolves to `/bruksomrader/idrettshaller-gymsaler`
  instead of the generic fallback; verified that route exists
  (`src/pages/UseCaseIdrettshaller.tsx` is routed there).
- `scripts/prerender.mjs`, `scripts/check-blog-word-count.mjs`,
  `scripts/check-title-lengths.mjs` — iterate every `.md` file in
  `src/content/blog/`; new file picked up automatically.
- `src/lib/post-slugs.test.ts` — will assert
  `booking-spesialiserte-trening-kunstnerlokaler` is unique; confirmed no
  existing post uses this slug (`grep -rn` returned no hits).
- No other file references this slug — no collision/shadowing risk.

## Mermaid: content pipeline for this post

```mermaid
flowchart TD
    MD["src/content/blog/booking-spesialiserte-trening-kunstnerlokaler.md"]
    VITE["vite.config.ts: virtual:blog-meta plugin (frontmatter only)"]
    GLOB["src/lib/postContent.ts: import.meta.glob (raw body)"]
    POSTS["src/lib/posts.ts: getAllPosts()"]

    MD -->|frontmatter| VITE --> POSTS
    MD -->|raw markdown| GLOB

    POSTS --> BLOGLIST["src/pages/Blog.tsx / BlogPreview.tsx (index)"]
    POSTS --> PREVIEW["src/components/BlogPreviewSection.tsx (homepage)"]
    POSTS --> SEARCH["src/lib/search/corpus.ts (sitewide search)"]
    POSTS --> SIDEBAR["src/pages/BlogPost.tsx: sidebarRelated"]
    GLOB --> BLOGPOST["src/pages/BlogPost.tsx: article body + TOC"]

    BLOGPOST -->|relatedSolutions regex match on "trening"| IDRETT["/bruksomrader/idrettshaller-gymsaler"]
    BLOGPOST -->|explicit inline links, one per persona| MUSIKK["leie-ovingsrom-musikk-dans-studio.md"]
    BLOGPOST --> FOTO["studio-fotografi-videografi-privatproduksjon-booking.md"]
    BLOGPOST --> KUNST["kunstner-verksteder-studio-dansesaler-kreative-lokaler.md"]
    BLOGPOST --> TRENING["treningsrom-gymhaller-personlig-trener-fitnessinstruktor.md"]
    BLOGPOST --> NICHE["spesiallokaler-niche-utleie-teaterscene-kjeller.md"]

    PRERENDER["scripts/prerender.mjs"] -->|SSR at build| DIST["dist/blogg/booking-spesialiserte-trening-kunstnerlokaler/index.html"]
    WORDCOUNT["scripts/check-blog-word-count.mjs"] -.->|gates| DIST
    SLUGTEST["src/lib/post-slugs.test.ts"] -.->|gates uniqueness| POSTS
```

## Testing requirements

- `pnpm vitest run` (full suite) green, including `post-slugs.test.ts`.
- `node scripts/check-blog-word-count.mjs` passes for the new post (>=200
  words markdown source; verified well over that).
- `node scripts/check-title-lengths.mjs` — title "Booking av spesialiserte
  trening- og kunstnerlokaler" is 52 chars as-is (over 50, so rendered
  verbatim), within the 65-char informational limit.
- All internal links resolve to real posts/pages.

## Definition of done

Post committed, slug unique, word count and title-length gates pass, full
vitest suite green, internal links resolve, Linear attachment attempted.

## Linear attachment status

No Linear MCP tools are available in this environment (confirmed:
`ToolSearch` for `linear`/`prepare_attachment_upload`/
`create_attachment_from_upload` returns no matches — consistent with prior
tickets XAL-1091, XAL-1151 noted in session memory). This SPEC is committed
to the branch instead; a later phase with Linear access can attach it.
