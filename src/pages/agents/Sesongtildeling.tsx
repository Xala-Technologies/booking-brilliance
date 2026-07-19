import AgentSpokeLayout, { type AgentSpokeContent } from "@/components/AgentSpokeLayout";

const content: AgentSpokeContent = {
  slug: "sesongtildeling",
  eyebrow: "SESONGTILDELING",
  h1: "Sesongtildeling av idrettshaller, forklart for hvert lag",
  lead: "Digilists fordelingsmotor lager selve forslaget til sesongtildeling. AI-agenten fordeler ikke halltid — den gjennomgår forslaget, flagger lagene som er skviset ut, og skriver en begrunnelse et menneske kan stå inne for.",
  metaTitle: "Sesongtildeling av idrettshaller | Digilist",
  metaDescription:
    "AI-agenten gjennomgår og forklarer sesongtildeling av idrettshall for kommuner. Den fordeler aldri halltid selv — et menneske godkjenner hver melding.",
  keywords: [
    "sesongtildeling idrettshall",
    "halltildeling kommune",
    "fordeling av halltid",
    "lag og foreninger",
    "sesongleie idrettshall",
    "tildeling av halltid",
    "rettferdig halltildeling",
    "idrettshall kommune",
  ],
  breadcrumbLabel: "Sesongtildeling",
  flowTitle: "SLIK JOBBER AGENTEN",
  flow: [
    "Mottar fordelingsforslaget",
    "Beregner rettferdighetssignaler",
    "Flagger skvisede lag",
    "Skriver saksbehandlerens vurdering",
    "Utkast til hvert lag",
    "Menneske godkjenner",
  ],
  sections: [
    {
      heading: "Agenten fordeler aldri halltid selv",
      body: [
        "Digilists deterministiske fordelingsmotor lager forslaget til sesongtildeling. AI-agenten rører det ikke. Den verken tildeler, justerer, regenererer eller forkaster et forslag — den leser det, og forklarer hva forslaget faktisk betyr for hvert lag.",
        "Skillet er bevisst. Halltildeling i en kommune er en forvaltningsavgjørelse, ikke en maskinutregning. Agenten gir saksbehandleren et bedre grunnlag, men beslutningen ligger alltid hos et menneske.",
        "Resultatet er ikke en ny fordeling, men en fordeling som kan forsvares. Saksbehandleren ser det samme forslaget som før, nå med en lesbar vurdering av hvor det skjærer seg.",
      ],
    },
    {
      heading: "Rettferdighetssignaler som gjelder selv om AI-en er nede",
      body: [
        "Før agenten skriver ett ord, regner den ut et sett deterministiske signaler fra forslaget. Tallene er de samme hver gang, og de foreligger selv om språkmodellen er utilgjengelig.",
        "Signalene fanger opp lag som er stengt ute (ba om tider, fikk null), lag som er sultefôret (fikk 25 prosent eller mindre av det de ba om), uløste konflikter, avgjørelser tatt ved loddtrekning eller førstemann-til-mølla, og manuelle overstyringer gjort av mennesker. Det er nettopp disse utfallene lag og foreninger klager på.",
        "Fordi signalene er deterministiske, kan de brukes som en fast kontroll av hvert forslag til halltildeling — uavhengig av om agenten rekker å skrive den språklige vurderingen.",
      ],
    },
    {
      heading: "To stemmer, to formål",
      body: [
        "For saksbehandleren skriver agenten en kald, tallfestet vurdering. Den peker på lagene som reelt er skviset ut, og på utfall som kan være teknisk korrekte, men som ikke lar seg forsvare i et kommunestyre.",
        "For hvert lag skriver den en varm melding på høyst 120 ord. Den forklarer alltid hvorfor tildelingen ble som den ble, og den sier aldri at «systemet» eller «algoritmen» bestemte — et menneske står ansvarlig. Hver melding ender med et konkret neste steg, som plass på venteliste eller ledige restetider.",
      ],
    },
    {
      heading: "De dårligst stilte lagene forklares først",
      body: [
        "Agenten prioriterer lagene som kom dårligst ut. De får forklaringen sin først, fordi det er de som har mest grunn til å spørre og minst grunn til å slå seg til ro.",
        "Alt agenten produserer er utkast. Både saksbehandlerens vurdering og hver enkelt melding til lagene er et forslag som et menneske må godkjenne før noe lag hører et ord. Ingenting sendes automatisk.",
      ],
    },
    {
      heading: "Bygget for kommunal etterprøvbarhet",
      body: [
        "Sesongleie av idrettshall handler til slutt om tillit. Når et lag mister en fast treningstid, har de krav på en begrunnelse de kan forstå og etterprøve. Agenten gjør fordeling av halltid dokumenterbar: hva ble prioritert, hvem ble berørt, og hvorfor.",
        "For kommunen betyr det færre uforståelige avslag og en halltildeling som tåler innsyn. Saksbehandleren beholder kontrollen, men slipper å skrive den samme forklaringen hundre ganger.",
        "Agenten er ikke bygget for å avgjøre saker, men for å gjøre avgjørelser etterprøvbare. Det er forskjellen på et svar et lag godtar og et avslag de ikke forstår.",
      ],
    },
  ],
  faq: [
    {
      question: "Fordeler agenten halltiden i idrettshallen?",
      answer:
        "Nei. Digilists deterministiske fordelingsmotor lager selve forslaget til sesongtildeling. Agenten verken tildeler, justerer, regenererer eller forkaster forslaget. Den gjennomgår og forklarer — et menneske avgjør.",
    },
    {
      question: "Hva skjer hvis AI-en er utilgjengelig?",
      answer:
        "Rettferdighetssignalene beregnes fortsatt. De er deterministiske og foreligger uansett: hvilke lag som er stengt ute, hvilke som er sultefôret, uløste konflikter, avgjørelser ved loddtrekning og manuelle overstyringer. Bare den språklige vurderingen krever AI-en.",
    },
    {
      question: "Hvilke lag flagger agenten?",
      answer:
        "Lag som ba om tider men fikk null, lag som fikk 25 prosent eller mindre av det de ba om, saker med uløste konflikter, tildelinger avgjort ved loddtrekning eller førstemann-til-mølla, og tilfeller der et menneske har overstyrt forslaget.",
    },
    {
      question: "Får lagene automatisk beskjed fra agenten?",
      answer:
        "Nei. Både saksbehandlerens vurdering og hver melding til lagene er utkast. Et menneske godkjenner før noe lag hører et ord. De dårligst stilte lagene får forklaringen sin først.",
    },
    {
      question: "Sier agenten at systemet bestemte tildelingen?",
      answer:
        "Aldri. Meldingen til laget forklarer alltid hvorfor tildelingen ble som den ble, og understreker at et menneske står ansvarlig — ikke «systemet» eller «algoritmen». Den avsluttes med et konkret neste steg, som venteliste eller restetider.",
    },
  ],
  related: [
    { label: "Alle AI-agentene", href: "/ai-agenter" },
    { label: "Compliance-godkjenning", href: "/ai-agenter/compliance-godkjenning" },
    { label: "Importér oppføring", href: "/ai-agenter/importer-oppforing" },
  ],
};

const Sesongtildeling = () => <AgentSpokeLayout content={content} />;

export default Sesongtildeling;
