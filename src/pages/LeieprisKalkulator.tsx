import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Calculator } from "lucide-react";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SectionRule, EditorialHeading, EditorialButton, EditorialCard, Byline } from "@/components/editorial";
import { getFraunces } from "@/lib/fonts";
import PilotInvitationSection from "@/components/PilotInvitationSection";
import { LOKALTYPER, BYER, estimatePrice, kr } from "@/lib/kalkulator";

const UPDATED = "24. juli 2026";

const FAQ = [
  {
    question: "Hva koster det å leie et lokale?",
    answer:
      "Prisen varierer mye med lokaltype, sted, kapasitet, ukedag og sesong. Som grove pekepinner ligger grendehus og foreningslokaler ofte på 1 000–5 000 kr per dag, selskaps- og festlokaler på 5 000–30 000 kr, møterom fra noen hundre kroner, og kulturhus og storsaler høyere. Denne kalkulatoren gir et estimert intervall basert på disse pekepinnene – den faktiske prisen ser du på det enkelte lokalet.",
  },
  {
    question: "Er estimatet et bindende tilbud?",
    answer:
      "Nei. Kalkulatoren gir kun et veiledende prisintervall for å hjelpe deg å budsjettere. Faktisk pris settes av den enkelte utleier og avhenger av lokalet, tidspunktet og eventuelle tilleggstjenester. På Digilist ser du totalprisen for din dato, inkludert depositum, før du booker.",
  },
  {
    question: "Hva påvirker prisen mest?",
    answer:
      "Lokaltype og størrelse betyr mest, deretter sted (sentrale strøk i de største byene er dyrest), ukedag (lørdager i høysesong koster mest) og sesong (mai–september er høysesong for fester og bryllup). Tilleggstjenester som rengjøring, bemanning, AV-utstyr og catering kommer ofte i tillegg til grunnleien.",
  },
  {
    question: "Kan jeg leie både private og kommunale lokaler?",
    answer:
      "Ja. Mange grendehus, kulturhus og kommunale lokaler leies ut til private arrangementer, ofte rimeligere enn rene selskapslokaler. På Digilist ligger private og kommunale lokaler i samme kalender, så du kan sammenligne pris og tilgjengelighet på ett sted.",
  },
];

export default function LeieprisKalkulator() {
  const [lokaltype, setLokaltype] = useState("selskapslokale");
  const [gjester, setGjester] = useState(60);
  const [by, setBy] = useState("oslo");
  const [helg, setHelg] = useState(true);
  const [hoysesong, setHoysesong] = useState(true);

  const result = useMemo(
    () => estimatePrice({ lokaltype, gjester, by, helg, hoysesong }),
    [lokaltype, gjester, by, helg, hoysesong],
  );

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <SEO
        title="Leiepriskalkulator: hva koster det å leie lokale? | Digilist"
        description="Gratis leiepriskalkulator: få et ærlig, veiledende prisintervall for å leie selskapslokale, møterom, konferanselokale, kulturhus eller idrettshall – justert for by, sesong og ukedag. Ikke et tilbud, men en god pekepinn for budsjettet."
        keywords="hva koster det å leie lokale, leiepris lokale, pris selskapslokale, priskalkulator lokale, leie lokale pris, leiepriskalkulator"
        canonical="https://digilist.no/verktoy/leiepriskalkulator"
        faq={FAQ}
        breadcrumbs={[
          { name: "Hjem", url: "https://digilist.no/" },
          { name: "Verktøy", url: "https://digilist.no/verktoy" },
          { name: "Leiepriskalkulator", url: "https://digilist.no/verktoy/leiepriskalkulator" },
        ]}
      />
      <Navbar />

      <main id="main">
        {/* Hero */}
        <section className="pt-28 lg:pt-32 pb-10 lg:pb-14 bg-paper">
          <div className="mx-auto max-w-3xl px-6">
            <div className="inline-flex items-center gap-2 text-sm text-ink-soft mb-4">
              <Calculator className="h-4 w-4" aria-hidden />
              <span>Gratis verktøy</span>
            </div>
            <EditorialHeading as="h1" size="display">
              Hva koster det å leie et lokale?
            </EditorialHeading>
            <p className="text-xl text-ink-soft measure leading-relaxed mt-5">
              Få et ærlig, veiledende prisintervall for å leie lokale i Norge – justert for lokaltype, antall
              gjester, by, ukedag og sesong. Dette er <strong className="text-ink">et estimat, ikke et tilbud</strong>:
              faktisk pris settes av utleier og ser du på det enkelte lokalet.
            </p>
          </div>
        </section>

        {/* Calculator */}
        <section className="pb-14 lg:pb-20 bg-paper">
          <div className="mx-auto max-w-3xl px-6">
            <EditorialCard className="p-6 lg:p-8">
              <div className="grid gap-6 sm:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-medium text-ink">Lokaltype</span>
                  <select
                    className="mt-1.5 w-full rounded-md border border-rule bg-background px-3 py-2 text-ink"
                    value={lokaltype}
                    onChange={(e) => setLokaltype(e.target.value)}
                  >
                    {LOKALTYPER.map((t) => (
                      <option key={t.key} value={t.key}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="text-sm font-medium text-ink">Antall gjester</span>
                  <input
                    type="number"
                    min={1}
                    max={1000}
                    className="mt-1.5 w-full rounded-md border border-rule bg-background px-3 py-2 text-ink"
                    value={gjester}
                    onChange={(e) => setGjester(Math.max(0, Number(e.target.value) || 0))}
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-medium text-ink">By / sted</span>
                  <select
                    className="mt-1.5 w-full rounded-md border border-rule bg-background px-3 py-2 text-ink"
                    value={by}
                    onChange={(e) => setBy(e.target.value)}
                  >
                    {BYER.map((b) => (
                      <option key={b.key} value={b.key}>
                        {b.label}
                      </option>
                    ))}
                  </select>
                </label>

                <div className="block">
                  <span className="text-sm font-medium text-ink">Tidspunkt</span>
                  <div className="mt-1.5 flex flex-col gap-2">
                    <label className="inline-flex items-center gap-2 text-ink-soft">
                      <input type="checkbox" checked={helg} onChange={(e) => setHelg(e.target.checked)} />
                      <span>Helg (lør/søn)</span>
                    </label>
                    <label className="inline-flex items-center gap-2 text-ink-soft">
                      <input
                        type="checkbox"
                        checked={hoysesong}
                        onChange={(e) => setHoysesong(e.target.checked)}
                      />
                      <span>Høysesong (mai–september)</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Result */}
              <div className="mt-8 rounded-lg bg-paper-tinted border border-rule p-6 text-center">
                {result ? (
                  <>
                    <p className="text-sm text-ink-soft">Estimert leiepris</p>
                    <p
                      className="font-serif text-4xl lg:text-5xl text-ink mt-1"
                      style={{ fontVariationSettings: getFraunces("hero") }}
                    >
                      {kr(result.low)}–{kr(result.high)} kr
                    </p>
                    <p className="text-sm text-ink-soft mt-1">
                      per {result.unit} · {result.typeLabel}
                    </p>
                    <p className="text-xs text-ink-soft mt-4 measure mx-auto">
                      Justert for: {result.factors.join(" · ")}. Et veiledende intervall – ikke et tilbud. Faktisk
                      pris varierer med lokalet og tilleggstjenester.
                    </p>
                    <div className="mt-5">
                      <EditorialButton href={`https://app.digilist.no`} variant="primary">
                        Finn ledige {result.typeLabel.toLowerCase()} <ArrowRight className="h-4 w-4" />
                      </EditorialButton>
                    </div>
                    <p className="text-xs text-ink-soft mt-3">
                      Se ekte priser og ledige datoer på{" "}
                      <Link to={result.link} className="underline">
                        {result.typeLabel}
                      </Link>
                      .
                    </p>
                  </>
                ) : (
                  <p className="text-ink-soft">Velg lokaltype for et estimat.</p>
                )}
              </div>
            </EditorialCard>
          </div>
        </section>

        <SectionRule />

        {/* Explanation — rich guidance */}
        <section className="py-14 lg:py-20 bg-paper">
          <div className="mx-auto max-w-3xl px-6">
            <EditorialHeading as="h2" size="section">
              Slik beregner vi estimatet
            </EditorialHeading>
            <div className="mt-6 space-y-4 text-lg text-ink-soft leading-relaxed measure">
              <p>
                Estimatet tar utgangspunkt i typiske prisintervaller for hver lokaltype i det norske
                utleiemarkedet, og justerer dem med noen få, tydelige faktorer. Vi oppgir alltid et{" "}
                <strong className="text-ink">intervall</strong>, ikke en eksakt pris, fordi den reelle prisen
                avhenger av det konkrete lokalet.
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong className="text-ink">Lokaltype og størrelse</strong> betyr mest. Et grendehus koster en
                  brøkdel av et sentralt selskapslokale.
                </li>
                <li>
                  <strong className="text-ink">By og sted:</strong> sentrale strøk i Oslo og de større byene ligger
                  høyere; mindre steder rimeligere.
                </li>
                <li>
                  <strong className="text-ink">Ukedag:</strong> lørdager er mest ettertraktet og dyrest; hverdager
                  er billigere og har bedre tilgjengelighet.
                </li>
                <li>
                  <strong className="text-ink">Sesong:</strong> mai–september er høysesong for bryllup og fester.
                </li>
              </ul>
              <p>
                Husk at <strong className="text-ink">tilleggstjenester</strong> – rengjøring, bemanning, AV-utstyr,
                catering og depositum – ofte kommer i tillegg til grunnleien. På Digilist vises tilleggene som egne
                linjer, så du ser sluttsummen før du bekrefter.
              </p>
            </div>

            <div className="mt-8">
              <Byline author="Digilist-redaksjonen" role="Bookingsystem for utleie" date={UPDATED} />
            </div>
          </div>
        </section>

        <SectionRule />

        {/* Related */}
        <section className="py-14 lg:py-20 bg-paper-tinted border-y border-rule">
          <div className="mx-auto max-w-3xl px-6">
            <EditorialHeading as="h2" size="section">
              Utforsk videre
            </EditorialHeading>
            <ul className="mt-5 grid gap-2 sm:grid-cols-2 text-ink">
              <li><Link className="underline" to="/lokaler-til-leie">Lokaler til leie</Link></li>
              <li><Link className="underline" to="/bookingsystem-utleie">Bookingsystem for utleie</Link></li>
              <li><Link className="underline" to="/verktoy/kapasitetskalkulator">Kapasitetskalkulator</Link></li>
              <li><Link className="underline" to="/leie/selskapslokale">Leie selskapslokale</Link></li>
            </ul>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-14 lg:py-20 bg-paper">
          <div className="mx-auto max-w-3xl px-6">
            <EditorialHeading as="h2" size="section">
              Ofte stilte spørsmål
            </EditorialHeading>
            <dl className="mt-6 space-y-6">
              {FAQ.map((f) => (
                <div key={f.question}>
                  <dt className="font-serif text-xl text-ink mb-1">{f.question}</dt>
                  <dd className="text-ink-soft leading-relaxed measure">{f.answer}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <PilotInvitationSection />
      </main>

      <Footer />
    </div>
  );
}
