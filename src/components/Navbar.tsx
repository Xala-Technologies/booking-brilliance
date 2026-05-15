import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import { GlobalSearch } from "./GlobalSearch";
import { MobileMenu } from "./MobileMenu";
import { EditorialButton } from "@/components/editorial";
import { cn } from "@/lib/utils";
import { getFraunces } from "@/lib/fonts";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Skip-to-main link (WCAG 2.1.1 / 2.4.1) — visually hidden until focused */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:bg-navy focus:text-on-navy focus:px-4 focus:py-2 focus:rounded-sm focus:outline-none focus:ring-2 focus:ring-navy focus:ring-offset-2"
      >
        Hopp til hovedinnhold
      </a>
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-40 bg-paper border-b transition-all duration-normal ease-editorial",
        isScrolled
          ? "border-rule-strong py-2 shadow-[0_1px_0_0_hsl(var(--rule))]"
          : "border-rule py-3"
      )}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link
          to="/"
          aria-label="Digilist — gå til forsiden"
          className="group inline-flex items-center gap-3"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <img
            src="/logo.svg"
            alt=""
            aria-hidden="true"
            className="h-11 md:h-12 w-auto transition-opacity group-hover:opacity-80"
          />
          <span className="flex flex-col items-start leading-none">
            <span
              className="font-serif text-3xl md:text-[2rem] text-ink leading-none"
              style={{
                fontVariationSettings:
                  '"opsz" 96, "wght" 460, "SOFT" 25, "WONK" 1',
                letterSpacing: "-0.02em",
              }}
            >
              Digilist
            </span>
            <span className="mt-0.5 inline-flex items-center gap-1.5">
              <span
                aria-hidden="true"
                className="inline-block w-3.5 h-px bg-accent-text"
              />
              <span
                className="font-serif italic text-sm md:text-[0.95rem] text-ink-soft leading-none"
                style={{
                  fontVariationSettings:
                    '"opsz" 16, "wght" 420, "SOFT" 60',
                  letterSpacing: "0.005em",
                }}
              >
                Enkel booking
              </span>
              <span
                aria-hidden="true"
                className="inline-block w-1 h-1 rounded-full bg-accent-text/60"
              />
            </span>
          </span>
        </Link>

        <div className="hidden md:flex flex-1 justify-center px-6 lg:px-10 max-w-2xl mx-auto">
          <GlobalSearch />
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <EditorialButton
            variant="primary"
            size="md"
            href="https://app.digilist.no"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex"
          >
            Åpne plattformen
          </EditorialButton>
          <MobileMenu />
        </div>
      </div>
    </nav>
    </>
  );
};

export default Navbar;
