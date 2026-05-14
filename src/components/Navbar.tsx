import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import DockNavigation from "./DockNavigation";
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
          className="group flex items-center gap-3"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <img
            src="/logo.svg"
            alt="Digilist"
            className="h-10 md:h-11 w-auto transition-opacity group-hover:opacity-80"
          />
          <div className="flex flex-col leading-none">
            <span className="text-xl md:text-2xl font-bold text-ink tracking-tight">
              DIGILIST
            </span>
            <span className="text-[0.65rem] md:text-xs text-ink-faint tracking-[0.18em] uppercase">
              Enkel booking
            </span>
          </div>
        </Link>

        <DockNavigation />

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
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
