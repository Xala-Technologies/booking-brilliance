import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { LegalDocument } from "@/components/LegalDocument";
import { PRIVACY_POLICY, legalDoc } from "@/content/legal";
import { localeFromPath } from "@/lib/i18n";
import { t } from "@/lib/copy";

const Personvern = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const locale = localeFromPath(useLocation().pathname);
  const en = locale === "en";
  const doc = legalDoc(PRIVACY_POLICY, locale);
  const url = en
    ? "https://digilist.no/en/personvern"
    : "https://digilist.no/personvern";

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={doc.metaTitle}
        description={doc.metaDescription}
        canonical={url}
        breadcrumbs={[
          {
            name: t(locale, "nav.home"),
            url: en ? "https://digilist.no/en" : "https://digilist.no/",
          },
          { name: doc.title, url },
        ]}
      />
      <Navbar />

      <main id="main">
        <LegalDocument doc={doc} />
      </main>

      <Footer />
    </div>
  );
};

export default Personvern;
