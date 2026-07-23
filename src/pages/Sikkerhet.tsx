import { Link } from "react-router-dom";
import { CheckCircle2, ArrowRight } from "lucide-react";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  SectionRule,
  EditorialHeading,
  EditorialButton,
  EditorialCard,
  SpecRow,
  ProgressRail,
} from "@/components/editorial";
import { getFraunces } from "@/lib/fonts";
import PilotInvitationSection from "@/components/PilotInvitationSection";

const FAQ = [
  {
    question: "Er Digilist GDPR-kompatibelt?",
    answer:
      "Ja. Digilist oppfyller kravene i GDPR og norsk personopplysningslov. Vi inngår databehandleravtale (DPA) med hver kunde, behandler kun de personopplysningene bookingen krever, og gir de registrerte innsyn, retting og sletting. All data lagres i Norge og EU.",
  },
  {
    question: "Hvor lagres dataene?",
    answer:
      "All data lagres i Norge og EU, aldri utenfor EØS. Databasen driftes på infrastruktur innenfor EU/EØS, slik at offentlige og private kunder oppfyller kravene til datalokasjon i norske anskaffelser og personvernregelverket.",
  },
  {
    question: "Er Digilist ISO 27001-sertifisert?",
    answer:
      "Ja. Digilist er sertifisert mot ISO 27001 (informasjonssikkerhet) og ISO 27701 (personverninformasjon). Det betyr at sikkerhet og personvern styres etter et etablert, revidert rammeverk – ikke ad hoc.",
  },
  {
    question: "Hvordan logger brukere inn sikkert?",
    answer:
      "Innlogging skjer med BankID og ID-porten for sterk autentisering, slik offentlige tjenester krever. Tilgang er rollebasert, så saksbehandlere, utleiere og innbyggere ser kun det de skal.",
  },
  {
    question: "Hvordan sikres sporbarhet og tilgangskontroll?",
    answer:
      "Tilgang styres rollebasert, og hver endring registreres i en audit-logg med tidsstempel og bruker. Det gir full sporbarhet på hvem som gjorde hva og når – nødvendig både for offentlig forvaltning og for tvistehåndtering ved utleie.",
  },
  {
    question: "Hva skjer ved et sikkerhetsbrudd?",
    answer:
      "Digilist har rutiner for hendelseshåndtering og varsling. Ved brudd på personopplysningssikkerheten varsler vi kunden uten ugrunnet opphold, slik at avviket kan meldes til Datatilsynet innen 72 timer i tråd med GDPR.",
  },
];

const PRINSIPPER = [
  "Data lagret i Norge og EU – aldri utenfor EØS",
  "ISO 27001 (informasjonssikkerhet) sertifisert",
  "ISO 27701 (personvern) sertifisert",
  "GDPR-kompatibel med databehandleravtale",
  "BankID og ID-porten for sikker innlogging",
  "Rollebasert tilgangsstyring",
  "Kryptering i transitt og hvile",
  "Audit-logg på hver endring",
  "Dataminimering – kun det bookingen krever",
  "Innsyn, retting og sletting for de registrerte",
  "Varslingsrutiner iht. GDPR (72 timer)",
  "SSA-L 2026-klar for offentlige anskaffelser",
];

const OMRADER = [
  {
    title: "Personvern og GDPR",
    body: "Databehandleravtale med hver kunde, dataminimering, og innsyn/retting/sletting for de registrerte. Vi behandler kun de personopplysningene en booking faktisk krever.",
  },
  {
    title: "Datalagring i Norge og EU",
    body: "All data lagres innenfor EU/EØS, aldri utenfor. Det oppfyller kravene til datalokasjon i norske offentlige anskaffelser og i personvernregelverket.",
  },
  {
    title: "ISO 27001 og 27701",
    body: "Informasjonssikkerhet og personvern styres etter et sertifisert, revidert rammeverk. Kontroller, risikovurdering og forbedring er innebygd, ikke tilfeldig.",
  },
  {
    title: "Sikker innlogging",
    body: "BankID og ID-porten gir sterk autentisering på nivå med offentlige tjenester. Rollebasert tilgang sikrer at hver bruker kun ser det de skal.",
  },
  {
    title: "Sporbarhet og audit-logg",
    body: "Hver mutasjon registreres med tidsstempel og bruker. Det gir full sporbarhet for offentlig forvaltning og et etterprøvbart spor ved tvist om en utleie eller booking.",
  },
  {
    title: "Kryptering og drift",
    body: "Data krypteres i transitt og hvile. Drift, sikkerhetsoppdateringer og overvåking håndteres av oss, slik at kommuner og utleiere slipper egen sikkerhetsforvaltning.",
  },
];

const Sikkerhet = () => {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <SEO
        title="Sikkerhet og personvern · Digilist | ISO 27001, GDPR og datasikkerhet"
        description="Slik ivaretar Digilist sikkerhet og personvern: data i Norge og EU, ISO 27001- og 27701-sertifisert, GDPR-kompatibelt, BankID/ID-porten og audit-logg. Trygt bookingsystem for kommuner og utleiere."
        keywords="iso 27001, gdpr, personvern bookingsystem, datasikkerhet, sikker booking, gdpr bookingsystem, iso 27701, databehandleravtale, datalagring norge"
        canonical="https://digilist.no/sikkerhet"
        ogImage="https://digilist.no/og-image.png"
        faq={FAQ}
        breadcrumbs={[
          { name: "Hjem", url: "https://digilist.no/" },
          { name: "Sikkerhet og personvern", url: "https://digilist.no/sikkerhet" },
        ]}
      />
      <ProgressRail />
      <Navbar />

      <main id="main">
        <section className="pt-28 lg:pt-32 pb-16 lg:pb-24 bg-paper">
          <div className="container mx-auto md:px-8 lg:px-12">
            <SectionRule label="SIKKERHET OG PERSONVERN · 2026" />

            <div className="grid lg:grid-cols-12 gap-8 lg:gap-gutter items-start">
              <div className="lg:col-span-8">
                <EditorialHeading as="h1" size="hero" className="mb-6">
                  Sikkerhet og{" "}
                  <em
                    className="italic"
                    style={{ fontVariationSettings: getFraunces("hero") }}
                  >
                    personvern
                  </em>
                  .
                </EditorialHeading>
                <p className="text-xl text-ink-soft measure leading-relaxed mb-10">
                  Digilist er bygget for å håndtere personopplysninger trygt. All
                  data lagres i{" "}
                  <strong className="text-ink">Norge og EU</strong>, plattformen er{" "}
                  <strong className="text-ink">ISO 27001- og 27701-sertifisert</strong>{" "}
                  og GDPR-kompatibel, med BankID/ID-porten-innlogging og audit-logg på
                  hver endring. Et bookingsystem kommuner og utleiere kan stole på.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <EditorialButton variant="primary" size="lg" href="/#kontakt">
                    Be om demo
                  </EditorialButton>
                  <EditorialButton
                    variant="outline"
                    size="lg"
                    icon={false}
                    href="/teknologi"
                  >
                    Se teknologien
                  </EditorialButton>
                </div>
              </div>

              <div className="lg:col-span-4">
                <EditorialCard className="bg-accent-tinted">
                  <h2
                    className="font-serif text-2xl text-ink mb-4"
                    style={{ fontVariationSettings: getFraunces("section") }}
                  >
                    Kort fortalt
                  </h2>
                  <SpecRow label="Datalokasjon" value="Norge · EU" />
                  <SpecRow label="Sertifisering" value="ISO 27001 · 27701" />
                  <SpecRow label="Personvern" value="GDPR · DPA" />
                  <SpecRow label="Innlogging" value="BankID · ID-porten" />
                </EditorialCard>
              </div>
            </div>
          </div>
        </section>

        <section className="py-14 lg:py-20 bg-paper-tinted border-y border-rule">
          <div className="container mx-auto md:px-8 lg:px-12">
            <SectionRule label="I. SIKKERHETSPRINSIPPER" />
            <div className="grid lg:grid-cols-12 gap-8 mb-10">
              <div className="lg:col-span-7">
                <EditorialHeading as="h2" size="section">
                  Innebygd sikkerhet,{" "}
                  <em className="italic">ikke påklistret</em>.
                </EditorialHeading>
              </div>
              <div className="lg:col-span-5 flex items-end">
                <p
                  className="text-xl text-ink-soft italic"
                  style={{ fontVariationSettings: getFraunces("sub") }}
                >
                  Tolv prinsipper som gjør Digilist trygt for offentlige og private data.
                </p>
              </div>
            </div>
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4 mt-8">
              {PRINSIPPER.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle2
                    className="h-5 w-5 mt-0.5 shrink-0 text-accent-text"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                  <span className="text-base text-ink-soft">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="py-14 lg:py-20 bg-paper">
          <div className="container mx-auto md:px-8 lg:px-12">
            <SectionRule label="II. OMRÅDER" />
            <div className="grid lg:grid-cols-12 gap-8 mb-10">
              <div className="lg:col-span-7">
                <EditorialHeading as="h2" size="section">
                  Hvordan vi ivaretar dataene.
                </EditorialHeading>
              </div>
              <div className="lg:col-span-5 flex items-end">
                <p
                  className="text-xl text-ink-soft italic"
                  style={{ fontVariationSettings: getFraunces("sub") }}
                >
                  Fra datalokasjon og sertifisering til innlogging og sporbarhet.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-rule border border-rule">
              {OMRADER.map((f) => (
                <div key={f.title} className="bg-paper p-6 lg:p-8 flex flex-col gap-3">
                  <h3
                    className="font-serif text-xl text-ink"
                    style={{ fontVariationSettings: getFraunces("sub"), fontStyle: "normal" }}
                  >
                    {f.title}
                  </h3>
                  <p className="text-base text-ink-soft leading-relaxed">{f.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <PilotInvitationSection />

        <section className="py-14 lg:py-20 bg-paper">
          <div className="container mx-auto md:px-8 lg:px-12">
            <SectionRule label="III. SPØRSMÅL OG SVAR" />
            <EditorialHeading as="h2" size="section" className="mb-10">
              Vanlige spørsmål om sikkerhet og personvern.
            </EditorialHeading>
            <dl className="space-y-8 max-w-4xl">
              {FAQ.map((q) => (
                <div key={q.question} className="border-b border-rule pb-8">
                  <dt
                    className="font-serif text-2xl text-ink mb-3"
                    style={{
                      fontVariationSettings: getFraunces("section"),
                      letterSpacing: "-0.015em",
                    }}
                  >
                    {q.question}
                  </dt>
                  <dd className="text-base text-ink-soft leading-relaxed measure">
                    {q.answer}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-10 editorial-mono-caption">
              Se også{" "}
              <Link
                to="/bookingsystem-kommune"
                className="text-accent-text hover:underline underline-offset-4 decoration-[0.5px]"
              >
                bookingsystem for kommuner
              </Link>
              ,{" "}
              <Link
                to="/bookingsystem-utleie"
                className="text-accent-text hover:underline underline-offset-4 decoration-[0.5px]"
              >
                bookingsystem for utleie
              </Link>{" "}
              eller{" "}
              <Link
                to="/teknologi"
                className="text-accent-text hover:underline underline-offset-4 decoration-[0.5px]"
              >
                teknologien bak
              </Link>
              .
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Sikkerhet;
