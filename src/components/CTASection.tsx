import { useLocation } from "react-router-dom";
import { SectionRule } from "@/components/editorial";
import { localeFromPath } from "@/lib/i18n";
import { t } from "@/lib/copy";
import { BookDemoBlock } from "@/components/BookDemoBlock";

// The homepage contact section. "BOOK EN DEMO" is the section eyebrow (same
// style as every other section label); BookDemoBlock renders without its big
// display heading so there's no duplicate title. The #kontakt anchor stays on
// the <section> for nav/footer links.
const CTASection = () => {
  const locale = localeFromPath(useLocation().pathname);
  return (
    <section id="kontakt" className="relative py-10 lg:py-14 bg-accent-tinted border-t border-rule">
      <div className="container mx-auto md:px-8 lg:px-12">
        <SectionRule label={t(locale, "cta.label")} />
        <BookDemoBlock source="homepage-kontakt" heading={false} />
      </div>
    </section>
  );
};

export default CTASection;
