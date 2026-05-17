---
title: Stripe Connect
description: Express-konto, KYC-onboarding, provisjons-splitting, payout-skjema, dispute-håndtering. Slik kobler tenants Stripe til Digilist.
---

Stripe håndterer alle kort-betalinger, internasjonal valuta, Apple Pay, Google Pay
og SEPA. Vi bruker **Stripe Connect Express** — tenant får sin egen Stripe-konto
med KYC, men onboardingen er forenklet og embedded i Digilist.

## 1. Onboarding-flyt

```
DRIFTSLEDER             DIGILIST             STRIPE
    │                      │                    │
    │ ── /admin/payouts ──>│                    │
    │ <── viser "Koble til Stripe"-knapp        │
    │                      │                    │
    │ ── klikker ─────────>│ ── accounts.create │
    │                      │ <── { id: acct_… } │
    │                      │ ── accountLinks    │
    │                      │ <── { url }        │
    │ <── 302 til Stripe ──│                    │
    │ ── KYC: orgnr, eier,──────────────────>   │
    │   konto, ID-bilde                         │
    │ <── 302 til /admin/payouts?return ─────── │
    │                      │ <── webhook account.updated
    │                      │ Set tenants.stripeAccountId
    │ <── viser "Aktivert" │                    │
```

## 2. Konfigurasjon

```ts
// tenants.paymentConfig.stripe
{
  accountId: "acct_1Q…",
  capabilities: ["card_payments", "transfers", "sepa_debit_payments"],
  payoutSchedule: {
    interval: "weekly",          // daily | weekly | monthly | manual
    weeklyAnchor: "thursday",
  },
  defaultCurrency: "NOK",
  bankAccount: "encrypted-last-4-only",
}
```

## 3. Provisjons-splitting

For hver booking deler Digilist beløpet:

```
                    Innbygger betaler 800,00 kr
                            │
                            ▼
                    ┌───────────────┐
                    │   Stripe      │
                    │   trekker     │
                    │   2,9 % + 2 kr│
                    │   = 25,20 kr  │
                    └───────┬───────┘
                            │
                  Stripe-saldo: 774,80 kr
                            │
              ┌─────────────┴──────────────┐
              ▼                            ▼
      Digilist (5 %)                Tenant (95 %)
      = 38,74 kr                    = 736,06 kr
      (transferred to              (utbetales ifølge
       digilist-platform-acct)      payoutSchedule)
```

Provisjons-snapshot tas på `payment.captured` og lagres i `commissions`-tabellen
med en `rateBps` (basispunkter) og `snapshotAt`. Dette gjør at en historisk
revisjon vil regne provisjon på samme måte som da bookingen ble fullført,
selv om plattformens provisjon-sats endres senere.

## 4. Betalings-flyt

```ts
// 1) Lag PaymentIntent (capture senere)
const intent = await stripe.paymentIntents.create({
  amount: 80000,                       // 800,00 kr i øre
  currency: "nok",
  capture_method: "manual",            // Vent på saksbehandler-godkjenning
  application_fee_amount: 4000,        // 40 kr (vår 5 %)
  transfer_data: {
    destination: tenant.stripeAccountId,
  },
  metadata: { bookingId, tenantId },
});

// 2) Saksbehandler godkjenner → capture
await stripe.paymentIntents.capture(intent.id);
// → emit "payment.captured"

// 3) Webhook from Stripe → ledger entry + payout
```

## 5. Webhook-handling

Stripe sender webhooks til `https://api.digilist.no/webhooks/stripe`. Vi:

1. Verifiserer signatur med `STRIPE_WEBHOOK_SECRET`
2. Dedupliserer på `event.id` (cached i Convex 30 dager)
3. Emit'er `webhook.stripe.received` på outbox-bussen

Topics vi håndterer:

| Stripe-event | Digilist-handling |
|---|---|
| `payment_intent.succeeded` | Set booking til `paid`, emit `payment.captured` |
| `payment_intent.payment_failed` | Set booking til `payment_failed`, emit `payment.failed` |
| `charge.refunded` | Set refund til `succeeded`, emit `payment.refunded` |
| `charge.dispute.created` | Opprett dispute-sak, varsle support |
| `payout.paid` | Set payout til `completed`, oppdater ledger |
| `account.updated` | Re-sync tenant.stripeCapabilities |

## 6. Dispute-håndtering

Når Stripe mottar en dispute (chargeback):

1. `charge.dispute.created` → opprett sak i `support`-komponenten
2. Send Slack-varsling til `#disputes` (hvis tenant > 1 dispute siste 90 dager → alert)
3. Driftsleder må laste opp evidens via `/admin/disputes/{id}` innen 7 dager
4. Stripe svarer; emit `payment.dispute.resolved`

## 7. Sandbox vs produksjon

Bruk Stripes [test-kort](https://stripe.com/docs/testing) i sandbox:

| Test-kort | Brukes til |
|---|---|
| `4242 4242 4242 4242` | Vanlig OK |
| `4000 0027 6000 3184` | 3D Secure 2 påkrevd |
| `4000 0000 0000 9995` | Insufficient funds |
| `4000 0000 0000 0341` | Attached til kunde feiler |

## 8. Operasjon

- **Webhook-feilrate:** Mål < 0,5 %. Spike → side på `#oncall`.
- **Payout-frekvens:** Konfigurerbart per tenant. Default ukentlig (torsdag).
- **Compliance:** SCA (Strong Customer Authentication) håndteres av Stripe Elements + `payment_method_types: ["card"]`.

## Beslektet

- [Vipps Mobilepay](/integrasjoner/vipps/) · [EHF](/integrasjoner/ehf/)
- [Payments-komponent](/arkitektur/komponenter/#payments) · [Ledger](/arkitektur/datamodell/#payments--ledger)
