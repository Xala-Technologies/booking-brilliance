---
title: EHF / Peppol
description: Elektronisk faktura til kommune, fylke og stat. Access-point-konfigurasjon, AS4-transport, validering, KID-generering, retransmittering.
---

EHF (Elektronisk Handelsformat) er det norske formatet for elektronisk faktura
til offentlige kjøpere. Digilist sender EHF-fakturaer via [Peppol](https://peppol.eu/)-nettverket gjennom
en sertifisert access point.

## 1. Når EHF brukes

| Scenario | Faktura-rute |
|---|---|
| Innbygger booker som privat-person | Vipps eller Stripe direkte. Ingen EHF. |
| Innbygger booker på vegne av lag/forening | EHF til lagets eFaktura-adresse (orgnr + 0192 prefix) |
| Innbygger booker fra kommunal kontekst | EHF til kommunens fakturasystem (UBL Invoice 2.1 → Peppol BIS Billing 3.0) |
| Tenant (utleier) får payout | Stripe payout, ikke EHF |

## 2. Identifisering av mottaker

Norsk Peppol-mottaker har formatet **`0192:orgnr`**:

```ts
function peppolId(orgnr: string): string {
  return `0192:${orgnr.replace(/\s/g, "")}`;
}

// Eksempel: Oslo kommune
peppolId("958935420")  // → "0192:958935420"
```

Vi slår opp tilgjengelig kapabiliteter i [Peppol Directory](https://directory.peppol.eu/):

```ts
async function canReceiveEhf(orgnr: string): Promise<boolean> {
  const id = peppolId(orgnr);
  const res = await fetch(
    `https://directory.peppol.eu/search/1.0/json?participant=${id}`
  );
  const data = await res.json();
  return data.matches?.some((m) =>
    m.docTypes?.includes(
      "busdox-docid-qns::urn:oasis:names:specification:ubl:schema:xsd:Invoice-2::Invoice##urn:cen.eu:en16931:2017"
    )
  );
}
```

## 3. Generere EHF-XML

Vi bruker UBL Invoice 2.1 med Peppol BIS Billing 3.0-profil:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<Invoice xmlns="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2">
  <cbc:CustomizationID>urn:cen.eu:en16931:2017#compliant#urn:fdc:peppol.eu:2017:poacc:billing:3.0</cbc:CustomizationID>
  <cbc:ProfileID>urn:fdc:peppol.eu:2017:poacc:billing:01:1.0</cbc:ProfileID>
  <cbc:ID>{{kid}}</cbc:ID>
  <cbc:IssueDate>{{issueDate}}</cbc:IssueDate>
  <cbc:DueDate>{{dueDate}}</cbc:DueDate>
  <cbc:InvoiceTypeCode>380</cbc:InvoiceTypeCode>
  <cbc:Note>Booking av {{resourceName}} {{startsAt}}</cbc:Note>
  <cbc:DocumentCurrencyCode>NOK</cbc:DocumentCurrencyCode>

  <cac:AccountingSupplierParty><!-- Tenant --></cac:AccountingSupplierParty>
  <cac:AccountingCustomerParty><!-- Kjøper, orgnr --></cac:AccountingCustomerParty>

  <cac:PaymentMeans>
    <cbc:PaymentMeansCode>30</cbc:PaymentMeansCode>
    <cbc:PaymentID>{{kid}}</cbc:PaymentID>
    <cac:PayeeFinancialAccount>
      <cbc:ID>{{kontonummer}}</cbc:ID>
    </cac:PayeeFinancialAccount>
  </cac:PaymentMeans>

  <cac:TaxTotal><!-- MVA-spesifisering --></cac:TaxTotal>
  <cac:LegalMonetaryTotal><!-- Beløp --></cac:LegalMonetaryTotal>
  <cac:InvoiceLine><!-- Per booking-linje --></cac:InvoiceLine>
</Invoice>
```

## 4. KID-generering

KID (Kunde-ID) genereres med [Mod-10 sjekksum](https://no.wikipedia.org/wiki/MOD_10):

```ts
function generateKid(bookingId: string): string {
  // Booking-ID konverteres til numerisk + sjekksiffer
  const numeric = bookingIdToNumeric(bookingId);    // 12 sifre
  const checkDigit = mod10(numeric);
  return `${numeric}${checkDigit}`;                 // 13 sifre
}
```

KID lagres på `invoices`-tabellen med unique-index `by_kid` slik at
innbetalinger fra bank kan matches automatisk.

## 5. AS4-transport

EHF-XML sendes til Peppol-nettverket via AS4 (ebMS 3.0). Digilist er ikke et
access point selv — vi bruker [Sendregning](https://sendregning.no/) som AP.

```
DIGILIST                  SENDREGNING (AP)            PEPPOL-NETTVERK         MOTTAKER-AP
   │                            │                           │                      │
   │ ── POST /v1/invoices ────> │                           │                      │
   │      (EHF-XML)             │                           │                      │
   │                            │ ── AS4 over HTTPS ─────>  │                      │
   │                            │                           │ ── ruting ────────>  │
   │                            │ <── delivery receipt ──── │ <── receipt ──────── │
   │ <── webhook /sendt ────────│                           │                      │
   │   (eller /feilet)          │                           │                      │
```

## 6. Validering

Før vi sender, validerer vi mot Peppol BIS Billing 3.0-skjemaet
([Schematron](https://docs.peppol.eu/poacc/billing/3.0/)):

```ts
import { validateInvoice } from "@digilist/ehf-validator";

const xml = renderEhfInvoice({ booking, tenant, customer });
const result = await validateInvoice(xml);
if (!result.ok) {
  throw new ConvexError({
    kind: "ehf_validation_failed",
    errors: result.errors,
  });
}
```

Vanlige feil:

| Feil | Årsak |
|---|---|
| `BR-CO-15` | MVA-sum stemmer ikke med linje-sum |
| `BR-DE-1` | Manglende `OrderReference` (BuyerRef) for offentlige kjøpere |
| `BR-S-08` | Standard-MVA-sats brukt, men mottaker er fritatt (kultur) |
| `PEPPOL-EN16931-R046` | KID lengre enn 25 tegn |

## 7. Retransmittering

Hvis Peppol-mottaker rapporterer feil, lagrer vi `invoices.state = "failed"` og
viser en re-send-knapp i `/admin/invoices/{id}`. Driftsleder kan også
generere PDF-kopi og sende manuelt via e-post som backup.

## 8. Sandbox vs produksjon

| Miljø | Sendregning-prefix | Test-Peppol-mottaker |
|---|---|---|
| **Test** | `https://api-test.sendregning.no/` | `9908:990399123` (Sendregnings test-mottaker) |
| **PROD** | `https://api.sendregning.no/` | Faktisk orgnr |

## 9. Operasjon

- **Daglig batch:** Cron `cron.daily.06_00` batches alle EHF-klare fakturaer og sender til Sendregning.
- **Feilrate-mål:** < 1 % retransmittering.
- **Lagring:** Original XML lagres i `media`-komponenten 10 år (regnskapsloven § 13).

## Beslektet

- [Vipps · e-faktura](/integrasjoner/vipps/#5-e-faktura-via-vipps) (lett-versjon, ikke EHF)
- [Accounting-komponent](/arkitektur/komponenter/#regnskap)
