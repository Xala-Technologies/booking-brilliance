---
slug: favoritter-digilist-lagring-lag-bedrift-kommune
title: "Favoritter på Digilist: riktig meldingsstatus for privatpersoner, lag og kommune"
description: "Favoritt-meldingen på Digilist stemmer nå med faktisk lagringsstatus (XAL-918). Se hva rettelsen betyr for privatpersoner, lag, bedrifter og kommunale driftsledere som bruker flere enheter."
date: 2026-08-08
author: "Ibrahim Rahmani"
role: "Grunnlegger, Digilist"
readingMinutes: 7
tag: "Privatperson"
cover: "/images/blog/integrations_idporten_hero_no.webp"
keywords: ["favoritter digilist", "lagre favoritt idrettshall", "logg inn for å lagre favoritt", "favoritter lagret på konto", "gjestebruker lokal lagring", "XAL-918", "favoritter lag og foreninger", "delt konto booking"]
---

Favoritt-knappen på Digilist skal vise riktig status til riktig bruker. En feil i meldingslogikken, registrert internt som XAL-918, gjorde at innloggede brukere fikk beskjed om å logge inn for å lagre en favoritt, selv om de allerede var pålogget. Feilen er rettet. Den er liten i omfang, men den sier noe viktig om hva som skal til for at lag, bedrifter og kommunale driftsledere kan stole på et bookingsystem de bruker daglig.

## Feilen: innlogget bruker fikk beskjed om å logge inn

Symptomet var enkelt å beskrive og irriterende å oppleve. Du var logget inn, du trykket på hjertet ved en idrettshall eller et selskapslokale, og toasten svarte "logg inn for å lagre favoritt". Systemet visste hvem du var, men meldingslogikken sjekket ikke innloggingsstatus riktig før den valgte tekst. Resultatet: brukere logget ut og inn igjen for en funksjon som allerede fungerte, eller ga opp og forlot siden uten å lagre noe de faktisk ville huske til senere.

## Hva som er rettet: meldingen matcher nå faktisk status

Rettelsen kobler toast-teksten direkte til den samme sesjonssjekken som styrer selve lagringen, ikke en separat antakelse om brukertilstand. Er du innlogget, bekrefter meldingen at favoritten er lagret på kontoen. Er du gjest, forklarer meldingen at lagringen er lokal og tilbyr innlogging. To tilstander, to meldinger som stemmer med det som faktisk skjer bak knappen.

## Innlogget bruker: favoritter lagres permanent på kontoen

Når du er logget inn, ligger favorittene dine på kontoen, ikke i nettleseren. De følger deg fra mobil til laptop, overlever at du bytter enhet, og er der neste gang du booker, enten det er en ledig time i idrettshallen eller et selskapslokale du sammenligner til bryllupet. Legger du til en favoritt på mobilen på vei til jobb, ligger den klar når du åpner Digilist på laptopen samme kveld. Dette er ikke ny funksjonalitet, det er det systemet alltid har gjort. Meldingen sa lenge noe annet, og det var problemet.

## Gjestebruker: lokal lagring og en tydelig oppfordring

Uten innlogging lagres favoritter lokalt i nettleseren du bruker akkurat da. Bytter du enhet, rydder du nettleserdata, eller åpner du en privat fane, er de borte. Det er ikke en feil, det er en naturlig konsekvens av at det ikke finnes noen konto å knytte dataene til. Digilist viser derfor en tydelig oppfordring til å logge inn når en gjest lagrer noe, slik at valget om å opprette konto blir informert i det øyeblikket det er relevant, ikke tredd ned over hodet på en bruker som bare ville se seg om.

## Hvorfor riktig melding til riktig tid faktisk betyr noe

En feilmelding som ikke stemmer med virkeligheten koster mer enn irritasjon i sekundet. Den svekker tilliten til at systemet vet hva det snakker om, og den mistilliten smitter lett over på funksjoner som faktisk har konsekvenser: om en betaling er registrert, om en avbestilling er gjennomført, om en sal vises som ledig i sanntid. Digilist har over 190 publiserte artikler om booking i offentlig og privat sektor, og et tilbakevendende mønster derfra er at brukere tester systemets korrekthet på de små, lavrisiko-detaljene før de stoler på det som faktisk koster penger eller avgjør om et arrangement blir noe av.

## Lag og foreninger: delte kontoer, flere enheter

Et lag eller en forening booker sjelden fra én enhet. Treneren booker fra mobil rett før trening, styrelederen fra laptop når sesongplanen skal legges, og på mindre lag deler flere personer samme innlogging til hallen eller salen de bruker fast. I den situasjonen må systemet være entydig på hvor favoritten havner: på den innloggede kontoen, ikke på telefonen som tilfeldigvis var i bruk sist. Skal styret sammenligne flere haller før sesongsøknaden sendes inn, må favorittlisten være den samme uansett hvem som logger på og fra hvilken enhet. En favoritt som forsvinner fordi den lå lagret i feil nettleser, er ikke bare en teknisk detalj, det er en søknadsfrist som plutselig haster mer enn den trengte.

## Bedrifter: booking på vegne av andre

Bedrifter som leier møterom, idrettshall til firmaarrangement eller selskapslokale til julebord, booker ofte gjennom én ansatt med tilgang til en delt eller administrert konto. Den ansatte som gjør research i dag er ikke nødvendigvis den som bekrefter bookingen to uker senere. Da må lagrede favoritter og søk ligge på kontoen, tilgjengelig for neste person som logger på med samme tilgang, ikke bundet til den første researcherens private nettleser. Det er samme prinsipp som for lag og foreninger, bare med en annen begrunnelse: for bedriften handler det om at bookingansvaret kan overføres til en kollega uten at arbeidet må gjøres på nytt.

## Kommune og driftsledere: sporbarhet og tillit til statuslogikk

For en driftsleder eller saksbehandler som forvalter titalls saler og haller gjennom ett bookingsystem, handler dette om noe mer prinsipielt enn favoritter: at systemets egen statuslogikk er til å stole på. Hvis en toast kan vise feil innloggingsstatus, er spørsmålet naturlig hva annet i grensesnittet som kan vise feil status, om en sal faktisk er ledig, eller om en søknad faktisk er registrert mottatt. Det er nøyaktig denne typen spørsmål en IT-ansvarlig bør stille i et anbud: ikke bare hvilke funksjoner systemet har, men hvordan feil i statusvisning oppdages og rettes. Rettelsen av XAL-918 er liten i omfang, men den viser at statuslogikken testes og korrigeres fortløpende, noe som er relevant informasjon når en kommune vurderer et bookingsystem for hele sale- og hallporteføljen sin.

## Hva som ikke er endret

Ingen ny funksjonalitet er lagt til. Favoritter fungerer som før: lagring på konto for innloggede, lokal lagring for gjester, mulighet til å lagre idrettshaller, selskapslokaler og saler for senere sammenligning. Det eneste som er endret er at meldingen du ser nå stemmer med det som faktisk skjer, uansett om du booker som privatperson, på vegne av et lag, en bedrift eller en kommune.

## Prøv Digilist selv

Om du forvalter saler og haller i en kommune, driver utleie privat, eller booker på vegne av et lag eller en bedrift, er den beste måten å vurdere et system på å se det i bruk. Book en demo med Digilist, så viser vi hvordan booking, favoritter og sanntidskalender henger sammen i praksis, uansett hvor mange enheter og kontoer som er involvert.