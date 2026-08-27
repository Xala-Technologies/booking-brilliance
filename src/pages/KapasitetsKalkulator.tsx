import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Ruler } from "lucide-react";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { PricingSummaryBlock } from "@/components/PricingSummaryBlock";
import { SectionRule, EditorialHeading, EditorialButton, EditorialCard, Byline } from "@/components/editorial";
import { getFraunces } from "@/lib/fonts";
import PilotInvitationSection from "@/components/PilotInvitationSection";
import { OPPSETT, ARRANGEMENT, estimateCapacity, kr } from "@/lib/kalkulator";
import { LinkOrText } from "@/components/LinkOrText";
import { capacityFaq } from "@/content/kalkulator-copy";
import { useLocation } from "react-router-dom";
import { localeFromPath } from "@/lib/i18n";
import { t } from "@/lib/copy";

const UPDATED = "24. juli 2026";

export default function KapasitetsKalkulator() {
  const locale = localeFromPath(useLocation().pathname);
  const en = locale === "en";
  const FAQ = capacityFaq(locale);
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
        title={t(locale, "cap.title")}
        description={t(locale, "cap.description")}
        keywords={t(locale, "cap.keywords")}
        canonical={en ? "https://digilist.no/en/verktoy/kapasitetskalkulator" : "https://digilist.no/verktoy/kapasitetskalkulator"}
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
              <span>{t(locale, "cap.badge")}</span>
            </div>
            <EditorialHeading as="h1" size="display">
              {t(locale, "cap.h1")}
            </EditorialHeading>
            <p className="text-xl text-ink-soft measure leading-relaxed mt-5">
              {t(locale, "cap.ledeA")}
              <strong className="text-ink">{t(locale, "cap.ledeStrong")}</strong>
              {t(locale, "cap.ledeB")}
            </p>
          </div>
        </section>

        <section className="pb-14 lg:pb-20 bg-paper">
          <div className="mx-auto max-w-3xl px-6">
            <EditorialCard className="p-6 lg:p-8">
              <div className="grid gap-6 sm:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-medium text-ink">{t(locale, "cap.guests")}</span>
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
                  <span className="text-sm font-medium text-ink">{t(locale, "cap.occasion")}</span>
                  <select
                    className="mt-1.5 w-full rounded-md border border-rule bg-background px-3 py-2 text-ink"
                    value={arrangement}
                    onChange={(e) => pickArrangement(e.target.value)}
                  >
                    {ARRANGEMENT.map((a) => (
                      <option key={a.key} value={a.key}>
                        {t(locale, `calc.arr.${a.key}`)}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block sm:col-span-2">
                  <span className="text-sm font-medium text-ink">{t(locale, "cap.layout")}</span>
                  <select
                    className="mt-1.5 w-full rounded-md border border-rule bg-background px-3 py-2 text-ink"
                    value={oppsett}
                    onChange={(e) => setOppsett(e.target.value)}
                  >
                    {OPPSETT.map((o) => (
                      <option key={o.key} value={o.key}>
                        {t(locale, `calc.oppsett.${o.key}`)} ({o.low}–{o.high} {t(locale, "cap.perPerson")})
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="mt-8 rounded-lg bg-paper-tinted border border-rule p-6 text-center">
                {result ? (
                  <>
                    <p className="text-sm text-ink-soft">{t(locale, "cap.recommended")}</p>
                    <p
                      className="font-serif text-4xl lg:text-5xl text-ink mt-1"
                      style={{ fontVariationSettings: getFraunces("hero") }}
                    >
                      {kr(result.areaLow)}–{kr(result.areaHigh)} m²
                    </p>
                    <p className="text-sm text-ink-soft mt-1">
                      {t(locale, "cap.for")} {gjester} {t(locale, "cap.guestsWord")} · {t(locale, `calc.oppsett.${result.oppsettKey}`)}
                    </p>
                    <p className="text-xs text-ink-soft mt-4 measure mx-auto">
                      {t(locale, "cap.basedOn")} {result.ratioLow}–{result.ratioHigh}{" "}
                      {t(locale, "cap.perPerson")}. {t(locale, "cap.basis")}
                    </p>

                    {result.types.length > 0 && (
                      <div className="mt-6 text-left">
                        <p className="text-sm font-medium text-ink mb-2">{t(locale, "cap.typesFor")} {gjester} {t(locale, "cap.guestsWord")}:</p>
                        <ul className="flex flex-wrap gap-2">
                          {result.types.map((venue) => (
                            <li key={venue.key}>
                              <LinkOrText
                                en={en}
                                to={venue.link}
                                className="inline-block rounded-full border border-rule bg-background px-3 py-1 text-sm text-ink hover:bg-paper-tinted"
                              >
                                {t(locale, `calc.type.${venue.key}`)}
                              </LinkOrText>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="mt-6">
                      <EditorialButton href="https://app.digilist.no" variant="primary">
                        {t(locale, "cap.findVenues")} <ArrowRight className="h-4 w-4" />
                      </EditorialButton>
                    </div>
                  </>
                ) : (
                  <p className="text-ink-soft">{t(locale, "cap.empty")}</p>
                )}
              </div>
            </EditorialCard>
          </div>
        </section>

        <SectionRule />

        <section className="py-14 lg:py-20 bg-paper">
          <div className="mx-auto max-w-3xl px-6">
            <EditorialHeading as="h2" size="section">
              {t(locale, "cap.howH2")}
            </EditorialHeading>
            <div className="mt-6 space-y-4 text-lg text-ink-soft leading-relaxed measure">
              <p>
                {t(locale, "cap.howP1a")}{" "}
                <strong className="text-ink">{t(locale, "cap.howP1strong")}</strong>
                {t(locale, "cap.howP1b2")}
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong className="text-ink">{t(locale, "cap.rowDinner")}</strong> ~1,5–2,0 m² {t(locale, "cap.perGuest")}</li>
                <li><strong className="text-ink">{t(locale, "cap.rowMingle")}</strong> ~0,8–1,0 m² {t(locale, "cap.perGuest")}</li>
                <li><strong className="text-ink">{t(locale, "cap.rowClass")}</strong> ~2,0–2,5 m² {t(locale, "cap.perPersonShort")}</li>
                <li><strong className="text-ink">{t(locale, "cap.rowTheatre")}</strong> ~0,8–1,2 m² {t(locale, "cap.perPersonShort")}</li>
              </ul>
              <p>
                {t(locale, "cap.howP2a")}
                <strong className="text-ink">{t(locale, "cap.howP2strong")}</strong>
                {t(locale, "cap.howP2b")}
              </p>
            </div>
            <div className="mt-8">
              <Byline author={t(locale, "cap.byline")} role={t(locale, "cap.bylineRole")} date={UPDATED} />
            </div>
          </div>
        </section>

        <SectionRule />

        {/* Norwegian only: three of these four targets are landing pages that
            stay Norwegian by design, so in English this block would be a row
            of exits out of the language. */}
        {!en && (
          <section className="py-14 lg:py-20 bg-paper-tinted border-y border-rule">
            <div className="mx-auto max-w-3xl px-6">
              <EditorialHeading as="h2" size="section">
                {t(locale, "cap.explore")}
              </EditorialHeading>
              <ul className="mt-5 grid gap-2 sm:grid-cols-2 text-ink">
                <li><Link className="underline" to="/verktoy/leiepriskalkulator">Leiepriskalkulator</Link></li>
                <li><Link className="underline" to="/lokaler-til-leie">Lokaler til leie</Link></li>
                <li><Link className="underline" to="/leie/selskapslokale">Leie selskapslokale</Link></li>
                <li><Link className="underline" to="/leie/konferanselokale">Leie konferanselokale</Link></li>
              </ul>
            </div>
          </section>
        )}

        <section className="py-14 lg:py-20 bg-paper">
          <div className="mx-auto max-w-3xl px-6">
            <EditorialHeading as="h2" size="section">
              {t(locale, "cap.faqH2")}
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

        {/* Pricing summary block */}
        <PricingSummaryBlock />
      </main>

      <Footer />
    </div>
  );
}
