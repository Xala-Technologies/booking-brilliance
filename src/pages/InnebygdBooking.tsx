import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  SectionRule,
  EditorialHeading,
  EditorialButton,
} from "@/components/editorial";
import { getFraunces } from "@/lib/fonts";
import { useLocation } from "react-router-dom";
import { localeFromPath } from "@/lib/i18n";
import { embeddedBookingCopy } from "@/content/innebygd-booking";
import { PricingSummaryBlock } from "@/components/PricingSummaryBlock";

const InnebygdBooking = () => {
  const locale = localeFromPath(useLocation().pathname);
  const c = embeddedBookingCopy(locale);
  const FAQ = c.faq;

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <SEO
        title={c.metaTitle}
        description={c.metaDescription}
        keywords={c.keywords}
        canonical="https://digilist.no/innebygd-booking"
        ogImage="https://digilist.no/images/blog/innebygd-booking.webp"
        faq={c.faq}
        breadcrumbs={[
          { name: "Hjem", url: "https://digilist.no/" },
          { name: "Innebygd booking", url: "https://digilist.no/innebygd-booking" },
        ]}
      />
      <Navbar />

      <main id="main">
        <section className="pt-28 lg:pt-32 pb-16 lg:pb-24 bg-paper">
          <div className="container mx-auto md:px-8 lg:px-12">
            <div className="grid lg:grid-cols-12 gap-8 lg:gap-gutter items-start">
              <div className="lg:col-span-8">
                <EditorialHeading as="h1" size="hero" className="mb-6">
                  {c.h1}
                </EditorialHeading>
                <p className="text-xl text-ink-soft measure leading-relaxed mb-6">
                  {c.description}
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <EditorialButton variant="primary" size="lg" href="/book-demo">
                    {c.ctaDemo}
                  </EditorialButton>
                  <EditorialButton
                    variant="outline"
                    size="lg"
                    icon={false}
                    href="https://app.digilist.no"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Åpne plattformen
                  </EditorialButton>
                </div>
              </div>

              <div className="lg:col-span-4">
                <div className="aspect-[16/9] bg-paper-tinted border border-rule rounded-sm overflow-hidden">
                  <img
                    src="/images/blog/innebygd-booking.webp"
                    alt="Innebygd booking på egen nettside"
                    className="w-full h-full object-cover"
                    loading="eager"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-14 lg:py-20 bg-paper-tinted border-y border-rule">
          <div className="container mx-auto md:px-8 lg:px-12">
            <div className="max-w-4xl space-y-12">
              <div>
                <div className="space-y-5 text-lg text-ink-soft leading-relaxed mb-10">
                  <p>{c.ledeA}</p>
                  <p>{c.ledeB}</p>
                </div>
              </div>

              <div>
                <h2
                  className="font-serif text-3xl text-ink mb-6"
                  style={{ fontVariationSettings: getFraunces("section") }}
                >
                  {c.whatIsH2}
                </h2>
                <div className="space-y-5 text-lg text-ink-soft leading-relaxed">
                  <p>{c.whatIsP1}</p>
                  <p>{c.whatIsP2}</p>
                  <p>{c.whatIsP3}</p>
                  <p>
                    <Link
                      to={c.whatIsLinkUrl}
                      className="text-accent-text hover:underline underline-offset-4 decoration-[0.5px]"
                    >
                      {c.whatIsLinkText}
                    </Link>
                  </p>
                </div>
              </div>

              <div>
                <h2
                  className="font-serif text-3xl text-ink mb-6"
                  style={{ fontVariationSettings: getFraunces("section") }}
                >
                  {c.administrationH2}
                </h2>
                <div className="space-y-5 text-lg text-ink-soft leading-relaxed">
                  <p>{c.administrationP1}</p>
                  <p>{c.administrationP2}</p>
                  <p>{c.administrationP3}</p>
                  <p>
                    <Link
                      to={c.administrationLinkUrl}
                      className="text-accent-text hover:underline underline-offset-4 decoration-[0.5px]"
                    >
                      {c.administrationLinkText}
                    </Link>
                  </p>
                </div>
              </div>

              <div>
                <h2
                  className="font-serif text-3xl text-ink mb-6"
                  style={{ fontVariationSettings: getFraunces("section") }}
                >
                  {c.notChannelSyncH2}
                </h2>
                <div className="space-y-5 text-lg text-ink-soft leading-relaxed">
                  <p>{c.notChannelSyncP1}</p>
                  <p>{c.notChannelSyncP2}</p>
                </div>
              </div>

              <div>
                <h2
                  className="font-serif text-3xl text-ink mb-6"
                  style={{ fontVariationSettings: getFraunces("section") }}
                >
                  {c.canShowOnDigilistH2}
                </h2>
                <div className="space-y-5 text-lg text-ink-soft leading-relaxed">
                  <p>{c.canShowOnDigilistP1}</p>
                  <p>{c.canShowOnDigilistP2}</p>
                  <p>
                    <Link
                      to={c.canShowOnDigilistLinkUrl}
                      className="text-accent-text hover:underline underline-offset-4 decoration-[0.5px]"
                    >
                      {c.canShowOnDigilistLinkText}
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-14 lg:py-20 bg-paper">
          <div className="container mx-auto md:px-8 lg:px-12">
            <EditorialHeading as="h2" size="section" className="mb-10">
              {c.faqH2}
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
            <div className="mt-10 flex flex-wrap gap-4">
              {c.relatedLinks.map((link) => (
                <Link
                  key={link.url}
                  to={link.url}
                  className="text-accent-text hover:underline underline-offset-4 decoration-[0.5px]"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </section>

        <PricingSummaryBlock />
      </main>

      <Footer />
    </div>
  );
};

export default InnebygdBooking;
