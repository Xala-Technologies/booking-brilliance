# Oslo city page CTR enrichment (2026-11-02)

URL: https://digilist.no/lokaler-til-leie/oslo  
GSC baseline (28d to 2026-10-30): 41 clicks, 2 758 impressions, ~1.49% CTR, avg pos 12.4.

## Before / after

| Field | Before (live 2 Nov 2026) | After (this branch) |
| --- | --- | --- |
| **Title** | Lokaler til leie i Oslo – finn og book \| Digilist | Leie lokale i Oslo – ledige lokaler til leie \| Digilist |
| **Meta description** | …selskapslokaler, møterom, kulturhus og haller i **sanntid**. Sammenlign pris og **book direkte**. | Leie lokale i Oslo? Se ledige selskapslokaler, festlokaler, møterom og kulturhus. Sammenlign private og kommunale lokaler, og send forespørsel på Digilist. |
| **H1** | Lokaler til leie *i Oslo*. | Leie lokale *i Oslo*: ledige lokaler til fest og møter. |
| **First content H2** | Venue-landskapet i *Oslo*. | Ledige lokaler i Oslo: selskapslokale, festlokale og møterom |
| **FAQ count** | 4 (FAQPage JSON-LD) | 8 (visible FAQ = FAQPage JSON-LD) |
| **Internal links in main** | /lokaler-til-leie, /leie/* types, /priser, /book-demo, /bookingsystem-utleie | Same type links **plus** /leie hub, /priser (also in reading block), **3 blog posts** (selskapslokaler-typer, julebord-guide, privat fest/bedrift), /book-demo, /bookingsystem-utleie |

## Head queries targeted in SERP copy

- leie lokale oslo
- lokaler til leie oslo
- ledige lokaler oslo
- festlokale oslo leie
- leie selskapslokale

Shop-space queries (butikklokaler) intentionally not emphasized.

## Scope

Oslo-only overrides in `src/content/lokalerByer.ts` and matching FAQ/title/meta in `scripts/prerender.mjs` (route `/lokaler-til-leie/oslo`). Shared template in `LokalerTilLeieBy.tsx` reads optional fields; other cities unchanged when fields are absent.

## Verification

- `pnpm exec vitest run src/content/lokalerByer.test.ts`
- `pnpm build` then inspect `dist/lokaler-til-leie/oslo/index.html` and `dist/lokaler-til-leie/trondheim/index.html`
