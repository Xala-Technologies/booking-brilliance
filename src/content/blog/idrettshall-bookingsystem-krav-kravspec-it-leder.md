---
slug: idrettshall-bookingsystem-krav-kravspec-it-leder
title: "Idrettshall-modul i bookingsystemet: kravspec for IT-lederen"
description: "Idrettshaller stiller krav møteromsbooking ikke dekker: sesongtildeling, rammetimeplan, garderobe og spillemidler. Slik skriver du kravspec riktig."
date: 2026-07-16
author: "Ibrahim Rahmani"
role: "Grunnlegger, Digilist"
readingMinutes: 6
tag: "IT-leder"
cover: "/images/blog/sesongleie_hero_no.webp"
keywords: ["idrettshall booking", "idrettshall ledige tider", "idrettshall sesongtildeling", "bookingsystem krav", "spillemidler rapportering", "idrettshall pris"]
---

En idrettshall er ikke et møterom med større gulv. Sesongtildeling etter idrettsrådets fordelingsnøkkel, rammetimeplan, garderobefordeling og spillemiddelrapportering er krav generiske bookingsystemer ikke dekker. Denne guiden er en kravspec-sjekkliste for selve idrettshall-modulen, ikke for lokaler generelt. Bruker du den før du signerer kontrakt, unngår du å kjøpe en møteromsløsning som knekker første sesong.

## Hva gjør idrettshall-booking annerledes

Et møterom bookes av én person for én time. En idrettshall deles samtidig av faste treningsgrupper, kamper i helgen og privat enkeltleie på ukedagskvelder, ofte med hallen delt i to eller tre baner.

En moderne flerbrukshall kan deles med skillevegg i to eller tre spilleflater, og hver flate er et eget bookbart objekt i tillegg til hele hallen. Det gir systemet minst fire tilstander å holde styr på for hver time: bane A, bane B, bane C og full hall, der en booking av full hall må blokkere alle tre banene samtidig. Systemet må håndtere gjentakende tildelinger over en hel sesong, denne baneoppdelingen, og at ett lag har fast tirsdag 18-19 mens naboklubben har 19-20.

Booker du dette som enkeltstående hendelser, drukner saksbehandleren i manuelle rader. Idrettshall-modulen må kjenne begrepene sesong, ramme og bane fra bunnen av, ikke som en påklistret gjentakelsesregel over en vanlig kalender.

## Sesongtildeling og rammetimeplan

Kjernen er sesongtildelingen. Lag søker om treningstid for et halvår eller helt år, og idrettsrådet fordeler etter en fordelingsnøkkel som prioriterer barn og unge, aktivitetsnivå og medlemstall. Søknadsrunden for høstsesongen kjøres typisk på våren, med frist i mars eller april, slik at rammetimeplanen er klar i god tid før skolestart.

Systemet må støtte tre faser: en søknadsrunde med frist, en fordelingsfase der saksbehandler ser alle søknader mot ledig kapasitet, og en publisert rammetimeplan som låser de faste tidene. Skjer fordelingen i et regneark ved siden av bookingsystemet, mister du sporbarheten i hvem som fikk hva og hvorfor, og klagene blir umulige å svare ut.

Krav å ta med i spec:
- Gjentakende tildeling per uke over hele sesongen, med unntak for ferier og røde dager
- Prioriteringsregler som kan speile idrettsrådets vekting, ikke bare førstemann til mølla
- Rammetimeplan som frigir ubrukte faste timer til enkeltbooking automatisk
- Sporbar fordelingslogg som viser hvilke søknader som ble innvilget, avslått eller nedskalert

## Ledige tider i sanntid

Når faste treningstider, kamper og privat leie deler samme hall, må ledig-visningen vise sannheten i sanntid. En innbygger som vil leie hallen en søndag skal se nøyaktig hvilke timer og hvilke baner som er frie, ikke en statisk timeplan fra august.

Frigir en klubb tirsdagstimen sin, skal den dukke opp som ledig samme minutt. Det er forskjellen på en hall som står tom fordi ingen visste at timen var fri, og en hall som fylles fordi den ledige tiden ble synlig med én gang. Krev at kalenderen viser tilgjengelighet per bane og per time, at avlyste faste timer automatisk blir bookbare for andre, og at visningen innbyggeren ser er den samme databasen saksbehandleren jobber i, ikke en kopi som oppdateres over natten.

## Konfliktløsning og doble bookinger

Doble bookinger er den dyreste feilen: to lag møter opp til samme bane samtidig, og driftsleder får telefonen. Systemet må håndheve at én bane i én tidsluke bare kan holdes av én booking, uansett om den kommer fra sesongtildeling, en kampoppsetting eller en enkelttime.

Det betyr låsing på databasenivå, ikke en advarsel etter at begge har trykket bekreft. To personer som booker samme luke i samme sekund skal føre til at den ene får plassen og den andre får beskjed om at tiden nettopp ble tatt. Krev også en tydelig prioritetsregel: en publisert rammetime skal alltid vinne over et forsøk på enkeltbooking i samme luke, og en kamp som legges inn skal varsle om den kolliderer med en fast trening før den lagres.

## Garderobe, utstyr og nøkkelstyring

Selve timeboken er bare halve jobben. En idrettshall har garderober som skal fordeles, utstyr som kan reserveres og dører som skal låses opp.

IT-lederen bør spørre om modulen kobler booking til adgang: får laget en digital nøkkel eller kode som gjelder nøyaktig i det tildelte tidsrommet, slik at driftsleder slipper å dele ut fysiske nøkler til titalls klubber? En hall med 40 faste leietakere blir raskt en runde med nøkkelknipper og pantelister uten dette. Garderobefordeling knyttet til rammetimeplanen hindrer at to lag ender i samme garderobe, og utstyrsreservasjon holder styr på mål, matter og tribuner slik at handballmålene ikke er låst inne når innebandylaget kommer.

## Rapportering til spillemidler og anleggsregister

Kommunale idrettsanlegg finansieres delvis av spillemidler, og bruken skal dokumenteres. Systemet må kunne eksportere faktiske brukstimer fordelt på aktivitet og aldersgruppe, siden barn og unge teller tyngst i tildelingen og i rapporteringen.

Krev uttrekk som lar deg vise timer per klubb, per anlegg og per periode, og som er enkle å levere videre til det nasjonale anleggsregisteret og til søknader om spillemidler. Skillet mellom tildelte timer og faktisk brukte timer er verdt å be om spesifikt: en klubb som får tildelt en time, men aldri møter opp, gir et helt annet grunnlag for neste års fordeling. Uten slike uttrekk blir rapporteringen manuell telling i regneark ved hvert årsskifte, med tallene noen husker fremfor tallene systemet vet.

## Prismodeller i praksis

En idrettshall har minst to prislogikker i samme løsning. Lag betaler en subsidiert sesongpris eller trener gratis etter kommunens satser, mens en privatperson som leier hallen en lørdag betaler enkelttimepris, ofte i størrelsesorden 300-600 kroner timen avhengig av kommune og formål.

Modulen må skille disse, knytte riktig pris til riktig brukertype automatisk, og håndtere fakturering av klubber samlet og betaling fra innbyggere direkte. En klubb med tolv faste timer i uken skal ha én samlefaktura, ikke tolv, mens innbyggeren skal betale i det hun booker. Krev at prisregler settes per hall, per tidsluke og per brukerkategori, slik at kveldstid, helg og høytid kan prises ulikt uten at noen redigerer priser for hånd hver uke.

## Sjekkliste: 10 spørsmål før kravspec signeres

1. Støtter modulen sesongtildeling med søknadsrunde og frist?
2. Kan prioriteringen speile idrettsrådets fordelingsnøkkel?
3. Håndteres rammetimeplan med gjentakelse og ferieunntak?
4. Vises ledige tider i sanntid, per bane og per time?
5. Frigis avlyste faste timer automatisk til enkeltbooking?
6. Er dobbeltbooking umulig på databasenivå, ikke bare en advarsel?
7. Kobles booking til digital adgang og nøkkelstyring?
8. Kan garderobe og utstyr fordeles sammen med tildelingen?
9. Finnes eksport av brukstimer for spillemidler og anleggsregister?
10. Håndteres sesongpris for lag og enkelttimepris for innbyggere i samme løsning?

Får du ja på alle ti, har du en idrettshall-modul, ikke bare en kalender.

## Se det i praksis

Digilist er bygget for idrettshallens virkelighet: sesongtildeling, sanntidskalender per bane, adgangsstyring og spillemiddelrapportering i én løsning. Book en demo, så viser vi hvordan modulen dekker hele kravspec-listen med dine egne haller og satser.