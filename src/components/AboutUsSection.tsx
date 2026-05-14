import {
  SectionRule,
  EditorialHeading,
  DropCap,
  Byline,
  SpecRow,
  EditorialCard,
} from "@/components/editorial";
import { getFraunces } from "@/lib/fonts";

const AboutUsSection = () => {
  return (
    <section id="om-oss" className="py-14 lg:py-20 bg-paper-deep/40">
      <div className="container mx-auto px-4">
        <SectionRule label="VIII. KOLOFON" />

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-gutter">
          <div className="lg:col-span-7 lg:col-start-2">
            <Byline
              author="Xala Technologies AS"
              role="Utgiver"
              date="Oslo, 2026"
              className="mb-10"
            />

            <EditorialHeading as="h2" size="section" className="mb-12">
              Om{" "}
              <em
                className="italic"
                style={{ fontVariationSettings: '"opsz" 96, "wght" 400, "SOFT" 30, "WONK" 0' }}
              >
                Digilist.
              </em>
            </EditorialHeading>

            <div className="prose-editorial text-ink-soft text-lg leading-relaxed space-y-6">
              <DropCap>
                Digilist er en SaaS-plattform for det norske utleiemarkedet, utviklet
                av Xala Technologies AS. Plattformen samler booking, betaling, kalender,
                rapportering og integrasjoner mot offentlige tjenester i én løsning —
                bygd for både private utleiere, kulturhus, foreninger og kommuner.
              </DropCap>

              <p>
                Vi tror norske utleiere fortjener verktøy som passer det norske
                landskapet: Vipps og BankID til betaling og autentisering, EHF og Peppol
                til fakturering, ID-porten til innbyggerautentisering, ISO 27001 og GDPR
                til samsvar. Ikke amerikansk SaaS oversatt til bokmål, men en plattform
                bygd fra grunnen for norske krav.
              </p>

              <p>
                Plattformen kjører på Convex og PostgreSQL, hostet i Norge og EU.
                Hver mutasjon revisjonsspores. Hver komponent isoleres. Tilgang
                kontrolleres med RBAC og step-up-autentisering for sensitive
                operasjoner.
              </p>
            </div>
          </div>

          <div className="lg:col-span-3 lg:col-start-10">
            <EditorialCard className="bg-paper">
              <h3
                className="font-serif text-xl text-ink mb-6"
                style={{ fontVariationSettings: getFraunces("sub"), fontStyle: "normal" }}
              >
                Fakta
              </h3>
              <SpecRow label="Utgiver" value="Xala Technologies AS" />
              <SpecRow label="Kontor" value="Oslo" />
              <SpecRow label="Datalagring" value="Norge / EU" />
              <SpecRow label="Sertifisering" value="ISO 27001/27701" />
              <SpecRow label="Samsvar" value="GDPR · WCAG 2.0 AA" />
              <SpecRow label="Stack" value="Convex · React · PostgreSQL" />
            </EditorialCard>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUsSection;
