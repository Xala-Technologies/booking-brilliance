---
title: Arkitektur-oversikt
description: Tre-plan-design med 27 komponenter, ~80 kjernetabeller, 50 cron-jobber, 110+ hendelse-topics. Komplett systemkart.
---

Digilist følger et tre-plan-design: **tynne frontend-apper**, en **kilde-bare SDK**, og en
**Convex-basert kontrollplan** bygd av 27 isolerte komponenter.

## 1. Tre-plan-design

```
┌────────────────────────────────────────────────────────────────────┐
│  OPPLEVELSE-PLAN — 2 React-apper                                  │
│                                                                    │
│  apps/web       Offentlig markedsplass — søk, betaling, billett   │
│                 Helt un-scoped (ingen tenantId på lese-spørringer)│
│                                                                    │
│  apps/dashboard Forent dashboard — /admin/* (tenant) + /platform/*│
│                 (plattform-drift). users.role + tenantUsers.role  │
│                 styrer hva hver person ser. ~126 ruter            │
└────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌────────────────────────────────────────────────────────────────────┐
│  SDK-PLAN — kilde-bare TypeScript-pakke (packages/sdk/)           │
│                                                                    │
│  convex-provider.tsx   XalaConvexProvider — klient + cache        │
│  hooks/  (109 filer)   ~870 navngitte eksporter                   │
│  transforms/  (16)     Convex-form ↔ Digilist-form                │
└────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌────────────────────────────────────────────────────────────────────┐
│  KONTROLL-PLAN — Convex                                           │
│                                                                    │
│  schema.ts            ~80 kjernetabeller                          │
│  domain/  (103 filer) ~960 fasade-spørringer/mutasjoner/handlinger│
│  components/  (27)    Isolerte, plug-and-play komponenter         │
│  crons.ts             50 planlagte jobber                         │
│  http.ts              Webhook-endepunkter (Stripe, Vipps, Signicat)│
└────────────────────────────────────────────────────────────────────┘
```

## 2. Delte pakker

| Pakke | Rolle | Notater |
|---|---|---|
| `@digilist/sdk` | Type-trygt data-lag | Kilde-bare, ingen byggesteg. Provider + hooks + transforms. |
| `@digilist/app-shell` | Provider-komposisjon + rutevakter | AuthProvider, RequireAuth, RoleProvider, FeatureGate, kapabiliteter. |
| `@digilist/digilist` | Domene-UI-komponenter | Listings, bookings, calendar, reviews, cart. |
| `@digilist/shared` | Plattform-typer + konstanter | Multi-entry: `./types`, `./constants`, `./navigation`. |
| `@digilist/ds` | Designsystem | Digdir Designsystemet base, Digilist-tema, komponent-registry. |
| `@digilist/i18n` | i18next-wrapper | Lokaliteter: `nb` (default), `en`, `ar` (RTL). |

**Kanonisk regel.** Auth, realtime, RBAC og feature-flags må komme fra
`@digilist/app-shell` (wrapping SDK). Ingen lokal `useAuth`, `AuthProvider`
eller `RealtimeProvider` i appene. Dette hindrer drift mellom apper.

## 3. Komponent-arkitektur

Hver Convex-komponent eier sine tabeller, funksjoner, schema og kontrakt.
Komponenter **spørrer aldri hverandres tabeller direkte** — all kryss-komponent-tilgang
går via fasader i `convex/domain/` eller over hendelse-bussen.

### 3.1 Plattform-lag (10 komponenter)

Identitet, infrastruktur, observabilitet — felles fundament for alle tenants.

| Komponent | Ansvar |
|---|---|
| `identity` | Brukere, sesjoner, MFA, step-up auth |
| `rbac` | Roller, tillatelser, kapabiliteter |
| `tenants` | Tenant-livssyklus, billing-binding, team-medlemskap |
| `audit` | Hendelse-loggføring, retention, DSAR-eksport |
| `feature-flags` | Plattform kill-switches, tenant overrides |
| `notifications` | E-post-pipeline, SMS, push, in-app |
| `secrets` | Kryptert nøkkel-lager med step-up |
| `geo` | Brreg, adresse-oppslag, kart |
| `media` | CDN-opplastinger, transformasjoner |
| `i18n` | Oversettelser, lokaliteter |

### 3.2 Forretnings-lag (12 komponenter)

Booking-motor, betalinger, ressurser — kjerne-domenet.

| Komponent | Ansvar |
|---|---|
| `resources` | Lokaler, utleieobjekter, tjenester, events |
| `bookings` | Slot-allokering, godkjenningsflyt, konflikter |
| `calendar` | Åpningstider, blokker, sesonger, rekurrens |
| `payments` | Checkout, Stripe/Vipps/Nets-routing, refusjon |
| `ledger` | Provisjon-snapshot, payouts, escrow |
| `subscriptions` | Basis/Pluss/Premium-nivåer, plan-grinder |
| `tickets` | Event-billett-typer, kjøp, innsjekk, salg igjen |
| `memberships` | Medlemskap, kontingent, fornyelse |
| `messaging` | Trådet kommunikasjon innbygger ↔ saksbehandler |
| `reviews` | Vurderinger, moderasjon, eksterne kilder |
| `seasons` | Sesongleie, fordelings-regler for lag/foreninger |
| `accounting` | EHF, Fiken/Tripletex/Visma/PowerOffice-adaptere |

### 3.3 Tjeneste-lag (5 komponenter)

Operatør-verktøy — bygd oppå plattform + forretning.

| Komponent | Ansvar |
|---|---|
| `intelligence` | Site-audits, vekst-harness, content-pipeline |
| `support` | Sak-håndtering, escalation, runbook-binding |
| `admin` | Plattform-drift, tenant-tilsyn, kill-switches |
| `migrations` | Convex-skjema-migrering, datatransport |
| `reporting` | Aggregert tenant + plattform-rapportering |

## 4. Operasjons-fakta

- **27 komponenter** · **~80 kjernetabeller** · **103 fasade-filer** · **~960 fasade-funksjoner**
- **109 hook-filer** med ~870 eksporter
- **2 apper** (web + dashboard) · **~126 ruter**
- **50 cron-jobber** klassifisert i W3-A
- **110+ hendelse-topics** på outbox-bussen

## 5. Drift- og test-tall

- **~2 044 tester** totalt: 281 SDK + 1 470 Convex unit + 71 Convex E2E + 135 Playwright + 87 A-krav
- **99,98 % oppetid** siste 90 dager (mai 2026)
- **94s median booking-tid** fra førstegangs-besøk til bekreftet betaling
- **100 % EØS-data-lokasjon** (Frankfurt / Stockholm)

## Beslektet

- [Datamodell](/arkitektur/datamodell/) — alle 80 tabellene
- [Hendelse-buss](/arkitektur/event-bus/) — outbox + topic-katalog
- [Komponent-katalog](/arkitektur/komponenter/) — per-komponent dyp-dykk
