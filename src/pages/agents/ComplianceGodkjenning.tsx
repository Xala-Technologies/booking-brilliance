import AgentSpokeLayout, { type AgentSpokeContent } from "@/components/AgentSpokeLayout";

const content: AgentSpokeContent = {
  slug: "compliance-godkjenning",
  eyebrow: "GODKJENNING & COMPLIANCE",
  h1: "Listing Approver: automatisk compliance-godkjenning av oppføringer",
  lead: "Listing Approver er Digilists AI-agent som modererer hver eneste ventende oppføring i markedsplassen som «Digilist Agent». Den er en lovlighetsport, ikke en kvalitetsport: en normal, ærlig oppføring slipper gjennom. Bare et reelt juridisk, regulatorisk eller personvernmessig problem stopper den. Agenten godkjenner raust, gir vennlige råd i stedet for å avvise på skjønn, og eskalerer alt den er usikker på til et menneske.",
  metaTitle: "Automatisk compliance-godkjenning av oppføringer | Digilist",
  metaDescription:
    "Listing Approver modererer hver oppføring automatisk mot GDPR, NSM, markedsføringsloven og universell utforming. Lovlighetsport for bookingsystem i kommune.",
  keywords: [
    "GDPR bookingplattform",
    "automatisk moderering",
    "universell utforming booking",
    "compliance utleie kommune",
    "bookingsystem kommune",
    "markedsføringsloven oppføring",
    "NSM IKT-sikkerhet",
    "SOC 2 utleieplattform",
  ],
  breadcrumbLabel: "Compliance-godkjenning",
  flowTitle: "SLIK GODKJENNES EN OPPFØRING",
  flow: [
    "Publiseringsport sjekker struktur",
    "Ekspert-LLM vurderer compliance",
    "Vision inspiserer hvert bilde",
    "Konservativ beslutningsmotor",
    "Mentor skriver melding til utleier",
    "Godkjenn · endre · eskalér",
  ],
  frameworks: ["GDPR", "NSM", "SOC 2", "WCAG 2.1 AA", "Markedsføringsloven"],
  sections: [
    {
      heading: "En lovlighetsport, ikke en kvalitetsport",
      body: [
        "Listing Approver har ett mandat: å hindre at ulovlig, villedende eller personvernkrenkende innhold blir publisert. Den vurderer ikke om en oppføring er pen, komplett eller godt optimalisert. En normal, ærlig oppføring passerer uten friksjon.",
        "Agenten godkjenner raust. Tips om kvalitet, komplett utfylling og SEO gis som vennlige råd fra en rådgiver, aldri som grunnlag for å blokkere. Det som stopper en oppføring, er et reelt juridisk, regulatorisk eller personvernmessig problem, og ingenting annet.",
        "Denne holdningen er avgjørende for en markedsplass i kommunal regi. Utleiere skal ikke oppleve automatisk moderering som en vilkårlig portvakt, men som en forutsigbar lovlighetskontroll som behandler alle likt.",
      ],
    },
    {
      heading: "Hva agenten faktisk gjennomgår",
      body: [
        "Ekspert-LLM-en vurderer oppføringen på flere dimensjoner. Ulovlig innhold avvises. Personopplysninger i offentlig tekst, som e-post, telefonnummer, fødselsnummer eller en identifiserbar person, håndteres som et GDPR-problem for en GDPR bookingplattform.",
        "Sikkerhet vektlegges etter NSM sine grunnprinsipper for IKT-sikkerhet: eksponerte adgangskoder, passord eller usikre betalingslenker utenfor plattformen fanges opp. Villedende eller ulovlige kommersielle påstander vurderes mot markedsføringsloven, inkludert lokkepriser, uopplyste obligatoriske gebyrer og alkoholmarkedsføring.",
        "Til slutt kontrolleres intern konsistens: feil kategori, åpningstider som ikke dekker den annonserte bruken, skjulte obligatoriske kostnader og fasiliteter som ikke stemmer med teksten. En deterministisk forhåndssjekk fanger e-post, telefon, fødselsnummer og åpenbart ulovlig innhold selv om AI-kallet skulle feile.",
      ],
    },
    {
      heading: "Hvert bilde blir sett",
      body: [
        "Vision-steget laster ned og inspiserer hvert enkelt bilde i oppføringen. Seksuelt, voldelig eller ulovlig innhold fører til avvisning. Et bilde som gir et misvisende inntrykk av stedet, altså svindel, eller som viser et identifiserbart ansikt uten grunnlag, må rettes av personvernhensyn.",
        "Bildekvalitet, lys og komposisjon er aldri blokkerende. Beslutningsmotoren nekter å godkjenne noe den ikke faktisk har vision-skannet, slik at ingen oppføring slipper gjennom på antakelser.",
      ],
    },
    {
      heading: "Forankret i norsk regelverk",
      body: [
        "Agenten grunngir vurderingene sine i reelt regelverk, ikke gjetning. Den bruker Digilists egne regler via repo-kartet, interne compliance-dokumenter og websøk mot autoritativ juridisk tekst.",
        "Rammeverkene er GDPR (Datatilsynet), universell utforming etter WCAG 2.1 AA, som er lovpålagt i Norge gjennom Forskrift om universell utforming av IKT, NSM sine grunnprinsipper for IKT-sikkerhet, SOC 2 etter AICPA Trust Services Criteria, og markedsføringsloven. Universell utforming booking er dermed ikke en ettertanke, men en del av selve godkjenningen.",
        "For compliance utleie kommune betyr dette et bookingsystem kommune kan stole på: hver avgjørelse kan spores tilbake til en konkret regel.",
      ],
    },
    {
      heading: "Tre stemmer, og et menneske når det trengs",
      body: [
        "Agenten snakker med tre stemmer. Moderatoren er compliance-myndigheten som avgjør lovligheten. Mentoren er en varm veileder som forklarer eventuelle rettinger på norsk, leser oppføringens historikk og passer på at den aldri gjentar eller motsier tidligere veiledning. Rådgiveren, en utleiemegler, gir ved godkjenning 6-10 konkrete tips for å få lokalet booket: bedre fasiliteter og tillegg, SEO-nøkkelord, skarpere tittel og beskrivelse, media, prising og differensiering mot konkurrenter.",
        "Beslutningsmotoren er bevisst konservativ. Ulovlig innhold avvises, et rettbart juridisk eller personvernmessig problem utløser en anmodning om endringer, alt som er usikkert eskaleres til et menneske, og rene oppføringer godkjennes.",
        "Agenten kjører også en komplett livssyklus. En tidligere godkjent oppføring som har blitt dårligere settes på pause med et mentornotat til eier, og gjenopptas automatisk når den er rettet.",
      ],
    },
  ],
  faq: [
    {
      question: "Blokkerer agenten oppføringer med dårlig kvalitet eller manglende bilder?",
      answer:
        "Nei. Listing Approver er en lovlighetsport, ikke en kvalitetsport. Kvalitet, komplett utfylling og bildekvalitet gis som vennlige råd, aldri som grunnlag for å blokkere. Bare et reelt juridisk, regulatorisk eller personvernmessig problem stopper en oppføring.",
    },
    {
      question: "Hvordan håndterer den personopplysninger og GDPR?",
      answer:
        "Agenten behandler e-post, telefonnummer, fødselsnummer eller en identifiserbar person i offentlig tekst som et GDPR-problem, forankret i Datatilsynets regelverk. En deterministisk forhåndssjekk fanger slike opplysninger selv om AI-kallet skulle feile, slik at en GDPR bookingplattform holder personvernet intakt.",
    },
    {
      question: "Hva skjer med bildene i en oppføring?",
      answer:
        "Vision-steget laster ned og inspiserer hvert enkelt bilde. Seksuelt, voldelig eller ulovlig innhold avvises. Et bilde som misrepresenterer stedet eller viser et identifiserbart ansikt uten grunnlag må rettes. Bildekvalitet og lys er aldri blokkerende, og agenten godkjenner aldri noe den ikke har vision-skannet.",
    },
    {
      question: "Hvilke regelverk bygger avgjørelsene på?",
      answer:
        "GDPR, universell utforming etter WCAG 2.1 AA (lovpålagt via Forskrift om universell utforming av IKT), NSM sine grunnprinsipper for IKT-sikkerhet, SOC 2 etter AICPA Trust Services Criteria og markedsføringsloven. Agenten bruker Digilists egne regler, compliance-dokumenter og websøk mot autoritativ juridisk tekst, og gjetter ikke.",
    },
    {
      question: "Erstatter agenten menneskelig moderering?",
      answer:
        "Nei. Beslutningsmotoren er konservativ og eskalerer alt den er usikker på til et menneske. Den avviser ulovlig innhold, ber om endringer ved rettbare problemer og godkjenner rene oppføringer, men automatisk moderering avlaster mennesker uten å ta over de vanskelige skjønnsvurderingene.",
    },
  ],
  related: [
    { label: "Alle AI-agentene", href: "/ai-agenter" },
    { label: "Sesongtildeling", href: "/ai-agenter/sesongtildeling" },
    { label: "Importér oppføring", href: "/ai-agenter/importer-oppforing" },
  ],
};

const ComplianceGodkjenning = () => <AgentSpokeLayout content={content} />;

export default ComplianceGodkjenning;
