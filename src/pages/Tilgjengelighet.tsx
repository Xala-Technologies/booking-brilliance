import { useEffect } from "react";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Tilgjengelighet = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Tilgjengelighetserklæring · Digilist | WCAG 2.1 AA"
        description="Digilists tilgjengelighetserklæring: standard, status, hvordan vi tester, og hvordan du gir tilbakemelding eller klager til Digitaliseringsdirektoratet (uustatus.no)."
        canonical="https://digilist.no/tilgjengelighet"
        breadcrumbs={[
          { name: "Hjem", url: "https://digilist.no/" },
          { name: "Tilgjengelighet", url: "https://digilist.no/tilgjengelighet" },
        ]}
      />
      <Navbar />

      <main id="main">
      {/* Content */}
      <section className="pt-32 pb-16">
        <div className="container mx-auto md:px-8 lg:px-12">
          <div className="max-w-3xl mx-auto">

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Tilgjengelighetserklæring
            </h1>

            {/* Intro */}
            <p className="text-muted-foreground leading-relaxed mb-8">
              Denne erklæringen beskriver hvordan Digilist arbeider med universell utforming av digilist.no og bookingplattformen, hvilken standard vi følger, og hvordan du gir tilbakemelding eller klager dersom du støter på et tilgjengelighetsproblem.
            </p>

            {/* Section 1 */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                1. Standard og regelverk
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Digilist utvikles etter WCAG 2.1 nivå AA, som er kravet i forskrift om universell utforming av IKT, hjemlet i likestillings- og diskrimineringsloven § 17a. Standarden gjelder både digilist.no og bookingplattformen som tilbys kommuner og utleiere.
              </p>
            </div>

            {/* Section 2 */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                2. Hvordan vi tester
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-2">
                Tilgjengelighet inngår i den vanlige utviklingsprosessen, ikke som en engangskontroll:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 mb-4 ml-4">
                <li>automatiserte axe-core-revisjoner kjøres på hvert deploy</li>
                <li>overskriftshierarki, landemerker (som `main` og `nav`) og alt-tekster kontrolleres for hver side</li>
                <li>tastaturnavigasjon og synlig fokusmarkering testes på nye komponenter</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed">
                Automatisert testing fanger ikke alt. Vi retter feil fortløpende etter hvert som de oppdages, enten av oss selv eller gjennom tilbakemeldinger fra brukere.
              </p>
            </div>

            {/* Section 3 */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                3. Kjente avvik
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Vi kjenner ikke til vesentlige, uløste avvik fra WCAG 2.1 AA på digilist.no per publiseringsdato under. Enkeltstående feil kan likevel forekomme, særlig i innhold levert av tredjepart (for eksempel bilder eller tekst fra utleiere i markedsplassen). Oppdager du et problem, hører vi gjerne fra deg – se kontaktpunkt under.
              </p>
            </div>

            {/* Section 4 */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                4. Tilbakemelding og klage
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Har du støtt på et tilgjengelighetsproblem på digilist.no, kan du gi tilbakemelding til{" "}
                <a href="mailto:kontakt@digilist.no" className="text-primary hover:underline font-medium">
                  kontakt@digilist.no
                </a>
                . Beskriv gjerne hvilken side, hva som skjedde, og hvilket hjelpemiddel du eventuelt brukte.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Er du ikke fornøyd med svaret du får, kan du klage til Digitaliseringsdirektoratet, som fører tilsyn med regelverket om universell utforming av IKT. Tilsynet forvalter det nasjonale registeret for tilgjengelighetserklæringer på{" "}
                <a
                  href="https://uustatus.no"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline font-medium"
                >
                  uustatus.no
                </a>
                .
              </p>
            </div>

            {/* Dates */}
            <div className="mt-16 pt-8 border-t border-border">
              <p className="text-sm text-muted-foreground">
                Sist oppdatert: 11.08.2026
              </p>
            </div>

          </div>
        </div>
      </section>
      </main>

      <Footer />
    </div>
  );
};

export default Tilgjengelighet;
