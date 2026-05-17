---
title: Vipps Mobilepay
description: Salesunit-oppsett, callback-URLer, betalings-flyt, refusjons-håndtering, e-faktura. Slik kobler tenants Vipps til sin checkout.
---

Vipps er den dominerende mobil-betalingen i Norge med >85 % markedsandel
blant Digilists innbyggere. Vi integrerer via [Vipps eCom v2](https://developer.vippsmobilepay.com/) og bruker
**capture-on-confirm**-mønster — innbygger autoriserer ved booking, vi capturer
først når saksbehandler har godkjent (eller umiddelbart for selvbetjente bookinger).

## 1. Salesunit-oppsett

Hver tenant har én Vipps "salesunit" registrert hos Vipps. Konfig ligger i
`tenants.paymentConfig.vipps`:

```ts
{
  msn: "123456",                          // Merchant Serial Number
  subscriptionKey: "encrypted-via-secrets-component",
  clientId: "...",
  clientSecret: "encrypted-via-secrets-component",
  callbackPrefix: "https://api.digilist.no/webhooks/vipps",
  fallbackUrl: "https://{tenant}.digilist.no/booking/{bookingId}/return",
  isApplePay: false,
  authMode: "MERCHANT_HOSTED",  // vs. VIPPS_HOSTED
}
```

## 2. Betalings-flyt

```
INNBYGGER             DIGILIST              VIPPS-API
    │                    │                     │
    │ ── velger slot ──> │                     │
    │ ── klikker betal ─>│ ── POST /payments ─>│
    │                    │ <── { url, ref } ─  │
    │ <── 302 til Vipps ─│                     │
    │ ── auth i Vipps-app ──────────────────>  │
    │ <── 302 til fallbackUrl?ref=... ─────── │
    │                    │ <── webhook /v2/payments/{ref}/status
    │                    │ Verifiser sig, upd booking
    │ <── viser bekreft ─│                     │
```

### State-overgangsmatrise

```
   INITIATE → RESERVE → CAPTURE → (REFUND)
                ↓
              CANCEL
                ↓
              EXPIRE (etter 24t hvis ikke auth)
```

| Booking-state | Vipps-action |
|---|---|
| `pending_approval` (saksbehandler skal godkjenne) | `INITIATE` + `RESERVE` (innbygger har autorisert, vi capturer ikke ennå) |
| `approved` | `CAPTURE` (saksbehandler godkjent → trekker beløpet) |
| `rejected` eller `cancelled_before_capture` | `CANCEL` (release reservasjon, ingen trekk) |
| `cancelled_after_capture` | `REFUND` (helt eller delvis) |

## 3. Callback / webhook

Vipps sender callbacks til `https://api.digilist.no/webhooks/vipps/{ref}`.
Vi verifiserer HMAC, dedupliserer på `ref` (transactionId), og emit'er
`webhook.vipps.received` på outbox-bussen.

```ts
// convex/http.ts
http.route({
  path: "/webhooks/vipps/:ref",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const body = await request.text();
    const hmac = request.headers.get("authorization");
    if (!verifyVippsHmac(body, hmac)) {
      return new Response("invalid signature", { status: 401 });
    }
    const ref = request.params.ref;
    await ctx.runMutation(internal.payments.handleVippsCallback, {
      ref,
      body: JSON.parse(body),
    });
    return new Response(null, { status: 200 });
  }),
});
```

## 4. Refusjon

Refusjon kan utløses av:

- **Saksbehandler** kansellerer en godkjent booking via `/admin/bookings/{id}/cancel`
- **Innbygger** kansellerer (hvis lokalets kanselleringspolitikk tillater)
- **System** ved force-majeure (stengt lokale)

```ts
await payments.refund({
  paymentId: payment._id,
  amountCents: payment.amountCents, // hel eller delvis
  reason: "Lokale stengt grunnet vannlekkasje",
});
// → POST /v2/payments/{ref}/refund
// → emit "payment.refunded"
// → notifications.sendRefundConfirmation
```

## 5. E-faktura via Vipps

For tenants som tilbyr "betal senere" støtter Vipps e-faktura
(`OPTIONS: ["VIPPS_INVOICE"]` i `initiatePayment`). Beløpet sendes til
innbyggers nettbank uten kort-trekk.

| Egenskap | Verdi |
|---|---|
| Forfall | 14 dager (konfigurerbart) |
| Begrensning | Min 100 kr, maks 30 000 kr |
| KID-generering | Mod-10 fra `bookingId` |
| Påminnelse | Auto fra Vipps + duplikat fra Digilist `notifications` |

## 6. Sandbox vs produksjon

| Miljø | Base URL | Brukes |
|---|---|---|
| **Test** | `https://apitest.vipps.no/` | All utvikling og staging. Test-MSN 654321. |
| **PROD** | `https://api.vipps.no/` | Etter merchant-aktivering hos Vipps. |

## 7. Operasjon

- **Token-fornyelse:** Access-tokens varer 1 time. Vi cacher i `secrets`-komponenten og fornyer 5 min før utløp.
- **Overvåking:** `/platform/integrations/vipps` viser dispatch-rate, callback-feilrate, latency p50/p95/p99.
- **Avbruddshåndtering:** Hvis Vipps er nede > 5 min → fallback til Stripe-kort, banner på checkout.

## Beslektet

- [Stripe Connect](/integrasjoner/stripe/) · [EHF](/integrasjoner/ehf/)
- [Payments-komponent](/arkitektur/komponenter/#payments)
