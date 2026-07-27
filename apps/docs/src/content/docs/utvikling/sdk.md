---
title: SDK & hooks
description: Hook-mønstre, transforms, hvordan legge til en ny hook. SDK er kilde-bare og deles på tvers av web og dashboard.
---

`@digilist/sdk` er pakken som binder frontend-apper til Convex-kontrollplanet.
Pakken er **kilde-bare** — ingen byggesteg. Den eksporterer:

- **`XalaConvexProvider`** — Convex-klient + cache-singleton
- **Hooks** (109 filer, ~870 navngitte eksporter) — `use<Domain><Action>()`-mønster
- **Transforms** (16 filer) — Convex-form ↔ Digilist-form-konvertering
- **Compat-shims** — no-op-erstatninger for gammel API

## 1. Hook-mønster

Hver hook følger samme struktur:

```ts
// packages/sdk/src/hooks/use-bookings.ts
import { useQuery, useMutation } from "convex/react";
import { api } from "../convex-api";

export function useBookings(args: { resourceId?: Id<"resources"> } = {}) {
  return useQuery(api.bookings.list, args);
}

export function useCreateBooking() {
  const mutate = useMutation(api.bookings.create);
  return async (input: CreateBookingInput) => {
    const result = await mutate(input);
    return transformBooking(result);
  };
}

export function useApproveBooking() {
  return useMutation(api.bookings.approve);
}
```

## 2. Bruks-eksempel

```tsx
// apps/web/src/components/BookingForm.tsx
import { useBookings, useCreateBooking } from "@digilist/sdk";

export function BookingForm({ resourceId }: { resourceId: Id<"resources"> }) {
  const existing = useBookings({ resourceId });
  const create = useCreateBooking();

  async function onSubmit(form: FormData) {
    await create({
      resourceId,
      startsAt: Number(form.get("startsAt")),
      endsAt: Number(form.get("endsAt")),
    });
  }

  return (/* … */);
}
```

## 3. Transforms

Convex returnerer "rå" tabell-data. Mange UI-komponenter vil ha en transformert
form (datoer som `Date`, sammenslåtte felter, oversatte enums). Transforms
sentraliserer denne konverteringen:

```ts
// packages/sdk/src/transforms/booking.ts
export function transformBooking(raw: Doc<"bookings">): Booking {
  return {
    id: raw._id,
    resourceId: raw.resourceId,
    startsAt: new Date(raw.startsAt),
    endsAt: new Date(raw.endsAt),
    state: BOOKING_STATE_LABELS[raw.state],
    durationMinutes: (raw.endsAt - raw.startsAt) / 60_000,
    priceFormatted: formatNok(raw.priceCents),
  };
}
```

Bruk samme transform overalt — det er kilde-til-sannhet for hvordan UI ser
en booking. Test transforms med Vitest:

```ts
// packages/sdk/src/transforms/__tests__/booking.test.ts
describe("transformBooking", () => {
  it("converts cents to formatted NOK", () => {
    const raw = { ...baseDoc, priceCents: 80000 } as Doc<"bookings">;
    expect(transformBooking(raw).priceFormatted).toBe("800,00 kr");
  });
});
```

## 4. Legge til en ny hook

Sjekk-liste:

1. **Lag fasaden** i `convex/domain/<domain>.ts`:

   ```ts
   export const list = query({
     args: { resourceId: v.optional(v.id("resources")) },
     handler: async (ctx, { resourceId }) => {
       const session = await requireSession(ctx);
       // … scope til session.tenantId
     },
   });
   ```

2. **Lag transformen** hvis returverdi er ikke-trivielt:

   ```ts
   // packages/sdk/src/transforms/<domain>.ts
   export function transformX(raw: Doc<"x">): X { /* … */ }
   ```

3. **Lag hooken** i `packages/sdk/src/hooks/use-<domain>.ts`:

   ```ts
   export function useX() {
     return useQuery(api.<domain>.list);
   }
   ```

4. **Skriv test** i `packages/sdk/src/hooks/__tests__/use-<domain>.test.tsx` med `@convex/react-test`:

   ```ts
   it("returns transformed bookings", async () => {
     const { result } = renderHook(() => useBookings(), { wrapper });
     await waitFor(() => expect(result.current).toHaveLength(2));
   });
   ```

5. **Eksporter** fra `packages/sdk/src/index.ts`.

## 5. Caching-strategi

Convex `useQuery` returnerer alltid live-data via WebSocket. Cache er pr query-args.

- **Identiske args** = samme cache-entry, ingen ny nettverks-runde
- **Nye args** = ny entry, men WS-forbindelsen er gjenbrukt
- **Mutate** = automatisk re-fetch av berørte queries (Convex sporer leseavhengigheter)

For ekstra cache-kontroll, bruk `useStableQuery` i SDK (deduplikerer rask
prop-change-storm).

## 6. App-shell-wrappers

Auth, realtime og RBAC kommer via `@digilist/app-shell`, ikke direkte fra SDK:

```tsx
// apps/web/src/main.tsx
import {
  AuthProvider,
  RealtimeProvider,
  RoleProvider,
} from "@digilist/app-shell";

export default function App() {
  return (
    <XalaConvexProvider>
      <AuthProvider>
        <RealtimeProvider>
          <RoleProvider>
            <Routes />
          </RoleProvider>
        </RealtimeProvider>
      </AuthProvider>
    </XalaConvexProvider>
  );
}
```

## 7. Vanlige feil

| Feil | Sannsynlig årsak |
|---|---|
| `useQuery returned undefined` | Query argumenter er `undefined` — Convex hopper over kjøring. Sjekk default-args. |
| `Mutation not found` | Glemt å re-eksportere i `convex/_generated/api`. Kjør `npx convex codegen`. |
| Cache flapper | To hooks bruker samme query med litt forskjellige args. Konsolider eller bruk `useStableQuery`. |
| `TypeError: Cannot read property 'pid' of undefined` | Bruker ikke `RequireAuth` rundt komponenten. |

## Beslektet

- [Kom i gang som utvikler](/utvikling/kom-i-gang/)
- [Arkitektur · Datamodell](/arkitektur/datamodell/)
- [API-referanse](/api-referanse/)
