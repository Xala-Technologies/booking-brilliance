import { EditorialButton } from "@/components/editorial";
import { SectionHeader } from "@/components/SectionHeader";
import { FAQAccordion } from "@/components/FAQAccordion";
import { HOMEPAGE_FAQ } from "@/content/faq";
import { HOMEPAGE_FAQ_EN } from "@/content/faq.en";
import { useLocation } from "react-router-dom";
import { localeFromPath } from "@/lib/i18n";
import { t } from "@/lib/copy";
import { getFraunces } from "@/lib/fonts";

/**
 * Homepage FAQ. Renders HOMEPAGE_FAQ (the single source of truth, mirrored in
 * the FAQPage JSON-LD) through the shared <FAQAccordion>. The visible copy
 * matches the schema, which is what makes it an answer-engine (AEO) surface,
 * not just decoration.
 */
const HomepageFAQSection = () => {
  const locale = localeFromPath(useLocation().pathname);
  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="py-10 lg:py-14 bg-paper-tinted border-y border-rule"
    >
      <div className="container mx-auto md:px-8 lg:px-12">
        <SectionHeader
          label={t(locale, "faq.label")}
          headingId="faq-heading"
          intro={t(locale, "faq.intro")}
          action={
            <EditorialButton variant="link" size="md" href={locale === "en" ? "/en/faq" : "/faq"}>
              {t(locale, "faq.seeAll")}
            </EditorialButton>
          }
        >
          {t(locale, "faq.headline")}{" "}
          <em
            className="italic"
            style={{ fontVariationSettings: getFraunces("display") }}
          >
            {t(locale, "faq.headlineEm")}
          </em>
          .
        </SectionHeader>

        <FAQAccordion items={locale === "en" ? HOMEPAGE_FAQ_EN : HOMEPAGE_FAQ} />

      </div>
    </section>
  );
};

export default HomepageFAQSection;
