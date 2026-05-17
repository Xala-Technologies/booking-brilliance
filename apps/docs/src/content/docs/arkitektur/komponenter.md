---
title: Komponent-katalog
description: 27 isolerte Convex-komponenter — plattform (10), forretning (12), tjeneste (5). Per-komponent tabeller, fasader, hendelse-topics og avhengigheter.
---

Hver komponent eier sine tabeller, fasader, schema og kontrakt. Komponenter
spørrer aldri hverandres tabeller direkte — all kryss-komponent-tilgang
går via fasader eller hendelse-bussen.

## Plattform-lag (10 komponenter)

### identity

Brukere, sesjoner, MFA, step-up auth, OAuth (ID-porten · BankID · Feide).

| Tabeller | `users`, `sessions`, `mfaCredentials`, `oauthAccounts`, `passwordResets` |
|---|---|
| Fasader (utdrag) | `users.create`, `users.signInWithIdPorten`, `users.requireMfa`, `users.linkBankID` |
| Hendelser emit | `user.signed_up`, `user.signed_in`, `mfa.required`, `password.reset_requested` |
| Avhengigheter | `audit`, `notifications`, `secrets` |

### rbac

Roller, tillatelser, kapabilitet-resolver (3-lag: plattform → plan → tenant override).

| Tabeller | `roles`, `userRoles`, `capabilities`, `capabilityOverrides` |
|---|---|
| Fasader | `rbac.createRole`, `rbac.assignRole`, `rbac.checkPermission`, `rbac.getUserPermissions` |
| Hendelser emit | `role.created`, `role.assigned`, `role.revoked` |
| Avhengigheter | `audit` |

### tenants

Tenant-livssyklus, billing-binding, team-medlemskap, kundeforhold.

| Tabeller | `tenants`, `tenantUsers`, `tenantInvites`, `tenantCustomers` |
|---|---|
| Fasader | `tenants.create`, `tenants.invite`, `tenants.addCustomer`, `tenants.changePlan` |
| Hendelser emit | `tenant.created`, `subscription.upgraded`, `tenant.member_added` |
| Avhengigheter | `identity`, `subscriptions`, `audit` |

### audit

Hendelse-loggføring, retention, DSAR-eksport, GDPR-sletting.

| Tabeller | `auditEvents`, `dataExports`, `dataDeletions`, `consents` |
|---|---|
| Fasader | `audit.log`, `audit.export`, `audit.scheduleDeletion`, `audit.consents.record` |
| Hendelser emit | `audit.gdpr.export_requested`, `audit.gdpr.deletion_scheduled` |
| Avhengigheter | (root) |

### feature-flags · notifications · secrets · geo · media · i18n

| Komponent | Hovedansvar |
|---|---|
| `feature-flags` | Plattform kill-switches, A/B-eksperimenter, tenant overrides |
| `notifications` | E-post (Resend), SMS (Twilio), push (Expo), in-app, brukerprefs |
| `secrets` | Kryptert nøkkel-lager med step-up auth-krav |
| `geo` | Brreg-oppslag, adresse-normalisering, geocoding |
| `media` | CDN-opplastinger (Cloudflare R2), bilde-transformasjoner |
| `i18n` | Oversettelser, lokaliteter, RTL-håndtering |

## Forretnings-lag (12 komponenter)

### resources

Lokaler, utleieobjekter, tjenester, events. State-maskin: draft → scheduled → published → archived.

| Tabeller | `resources`, `resourceMedia`, `resourceCategories`, `resourceCustomFields` |
|---|---|
| Fasader | `resources.create`, `resources.publish`, `resources.archive`, `resources.search` |
| Hendelser emit | `resource.created`, `resource.published`, `resource.unpublished`, `resource.archived` |
| Avhengigheter | `media`, `geo`, `audit` |

### bookings

Slot-allokering, godkjenningsflyt (innbygger → saksbehandler → driftsleder), konflikt-deteksjon.

| Tabeller | `bookings`, `bookingApprovals`, `bookingChanges`, `bookingAttendees` |
|---|---|
| Fasader | `bookings.create`, `bookings.approve`, `bookings.reject`, `bookings.cancel`, `bookings.reschedule` |
| Hendelser emit | `booking.created`, `booking.approved`, `booking.rejected`, `booking.cancelled` |
| Avhengigheter | `resources`, `calendar`, `payments`, `notifications`, `audit` |

### calendar

Åpningstider, blokker, sesonger, rekurrens. Beregner tilgjengelige slots i sanntid.

| Tabeller | `availabilityBlocks`, `openingHours`, `seasons`, `recurringRules` |
|---|---|
| Fasader | `calendar.availability`, `calendar.block`, `calendar.unblock`, `calendar.computeSlots` |
| Hendelser emit | `availability.blocked`, `season.started`, `season.ended` |
| Avhengigheter | `resources` |

### payments

Checkout, Stripe Connect + Vipps + Nets routing, refusjon, dispute-håndtering.

| Tabeller | `payments`, `refunds`, `disputes`, `paymentMethods` |
|---|---|
| Fasader | `payments.createIntent`, `payments.confirm`, `payments.refund`, `payments.handleWebhook` |
| Hendelser emit | `payment.intent.created`, `payment.captured`, `payment.failed`, `payment.refunded` |
| Avhengigheter | `bookings`, `ledger`, `notifications`, `accounting` |

### ledger · subscriptions · tickets · memberships · messaging · reviews · seasons · accounting

| Komponent | Hovedansvar |
|---|---|
| `ledger` | Provisjon-snapshot, payouts, escrow, double-entry bookkeeping |
| `subscriptions` | Basis / Pluss / Premium-nivåer, plan-grinder, billing |
| `tickets` | Event-billett-typer, kjøp, innsjekk, salg igjen, kiosk |
| `memberships` | Medlemskap, kontingent, fornyelse, A-krav-medlems-styring |
| `messaging` | Trådet kommunikasjon innbygger ↔ saksbehandler, vedlegg |
| `reviews` | Vurderinger, moderasjon, eksterne kilder, A-krav |
| `seasons` | Sesongleie-fordeling for lag/foreninger, prioritets-regler |
| `accounting` | EHF, Fiken / Tripletex / Visma / PowerOffice / DNB-adaptere |

## Tjeneste-lag (5 komponenter)

| Komponent | Hovedansvar |
|---|---|
| `intelligence` | Site-audits, Vekst-harness (keywords → drafts → publish), content-pipeline |
| `support` | Sak-håndtering, escalation, runbook-binding, on-call |
| `admin` | Plattform-drift, tenant-tilsyn, kill-switches, support-impersonering |
| `migrations` | Convex-skjema-migrering, datatransport, blue/green-bytter |
| `reporting` | Aggregert tenant + plattform-rapportering, eksport |

## Avhengighet-graf (forenklet)

```
                    ┌───────────────────────────────┐
                    │           audit               │
                    └──────────────▲────────────────┘
                                   │ (alle komponenter logger)
   ┌──────────┬───────────┬────────┴────────┬───────────┬──────────┐
   │ identity │   rbac    │     tenants     │ payments  │ bookings │
   └────▲─────┴────▲──────┴────▲────────────┴────▲──────┴────▲─────┘
        │          │           │                 │           │
        │  ┌───────┴───────────┴────┐    ┌───────┴───────────┴─┐
        └──┤    notifications       │    │      ledger          │
           └───────▲────────────────┘    └─────────────────────┘
                   │
        ┌──────────┴──────────────┐
        │      messaging          │
        └─────────────────────────┘
```

## Beslektet

- [Datamodell](/arkitektur/datamodell/) · [Hendelse-buss](/arkitektur/event-bus/)
