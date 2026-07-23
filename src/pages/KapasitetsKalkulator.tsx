import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Ruler } from "lucide-react";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SectionRule, EditorialHeading, EditorialButton, EditorialCard, Byline } from "@/components/editorial";
import { getFraunces } from "@/lib/fonts";
import PilotInvitationSection from "@/components/PilotInvitationSection";
import { OPPSETT, ARRANGEMENT, estimateCapacity, kr } from "@/lib/kalkulator";

const UPDATED = "24. juli 2026";

const FAQ = [
  {
    question: "Hvor stort lokale trenger jeg per gjest?",
    answer:
      "Det avhenger av oppsettet. Til en sittende middag med runde bord regner man vanligvis 1,5–2,0 m² per gjest, til mingling og stående mottakelse 0,8–1,0 m², til klasserom/kurs 2,0–2,5 m², og til kino/teater med stolrader 0,8–1,2 m². Kalkulatoren ganger antall gjester med disse standard-tallene og gir et anbefalt areal.",
  },
  {
    question: "Er arealtallene eksakte?",
    answer:
      "Nei, det er standard planleggingstall for å gi en pekepinn. Faktisk behov varierer med bord- og stoltyper, dansegulv, scene, buffé, garderobe, rømningsveier og bevegelsesareal. Legg gjerne på litt margin, og se alltid lokalets oppgitte kapasitet før du booker.",
  },
  {
    question: "Hvilke lokaltyper passer til antallet mitt?",
    answer:
      "Kalkulatoren foreslår lokaltyper hvis oppgitte kapasitet passer gjesteantallet ditt – for eksempel møterom for små grupper, selskapslokaler for 30–150 gjester, og kulturhus/storsaler for store arrangementer. Hver type lenker videre til ledige lokaler på Digilist.",
  },
  {
    question: "Bør jeg regne inn plass til dansegulv og buffé?",
    answer:
      "Ja. Skal du ha dansegulv, scene, buffébord eller bar, trenger du mer areal enn ren bordplass. En tommelfingerregel er å legge til 15–25 % ekstra for slike soner. Velg gjerne et lokale i øvre del av det anbefalte intervallet hvis programmet er variert.",
  },
];

export default function KapasitetsKalkulator() {
  const [gjester, setGjester] = useState(60);
  const [arrangement, setArrangement] = useState("bryllup");
  const [oppsett, setOppsett] = useState("middag");

  const result = useMemo(() => estimateCapacity({ gjester, oppsett }), [gjester, oppsett]);

  // Occasion picker suggests a layout (user can still override).
  function pickArrangement(key: string) {
    setArrangement(key);
    const a = ARRANGEMENT.find((x) => x.key === key);
    if (a) setOppsett(a.oppsett);
  }

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <SEO
        title="Kapasitetskalkulator: hvor stort lokale trenger du? | Digilist"
        description="Gratis kapasitetskalkulator: regn ut hvor stort lokale (m²) du trenger ut fra antall gjester og oppsett – sittende middag, mingling, klasserom eller kino. Med standard planleggingstall og forslag til lokaltyper som passer."
        keywords="hvor stort lokale, kapasitet lokale, m2 per gjest, hvor mange gjester lokale, kapasitetskalkulator, antall gjester lokale"
        canonical="https://digilist.no/verktoy/kapasitetskalkulator"
        faq={FAQ}
        breadcrumbs={[
          { name: "Hjem", url: "https://digilist.no/" },
          { name: "Verktøy", url: "https://digilist.no/verktoy" },
          { name: "Kapasitetskalkulator", url: "https://digilist.no/verktoy/kapasitetskalkulator" },
        ]}
      />
      <Navbar />

      <main id="main">
        <section className="pt-28 lg:pt-32 pb-10 lg:pb-14 bg-paper">
          <div className="mx-auto max-w-3xl px-6">
            <div className="inline-flex items-center gap-2 text-sm text-ink-soft mb-4">
              <Ruler className="h-4 w-4" aria-hidden />
              <span>Gratis verktøy</span>
            </div>
            <EditorialHeading as="h1" size="display">
              Hvor stort lokale trenger du?
            </EditorialHeading>
            <p className="text-xl text-ink-soft measure leading-relaxed mt-5">
              Regn ut anbefalt areal ut fra antall gjester og oppsett, og se hvilke lokaltyper som passer. Tallene
              er <strong className="text-ink">standard planleggingstall</strong> – en god pekepinn, ikke en fasit.
            </p>
          </div>
        </section>

        <section className="pb-14 lg:pb-20 bg-paper">
          <div className="mx-auto max-w-3xl px-6">
            <EditorialCard className="p-6 lg:p-8">
              <div className="grid gap-6 sm:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-medium text-ink">Antall gjester</span>
                  <input
                    type="number"
                    min={1}
                    max={2000}
                    className="mt-1.5 w-full rounded-md border border-rule bg-background px-3 py-2 text-ink"
                    value={gjester}
                    onChange={(e) => setGjester(Math.max(0, Number(e.target.value) || 0))}
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-medium text-ink">Arrangementstype</span>
                  <select
                    className="mt-1.5 w-full rounded-md border border-rule bg-background px-3 py-2 text-ink"
                    value={arrangement}
                    onChange={(e) => pickArrangement(e.target.value)}
                  >
                    {ARRANGEMENT.map((a) => (
                      <option key={a.key} value={a.key}>
                        {a.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block sm:col-span-2">
                  <span className="text-sm font-medium text-ink">Oppsett</span>
                  <select
                    className="mt-1.5 w-full rounded-md border border-rule bg-background px-3 py-2 text-ink"
                    value={oppsett}
                    onChange={(e) => setOppsett(e.target.value)}
                  >
                    {OPPSETT.map((o) => (
                      <option key={o.key} value={o.key}>
                        {o.label} ({o.low}–{o.high} m² per person)
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="mt-8 rounded-lg bg-paper-tinted border border-rule p-6 text-center">
                {result ? (
                  <>
                    <p className="text-sm text-ink-soft">Anbefalt areal</p>
                    <p
                      className="font-serif text-4xl lg:text-5xl text-ink mt-1"
                      style={{ fontVariationSettings: getFraunces("hero") }}
                    >
                      {kr(result.areaLow)}–{kr(result.areaHigh)} m²
                    </p>
                    <p className="text-sm text-ink-soft mt-1">
                      for {gjester} gjester · {result.oppsettLabel}
                    </p>
                    <p className="text-xs text-ink-soft mt-4 measure mx-auto">
                      Basert på {result.ratioLow}–{result.ratioHigh} m² per person. Legg til 15–25 % for dansegulv,
                      scene, buffé og garderobe. Standard planleggingstall – sjekk lokalets oppgitte kapasitet.
                    </p>

                    {result.types.length > 0 && (
                      <div className="mt-6 text-left">
                        <p className="text-sm font-medium text-ink mb-2">Lokaltyper som passer {gjester} gjester:</p>
                        <ul className="flex flex-wrap gap-2">
                          {result.types.map((t) => (
                            <li key={t.key}>
                              <Link
                                to={t.link}
                                className="inline-block rounded-full border border-rule bg-background px-3 py-1 text-sm text-ink hover:bg-paper-tinted"
                              >
                                {t.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="mt-6">
                      <EditorialButton href="https://app.digilist.no" variant="primary">
                        Finn ledige lokaler <ArrowRight className="h-4 w-4" />
                      </EditorialButton>
                    </div>
                  </>
                ) : (
                  <p className="text-ink-soft">Fyll inn antall gjester for et estimat.</p>
                )}
              </div>
            </EditorialCard>
          </div>
        </section>

        <SectionRule />

        <section className="py-14 lg:py-20 bg-paper">
          <div className="mx-auto max-w-3xl px-6">
            <EditorialHeading as="h2" size="section">
              Slik regner du ut kapasitet
            </EditorialHeading>
            <div className="mt-6 space-y-4 text-lg text-ink-soft leading-relaxed measure">
              <p>
                Arealbehovet styres først og fremst av <strong className="text-ink">oppsettet</strong>, altså hvordan
                gjestene skal sitte eller stå. En sittende middag med runde bord krever mest plass; en stående
                mottakelse minst.
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong className="text-ink">Sittende middag (runde bord):</strong> ~1,5–2,0 m² per gjest.</li>
                <li><strong className="text-ink">Mingling / stående:</strong> ~0,8–1,0 m² per gjest.</li>
                <li><strong className="text-ink">Klasserom / kurs:</strong> ~2,0–2,5 m² per person.</li>
                <li><strong className="text-ink">Kino / teater (stolrader):</strong> ~0,8–1,2 m² per person.</li>
              </ul>
              <p>
                Legg til areal for <strong className="text-ink">dansegulv, scene, buffé, bar, garderobe og
                rømningsveier</strong> – typisk 15–25 % ekstra. Skal barn løpe rundt, eller har du et variert
                program, velg heller et lokale i øvre del av intervallet.
              </p>
            </div>
            <div className="mt-8">
              <Byline author="Digilist-redaksjonen" role="Bookingsystem for utleie" date={UPDATED} />
            </div>
          </div>
        </section>

        <SectionRule />

        <section className="py-14 lg:py-20 bg-paper-tinted border-y border-rule">
          <div className="mx-auto max-w-3xl px-6">
            <EditorialHeading as="h2" size="section">
              Utforsk videre
            </EditorialHeading>
            <ul className="mt-5 grid gap-2 sm:grid-cols-2 text-ink">
              <li><Link className="underline" to="/verktoy/leiepriskalkulator">Leiepriskalkulator</Link></li>
              <li><Link className="underline" to="/lokaler-til-leie">Lokaler til leie</Link></li>
              <li><Link className="underline" to="/leie/selskapslokale">Leie selskapslokale</Link></li>
              <li><Link className="underline" to="/leie/konferanselokale">Leie konferanselokale</Link></li>
            </ul>
          </div>
        </section>

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
