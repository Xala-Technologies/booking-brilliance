import AgentSpokeLayout, { type AgentSpokeContent } from "@/components/AgentSpokeLayout";

const content: AgentSpokeContent = {
  slug: "importer-oppforing",
  eyebrow: "IMPORTÉR OPPFØRING",
  h1: "Importér oppføring: fra det du har, til et utkast på Digilist",
  lead: "Har du allerede en annonse på Airbnb, Booking.com, Finn.no eller Eventum — eller et dokument i skuffen — bruker Listing Importer det som utgangspunkt. Agenten leser innholdet, kartlegger det mot Digilists oppføringsstruktur og bygger et utkast du finpusser og publiserer selv.",
  metaTitle: "Importér oppføring: fra Airbnb, Finn eller Word til utkast | Digilist",
  metaDescription:
    "Lim inn lenken til annonsen din på Airbnb, Finn.no eller Booking.com, eller last opp et dokument. Digilist lager et utkast du finpusser og publiserer selv.",
  keywords: [
    "importere annonse",
    "lag oppføring automatisk",
    "importer fra Finn",
    "importer fra Airbnb",
    "opprett annonse enkelt",
    "onboarding utleier",
    "bookingsystem kommune",
    "importér oppføring digilist",
  ],
  breadcrumbLabel: "Importér oppføring",
  flowTitle: "FRA KILDE TIL UTKAST",
  flow: [
    "Del kilden: lenke eller fil",
    "Agenten leser og analyserer",
    "Relevante fakta hentes ut",
    "Kartlegges mot Digilists struktur",
    "Du finpusser utkastet",
    "Compliance-godkjenning før du publiserer",
  ],
  sections: [
    {
      heading: "Fra det du allerede har, til et ferdig utkast",
      body: [
        "De fleste utleiere har allerede beskrevet stedet sitt et eller annet sted. En annonse på Airbnb, en oppføring på Booking.com, en rubrikk på Finn.no, en side på Eventum, eller et Word-dokument som ble laget den gangen lokalet først ble leid ut. Listing Importer bruker dette som utgangspunkt, slik at du slipper å skrive alt på nytt i et langt skjema.",
        "Målet er enkelt: å importere annonse-innholdet du har fra før, og gjøre det om til et redigerbart utkast på Digilist. I stedet for et blankt skjema starter du med et utkast som allerede er fylt ut, og bruker tiden på å finpusse framfor å taste inn. Det senker terskelen for å komme i gang, enten du har ett lokale eller en hel portefølje.",
      ],
    },
    {
      heading: "Pek agenten mot kilden — lenke, dokument eller tekst",
      body: [
        "Du deler kilden på den måten som passer deg. Lim inn lenken til en eksisterende oppføring, last opp et dokument i Word eller PDF, eller lim inn ren tekst. Vil du importere fra Finn eller importere fra Airbnb, limer du ganske enkelt inn adressen til annonsen din.",
        "Agenten henter ikke innhold bak innlogging og omgår ingen sperrer — den arbeider med det du selv gir den tilgang til ved å lime inn lenken eller laste opp filen. Du kan oppgi flere kilder samtidig, på samme måte som du samler kilder i en notatbok. Har du både en annonse og et separat prisark, tar agenten med seg begge når den skal lage oppføring automatisk.",
      ],
    },
    {
      heading: "Slik kartlegges innholdet mot Digilists struktur",
      body: [
        "Agenten leser gjennom kilden og trekker ut de relevante faktaene: navn, beskrivelse, kapasitet, fasiliteter, beliggenhet, priser og husregler — og bilder der det lar seg gjøre. Deretter kartlegges alt mot Digilists oppføringsstruktur: kategori og underkategori, hva stedet er egnet for, kapasitet, prising, tilgjengelighet, fasiliteter og regler.",
        "Resultatet er en oppføring som allerede snakker Digilists språk. Der noe mangler eller er tvetydig, markeres feltet slik at du enkelt ser hva som bør fylles ut før publisering. Du beholder full oversikt over hva som kom fra kilden og hva du selv bør supplere.",
      ],
    },
    {
      heading: "Et utkast du eier — du finpusser og publiserer",
      body: [
        "Importen ender alltid i et utkast, aldri i en publisert oppføring. Ingenting går live automatisk. Du gjennomgår hvert felt, retter det som skal rettes, legger til det som mangler, og bestemmer selv når stedet er klart.",
        "Når du er fornøyd, sendes utkastet gjennom Digilists compliance-godkjenning på lik linje med oppføringer du lager for hånd. Slik vet du at det som til slutt publiseres, holder samme standard uansett hvordan det ble til. Du får opprett annonse enkelt uten å gi slipp på kontrollen — mennesket bekrefter alltid det siste steget.",
      ],
    },
    {
      heading: "Enklere onboarding for utleiere og kommuner",
      body: [
        "For en ny utleier er terskelen ofte det blanke skjemaet. Ved å starte fra innhold som finnes fra før, blir onboarding av utleier et spørsmål om minutter i stedet for en hel ettermiddag. Det gjør det lettere å få flere lokaler, idrettshaller og møterom inn i katalogen.",
        "For en kommune eller organisasjon som drifter et bookingsystem, betyr det raskere overgang når nye enheter skal legges inn. Et bookingsystem for kommune lever av at katalogen er komplett — jo lavere terskel for å legge til et sted, desto raskere blir tilbudet fullstendig for innbyggerne.",
      ],
    },
  ],
  faq: [
    {
      question: "Hvilke kilder kan jeg importere fra?",
      answer:
        "Du kan lime inn lenken til en oppføring på Airbnb, Booking.com, Finn.no eller Eventum, laste opp et Word- eller PDF-dokument, eller lime inn ren tekst. Flere kilder kan brukes samtidig, for eksempel en annonse og et separat prisark.",
    },
    {
      question: "Publiseres oppføringen automatisk?",
      answer:
        "Nei. Listing Importer lager alltid et utkast som du gjennomgår og finpusser selv. Ingenting går live uten at du bekrefter det, og utkastet sendes gjennom compliance-godkjenning før publisering.",
    },
    {
      question: "Henter agenten innhold bak innlogging?",
      answer:
        "Nei. Den omgår ingen sperrer og logger seg ikke inn på andres vegne. Den arbeider kun med det du selv deler ved å lime inn lenken eller laste opp filen.",
    },
    {
      question: "Hva skjer hvis noe mangler i kilden?",
      answer:
        "Agenten fyller ut det den finner, og markerer felt som mangler eller er uklare. Du ser tydelig hva som bør suppleres før du publiserer, så ingenting forsvinner i det stille.",
    },
    {
      question: "Hvor mye tid sparer jeg?",
      answer:
        "Det avhenger av kilden, men poenget er at du starter fra et ferdig utfylt utkast i stedet for et blankt skjema. For en utleier som allerede har en annonse, handler onboarding om å finpusse framfor å taste inn alt på nytt.",
    },
  ],
  related: [
    { label: "Alle AI-agentene", href: "/ai-agenter" },
    { label: "Sesongtildeling", href: "/ai-agenter/sesongtildeling" },
    { label: "Compliance-godkjenning", href: "/ai-agenter/compliance-godkjenning" },
  ],
};

const ImporterOppforing = () => <AgentSpokeLayout content={content} />;

export default ImporterOppforing;
