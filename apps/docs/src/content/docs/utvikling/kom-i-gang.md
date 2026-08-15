---
title: Kom i gang som utvikler
description: Forutsetninger, install, første lokale kjøring, seeding av databasen, dev-kommandoer, og monorepo-struktur.
---

## Forutsetninger

- **Node.js** 20+
- **pnpm** 9+ (`corepack enable && corepack prepare pnpm@latest --activate`)
- **Convex** konto og CLI (`npm i -g convex`)

## Oppsett

```bash
# Klon
git clone git@github.com:xalatechnologies/booking-brilliance.git
cd booking-brilliance

# Installer
pnpm install

# Start Convex dev server (watcher schema + funksjoner + komponenter)
pnpm dev:convex

# Seed databasen (kun første gang)
npx convex run seeds:seedAll
npx convex run seedComponents:seedAll

# Start web-appen (i et annet terminal-vindu)
pnpm dev:web
```

## Dev-kommandoer

| Kommando | Beskrivelse |
|---|---|
| `pnpm dev` | Alle tjenester (Convex + web + docs + monitoring + dashboard) |
| `pnpm dev:convex` | Convex dev server alene |
| `pnpm dev:web` | Web-appen (port 5190) |
| `pnpm dev:dashboard` | Dashboard-appen (port 5191) |
| `pnpm dev:docs` | Astro Starlight docs (port 4321) |

## Test-kommandoer

| Kommando | Beskrivelse | Antall tester |
|---|---|---|
| `pnpm sdk:test` | SDK hook unit-tester (Vitest, jsdom) | ~281 |
| `pnpm test:convex` | Convex-funksjon-tester (Vitest, edge-runtime) | ~1 470 |
| `pnpm test:convex:watch` | Convex-tester i watch-modus | — |
| `pnpm test:convex:e2e` | Backend E2E-tester | ~71 |
| `pnpm test:e2e` | Playwright browser E2E | ~135 |
| `pnpm test:e2e:a-krav` | Compliance E2E-suiter (A–K) | ~87 |
| `pnpm test:all` | Hele suiten | ~2 044 |

Kjøre én test-fil:

```bash
pnpm sdk:test packages/sdk/src/hooks/use-bookings.test.ts
pnpm test:convex convex/components/bookings/__tests__/bookings.test.ts
```

## Monorepo-struktur

```
booking-brilliance/
├── apps/
│   ├── web/                          Markedsplassen (Astro + React)
│   ├── dashboard/                    Forent dashboard (/admin + /platform)
│   └── docs/                         Disse docs (Astro Starlight)
├── packages/
│   ├── sdk/                          Source-only Convex SDK
│   ├── app-shell/                    Provider-komposisjon, rutevakter
│   ├── digilist/                     Domene-UI-komponenter
│   ├── shared/                       Plattform-typer + konstanter
│   ├── ds/                           Designsystem (Digdir-base + Digilist-tema)
│   ├── ds-themes/                    Tema-tokens
│   ├── i18n/                         i18next-wrapper
│   └── eslint-config/                Delt ESLint-config
├── convex/
│   ├── schema.ts                     ~80 kjernetabeller
│   ├── domain/                       103 fasade-filer, ~960 fasade-funksjoner
│   ├── components/                   27 isolerte komponenter
│   ├── lib/                          Hendelse-buss, audit, middleware, rate-limits
│   ├── crons.ts                      50 planlagte jobber
│   └── http.ts                       Webhook-endepunkter
└── tools/
    ├── content-agent/                Vekst-harness multi-agent system
    └── docs-rag/                     RAG-indeks-builder for docs.digilist.no
```

## Konvensjoner — kort versjon

1. **Auth fra `@digilist/app-shell` — aldri lokalt.** `useAuth`, `RequireAuth`, `RoleProvider` kommer derfra. Hindrer drift mellom apper.
2. **Skriv-fasader scopes alltid til `session.tenantId`.** Lese-fasader på markedsplassen kan være un-scoped.
3. **Hendelser emit'es i samme transaksjon som forretningsskriven** (`emit(ctx, "topic", payload)`). Aldri etterpå.
4. **Abonnenter MÅ være idempotente.** Hendelser kan leveres mer enn én gang.
5. **Komponenter krysser ikke tabeller direkte.** Bruk fasader eller hendelse-bussen.
6. **i18n via `@digilist/i18n`** — aldri hardkodet streng-litteral. Default-lokalitet er `nb`.

## Vanlige feil

| Symptom | Sannsynlig årsak |
|---|---|
| `Cannot read property 'tenantId' of undefined` | Glemt `requireSession(ctx)` før skriv |
| Hot-reload hopper ikke | Convex dev server stoppet — start `pnpm dev:convex` på nytt |
| `pnpm install` feiler | Slett `node_modules` + `pnpm-lock.yaml`, kjør `pnpm install --force` |
| Tester henger | Convex test-runtime trenger `setupConvexTest()` i `beforeAll` |

## Beslektet

- [SDK & hooks](/utvikling/sdk/) — hvordan legge til en ny hook
- [Arkitektur-oversikt](/arkitektur/oversikt/) — systemkart
- [API-referanse](/api-referanse/) — public + admin-endepunkter
