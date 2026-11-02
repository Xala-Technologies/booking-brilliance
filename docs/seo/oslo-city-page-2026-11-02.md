# Oslo city page CTR enrichment (2026-11-02)

URL: https://digilist.no/lokaler-til-leie/oslo  
GSC baseline (28d to 2026-10-30): 41 clicks, 2 758 impressions, ~1.49% CTR, avg pos 12.4.

## Before / after

| Field | Before (live 2 Nov 2026) | After (this branch) |
| --- | --- | --- |
| **Title** | Lokaler til leie i Oslo – finn og book \| Digilist | Leie lokale i Oslo: ledige lokaler til leie \| Digilist |
| **Meta description** | …selskapslokaler, møterom, kulturhus og haller i **sanntid**. Sammenlign pris og **book direkte**. | Leie lokale i Oslo? Se selskapslokaler, festlokaler, møterom og kulturhus. Sammenlign private og kommunale lokaler, og send forespørsel på Digilist. (≤155 tegn) |
| **H1** | Lokaler til leie *i Oslo*. | Leie lokale *i Oslo*: lokaler til fest og møter. |
| **First content H2** | Venue-landskapet i *Oslo*. | Ledige lokaler i Oslo: selskapslokale, festlokale og møterom. |
| **FAQ count** | 4 (FAQPage JSON-LD) | 8 (visible FAQ = FAQPage JSON-LD, loaded from `BYER.oslo.faq` at prerender) |
| **Internal links in main** | /lokaler-til-leie, /leie/* types, /priser, /book-demo, /bookingsystem-utleie | Same type links **plus** /leie hub, /priser (also in reading block), **3 blog posts** (selskapslokaler-typer, julebord-guide, privat fest/bedrift), /book-demo, /bookingsystem-utleie |

## Head queries targeted in SERP copy

- leie lokale oslo
- lokaler til leie oslo
- ledige lokaler oslo (title only)
- festlokale oslo leie
- leie selskapslokale

Shop-space queries (butikklokaler) intentionally not emphasized.

## Scope

Oslo-only overrides in `src/content/lokalerByer.ts`. Prerender title, description and FAQ for `/lokaler-til-leie/oslo` are injected from the same file at build time via `scripts/lokaler-oslo-prerender-loader.mjs`, guarded by `src/content/lokaler-oslo-faq-sync.test.ts`. Shared template in `LokalerTilLeieBy.tsx` reads optional fields; other cities unchanged when fields are absent.

## Verification

- `pnpm exec vitest run src/content/lokalerByer.test.ts src/content/lokaler-oslo-faq-sync.test.ts`
- `pnpm build` then inspect `dist/lokaler-til-leie/oslo/index.html` and `dist/lokaler-til-leie/trondheim/index.html`
