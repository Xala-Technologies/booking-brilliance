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
import { LinkOrText } from "@/components/LinkOrText";
import { priceFaq } from "@/content/kalkulator-copy";
import { useLocation } from "react-router-dom";
import { localeFromPath } from "@/lib/i18n";
import { t } from "@/lib/copy";

const UPDATED = "24. juli 2026";

/**
 * Renders the price adjustments as a sentence fragment.
 *
 * estimatePrice returns them as descriptors rather than strings, so the
 * wording lives here and the percentages stay in the pricing model where they
 * belong.
 */
function factorText(
  factors: ReturnType<typeof estimatePrice> extends null ? never : NonNullable<ReturnType<typeof estimatePrice>>["factors"],
  locale: "nb" | "en",
): string {
  return factors
    .map((f) => {
      if (f.kind === "guests") return `${f.guests} ${t(locale, "price.guestsWord")}`;
      if (f.kind === "city") return `${t(locale, `calc.city.${f.key}`)} (${f.pct})`;
      return `${t(locale, `calc.factor.${f.kind}`)} (${f.pct})`;
    })
    .join(" · ");
}

export default function LeieprisKalkulator() {
  const locale = localeFromPath(useLocation().pathname);
  const en = locale === "en";
  const FAQ = priceFaq(locale);
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
        title={t(locale, "price.title")}
        description={t(locale, "price.description")}
        keywords={t(locale, "price.keywords")}
        canonical={en ? "https://digilist.no/en/verktoy/leiepriskalkulator" : "https://digilist.no/verktoy/leiepriskalkulator"}
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
              <span>{t(locale, "cap.badge")}</span>
            </div>
            <EditorialHeading as="h1" size="display">
              {t(locale, "price.h1")}
            </EditorialHeading>
            <p className="text-xl text-ink-soft measure leading-relaxed mt-5">
              {t(locale, "price.ledeA")}
              <strong className="text-ink">{t(locale, "price.ledeStrong")}</strong>
              {t(locale, "price.ledeB")}
            </p>
          </div>
        </section>

        {/* Calculator */}
        <section className="pb-14 lg:pb-20 bg-paper">
          <div className="mx-auto max-w-3xl px-6">
            <EditorialCard className="p-6 lg:p-8">
              <div className="grid gap-6 sm:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-medium text-ink">{t(locale, "price.venueType")}</span>
                  <select
                    className="mt-1.5 w-full rounded-md border border-rule bg-background px-3 py-2 text-ink"
                    value={lokaltype}
                    onChange={(e) => setLokaltype(e.target.value)}
                  >
                    {LOKALTYPER.map((type) => (
                      <option key={type.key} value={type.key}>
                        {t(locale, `calc.type.${type.key}`)}
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
                  <span className="text-sm font-medium text-ink">{t(locale, "price.city")}</span>
                  <select
                    className="mt-1.5 w-full rounded-md border border-rule bg-background px-3 py-2 text-ink"
                    value={by}
                    onChange={(e) => setBy(e.target.value)}
                  >
                    {BYER.map((b) => (
                      <option key={b.key} value={b.key}>
                        {t(locale, `calc.city.${b.key}`)}
                      </option>
                    ))}
                  </select>
                </label>

                <div className="block">
                  <span className="text-sm font-medium text-ink">Tidspunkt</span>
                  <div className="mt-1.5 flex flex-col gap-2">
                    <label className="inline-flex items-center gap-2 text-ink-soft">
                      <input type="checkbox" checked={helg} onChange={(e) => setHelg(e.target.checked)} />
                      <span>{t(locale, "price.weekend")}</span>
                    </label>
                    <label className="inline-flex items-center gap-2 text-ink-soft">
                      <input
                        type="checkbox"
                        checked={hoysesong}
                        onChange={(e) => setHoysesong(e.target.checked)}
                      />
                      <span>{t(locale, "price.highSeason")}</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Result */}
              <div className="mt-8 rounded-lg bg-paper-tinted border border-rule p-6 text-center">
                {result ? (
                  <>
                    <p className="text-sm text-ink-soft">{t(locale, "price.estimated")}</p>
                    <p
                      className="font-serif text-4xl lg:text-5xl text-ink mt-1"
                      style={{ fontVariationSettings: getFraunces("hero") }}
                    >
                      {kr(result.low)}–{kr(result.high)} kr
                    </p>
                    <p className="text-sm text-ink-soft mt-1">
                      {t(locale, "price.per")} {t(locale, `calc.unit.${result.unit}`)} · {t(locale, `calc.type.${result.typeKey}`)}
                    </p>
                    <p className="text-xs text-ink-soft mt-4 measure mx-auto">
                      {t(locale, "price.adjustedFor")} {factorText(result.factors, locale)}.{" "}
                      {t(locale, "price.disclaimer")}
                    </p>
                    <div className="mt-5">
                      <EditorialButton href={`https://app.digilist.no`} variant="primary">
                        {t(locale, "price.findAvailable")} {t(locale, `calc.type.${result.typeKey}`).toLowerCase()} <ArrowRight className="h-4 w-4" />
                      </EditorialButton>
                    </div>
                    <p className="text-xs text-ink-soft mt-3">
                      {t(locale, "price.realPrices")}{" "}
                      <LinkOrText en={en} to={result.link} className="underline">
                        {t(locale, `calc.type.${result.typeKey}`)}
                      </LinkOrText>
                      .
                    </p>
                  </>
                ) : (
                  <p className="text-ink-soft">{t(locale, "price.empty")}</p>
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
              {t(locale, "price.howH2")}
            </EditorialHeading>
            <div className="mt-6 space-y-4 text-lg text-ink-soft leading-relaxed measure">
              <p>
                {t(locale, "price.howP1a")}
                <strong className="text-ink">{t(locale, "price.howP1strong")}</strong>
                {t(locale, "price.howP1b")}
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong className="text-ink">{t(locale, "price.b1strong")}</strong>
                  {t(locale, "price.b1")}
                </li>
                <li>
                  <strong className="text-ink">{t(locale, "price.b2strong")}</strong>
                  {t(locale, "price.b2")}
                </li>
                <li>
                  <strong className="text-ink">{t(locale, "price.b3strong")}</strong>
                  {t(locale, "price.b3")}
                </li>
                <li>
                  <strong className="text-ink">{t(locale, "price.b4strong")}</strong>
                  {t(locale, "price.b4")}
                </li>
              </ul>
              <p>
                {t(locale, "price.howP2a")}
                <strong className="text-ink">{t(locale, "price.howP2strong")}</strong>
                {t(locale, "price.howP2b")}
              </p>
            </div>

            <div className="mt-8">
              <Byline author={t(locale, "cap.byline")} role={t(locale, "cap.bylineRole")} date={UPDATED} />
            </div>
          </div>
        </section>

        <SectionRule />

        {/* Related */}
        <section className="py-14 lg:py-20 bg-paper-tinted border-y border-rule">
          <div className="mx-auto max-w-3xl px-6">
            <EditorialHeading as="h2" size="section">
              {t(locale, "cap.explore")}
            </EditorialHeading>
            <ul className="mt-5 grid gap-2 sm:grid-cols-2 text-ink">
              {/* Only the capacity calculator has an English twin. The other
                  three targets stay Norwegian, so in English this list is one
                  item rather than four exits out of the language. */}
              {!en && (
                <>
                  <li><Link className="underline" to="/lokaler-til-leie">Lokaler til leie</Link></li>
                  <li><Link className="underline" to="/bookingsystem-utleie">Bookingsystem for utleie</Link></li>
                </>
              )}
              <li>
                <Link className="underline" to={`${en ? "/en" : ""}/verktoy/kapasitetskalkulator`}>
                  {t(locale, "tools.capTitle")}
                </Link>
              </li>
              {!en && (
                <li><Link className="underline" to="/leie/selskapslokale">Leie selskapslokale</Link></li>
              )}
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
