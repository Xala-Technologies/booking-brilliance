---
slug: godkjenningsflyt-revisjonsspor-booking-re-forespørsel
title: "Godkjenningsflyt i booking: revisjonsspor som holder"
description: "Hvorfor en avvist godkjenning i Digilist blir re-forespurt, ikke overstyrt, og hva det betyr for revisjonsspor, SSA-L, GDPR og dobbeltbooking."
date: 2026-08-09
author: "Ibrahim Rahmani"
role: "Grunnlegger, Digilist"
readingMinutes: 7
tag: "Driftsleder"
cover: "/images/blog/gdpr_iso27001_hero_no.webp"
keywords: ["godkjenningsflyt booking", "revisjonsspor kommune", "SSA-L dokumentasjonskrav", "sesongtildeling saksbehandler", "dobbeltbooking bekreftelse", "GDPR sporbarhet booking"]
---

En godkjenningsflyt som kan overstyres i et hastverksøyeblikk, er ikke et revisjonsspor, det er et smutthull. Da Digilist selv nylig sto med en blokkert leveranse i egen produktkø, valgte teamet å avklare og dokumentere avvisningen fremfor å presse den gjennom med administratortilgang. Det samme prinsippet ligger under hver eneste godkjenning av sal, hall og lokale i plattformen, enten godkjenneren er en kommunal saksbehandler eller en privat utleier. Under ligger begrunnelsen for hvorfor, og hva det konkret betyr for fem ulike roller som bruker Digilist daglig.

## Hva stod fast: en blokkert godkjenning og hvorfor den ikke bare kunne overstyres

En endring sto klar til å gå videre i utviklingskøen, men ble stoppet i godkjenningstrinnet fordi dokumentasjonskravet ikke var oppfylt. Teknisk sett tar det minutter å omgå et slikt trinn med administratortilgang: fjern statusen, sett saken til godkjent, gå videre. Digilist gjorde ikke det. Grunnen er enkel. En overstyrt godkjenning sletter beslutningsgrunnlaget. Du ser i etterkant at noe ble godkjent, men ikke hvorfor det først ble avvist, hvem som avviste det, eller hva som faktisk endret seg før det gikk gjennom andre gang. For et team som bygger booking til kommuner og private utleiere, er akkurat det skillet mellom "det virker" og "det tåler revisjon". Et system som lar deg omgå eget avvik, lærer brukerne at trinnet er valgfritt, og det er ikke en beskrivelse noen ønsker å gi videre til egen anskaffelsesansvarlig.

## Hvordan Digilist håndterer en avvist godkjenning: re-forespørsel, ikke omgåelse

Avvisningen gikk tilbake til den som eide saken, med en konkret begrunnelse, ikke en generisk feilmelding. Saken gikk inn i kø på nytt etter at mangelen var rettet, og den nye beslutningen ble logget med tidsstempel og navnet på hvem som godkjente. Ingen "prøv igjen til det går gjennom" uten at noe faktisk er endret.

Samme mekanikk styrer en salbestilling som avvises av saksbehandler i Digilist. Bestillingen forsvinner ikke fra systemet, og den godkjennes ikke automatisk ved neste innsending. Den går tilbake til søkeren med en begrunnelse i klartekst, for eksempel manglende forsikringsbevis eller feil i antall deltakere, og krever et nytt, oppdatert godkjenningstrinn før salen faktisk tildeles. Søkeren slipper å gjette seg til hva som var galt, og saksbehandler slipper å behandle samme sak to ganger uten spor mellom dem.

## Hvorfor sporbarhet i godkjenningsflyten er noe annet enn å bare "få det unna"

Det er forskjell på løst og dokumentert løst. En sal som blir bekreftet uten spor av hvem som godkjente hva, fungerer fint helt til noen spør. Ta en kommune som forvalter et par titalls saler og haller fordelt på skoler, fritidsbygg og idrettsanlegg: når kommunerevisjonen eller en klagesak ber om innsyn i én enkelt booking, holder det ikke å si at den "ble ordnet". Det må stå hvem som godkjente, når, og på hvilket grunnlag en tidligere avvisning ble reversert. Uten det trinnet er godkjenningen en påstand, ikke et dokument, og en påstand tåler ikke en klagebehandling der to parter er uenige om hva som faktisk ble avtalt.

## Hva dette betyr for saksbehandler: samme prinsipp igjen i sesongtildeling og sakskøer

Sesongtildeling av idrettshall til lag følger identisk logikk. Når en saksbehandler avviser en søknad, for eksempel fordi laget ikke har levert oppdatert medlemsliste, sendes den tilbake til laget med begrunnelse. Den slettes ikke fra køen, og den hopper ikke automatisk forbi neste runde. I en kommune med rundt 120 sesongsøknader i høstrunden er dette forskjellen mellom en sakskø noen kan forklare i etterkant, og en haug e-poster ingen finner igjen når idrettsrådet spør hvorfor ett lag fikk tildelt tid og et annet ikke. Digilist logger hvert trinn i tildelingen, fra søknad via avvisning og re-forespørsel til endelig vedtak, slik at saksbehandler kan svare på en klage samme dag den kommer inn, i stedet for å lete gjennom en innboks.

## Hva dette betyr for IT-leder: GDPR, revisjonsspor og hvorfor SSA-L krever nettopp dette

GDPR artikkel 5 stiller krav om at behandling av personopplysninger skal kunne etterprøves og dokumenteres, det såkalte ansvarlighetsprinsippet. SSA-L-avtaler for kommunale driftsanskaffelser krever tilsvarende logging av endringer og hendelser i leverandørens system, ofte spesifisert i bilaget om drift og vedlikehold. Digilist lagrer hvem, når og hvorfor for hvert godkjenningstrinn som en integrert del av plattformen, ikke som en tilleggstjeneste IT-leder må bestille separat eller sette opp i et eget loggverktøy. For en anskaffelse som skal gjennom SSA-L og en påfølgende sikkerhetsrevisjon, er det nettopp dette revisjonssporet, ikke funksjonene i bookingskjemaet, som avgjør om systemet består kontrollen. Det er også det IT-leder kan vise frem uten å måtte forklare hvorfor loggen har hull rundt akkurat de sakene som ble hastet gjennom.

## Hva dette betyr for driftsleder: hvorfor en sal ikke bookes eller frigis uten godkjent trinn

Driftsleder trenger å vite at et lokale ikke frigis til neste booking før forrige er formelt avsluttet. Ta en idrettshall med seks baner: hvis én bane frigjøres uten et godkjent trinn, for eksempel fordi noen avlyser muntlig og en kollega antar at det er i orden, risikerer driftsleder en kollisjon mellom to lag samme kveld. I tillegg kommer et rengjørings- og vaktmesterskjema som plutselig ikke stemmer, fordi systemet fortsatt tror banen er opptatt til et annet tidspunkt enn det som faktisk skjer i hallen. Fordi Digilist krever et bekreftet trinn før en sal eller bane går tilbake i kalenderen, unngår driftsleder akkurat den typen dobbeltbooking som koster mest å rydde opp i etterpå, både i tid og i omdømme overfor lagene som booker.

## Hva dette betyr for private utleiere: samme logikk, ingen dobbeltbooking uten bekreftelse

For en utleier av bryllupslokale er prinsippet identisk, bare uten kommunenavnet. En forespørsel låser ikke datoen før utleier faktisk har bekreftet den, og betaling eller depositum holdes til bekreftelsen er på plass. I høysesong, når flere par kan spørre om samme lørdag i juni samtidig, er dette bekreftelsestrinnet det som avgjør om utleier står med én solgt dato og et fornøyd brudepar, eller to par som begge tror de har fått salen fordi en muntlig forhåndsavtale ble tolket som bindende. Samme logikk gjelder når et par ønsker å endre dato etter at forespørselen først ble avvist på grunn av kollisjon: endringen går gjennom et nytt godkjenningstrinn, ikke en stille overskriving av kalenderen.

## Hvorfor dette er tabellinnsats, og hva det faktisk låser opp for begge markeder

Verken kommune eller privat utleier velger dette bort lenger. For kommunen er det et krav i anskaffelsen. For utleieren er det tilliten kunden bygger videre på, og den tilliten er vanskelig å bygge opp igjen etter én dobbeltbooking i høysesong.

| Krav | Kommune | Privat utleier |
|---|---|---|
| Godkjenningstrinn før booking er endelig | Ja, saksbehandler | Ja, utleier bekrefter |
| Avvisning gir begrunnelse, ikke sletting | Ja | Ja |
| Logg over hvem, når og hvorfor | SSA-L- og GDPR-krav | Grunnlag for kundeservice og tvisteløsning |
| Frigjøring av lokale krever bekreftet trinn | Ja, driftsleder | Ja, utleier |

Det som ser ut som ett teknisk detaljvalg internt i Digilist, en avvist godkjenning som ble re-forespurt fremfor overstyrt, er samme mekanisme som gjør at en sal i en norsk kommune kan tildeles med dokumentert vedtak, og at en bryllupshelg i høysesong ikke selges to ganger til to forskjellige par.

Vil du se godkjenningsflyten og revisjonssporet i praksis, i deres egen booking av sal, hall eller lokale? Book en demo med Digilist, så viser vi hvordan avvisning, re-forespørsel og logg fungerer i akkurat deres oppsett.