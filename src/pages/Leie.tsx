import { Link } from "react-router-dom";
import {
  GlassWater,
  Users2,
  Trophy,
  Theater,
  ArrowUpRight,
  Search,
  CalendarCheck,
  Wallet,
} from "lucide-react";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import {
  SectionRule,
  EditorialHeading,
  EditorialButton,
  EditorialCard,
  ProgressRail,
} from "@/components/editorial";
import { getFraunces } from "@/lib/fonts";
import { VideoPlaceholder } from "@/components/VideoPlaceholder";

const APP = "https://app.digilist.no";

// Category cards open the live platform. A ?kategori hint is harmless today
// (the app ignores unknown params) and is forward-compatible once a deep-link
// contract exists. The Selskapslokaler card also carries an internal guide link.
const CATEGORIES = [
  {
    title: "Selskapslokaler",
    Icon: GlassWater,
    body: "Bryllup, jubileer, konfirmasjon og fest. Ekte pris for din dato, depositum og vilkår synlig før du booker.",
    href: `${APP}/?kategori=selskapslokale`,
    guide: "/leie/selskapslokale",
  },
  {
    title: "Møterom",
    Icon: Users2,
    body: "Møterom og kurslokaler per time, hos kommuner, næringsbygg og foreninger. Book og betal på minutter.",
    href: `${APP}/?kategori=moterom`,
  },
  {
    title: "Idrettshaller",
    Icon: Trophy,
    body: "Enkelttimer eller hele haller og gymsaler. Sjekk hva som er ledig og book uten å ringe rundt.",
    href: `${APP}/?kategori=idrettshall`,
  },
  {
    title: "Kulturhus og grendehus",
    Icon: Theater,
    body: "Kulturhus, samfunnshus og grendehus til arrangement, konsert eller markering. Lokale lokaler, samlet.",
    href: `${APP}/?kategori=kulturhus`,
  },
];

const STEPS = [
  {
    step: "01",
    Icon: Search,
    title: "Finn",
    body: "Søk på sted og dato. Du ser grendehus, kulturhus og private selskapslokaler i nærområdet, med ekte priser og hva som faktisk er ledig.",
  },
  {
    step: "02",
    Icon: CalendarCheck,
    title: "Book",
    body: "Velg ledig tid og book direkte, ingen uforpliktende forespørsel og ingen dager med e-post fram og tilbake. Vilkår, depositum og kapasitet er synlig før du bekrefter.",
  },
  {
    step: "03",
    Icon: Wallet,
    title: "Betal med Vipps",
    body: "Betal trygt med Vipps eller kort. Bekreftelse og kvittering kommer med en gang. Ingen bankoverføring til en fremmed, ingen usikkerhet.",
  },
];

const FAQ = [
  {
    question: "Hva koster det å leie et lokale?",
    answer:
      "Prisen varierer mye med type lokale, sted og varighet. Et grendehus kan koste noen hundre til noen tusen kroner for en helg, mens et kulturhus eller selskapslokale ligger høyere. På Digilist ser du den faktiske totalprisen for din dato, inkludert eventuelt depositum og rengjøring, før du booker, så du slipper å gjette.",
  },
  {
    question: "Kan jeg se ledige datoer og booke på nett?",
    answer:
      "Ja. Du søker på sted og dato, ser hva som faktisk er ledig i sanntid, og booker direkte. Ingen uforpliktende forespørsel og ingen venting på svar, du får bekreftelsen med en gang.",
  },
  {
    question: "Hvordan betaler jeg?",
    answer:
      "Du betaler trygt med Vipps eller kort i samme flyt som bookingen. Der lokalet krever depositum, håndteres det digitalt med automatisk frigjøring etter arrangementet. Ingen bankoverføring til en fremmed.",
  },
  {
    question: "Hva slags lokaler finner jeg?",
    answer:
      "Selskapslokaler, møterom, idrettshaller og gymsaler, kulturhus, samfunnshus og grendehus, både kommunale og private. Digilist samler lokalene der du bor på ett sted, så du slipper å lete gjennom kommunens sider, Finn-annonser og Facebook-grupper hver for seg.",
  },
  {
    question: "Er det gratis å bruke Digilist?",
    answer:
      "Ja, det er gratis å søke, sammenligne og booke som privatperson. Du betaler kun leieprisen til utleier. Depositum og eventuelle tilleggstjenester vises tydelig før du bekrefter.",
  },
  {
    question: "Kan jeg avbestille?",
    answer:
      "Avbestillingsvilkårene settes av utleier og vises tydelig på hvert lokale før du booker. Der det er tillatt, kan du avbestille digitalt, og et eventuelt depositum frigjøres automatisk etter reglene som gjelder for lokalet.",
  },
];

const Leie = () => {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <SEO
        title="Finn og book lokale — selskapslokale, møterom, kulturhus | Digilist"
        description="Finn og book lokale til bryllup, selskap, møte eller arrangement. Grendehus, kulturhus og selskapslokaler samlet ett sted, med ekte priser, ledige datoer og betaling med Vipps."
        keywords="leie lokale, finn lokale, leie selskapslokale, leie møterom, leie festlokale, leie lokale til bursdag, hva koster selskapslokale, book lokale online, leie kulturhus, leie grendehus"
        canonical="https://digilist.no/leie"
        breadcrumbs={[
          { name: "Hjem", url: "https://digilist.no/" },
          { name: "Leie", url: "https://digilist.no/leie" },
        ]}
        faq={FAQ}
        service
        howTo={{
          name: "Slik finner og booker du lokale",
          description: "Finn, book og betal med Vipps på tre steg via Digilist.",
          steps: STEPS.map((s) => ({ name: s.title, text: s.body })),
        }}
      />
      <ProgressRail />
      <Navbar />

      <PageTransition>
        <main id="main">
          <section className="pt-28 lg:pt-32 pb-14 lg:pb-20 bg-paper">
            <div className="container mx-auto md:px-8 lg:px-12">
              <SectionRule label="FINN LOKALE" />

              <div className="grid lg:grid-cols-12 gap-8 lg:gap-gutter mb-14 lg:mb-20">
                <div className="lg:col-span-9">
                  <EditorialHeading as="h1" size="display">
                    Finn og book lokale til festen,{" "}
                    <em
                      className="italic"
                      style={{ fontVariationSettings: getFraunces("display") }}
                    >
                      der du bor
                    </em>
                    .
                  </EditorialHeading>
                  <p className="mt-6 text-xl text-ink-soft measure leading-relaxed">
                    Grendehus, kulturhus og selskapslokaler samlet på ett sted. Ekte priser,
                    ledige datoer og trygg betaling med Vipps, ingen forespørsler og ingen
                    venting. Slutt med å lete gjennom kommunens sider, Finn-annonser og
                    Facebook-grupper hver for seg.
                  </p>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <EditorialButton
                      variant="primary"
                      size="lg"
                      href={APP}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Finn ledig lokale
                    </EditorialButton>
                    <EditorialButton variant="outline" size="lg" href="#slik">
                      Slik funker det
                    </EditorialButton>
                  </div>
                </div>
              </div>

              {/* Explainer video */}
              <div className="mb-14 lg:mb-20">
                <VideoPlaceholder
                  label="Reklamefilm · Finn lokale"
                  caption="Kort film om hvordan du finner og booker lokale"
                />
              </div>

              {/* Categories */}
              <div className="mb-14 lg:mb-20">
                <div className="flex items-baseline justify-between mb-6 border-b border-rule pb-3">
                  <h2 className="editorial-mono-caption text-accent-text">
                    HVA VIL DU LEIE?
                  </h2>
                  <span className="editorial-mono-caption text-ink-faint">
                    SELSKAP · MØTE · IDRETT · KULTUR
                  </span>
                </div>
                <div className="grid sm:grid-cols-2 gap-px bg-rule border border-rule">
                  {CATEGORIES.map((c) => {
                    const Icon = c.Icon;
                    return (
                      <a
                        key={c.title}
                        href={c.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group bg-paper p-7 lg:p-9 transition-colors duration-quick ease-editorial hover:bg-paper-deep/40 flex flex-col"
                      >
                        <header className="flex items-center gap-4 mb-4">
                          <span className="flex-shrink-0 inline-flex items-center justify-center w-11 h-11 bg-navy/5 border border-navy/15 rounded-sm text-navy group-hover:bg-navy group-hover:text-on-navy transition-colors duration-quick ease-editorial">
                            <Icon className="h-5 w-5" aria-hidden="true" />
                          </span>
                          <h3
                            className="font-serif text-2xl lg:text-3xl text-ink leading-tight flex-1"
                            style={{
                              fontVariationSettings: getFraunces("sub"),
                              letterSpacing: "-0.015em",
                            }}
                          >
                            {c.title}
                          </h3>
                          <ArrowUpRight
                            className="h-5 w-5 text-ink-faint group-hover:text-accent-text transition-transform duration-quick ease-editorial group-hover:translate-x-0.5 group-hover:-translate-y-0.5 flex-shrink-0"
                            aria-hidden="true"
                          />
                        </header>
                        <p className="text-base text-ink leading-relaxed flex-1">
                          {c.body}
                        </p>
                        <p className="mt-5 pt-4 border-t border-rule font-mono text-[0.65rem] uppercase tracking-widest text-accent-text inline-flex items-center gap-1.5">
                          Finn {c.title.toLowerCase()}
                          <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
                        </p>
                      </a>
                    );
                  })}
                </div>
              </div>

              {/* How it works */}
              <div id="slik" className="mb-14 lg:mb-20 scroll-mt-28">
                <div className="flex items-baseline justify-between mb-6 border-b border-rule pb-3">
                  <h2 className="editorial-mono-caption text-accent-text">
                    SLIK BOOKER DU
                  </h2>
                  <span className="editorial-mono-caption text-ink-faint">
                    FINN · BOOK · BETAL MED VIPPS
                  </span>
                </div>
                <ol className="relative border-l border-rule pl-8 lg:pl-12">
                  {STEPS.map((s, i) => {
                    const Icon = s.Icon;
                    return (
                      <li
                        key={s.step}
                        className={`relative grid grid-cols-12 gap-6 lg:gap-gutter py-8 lg:py-10 ${i > 0 ? "border-t border-rule" : ""}`}
                      >
                        <span
                          aria-hidden="true"
                          className="absolute -left-[2.5rem] lg:-left-[3.5rem] top-8 lg:top-10 inline-flex items-center justify-center w-9 h-9 bg-paper border border-hairline-strong rounded-sm font-mono text-xs text-accent-text tabular-nums"
                        >
                          {s.step}
                        </span>
                        <div className="col-span-12 lg:col-span-4">
                          <h3
                            className="font-serif text-2xl lg:text-3xl text-ink inline-flex items-center gap-3"
                            style={{
                              fontVariationSettings: getFraunces("sub"),
                              letterSpacing: "-0.015em",
                              lineHeight: 1.1,
                            }}
                          >
                            <Icon className="h-6 w-6 text-accent-text" strokeWidth={1.5} aria-hidden="true" />
                            {s.title}
                          </h3>
                        </div>
                        <div className="col-span-12 lg:col-span-8">
                          <p className="text-base lg:text-lg text-ink leading-relaxed">
                            {s.body}
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </div>

              {/* Guides */}
              <div className="mb-14 lg:mb-20">
                <div className="flex items-baseline justify-between mb-6 border-b border-rule pb-3">
                  <h2 className="editorial-mono-caption text-accent-text">GUIDER</h2>
                  <span className="editorial-mono-caption text-ink-faint">
                    PRIS · KAPASITET · BOOKING
                  </span>
                </div>
                <Link
                  to="/leie/selskapslokale"
                  className="group flex items-center justify-between gap-4 border border-rule rounded-sm p-6 hover:bg-paper-deep/40 transition-colors"
                >
                  <div>
                    <h3
                      className="font-serif text-xl lg:text-2xl text-ink"
                      style={{ fontVariationSettings: getFraunces("sub") }}
                    >
                      Leie selskapslokale: pris, kapasitet og booking
                    </h3>
                    <p className="text-base text-ink-soft mt-1">
                      Hva det koster, hva som er inkludert, og hvordan du booker på nett.
                    </p>
                  </div>
                  <ArrowUpRight className="h-6 w-6 text-ink-faint group-hover:text-accent-text flex-shrink-0" aria-hidden="true" />
                </Link>
              </div>

              {/* Closing CTA */}
              <EditorialCard className="bg-paper-deep/40">
                <div className="grid lg:grid-cols-12 gap-6 lg:gap-gutter items-center p-2 lg:p-6">
                  <div className="lg:col-span-8">
                    <h2
                      className="font-serif text-3xl lg:text-4xl text-ink mb-3"
                      style={{
                        fontVariationSettings: getFraunces("section"),
                        letterSpacing: "-0.015em",
                        lineHeight: 1.1,
                      }}
                    >
                      Klar til å finne lokalet?
                    </h2>
                    <p className="text-base lg:text-lg text-ink leading-relaxed">
                      Søk blant lokaler i nærområdet, se ekte priser og ledige datoer, og
                      book på minutter med Vipps.
                    </p>
                  </div>
                  <div className="lg:col-span-4 flex flex-wrap gap-3 lg:justify-end">
                    <EditorialButton
                      variant="primary"
                      size="lg"
                      href={APP}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Finn ledig lokale
                    </EditorialButton>
                  </div>
                </div>
              </EditorialCard>
            </div>
          </section>
        </main>
      </PageTransition>

      <Footer />
    </div>
  );
};

export default Leie;
