---
slug: differensiert-pris-bookingsystem-kommune-it-leder-kravspesifikasjon
title: "Differensiert pris i bookingsystemet: kravene IT-leder må stille"
description: "Guide for IT-leder: slik sikrer bookingsystemet at prisregulativ, rabattregler og fakturering for sal og lokale følges korrekt, uten manuell overstyring eller klager."
date: 2026-07-31
author: "Ibrahim Rahmani"
role: "Grunnlegger, Digilist"
readingMinutes: 5
tag: "IT-leder"
cover: "/images/blog/ssal_2026_booking_hero.webp"
keywords: ["differensiert pris kommune", "prisregulativ sal", "rabatt fast leietaker forening", "fakturering booking kommune", "kravspesifikasjon bookingsystem", "SSA-L revisjonsspor"]
---

Innbygger, saksbehandler og forening har alle fått sin guide til å finne billigst sal i kommunen. Det de ikke ser er hvor mye som kan gå galt bak kulissene: en prissats som ikke oppdateres, en rabatt som slår feil vei, en faktura som må rettes manuelt hver måned. For IT-leder er "billigst pris" ikke et spørsmål om søk, men om systemarkitektur.

## Hvorfor "billigst pris" er et systemproblem, ikke bare et prisregulativ på papir

Et prisregulativ vedtatt av kommunestyret er bare et dokument til det er kodet inn som logikk. Mange kommuner har regulativer med 10 til 20 satser fordelt på brukergrupper, tidspunkt og lokaletype, men bookingsystemet håndhever bare en brøkdel automatisk. Resten løses med manuell overstyring i skranken eller i et regneark ved siden av. Det er der feilene oppstår: en saksbehandler som glemmer å legge inn rabatt, en driftsleder som fakturerer full pris til en forening som skulle hatt sesongavtale. Konsekvensen er ikke bare feil beløp, men ulik behandling av like søknader, noe som er et forvaltningsrettslig problem, ikke bare et regnskapsproblem.

## Differensiert pris i praksis: innbygger, lag/forening og næring i samme system

De fleste kommuner opererer med minst tre brukergrupper: innbygger til private formål, lag og foreninger med aktivitet for barn og unge, og næringsliv eller eksterne aktører. Bærum kommune og Trondheim kommune er eksempler på kommuner med egne satsgrupper for hver kategori, ofte kombinert med differensiering mellom kommune- og fylkesnivå for haller og saler. Systemet må kunne knytte prisgruppe til brukerens organisasjonsnummer eller medlemskap, ikke til et fritekstfelt som fylles ut ved booking. Uten den koblingen er det brukeren selv, ikke systemet, som avgjør hvilken pris som gjelder.

## Slik må bookingsystemet håndtere rabatt for faste leietakere og sesongavtaler automatisk

Faste leietakere og sesongavtaler krever en annen logikk enn enkeltbooking. En idrettshall med 15 faste lag over en sesong kan ha ulike rabattsatser avhengig av antall timer, tidspunkt på døgnet og om laget driver barne- og ungdomsidrett. Digilists prisregelmotor lar disse reglene defineres én gang, sentralt, og deretter anvendes automatisk på hver booking som treffer betingelsene. Det fjerner behovet for at driftsleder manuelt justerer pris for hver enkelt reservasjon i en sesong som kan bestå av over 30 enkelttimer.

## Fra vedtak til fakturering: hvordan prisregulativet oversettes til korrekt beløp uten manuell overstyring

Et vedtak om sesongtildeling eller enkelttime skal føre til én ting: riktig faktura, uten at noen taster inn beløpet på nytt. I praksis betyr det at bookingmodulen må sende strukturert data, ikke bare et bookingnavn, videre til fakturering: brukergruppe, rabattsats, antall timer og eventuelle tillegg for utstyr eller vask. Systemer der pris beregnes ett sted og faktureres et annet, med manuell overføring mellom, er der de fleste feilene oppstår. Målet er at samme regel som avgjorde prisen ved booking er den som genererer fakturagrunnlaget.

## Avvikshåndtering: hva systemet må logge når feil pris er satt eller en klage kommer inn

Feil skjer uansett hvor godt regelverket er bygget. Det som skiller et modent system fra et sårbart, er hva som logges når det skjer. Systemet bør registrere:

- Hvilken regel som ble anvendt, og når
- Hvem som eventuelt overstyrte prisen manuelt, og begrunnelse
- Tidspunkt for endring, slik at en klage kan spores tilbake til konkret hendelse

Uten den loggen blir hver prisklage en manuell etterforskning på tvers av e-post og regneark. Med den kan saksbehandler svare på en klage om feil pris på minutter, ikke dager.

## Integrasjon mot sak/arkiv og økonomisystem: hvorfor pris ikke kan leve isolert i bookingmodulen

Pris som beregnes i bookingsystemet, men aldri når økonomisystemet eller sak/arkiv, skaper et skyggeregnskap. Kommuner som Lillestrøm har krav om at vedtak knyttet til tildeling og pris skal være sporbare i arkivsystemet, ikke bare i en bookingkalender. Et bookingsystem bygget for kommunal bruk må derfor ha ferdige integrasjoner mot vanlige kommunale økonomisystemer og mot sak/arkiv, slik at faktura, vedtak og eventuell klagebehandling henger sammen uten dobbeltregistrering.

## Kravspesifikasjon i anbudet: konkrete krav til prisregelmotor, SSA-L og revisjonsspor

Når kommunen lyser ut anskaffelse av bookingsystem under SSA-L, bør kravspesifikasjonen stille konkrete krav, ikke bare "systemet skal støtte differensiert pris". Still heller krav om:

- En regelmotor som håndterer minst brukergruppe, tidspunkt, sesong og rabatt i kombinasjon
- Fullt revisjonsspor på prisendringer, inkludert manuelle overstyringer
- Dokumenterte API-er mot økonomisystem og sak/arkiv
- Mulighet for kommunen selv å endre satser uten leverandørbistand ved hvert vedtak

SSA-L-avtalen regulerer ansvar og endringshåndtering, men den fanger ikke opp om løsningen faktisk er bygget riktig. Det er kravspesifikasjonen sin jobb.

## Sjekkliste: slik verifiserer IT-leder at systemet faktisk følger prisregulativet før kontraktsignering

Før kontrakt signeres, bør IT-leder be om en demonstrasjon som viser, ikke påstår, at:

1. En booking fra hver brukergruppe gir riktig pris automatisk
2. En sesongavtale med rabatt beregnes korrekt over flere måneder
3. En manuell overstyring logges med bruker, tidspunkt og begrunnelse
4. Fakturagrunnlaget som sendes til økonomisystemet stemmer med det som ble vist i bookingflyten

Et system som ikke kan vise dette live, bør ikke anses som "differensiert pris-klart" bare fordi det står i tilbudet.

Digilist er bygget med en prisregelmotor, revisjonsspor og ferdige integrasjoner mot sak/arkiv og økonomisystem som del av kjernen, ikke som tilleggsmodul. Book en demo for å se hvordan kommunens eget prisregulativ kan håndheves automatisk, fra booking til faktura.