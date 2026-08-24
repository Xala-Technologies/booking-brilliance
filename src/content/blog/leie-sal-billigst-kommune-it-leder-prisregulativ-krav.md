---
slug: leie-sal-billigst-kommune-it-leder-prisregulativ-krav
title: "Prisregulativ i bookingsystemet: kravene fra IT-leder"
description: "Skal bookingsystemet beregne riktig pris automatisk og tåle revisjon? Se kravene til differensiert pris, rabattkoder og fakturaintegrasjon i anskaffelsen."
date: 2026-08-07
author: "Ibrahim Rahmani"
role: "Grunnlegger, Digilist"
readingMinutes: 7
tag: "IT-leder"
cover: "/images/blog/ssal_2026_booking_hero.webp"
keywords: ["differensiert pris kommune", "prisregulativ sal", "rabattkode og friplass", "fakturaintegrasjon økonomisystem", "SSA-L krav prisregulativ", "GDPR og prisdata", "revisjonsspor booking", "bookingsystem kommune"]
---

«Billigst sal i kommunen» høres ut som et spørsmål om prisliste. I praksis er det et systemkrav: hvis bookingsystemet ikke beregner riktig pris automatisk for hver leietakerkategori, ender kommunen med underfakturering, klager fra leietakere som opplever forskjellsbehandling, og et regneark ved siden av systemet som bare én saksbehandler forstår fullt ut. Når kommunen etterhvert skal anskaffe eller bytte bookingsystem, er det denne logikken som avgjør om løsningen fungerer i drift, ikke hvor pen bookingsiden er. Denne artikkelen går gjennom hva IT-leder bør stille av krav til prislogikk, integrasjon og sporbarhet, med tanke på anskaffelse under SSA-L.

## Hvorfor «billigst sal i kommunen» i praksis er et systemkrav, ikke en prisliste

En prisliste på nettsiden forteller innbyggeren hva en time koster. Den forteller ingenting om hvordan systemet håndterer et lag med friplass, en ekstern leietaker med kommersiell sats, eller en forening som får redusert pris etter vedtak i kultur- og idrettsutvalget. Uten kodet logikk må saksbehandler regne ut riktig pris manuelt for hver booking, og feilmarginen øker med antall unntak i regelverket.

En kommune med flere idrettshaller, kulturhus og forsamlingslokaler opererer i praksis fort med ti eller flere leietakerkategorier, hver med egne satser, rabattregler og godkjenningskrav. Det er ikke et regnestykke én person kan holde konsistent over tid, uansett hvor godt vedkommende kjenner regelverket. Når nøkkelpersonen slutter eller har ferie, forsvinner kunnskapen med personen, og feilene dukker først opp i neste internrevisjon.

## Differensiert pris i bookingsystemet: lag og foreninger, innbyggere, næringsliv og eksterne

Et bookingsystem beregnet for kommunal utleie må støtte flere prisnivåer per lokale, ikke bare én sats med manuell rabatt lagt på toppen. Typiske kategorier er:

- Lag og foreninger med kommunal støtteordning
- Innbyggere som booker privat
- Næringsliv og kommersielle leietakere
- Eksterne leietakere fra andre kommuner
- Kommunens egne virksomheter (skole, kultur, helse) som booker internt

Prisen skal beregnes automatisk ut fra hvem som booker, når og hvilket lokale, uten at saksbehandler overstyrer manuelt for hver transaksjon. I praksis betyr det at systemet må kombinere tre variabler samtidig: leietakerkategori, lokaletype og tidspunkt, for eksempel kveld- og helgetillegg eller sesongpris. Kravet til IT-leder er at denne kombinasjonen konfigureres én gang i et regelsett, ikke bygges som unntak i etterkant av hver klage. I Digilist ligger denne logikken i selve bookingmotoren, koblet til leietakerkategori og lokaletype, med mulighet til å legge til nye kategorier uten kodeendring.

## Rabattkoder, friplasser og tilskudd: reglene kodet inn uten manuell overstyring

### Ulike typer rabattgrunnlag krever ulike regler

Rabattkoder og friplasser knyttet til tilskuddsvedtak må være regler i systemet, ikke unntak noen husker å legge inn manuelt. I praksis dekker dette flere ordninger som ikke kan behandles likt:

- Faste rabatter for lag og foreninger vedtatt i kultur- eller idrettsplan
- Tidsbegrensede friplasser knyttet til enkeltvedtak, for eksempel sosialt lavterskeltilbud
- Tilskudd som dekker deler av leien, der kommunen fakturerer differansen til et internt budsjettformål

Kravet til IT-leder er at rabattlogikk kan konfigureres per lag, periode eller lokale, og at den slår inn automatisk ved booking, med utløpsdato der vedtaket er tidsbegrenset. Alternativet, at saksbehandler manuelt justerer pris etter e-postdialog, er nettopp den flaskehalsen digitalisering skal fjerne. Manuell rabattbehandling tar typisk et sted mellom 10 og 15 minutter per sak i perioder med høyt volum, som ved sesongstart om høsten; med flere hundre saker i den perioden utgjør det fort flere ukeverk saksbehandlertid som kunne vært automatisert bort.

## Integrasjon mot økonomi- og fakturasystem: hvor feilfakturering faktisk oppstår

Feil oppstår sjeldnest i selve prisberegningen, men i overgangen mellom bookingsystem og økonomisystem. Hvis prisdata må tastes inn på nytt i et fakturasystem som Visma eller Agresso, introduseres en manuell feilkilde ved hver eneste transaksjon, og volumet gjør at selv en lav feilrate blir mange feilfakturaer i året.

Kravet til IT-leder er en dokumentert API-integrasjon som sender korrekt beregnet pris, leietakerkategori, mva-sats og eventuell rabattkode direkte til fakturagrunnlaget, uten mellomsteg. Integrasjonen bør også håndtere kreditnota ved avbestilling, slik at en kansellert booking ikke blir stående som ubetalt krav i økonomisystemet. Digilist tilbyr slik integrasjon som standard mot vanlige kommunale økonomisystemer, og kravspesifikasjonen bør be leverandøren dokumentere hvilke systemer integrasjonen faktisk er testet mot, ikke bare at «integrasjon er mulig».

## Sporbarhet og revisjon: å dokumentere hvorfor en pris ble som den ble

Ved klage eller internrevisjon holder det ikke å vise hva prisen ble. Kommunen må kunne dokumentere hvorfor: hvilken kategori leietakeren tilhørte, hvilken regel som slo inn, hvem som eventuelt godkjente et unntak, og når prisen ble beregnet. Et revisjonsspor per booking, med tidsstempel og regelhenvisning, bør derfor være et eksplisitt krav i kravspesifikasjonen, ikke noe man antar systemet har.

Dette har også en praktisk side utover revisjon: når en innbygger eller forening klager på pris, skal saksbehandler kunne finne svaret i systemet på minutter, ikke lete gjennom e-postkorrespondanse fra flere måneder tilbake. Et revisjonsspor som kan eksporteres til regneark eller PDF, gjør også kommunerevisjonens stikkprøver enklere å gjennomføre.

## Krav til prisregulativ i anbudet: hva IT-leder bør spesifisere under SSA-L

I en SSA-L-anskaffelse bør prisregulativ-håndtering beskrives som eget funksjonelt krav, ikke som en generell «fleksibel prising»-formulering som leverandøren fyller med eget innhold. Konkret bør kravspesifikasjonen stille krav om:

- Støtte for et definert antall leietakerkategorier, satt av kommunen selv
- Automatisk rabattlogikk med start- og sluttdato
- Revisjonsspor tilgjengelig for eksport
- Dokumentert API mot navngitte økonomisystemer

Be også leverandøren demonstrere prisregulativet i en test med kommunens egne kategorier og satser før kontraktsignering, ikke bare beskrive det i tilbudet. Uten dette blir det leverandøren som definerer hva «differensiert pris» betyr i praksis, gjerne etter at kontrakten er signert og forhandlingsposisjonen er borte.

## GDPR og datalokasjon når personopplysninger kobles til prisberegning

Rabattgrunnlag er ofte koblet til personopplysninger, for eksempel medlemskap i et lag, alder, eller inntektsbasert friplass. Det gjør prisdata til et personvernspørsmål, ikke bare et økonomisk et. Krav til IT-leder bør inkludere at leverandøren dokumenterer databehandleravtale, datalagring i EU/EØS, og at ISO 27001 eller tilsvarende sertifisering foreligger. Dette bør stå som et eget avsnitt i kravspesifikasjonen, med krav om at leverandøren viser hvor data faktisk lagres og prosesseres, ikke bare at «GDPR overholdes». Digilist driftes med databehandleravtale og datalagring i EU.

## Konsekvensene av et bookingsystem uten korrekt prislogikk

Uten kodet prislogikk havner kommunen i tre situasjoner samtidig: underskudd fordi rabatter glemmes eller feilberegnes, klager fra leietakere som opplever ulik behandling for lik bruk, og manuelt merarbeid for saksbehandler som må kontrollregne hver faktura før den sendes. Kostnaden vises sjelden på IT-budsjettet. Den vises som ekstra saksbehandlertid, som avvik i kommunerevisjonens rapport, og som tapt tillit når en forening oppdager at naboklubben har fått en annen pris for samme type booking. Et bookingsystem uten prislogikk koster i praksis mer i administrasjon over tid enn selve lisensen.

### Sjekkliste: krav til bookingsystem for korrekt og etterprøvbart prisregulativ

- Støtter et definert sett leietakerkategorier med automatisk prisberegning
- Rabattkoder og friplasser konfigurerbare med start- og sluttdato, uten manuell overstyring
- Dokumentert API-integrasjon mot kommunens økonomisystem, inkludert kreditnota ved avbestilling
- Revisjonsspor per booking med tidsstempel, regelhenvisning og eksportmulighet
- Databehandleravtale og datalagring i EU/EØS, med dokumentert sertifisering
- Prisregulativ-krav eksplisitt formulert og testet før kontraktsignering i SSA-L-kravspesifikasjonen

## Book demo

Digilist er bygget for kommunal utleie med differensiert prislogikk, rabatt- og tilskuddsregler, og revisjonsspor som standard, koblet mot vanlige kommunale økonomisystemer. Book en demo for å se hvordan prisregulativet kan spesifiseres, testes og dokumenteres før anskaffelsen lyses ut.