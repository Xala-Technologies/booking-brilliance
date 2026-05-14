import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "#funksjonalitet", numeral: "I", label: "Funksjonalitet" },
  { href: "#brukerhistorier", numeral: "II", label: "Brukerhistorier" },
  { href: "#kontakt", numeral: "III", label: "Kontakt" },
];

const DockNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeHash, setActiveHash] = useState("");

  useEffect(() => {
    const updateActiveHash = () => {
      const hash = window.location.hash;
      if (hash) {
        setActiveHash(hash);
        return;
      }
      const sections = navItems.map((item) => item.href.substring(1));
      const scrollPosition = window.scrollY + 200;
      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (!element) continue;
        const rect = element.getBoundingClientRect();
        const elementTop = rect.top + window.scrollY;
        const elementBottom = elementTop + rect.height;
        if (scrollPosition >= elementTop && scrollPosition < elementBottom) {
          setActiveHash(`#${sectionId}`);
          return;
        }
      }
      setActiveHash("");
    };

    updateActiveHash();
    window.addEventListener("scroll", updateActiveHash);
    window.addEventListener("hashchange", updateActiveHash);
    return () => {
      window.removeEventListener("scroll", updateActiveHash);
      window.removeEventListener("hashchange", updateActiveHash);
    };
  }, []);

  const handleNavClick = (hash: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (location.pathname === "/") {
      const element = document.querySelector(hash);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
        window.history.pushState(null, "", hash);
        setActiveHash(hash);
      }
    } else {
      navigate("/");
      setTimeout(() => {
        window.location.hash = hash;
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
        setActiveHash(hash);
      }, 50);
    }
  };

  return (
    <div className="hidden lg:flex items-center gap-7">
      {navItems.map((item) => {
        const isActive = activeHash === item.href;
        return (
          <a
            key={item.href}
            href={item.href}
            aria-label={item.label}
            onClick={(e) => handleNavClick(item.href, e)}
            className={cn(
              "group inline-flex items-center gap-2.5 py-2 transition-colors duration-quick ease-editorial",
              isActive
                ? "text-ink"
                : "text-ink-faint hover:text-ink"
            )}
          >
            <span
              className={cn(
                "font-mono text-[0.65rem] tracking-widest tabular-nums",
                isActive ? "text-accent-text" : "text-ink-faint group-hover:text-accent-text"
              )}
            >
              {item.numeral}
            </span>
            <span className="w-px h-3 bg-rule" aria-hidden="true" />
            <span
              className={cn(
                "font-sans text-xs uppercase tracking-widest",
                isActive &&
                  "underline underline-offset-8 decoration-[0.5px] decoration-ink"
              )}
            >
              {item.label}
            </span>
          </a>
        );
      })}
    </div>
  );
};

export default DockNavigation;
