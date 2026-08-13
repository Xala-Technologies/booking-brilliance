import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import { SectionRule, ProgressRail } from "@/components/editorial";
import { BookDemoBlock } from "@/components/BookDemoBlock";
import { useLocation } from "react-router-dom";
import { localeFromPath } from "@/lib/i18n";
import { t } from "@/lib/copy";

const BookDemo = () => {
  // Every English page's primary CTA points here, so an untranslated wrapper
  // dropped the visitor back into Norwegian at the exact moment they were
  // trying to convert. BookDemoBlock itself was already bilingual.
  const locale = localeFromPath(useLocation().pathname);
  const en = locale === "en";
  return (
    <div className="min-h-screen bg-paper overflow-x-hidden">
      <SEO
        title={t(locale, "bookDemo.title")}
        description={t(locale, "bookDemo.description")}
        canonical={en ? "https://digilist.no/en/book-demo" : "https://digilist.no/book-demo"}
        breadcrumbs={[
          { name: t(locale, "nav.home"), url: en ? "https://digilist.no/en" : "https://digilist.no/" },
          { name: t(locale, "bookDemo.crumb"), url: en ? "https://digilist.no/en/book-demo" : "https://digilist.no/book-demo" },
        ]}
      />
      <ProgressRail />
      <Navbar />

      <PageTransition>
        <main id="main">
          <article className="pt-28 lg:pt-32 pb-16 lg:pb-24">
            <div className="container mx-auto md:px-8 lg:px-12">
              <nav
                className="editorial-mono-caption mb-10"
                aria-label={t(locale, "nav.breadcrumbs")}
              >
                <Link
                  to={en ? "/en" : "/"}
                  className="group inline-flex items-center gap-2 text-accent-text"
                >
                  <ArrowLeft
                    className="h-3.5 w-3.5 transition-transform duration-quick ease-editorial group-hover:-translate-x-1"
                    aria-hidden="true"
                  />
                  <span className="group-hover:underline underline-offset-4 decoration-[0.5px]">
                    {t(locale, "bookDemo.back")}
                  </span>
                </Link>
              </nav>

              <SectionRule label={t(locale, "bookDemo.rule")} />
              <BookDemoBlock source="book-demo" showByline headingAs="h1" />
            </div>
          </article>
        </main>
      </PageTransition>

      <Footer />
    </div>
  );
};

export default BookDemo;
