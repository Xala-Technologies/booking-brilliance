import { Link, useLocation, useNavigate } from "react-router-dom";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { localeFromPath } from "@/lib/i18n";
import { t } from "@/lib/copy";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { getFraunces } from "@/lib/fonts";
import { EditorialButton } from "@/components/editorial";
import { openChatbot } from "@/lib/chatbot/open";


/**
 * Keep a footer link inside the visitor's language.
 *
 * Every route is mirrored under /en, so the English footer can point at
 * /en/<same-path> and the visitor stays in the English space with English
 * chrome. Before this, every one of the ~60 footer links on an English page
 * sent the reader to a Norwegian URL — the largest single leak out of English
 * on the site, and one no dictionary entry could fix.
 *
 * Anchors, external URLs and the already-prefixed are left alone.
 */
function localeHref(href: string, locale: "nb" | "en"): string {
  if (locale !== "en") return href;
  if (!href.startsWith("/") || href.startsWith("/en/") || href === "/en") return href;
  return href === "/" ? "/en" : `/en${href}`;
}

const Footer = () => {
  const location = useLocation();
  const locale = localeFromPath(location.pathname);
  const navigate = useNavigate();
  // Hide the Footer CTA strip on individual blog posts — those pages already
  // render a full-bleed tinted "NESTE STEG" band right above the footer.
  const isBlogPost = /^\/blogg\/[^/]+\/?$/.test(location.pathname);

  const handleNavClick = (hash: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (location.pathname === "/") {
      const element = document.querySelector(hash);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
        window.history.pushState(null, "", hash);
      }
    } else {
      navigate("/");
      setTimeout(() => {
        window.location.hash = hash;
        const element = document.querySelector(hash);
        if (element) element.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 50);
    }
  };

  const navigasjon = [
    { labelKey: "footer.funksjonalitet", hash: "#funksjonalitet" },
    { labelKey: "footer.brukerhistorier", hash: "#brukerhistorier" },
    { labelKey: "footer.kontakt", hash: "#kontakt" },
  ];

  const markedsplass = [
    { labelKey: "footer.lokaler", href: "/leie" },
    { labelKey: "footer.lokaler_til_leie", href: "/lokaler-til-leie" },
    { labelKey: "footer.overnatting", href: "/overnatting" },
    { labelKey: "footer.arrangementer", href: "/arrangementer" },
    { labelKey: "footer.utstyr", href: "/utstyr" },
    { labelKey: "footer.tjenester", href: "/tjenester" },
    { labelKey: "footer.booking_av_lokaler_og_m_terom", href: "/booking-av-lokaler-og-moterom" },
  ];

  const losninger = [
    { labelKey: "footer.bookingsystem_for_utleie", href: "/bookingsystem-utleie" },
    { labelKey: "footer.bookingsystem_for_kommuner", href: "/bookingsystem-kommune" },
    { labelKey: "footer.billettsystem", href: "/billettsystem" },
    { labelKey: "footer.teknologi", href: "/teknologi" },
    { labelKey: "footer.sikkerhet", href: "/sikkerhet" },
  ];

  // Company + resources. These were sitting under "Løsninger", which had grown
  // to ten entries and was neither scannable nor accurate — Om oss and Blogg
  // are not solutions.
  const selskap = [
    { labelKey: "footer.priser", href: "/priser" },
    { labelKey: "footer.om_oss", href: "/om-oss" },
    { labelKey: "footer.blogg", href: "/blogg" },
    { labelKey: "footer.faq", href: "/faq" },
    { labelKey: "footer.transparens", href: "/transparens" },
    { labelKey: "footer.utleiemarkedet_2026", href: "/rapport/utleiemarkedet-norge-2026" },
  ];

  const juridisk = [
    { labelKey: "footer.personvern", href: "/personvern" },
    { labelKey: "footer.salgsvilk_r", href: "/salgsvilkar" },
    { labelKey: "footer.cookies", href: "/cookies" },
    { labelKey: "footer.tilgjengelighet", href: "/tilgjengelighet" },
  ];

  // SEO internal-link cluster — the private-market pages, rendered site-wide in
  // a dense block below the main columns so every prerendered page passes
  // authority into them (they were previously only reachable via sitemap).
  const byer = [
    { label: "Oslo", href: "/lokaler-til-leie/oslo" },
    { label: "Bergen", href: "/lokaler-til-leie/bergen" },
    { label: "Trondheim", href: "/lokaler-til-leie/trondheim" },
    { label: "Stavanger", href: "/lokaler-til-leie/stavanger" },
    { label: "Kristiansand", href: "/lokaler-til-leie/kristiansand" },
    { label: "Tromso", href: "/lokaler-til-leie/tromso" },
    { label: "Drammen", href: "/lokaler-til-leie/drammen" },
    { label: "Baerum", href: "/lokaler-til-leie/baerum" },
    { label: "Fredrikstad", href: "/lokaler-til-leie/fredrikstad" },
    { label: "Sandnes", href: "/lokaler-til-leie/sandnes" },
    { label: "Alesund", href: "/lokaler-til-leie/alesund" },
    { label: "Bodo", href: "/lokaler-til-leie/bodo" },
    { label: "Sandefjord", href: "/lokaler-til-leie/sandefjord" },
    { label: "Tonsberg", href: "/lokaler-til-leie/tonsberg" },
    { label: "Sarpsborg", href: "/lokaler-til-leie/sarpsborg" },
    { label: "Haugesund", href: "/lokaler-til-leie/haugesund" },
  ];

  const lokaltyper = [
    { label: "Selskapslokale", href: "/leie/selskapslokale" },
    { label: "Moterom", href: "/leie/moterom" },
    { label: "Konferanselokale", href: "/leie/konferanselokale" },
    { label: "Kulturhus", href: "/leie/kulturhus" },
    { label: "Idrettshall", href: "/leie/idrettshall" },
    { label: "Hall", href: "/leie/hall" },
    { label: "Gaard", href: "/leie/gaard" },
    { label: "Kontorlokaler", href: "/leie/kontorlokaler" },
    { label: "Bursdagslokale", href: "/leie/bursdagslokale" },
    { label: "Coworking", href: "/leie/coworking" },
    { label: "Padelbane", href: "/leie/padelbane" },
    { label: "Svommehall", href: "/leie/svommehall" },
    { label: "Hobbyklubb", href: "/leie/hobbyklubb" },
  ];

  const anledninger = [
    { label: "Konfirmasjonslokale", href: "/leie/konfirmasjonslokale" },
    { label: "Firmafest", href: "/leie/firmafest" },
    { label: "Minnestund", href: "/leie/minnestund" },
    { label: "Daap", href: "/leie/daap" },
    { label: "Jubileum", href: "/leie/jubileum" },
  ];

  const verktoy = [
    { label: "Leiepriskalkulator", href: "/verktoy/leiepriskalkulator" },
    { label: "Kapasitetskalkulator", href: "/verktoy/kapasitetskalkulator" },
    { label: "Verktoy", href: "/verktoy" },
  ];

  const linkClass =
    "group inline-flex items-baseline gap-1.5 font-serif text-lg text-ink-soft hover:text-ink transition-colors duration-quick ease-editorial no-underline";
  const linkUnderline =
    "border-b border-transparent group-hover:border-ink transition-colors duration-quick ease-editorial pb-0.5";

  // Footer nav sections are top-level page landmarks — use h2, not h3. On
  // pages whose main content is client-fetched (e.g. /transparens renders a
  // loading spinner during prerender), the footer headings are the first
  // headings after the page h1, so h3 here produced an h1→h3 outline skip
  // that the a11y auditor flags. h2 is a clean, skip-free level everywhere.
  const ColumnHeading = ({ children }: { children: React.ReactNode }) => (
    <h2 className="flex items-center gap-3 mb-6 editorial-mono-caption text-accent-text">
      <span aria-hidden="true" className="w-6 h-px bg-accent-text" />
      {children}
    </h2>
  );

  return (
    <footer className="footer-surface border-t border-hairline-strong">
      <div className="container mx-auto md:px-8 lg:px-12 pt-16 lg:pt-24 pb-8 lg:pb-10">
        {/* Editorial colophon header */}
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-gutter mb-14 lg:mb-20">
          <div className="lg:col-span-7">
            <Link
              to="/"
              className="group inline-flex items-center gap-4 mb-6"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              <img
                src="/logo-64.webp"
                alt=""
                aria-hidden="true"
                width={64}
                height={64}
                className="h-16 lg:h-20 w-auto transition-opacity group-hover:opacity-80"
              />
              <span className="flex flex-col items-start leading-none">
                <span
                  className="font-serif text-5xl lg:text-6xl text-ink leading-none"
                  style={{
                    fontVariationSettings:
                      '"opsz" 96, "wght" 460',
                    letterSpacing: "-0.02em",
                  }}
                >
                  Digilist
                </span>
                <span className="mt-1 inline-flex items-center gap-2">
                  <span
                    aria-hidden="true"
                    className="inline-block w-6 h-px bg-accent-text"
                  />
                  <span
                    className="font-serif italic text-base lg:text-lg text-ink-soft leading-none"
                    style={{
                      fontVariationSettings:
                        '"opsz" 16, "wght" 420',
                    }}
                  >
                    Enkel booking
                  </span>
                  <span
                    aria-hidden="true"
                    className="inline-block w-1.5 h-1.5 rounded-full bg-accent-text/60"
                  />
                </span>
              </span>
            </Link>
            <p
              className="text-2xl lg:text-3xl text-ink-soft italic measure leading-snug"
              style={{ fontVariationSettings: getFraunces("sub") }}
            >
              {t(locale, "footer.tagline")}
            </p>
          </div>
          <div className="lg:col-span-5 lg:border-l lg:border-rule lg:pl-8 flex flex-col justify-end gap-3">
            <span className="editorial-mono-caption text-accent-text">
              KONTOR · OSLO-REGIONEN
            </span>
            <p
              className="font-serif text-2xl text-ink leading-snug"
              style={{
                fontVariationSettings: getFraunces("sub"),
                letterSpacing: "-0.01em",
              }}
            >
              Nesbruveien 75
              <br />
              1394 Nesbru
            </p>
            <div className="flex flex-col gap-1 mt-3">
              <a
                href="tel:+4796665001"
                className="group inline-flex items-baseline gap-2 font-mono text-base text-ink hover:text-accent-text transition-colors"
              >
                <span aria-hidden="true" className="text-ink-faint">
                  T
                </span>
                <span className="border-b border-rule group-hover:border-accent-text pb-0.5">
                  +47 96 66 50 01
                </span>
              </a>
              <a
                href="mailto:kontakt@digilist.no"
                className="group inline-flex items-baseline gap-2 font-mono text-base text-ink hover:text-accent-text transition-colors"
              >
                <span aria-hidden="true" className="text-ink-faint">
                  E
                </span>
                <span className="border-b border-rule group-hover:border-accent-text pb-0.5">
                  kontakt@digilist.no
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* Always-on CTA strip — tinted, hidden on individual blog posts */}
        {!isBlogPost && (
          <div className="mb-14 lg:mb-20 bg-accent-tinted border border-hairline-strong rounded-sm px-6 lg:px-10 py-10 lg:py-12">
            <div className="grid lg:grid-cols-12 gap-6 lg:gap-gutter items-end">
              <div className="lg:col-span-7">
                <span className="editorial-mono-caption text-accent-text">
                  NESTE STEG
                </span>
                <p
                  className="mt-3 font-serif text-3xl lg:text-4xl text-ink leading-tight"
                  style={{
                    fontVariationSettings: getFraunces("section"),
                    letterSpacing: "-0.015em",
                  }}
                >
                  {t(locale, "footer.ctaHeading")}
                </p>
                <p className="mt-3 text-lg text-ink-soft measure leading-relaxed">
                  {t(locale, "footer.ctaBody")}
                </p>
              </div>
              <div className="lg:col-span-5 flex flex-wrap gap-3 lg:justify-end">
                <EditorialButton variant="primary" size="md" href="/book-demo">
                  Book demo
                </EditorialButton>
                <EditorialButton
                  variant="outline"
                  size="md"
                  onClick={() => openChatbot({ mode: "chat" })}
                >
                  {t(locale, "nav.talkToUs")}
                </EditorialButton>
              </div>
            </div>
          </div>
        )}

        {/* Four columns of links */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          <nav aria-label="Navigasjon">
            <ColumnHeading>{t(locale, "footer.i_navigasjon")}</ColumnHeading>
            <ul className="space-y-3.5">
              {navigasjon.map((link) => (
                <li key={link.hash}>
                  <a
                    href={link.hash}
                    onClick={(e) => handleNavClick(link.hash, e)}
                    className={linkClass}
                  >
                    <span className={linkUnderline}>{t(locale, link.labelKey)}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Markedsplass">
            <ColumnHeading>{t(locale, "footer.ii_markedsplass")}</ColumnHeading>
            <ul className="space-y-3.5">
              {markedsplass.map((link) => (
                <li key={link.href}>
                  <Link to={localeHref(link.href, locale)} className={linkClass}>
                    <span className={linkUnderline}>{t(locale, link.labelKey)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Løsninger">
            <ColumnHeading>{t(locale, "footer.iii_l_sninger")}</ColumnHeading>
            <ul className="space-y-3.5">
              {losninger.map((link) => (
                <li key={link.href}>
                  <Link to={localeHref(link.href, locale)} className={linkClass}>
                    <span className={linkUnderline}>{t(locale, link.labelKey)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Selskap">
            <ColumnHeading>{t(locale, "footer.iv_selskap")}</ColumnHeading>
            <ul className="space-y-3.5">
              {selskap.map((link) => (
                <li key={link.href}>
                  <Link to={localeHref(link.href, locale)} className={linkClass}>
                    <span className={linkUnderline}>{t(locale, link.labelKey)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* SEO internal-link cluster — site-wide links into the private-market
            pages (byer, lokaltyper, anledninger, verktøy). These pages were
            previously reachable only via the sitemap, so this block is what
            passes internal link authority to them and must stay in the markup.
            It is collapsed rather than hidden: <details> keeps all 37 links in
            the DOM and crawlable, and the user can open it — unlike
            display:none, which Google discounts and which reads as cloaking
            when done purely for crawlers. Collapsing also stops the grid from
            rendering as a second footer stacked under sections I-IV. */}
        <details className="group mt-14 lg:mt-16 pt-10 border-t border-rule">
          <summary className="flex cursor-pointer list-none items-center gap-3 text-accent-text [&::-webkit-details-marker]:hidden">
            <span aria-hidden="true" className="w-6 h-px bg-accent-text" />
            <h2 className="editorial-mono-caption text-accent-text">
              {t(locale, "footer.v_lokaler_til_leie")}
            </h2>
            <span className="editorial-mono-caption text-ink-faint">
              37 sider
            </span>
            <ChevronDown
              aria-hidden="true"
              className="h-4 w-4 transition-transform duration-normal ease-editorial group-open:rotate-180"
            />
          </summary>
          <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-8">
            {[
              { title: "BYER", items: byer, label: "Byer" },
              { title: "LOKALTYPER", items: lokaltyper, label: "Lokaltyper" },
              { title: "ANLEDNINGER", items: anledninger, label: "Anledninger" },
              { title: "VERKTØY", items: verktoy, label: "Verktøy" },
            ].map((col) => (
              <nav key={col.title} aria-label={col.label}>
                <p className="editorial-mono-caption text-ink-faint mb-4">
                  {col.title}
                </p>
                <ul className="space-y-2.5">
                  {col.items.map((link) => (
                    <li key={link.href}>
                      <Link
                        to={localeHref(link.href, locale)}
                        className="font-sans text-[0.95rem] text-ink-soft hover:text-ink border-b border-transparent hover:border-ink transition-colors duration-quick ease-editorial no-underline pb-0.5"
                      >
                        {t(locale, link.labelKey)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </details>

        {/* Bottom colophon. The legal links sit here rather than in a column
            of their own — three items did not justify a quarter of the grid,
            and the colophon is where readers look for them anyway. */}
        <div className="mt-16 lg:mt-20 pt-8 border-t border-rule">
          <nav
            aria-label="Juridisk"
            className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-2"
          >
            {juridisk.map((link, i) => (
              <span key={link.href} className="inline-flex items-center gap-3">
                {i > 0 && (
                  <span aria-hidden="true" className="text-ink-faint">
                    ·
                  </span>
                )}
                <Link
                  to={localeHref(link.href, locale)}
                  className="editorial-mono-caption text-ink-soft hover:text-ink border-b border-transparent hover:border-ink transition-colors duration-quick ease-editorial no-underline pb-0.5"
                >
                  {t(locale, link.labelKey)}
                </Link>
              </span>
            ))}
          </nav>
          {/* Also in the footer: the navbar copy is hidden on a phone, and the
              footer is where people look for a language link anyway. */}
          <div className="mb-4">
            <LanguageSwitcher />
          </div>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <p className="editorial-mono-caption">
              <span className="text-ink">
                © {new Date().getFullYear()} Digilist
              </span>
              <span className="mx-3 text-ink-faint">·</span>
              <span className="text-ink-faint">{t(locale, "footer.productOf")}</span>{" "}
              <a
                href="https://xala.no"
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink hover:text-accent-text transition-colors"
              >
                Xala Technologies AS
              </a>
              <span className="mx-3 text-ink-faint">·</span>
              <span className="text-ink-faint">Org.nr. 920 972 454</span>
            </p>
            <p className="editorial-mono-caption text-ink-faint md:text-right">
              {t(locale, "footer.colophon")}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
