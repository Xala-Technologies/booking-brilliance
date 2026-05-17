---
title: ID-porten
description: OIDC-konfigurasjon, scopes, PID-håndtering, callback-flyt, sandbox vs produksjon. Slik kobler tenants ID-porten til sin innbygger-pålogging.
---

ID-porten er Difi's nasjonale innloggings-løsning. Digilist bruker ID-porten
som primær innloggings-mekanisme for innbyggere — særlig der saksbehandling
krever sikker identifisering.

## 1. Klient-oppsett

Hver tenant har én ID-porten-klient registrert via Samarbeidsportalen.
Konfigurasjonen ligger i `tenants.oauthConfig.idPorten`:

```ts
{
  client_id: "digilist-{tenant-slug}",
  issuer: "https://oidc.difi.no/idporten-oidc-provider/",
  scopes: ["openid", "profile", "pid", "krr"],
  redirect_uri: "https://{tenant-slug}.digilist.no/auth/callback/id-porten",
  acr_values: "idporten-loa-substantial",  // eller "idporten-loa-high" for BankID
  ui_locales: "nb",
}
```

## 2. OIDC-flyt

```
INNBYGGER                  DIGILIST                   ID-PORTEN
    │                         │                          │
    │ ───── trykker "Logg inn" ────────────────────────> │
    │                         │ ── 302 redirect to OIDC ─│
    │ <───────── 302 ─────────│                          │
    │ ── GET /authorize? ─────────────────────────────>  │
    │ <── viser ID-porten innlogging ──────────────────  │
    │ ── velger BankID, autentiserer ─────────────────>  │
    │ <── 302 til redirect_uri med ?code=...  ─────────  │
    │ ── GET /auth/callback?code=... ───>│              │
    │                         │ ── POST /token ──────>  │
    │                         │ <── id_token (JWT) ───  │
    │                         │ Verifiser sig, hent PID │
    │                         │ Slå opp/opprett user    │
    │                         │ Set session cookie       │
    │ <── 302 til /min-side ──│                          │
```

## 3. Scopes vi ber om

| Scope | Hva vi får | Brukes til |
|---|---|---|
| `openid` | `sub` (subject identifier) | Påkrevd for OIDC |
| `profile` | `name`, `given_name`, `family_name` | Visning i Min side |
| `pid` | `pid` (norsk fødselsnummer) | Booking-bekreftelse, KYC for fakturering |
| `krr` | `email`, `mobile` (fra Kontakt- og reservasjons-registeret) | Forhåndsutfylling, varsler |

PID lagres aldri i klartekst i Digilist. Vi hash'er med per-tenant pepper og
indekserer som `pidHash` på `users`-tabellen. Klartekst-PID lever bare i
sesjonen og slettes når sesjonen utløper.

## 4. ACR-nivåer

| ACR | Sikkerhetsnivå | Brukes når |
|---|---|---|
| `idporten-loa-substantial` | MinID, BankID på Mobil, Buypass | Standard innbygger-innlogging |
| `idporten-loa-high` | BankID, Commfides, Buypass | Saksbehandling, signering, refusjon > 5 000 kr |

For step-up: når innbygger må gjøre en sensitiv handling og er innlogget med
`substantial`, ber vi om re-autentisering med `high`. Dette håndteres av
`identity.requireMfa` → `acr_values=idporten-loa-high`.

## 5. Webhook / back-channel logout

ID-porten støtter [back-channel logout](https://docs.digdir.no/idporten_oidc_protocol.html#back-channel-logout). Digilist registrerer
`backchannel_logout_uri = https://{tenant}.digilist.no/auth/idporten-logout` og
inviterer alle sesjoner i `sessions`-tabellen som matcher `sid` i logout-token.

```ts
// convex/http.ts
http.route({
  path: "/auth/idporten-logout",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const logoutToken = await request.text();
    const claims = await verifyIdPortenJWT(logoutToken);
    await ctx.runMutation(internal.identity.invalidateSessionsBySid, {
      sid: claims.sid,
    });
    return new Response(null, { status: 200 });
  }),
});
```

## 6. Sandbox vs produksjon

| Miljø | Issuer | Brukes |
|---|---|---|
| **VER1 (test)** | `https://oidc-ver1.difi.no/idporten-oidc-provider/` | All utvikling og staging. Test-PID som `04031049739`. |
| **PROD** | `https://oidc.difi.no/idporten-oidc-provider/` | Kun for tenants som har gjennomført Difi-godkjenning. |

## 7. Operasjon

- **Sirkulasjon av client_secret:** Hver 6. måned via cron `cron.weekly.06_monthly_secret_rotation`.
- **Overvåking:** `/platform/integrations/id-porten` viser feilrate, latency p95, og siste 100 callbacks.
- **Feil-respons:** Hvis ID-porten er nede, faller vi tilbake til magic-link/SMS for innlogging og viser en banner på Min side.

## Beslektet

- [BankID + Signicat](/integrasjoner/) (kommer)
- [Identity-komponent](/arkitektur/komponenter/#identity)
- [Audit · GDPR](/compliance/gdpr/)
