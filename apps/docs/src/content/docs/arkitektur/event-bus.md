---
title: Hendelse-buss
description: Outbox-mekanikk, 110+ topic-katalog, abonnent-kart, retries og webhook-routing. Slik snakker komponenter på tvers uten å lese hverandres tabeller.
---

Hendelse-bussen er **outbox-basert**: produsenter skriver hendelser inn i en `outboxEvents`-tabell
som del av samme transaksjon som forretningsskriven. En cron-jobb plukker dem opp og leverer
til abonnenter. Garanterer at hendelser aldri går tapt — selv hvis dispatch-jobben er nede.

## 1. Mekanikk

```
       PRODUSENT                        OUTBOX                          ABONNENT
   ┌──────────────┐               ┌──────────────────┐              ┌──────────────┐
   │  bookings    │               │  outboxEvents    │              │ notifications│
   │  .create     │ ─── emit ──>  │  topic, payload  │ ─── relay ─> │ .send        │
   │              │   (atomic)    │  state=pending   │   (5s cron)  │              │
   └──────────────┘               └──────────────────┘              └──────────────┘
                                         │
                                         ▼
                                  ┌──────────────────┐
                                  │ outboxDeliveries │
                                  │  per-subscriber  │
                                  │  retry + state   │
                                  └──────────────────┘
```

### Garantier

| Garanti | Hvordan |
|---|---|
| **At-least-once** | Cron-relay leverer til alle abonnenter; abonnent må være idempotent. |
| **Atomicitet** | `emit(ctx, ...)` skriver i samme Convex-mutasjon som forretningsskriven. |
| **Ordring per topic** | Index `by_topic_createdAt`. Abonnent prosesserer i ts-rekkefølge. |
| **Retry med backoff** | 1 min → 5 min → 30 min → 6 t → 1 d. Etter 5 forsøk → dead-letter. |
| **Observabilitet** | `/platform/event-bus` viser pending, failing, dead-lettered per topic. |

## 2. Topic-katalog (utdrag)

110+ topics er katalogisert i `eventTopics`. Tabellen under viser de mest aktive (>1 000 dispatches/dag i mai 2026):

| Topic | Produsent | Abonnenter | Beskrivelse |
|---|---|---|---|
| `booking.created` | `bookings` | `notifications`, `audit`, `intelligence` | Ny booking opprettet (alle states inkl. pending_approval) |
| `booking.approved` | `bookings` | `notifications`, `payments`, `calendar` | Saksbehandler har godkjent |
| `booking.rejected` | `bookings` | `notifications`, `audit` | Saksbehandler har avvist |
| `booking.cancelled` | `bookings` | `notifications`, `payments`, `ledger` | Avbestilt av innbygger eller saksbehandler |
| `payment.intent.created` | `payments` | `bookings`, `audit` | Stripe/Vipps intent opprettet |
| `payment.captured` | `payments` | `bookings`, `ledger`, `notifications`, `accounting` | Betaling fullført, klar til payout |
| `payment.failed` | `payments` | `bookings`, `notifications`, `audit` | Betaling feilet (utløpt kort, avslag) |
| `payment.refunded` | `payments` | `bookings`, `ledger`, `notifications` | Refusjon fullført |
| `payout.completed` | `ledger` | `accounting`, `notifications` | Utbetaling til tenant fullført |
| `user.signed_up` | `identity` | `notifications`, `audit`, `intelligence` | Ny bruker registrert (ID-porten\|BankID\|magic-link) |
| `user.signed_in` | `identity` | `audit`, `intelligence` | Innlogging — feed for risiko-deteksjon |
| `mfa.required` | `identity` | `notifications` | Step-up auth påkrevd for sensitiv handling |
| `resource.published` | `resources` | `notifications`, `intelligence`, `audit` | Lokale eller event publisert til markedsplassen |
| `message.posted` | `messaging` | `notifications`, `audit` | Ny melding i tråd innbygger ↔ saksbehandler |
| `audit.gdpr.export_requested` | `audit` | `audit` (selv), `notifications` | DSAR-eksport startet |
| `audit.gdpr.deletion_scheduled` | `audit` | `audit`, `notifications`, `identity` | Sletting planlagt etter grace-periode |
| `season.allocation.computed` | `seasons` | `notifications`, `bookings` | Sesongleie-fordeling kjørt, lag/foreninger varslet |
| `subscription.upgraded` | `subscriptions` | `tenants`, `accounting`, `notifications` | Tenant byttet til høyere plan |
| `cron.daily.06_00` | (system) | `intelligence`, `reporting`, `accounting` | Daglig kl. 06:00 UTC — content-agent, audits, EHF-batching |
| `webhook.stripe.received` | `http` | `payments` | Innkommende Stripe-webhook (deduplisering på `eventId`) |
| `webhook.vipps.received` | `http` | `payments` | Innkommende Vipps-callback |
| `webhook.signicat.received` | `http` | `identity` | ID-porten / BankID-callback |

## 3. Webhook-routing

Eksterne webhooks går via `http.ts` → topic på outbox-bussen → abonnent.
Dette dekobler eksterne tider fra interne mutasjoner og lar oss replay’e
hele webhook-strømmen ved feil.

```
Stripe / Vipps / Signicat
        │
        ▼ POST /webhooks/<provider>
┌──────────────────────────┐
│  http.ts                 │  Verifiser signatur → emit topic
│  - verify HMAC           │
│  - dedupe på eventId     │
│  - emit "webhook.<x>.received"
└──────────────────────────┘
        │
        ▼  (5s relay cron)
┌──────────────────────────┐
│  payments.handleWebhook  │  Idempotent abonnent
│  - resolve intent → booking
│  - emit "payment.captured"
└──────────────────────────┘
```

## 4. Abonnement og idempotens

Abonnenter MÅ være idempotente — samme hendelse kan leveres flere ganger.

```ts
// God praksis: deduplisering på naturlig nøkkel
export const onPaymentCaptured = internalMutation({
  args: { paymentId: v.id("payments"), intentId: v.string() },
  handler: async (ctx, { paymentId, intentId }) => {
    // Idempotency-sjekk: har vi allerede prosessert denne intent?
    const existing = await ctx.db
      .query("ledgerEntries")
      .withIndex("by_intent", (q) => q.eq("intentId", intentId))
      .first();
    if (existing) return;

    await ctx.db.insert("ledgerEntries", { /* … */ intentId });
  },
});
```

## 5. Dead-letter og operasjon

Hendelser som feiler 5 ganger flytter til **dead-letter**-tilstand. Operatør
kan se og replay'e fra `/platform/event-bus/dead-letters`.

```bash
# Replay alle dead-letters for et topic siste 24t
curl -X POST https://api.digilist.no/platform/event-bus/replay \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"topic":"payment.captured","since":"24h"}'
```

## Beslektet

- [Datamodell · Outbox](/arkitektur/datamodell/#outbox-hendelse-buss)
- [API · Webhooks](/api-referanse/) · [Operations runbooks](/admin/)
