import UseCasePage from "@/components/UseCasePage";

export default function LeieHobbyklubb() {
  return (
    <UseCasePage
      basePath="/leie"
      parentCrumb={{ name: "Leie", path: "/leie" }}
      sectionLabel="LEIE"
      slug="hobbyklubb"
      breadcrumb="Hobbyklubb"
      title="Leie lokale til hobby- og interesseklubb"
      dek="Fast rom til strikkeklubben, yogagruppa eller brettspillkvelden. Se pris og ledig dato, og book direkte med Vipps."
      lead="Hobby- og interesseklubber som strikkegrupper, yogagrupper, brettspillklubber og andre private fellesskap trenger sjelden et helt lokale, men et rom de kan bruke fast, gjerne samme kveld hver uke. Å finne det har som regel betydd å ringe rundt til grendehus, menighetslokaler og kulturhus, vente på svar om pris og ledig tid, og betale med bankoverføring til en kontaktperson. På Digilist søker dere opp lokaler som passer klubbaktivitet, ser pris og kapasitet for deres faste kveld, og booker direkte med Vipps, uten forespørsler og venting på svar."
      seoTitle="Leie lokale til hobbyklubb: pris og booking | Digilist"
      seoDescription="Leie lokale til hobby- og interesseklubb: strikkeklubb, yogagruppe, brettspillklubb og andre. Se pris og kapasitet, book fast ukedag, og betal med Vipps."
      keywords="leie lokale hobbyklubb, hobbyklubb lokale leie, leie klubblokale, interesseklubb lokale, leie møtelokale klubb, fast ukentlig leie klubb, klubblokale pris, leie lokale privat forening"
      audience={[
        {
          persona: "Strikke-, håndarbeids- og hobbygrupper",
          context: "Faste medlemmer møtes en fast kveld i uka til strikking, broderi eller keramikk. Dere trenger et rom med bord og gjerne kjøkkenadgang, ikke en hel festsal.",
        },
        {
          persona: "Private yoga- og trimgrupper",
          context: "Gruppa er ikke tilknyttet en kommune eller et treningssenter, men trenger et rolig rom med gulvplass og gjerne speil eller matter, samme tid hver uke.",
        },
        {
          persona: "Brettspill-, rollespill- og samlerklubber",
          context: "Klubbkvelden krever bord, stoler og ro, gjerne en lørdag i måneden eller en fast ukedag på kvelden.",
        },
        {
          persona: "Nystartede interesseklubber uten eget lokale",
          context: "Foreningen har medlemmer og kontingent, men ikke egne lokaler. Dere trenger et sted å møtes fast, med en pris som er forutsigbar for klubbkassa.",
        },
      ]}
      problems={[
        "Private hobbyklubber er sjelden prioritert i kommunens bookingsystem, som først og fremst er bygget for lag og foreninger tilknyttet idrett og kultur.",
        "Å finne et ledig rom betyr som regel å ringe rundt til grendehus, menighetslokaler og kulturhus, og vente på svar i åpningstiden.",
        "Prisen oppgis sjelden på forhånd, og klubbkassereren må innhente tilbud fra flere steder før noen kan planlegge budsjettet.",
        "Å sikre samme kveld hver uke krever at noen sjekker en intern kalender manuelt for hver ny sesong.",
        "Betaling skjer ofte med bankoverføring til en kontaktperson, og et medlem legger ofte ut for depositum som skal betales tilbake senere.",
      ]}
      features={[
        {
          title: "Lokaler for klubbaktivitet samlet",
          body: "Rom, klasseromlokaler og saler som passer hobbyaktivitet i nærområdet, samlet ett sted i stedet for å ringe rundt til grendehus og menighetslokaler.",
        },
        {
          title: "Fast ukedag, sesong etter sesong",
          body: "Book samme kveld hver uke eller en fast lørdag i måneden. Kalenderen viser hva som faktisk er ledig, slik at klubben kan planlegge semesteret uten å vente på svar.",
        },
        {
          title: "Pris og kapasitet synlig",
          body: "Se hva rommet koster for deres faste kveld og hvor mange det har plass til, før dere booker. Klubbkassereren slipper å innhente tilbud fra flere steder.",
        },
        {
          title: "Egen pris for faste leietakere",
          body: "Utleier kan sette en annen pris for klubber som booker fast enn for enkeltbooking. Prisen som gjelder for dere vises på lokalet før dere bekrefter.",
        },
        {
          title: "Book og betal med Vipps",
          body: "Betal med Vipps eller kort i samme flyt som bookingen, i stedet for bankoverføring til en kontaktperson. Et eventuelt depositum håndteres digitalt.",
        },
        {
          title: "Vilkårene før dere bekrefter",
          body: "Nøkkelhåndtering, opprydding og avbestillingsregler står tydelig på hvert lokale, slik at klubben vet hva som gjelder før dere booker.",
        },
      ]}
      stories={[
        {
          customer: "Eksempel: strikkeklubb i en bygd",
          role: "Illustrasjon",
          headline: "Tirsdagskvelden sikret for hele høsten",
          body: "Slik kan det se ut: I stedet for å ringe grendehuset finner klubben et rom med bord og kjøkkenadgang på Digilist, ser prisen for en fast tirsdagskveld, og booker hele høstsesongen med én bekreftelse.",
          outcome: [
            { label: "Telefoner", value: "0" },
            { label: "Fast kveld", value: "Hele sesongen" },
            { label: "Betaling", value: "Vipps" },
          ],
        },
        {
          customer: "Eksempel: privat yogagruppe",
          role: "Illustrasjon",
          headline: "Fast sal uten binding til treningssenter",
          body: "Gruppa trenger et rolig rom med gulvplass en kveld i uka. De finner et klasseromlokale med matter og speil på Digilist, ser at kapasiteten og prisen passer, og booker fast tid uten å binde seg til et helt treningssenter.",
          outcome: [
            { label: "Bindingstid", value: "Ingen" },
            { label: "Kapasitet", value: "Synlig før booking" },
            { label: "Booking", value: "Fast ukedag" },
          ],
        },
        {
          customer: "Eksempel: brettspillklubb",
          role: "Illustrasjon",
          headline: "Lørdagen booket for hele klubben",
          body: "Klubben trenger bord og stoler til ti-tolv medlemmer én lørdag i måneden. De finner et møtelokale med riktig kapasitet, ser prisen for hele dagen, og booker med depositum betalt via Vipps.",
          outcome: [
            { label: "Kapasitet", value: "Tilpasset klubben" },
            { label: "Pris", value: "Kjent på forhånd" },
            { label: "Booking", value: "På minutter" },
          ],
        },
      ]}
      technical={[
        {
          label: "Betaling",
          value: "Vipps eller kort i samme flyt som bookingen. Et eventuelt depositum håndteres digitalt og frigjøres etter arrangementet.",
        },
        {
          label: "Ledige datoer",
          value: "Sanntidskalender per lokale. Dere ser hva som faktisk er ledig for deres faste ukedag, og booker direkte uten forespørsel.",
        },
        {
          label: "Pris",
          value: "Totalpris for deres dato og varighet, inkludert eventuelt depositum, vises før dere bekrefter. Utleier kan sette egen pris for faste leietakere.",
        },
        {
          label: "Fast booking",
          value: "Book samme ukedag over flere uker eller en hel sesong, i stedet for å søke på nytt hver gang.",
        },
        {
          label: "Kapasitet",
          value: "Antall personer og oppsett (bord, stolrader, gulvplass) oppgis per lokale, slik at dere finner et rom som faktisk passer klubben.",
        },
        {
          label: "Vilkår",
          value: "Nøkkelhåndtering, opprydding, avbestilling og eventuelle ordensregler står tydelig på hvert lokale før booking.",
        },
        {
          label: "Innlogging",
          value: "Trygg pålogging med BankID eller ID-porten. Bookingen er knyttet til den som booker, med kvittering og oversikt.",
        },
        {
          label: "Personvern",
          value: "All persondata lagres i Norge og EU, GDPR-kompatibelt. Klubben deler kun det som trengs for å booke lokalet.",
        },
      ]}
      pullQuote={{
        text: "Lokalet klubben trenger fast hver uke, med pris og ledig kveld synlig. Ikke en telefonrunde til grendehuset og en bankoverføring til en kontaktperson.",
        byline: "Slik er Digilist ment å fungere for hobby- og interesseklubber",
      }}
      faq={[
        {
          question: "Hva koster det å leie lokale til en hobbyklubb?",
          answer:
            "Prisen varierer med lokale, sted og hvor ofte dere booker. Et rom eller en sal kan koste fra noen hundre kroner per kveld, og mange utleiere gir lavere pris til klubber som booker fast over en hel sesong. På Digilist ser dere totalprisen for deres dato før dere booker.",
        },
        {
          question: "Kan klubben booke samme kveld hver uke?",
          answer:
            "Ja, dere kan booke en fast ukedag over flere uker eller en hel sesong, i stedet for å søke på nytt hver gang. Kalenderen viser hva som faktisk er ledig for deres foretrukne tidspunkt.",
        },
        {
          question: "Har Digilist et system for medlemskap og kontingent?",
          answer:
            "Nei. Digilist administrerer ikke medlemslister, kontingent eller søknader om tilskudd for klubben, det er noe klubben selv håndterer i egne systemer eller regneark. Det Digilist gjør er å gjøre lokaler søkbare og bookbare, med riktig pris og ledig dato for deres klubb.",
        },
        {
          question: "Kan klubben få egen pris som fast leietaker?",
          answer:
            "Det kommer an på utleier. Mange lokaler har lavere pris for klubber og grupper som booker fast, sammenlignet med enkeltbooking. Prisen som gjelder for dere vises på lokalet før dere bekrefter.",
        },
        {
          question: "Hvordan betaler vi, og hva med depositum?",
          answer:
            "Dere betaler med Vipps eller kort i samme flyt som bookingen. Der lokalet krever depositum, håndteres det digitalt og frigjøres etter arrangementet dersom ingenting er meldt. Ingen bankoverføring til en kontaktperson dere aldri har møtt.",
        },
        {
          question: "Kan vi avbestille en enkelt kveld?",
          answer:
            "Avbestillingsreglene settes av utleier og står på hvert lokale. Der det er tillatt, avbestiller dere digitalt for den aktuelle kvelden, uten at det påvirker resten av den faste bookingen.",
        },
      ]}
      relatedPosts={[
        {
          title: "Leie sal fast i kommunen: slik sikrer foreningen samme ukedag hele sesongen",
          slug: "leie-sal-fast-kommune-forening-sesong",
        },
        {
          title: "Sesongleie: Slik fordeler du kommunale lokaler rettferdig",
          slug: "sesongleie-fordeling-lag-foreninger",
        },
      ]}
    />
  );
}
