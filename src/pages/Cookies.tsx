import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { LegalDocument } from "@/components/LegalDocument";
import { COOKIE_POLICY, legalDoc } from "@/content/legal";
import { localeFromPath } from "@/lib/i18n";
import { t } from "@/lib/copy";

const Cookies = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // The consent banner already spoke English here while the policy behind it
  // did not, which is the one combination that makes the consent itself weak:
  // GDPR art. 7(2) wants the request in clear language the person can read.
  const locale = localeFromPath(useLocation().pathname);
  const en = locale === "en";
  const doc = legalDoc(COOKIE_POLICY, locale);

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={doc.metaTitle}
        description={doc.metaDescription}
        canonical={
          en ? "https://digilist.no/en/cookies" : "https://digilist.no/cookies"
        }
        breadcrumbs={[
          {
            name: t(locale, "nav.home"),
            url: en ? "https://digilist.no/en" : "https://digilist.no/",
          },
          {
            name: doc.title,
            url: en
              ? "https://digilist.no/en/cookies"
              : "https://digilist.no/cookies",
          },
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

export default Cookies;
