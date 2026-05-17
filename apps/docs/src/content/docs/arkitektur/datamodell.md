---
title: Datamodell
description: ~80 kjernetabeller fordelt på 27 komponenter. Identity, infra, commerce, payments, ledger, GDPR, secrets — alt scopet til tenantId.
---

Convex-skjemaet inneholder ~80 kjernetabeller fordelt på 27 komponenter. Alle skriv-spørringer scopes til
`tenantId` utledet fra sesjonen. Offentlige lese-spørringer (markedsplassen) er un-scoped.

## Identity & Auth

| Tabell | Felter (utdrag) | Indekser |
|---|---|---|
| `users` | `id`, `email`, `name`, `role`, `mfaEnabled`, `idPortenPid` | `by_email`, `by_idPortenPid` |
| `sessions` | `userId`, `token`, `expiresAt`, `device`, `ipHash` | `by_token`, `by_user` |
| `mfaCredentials` | `userId`, `kind` (totp\|webauthn), `secretEnc` | `by_user` |
| `oauthAccounts` | `userId`, `provider` (id-porten\|bankid\|feide), `subject` | `by_provider_subject` |
| `passwordResets` | `userId`, `token`, `expiresAt`, `usedAt` | `by_token` |

## Tenants & RBAC

| Tabell | Felter (utdrag) | Indekser |
|---|---|---|
| `tenants` | `id`, `slug`, `name`, `plan`, `kind` (kommune\|forening\|privat), `orgnr` | `by_slug`, `by_orgnr` |
| `tenantUsers` | `tenantId`, `userId`, `role`, `invitedAt`, `acceptedAt` | `by_tenant`, `by_user` |
| `roles` | `tenantId`, `name`, `permissions[]`, `isSystem` | `by_tenant_name` |
| `userRoles` | `userId`, `roleId`, `tenantId` | `by_user`, `by_role` |
| `capabilities` | `kind`, `scope`, `enabledByDefault` | (system) |

## Booking & Calendar

| Tabell | Felter (utdrag) | Indekser |
|---|---|---|
| `resources` | `tenantId`, `slug`, `name`, `kind`, `state`, `openingHours` | `by_tenant_slug`, `by_state` |
| `bookings` | `tenantId`, `resourceId`, `userId`, `startsAt`, `endsAt`, `state`, `priceCents` | `by_resource_time`, `by_user`, `by_tenant_state` |
| `bookingApprovals` | `bookingId`, `approverId`, `decidedAt`, `decision`, `note` | `by_booking` |
| `availabilityBlocks` | `resourceId`, `startsAt`, `endsAt`, `reason` | `by_resource_time` |
| `seasons` | `tenantId`, `name`, `startsAt`, `endsAt`, `allocationRules` | `by_tenant_active` |
| `recurringRules` | `bookingId`, `rrule`, `until` | `by_booking` |

## Payments & Ledger

| Tabell | Felter (utdrag) | Indekser |
|---|---|---|
| `payments` | `tenantId`, `bookingId`, `provider`, `intentId`, `state`, `amountCents` | `by_intent`, `by_booking` |
| `refunds` | `paymentId`, `amountCents`, `reason`, `state` | `by_payment` |
| `payouts` | `tenantId`, `provider`, `periodStart`, `periodEnd`, `amountCents`, `state` | `by_tenant_period` |
| `ledgerEntries` | `tenantId`, `kind`, `bookingId`, `amountCents`, `account`, `ts` | `by_tenant_ts`, `by_booking` |
| `commissions` | `tenantId`, `bookingId`, `rateBps`, `amountCents`, `snapshotAt` | `by_booking` |
| `invoices` | `tenantId`, `customerId`, `kid`, `state`, `amountCents`, `ehfSentAt` | `by_kid`, `by_tenant_state` |

## Notifications & Messaging

| Tabell | Felter (utdrag) | Indekser |
|---|---|---|
| `notifications` | `userId`, `kind`, `channel`, `payload`, `sentAt`, `readAt` | `by_user_sentAt` |
| `notificationPrefs` | `userId`, `kind`, `channels[]` | `by_user_kind` |
| `messages` | `tenantId`, `threadId`, `senderId`, `body`, `sentAt` | `by_thread_sentAt` |
| `messageThreads` | `tenantId`, `bookingId`, `participantIds[]`, `lastMessageAt` | `by_booking`, `by_tenant_lastMsg` |

## Audit & GDPR

| Tabell | Felter (utdrag) | Indekser |
|---|---|---|
| `auditEvents` | `tenantId`, `actorId`, `kind`, `targetType`, `targetId`, `payload`, `ts` | `by_tenant_ts`, `by_target` |
| `dataExports` | `userId`, `requestedAt`, `completedAt`, `urlEnc`, `expiresAt` | `by_user` |
| `dataDeletions` | `userId`, `requestedAt`, `scheduledAt`, `executedAt`, `gracePeriodEnd` | `by_user_state` |
| `consents` | `userId`, `kind`, `givenAt`, `revokedAt`, `version` | `by_user_kind` |

## Outbox (Hendelse-buss)

| Tabell | Felter (utdrag) | Indekser |
|---|---|---|
| `outboxEvents` | `topic`, `payload`, `producerComponentId`, `createdAt`, `state` | `by_topic_createdAt`, `by_state` |
| `outboxDeliveries` | `eventId`, `subscriberId`, `attempt`, `nextAttemptAt`, `state` | `by_subscriber_state`, `by_event` |
| `eventTopics` | `name`, `schema`, `producerComponent`, `subscriberComponents[]` | (system) |

## Tenant-første-prinsipp

Alle disse tabellene (med unntak av `capabilities`, `eventTopics`, og noen system-tabeller)
har `tenantId` som første index-felt. Alle skriv-fasader verifiserer
`session.tenantId === input.tenantId` før de muterer noe. Lese-spørringer på markedsplassen
bypasser scope-sjekk siden de er public.

```ts
// Eksempel: en skriv-fasade med tenant-scope
export const update = mutation({
  args: { id: v.id("bookings"), patch: v.object({ /* … */ }) },
  handler: async (ctx, { id, patch }) => {
    const session = await requireSession(ctx);
    const booking = await ctx.db.get(id);
    if (!booking || booking.tenantId !== session.tenantId) {
      throw new ConvexError({ kind: "not_found", id });
    }
    await ctx.db.patch(id, patch);
    await emit(ctx, "booking.updated", { id, by: session.userId });
  },
});
```

## Beslektet

- [Arkitektur-oversikt](/arkitektur/oversikt/) · [Hendelse-buss](/arkitektur/event-bus/)
- [API-referanse](/api-referanse/) · [Compliance · GDPR](/compliance/gdpr/)
