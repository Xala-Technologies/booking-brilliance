import { useEffect, useState } from "react";

/**
 * Tracks which #id section is currently in view, based on scroll position.
 * Uses scrollY + offset, not IntersectionObserver, because we want a single
 * authoritative "current" section even when multiple are visible at once.
 */
export function useActiveSection(ids: string[]): string {
  const [active, setActive] = useState<string>(ids[0] ?? "");

  useEffect(() => {
    if (ids.length === 0) return;
    const scrollLine = () => window.scrollY + window.innerHeight * 0.35;

    const compute = () => {
      const y = scrollLine();
      let current = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        const top =
          el.getBoundingClientRect().top + window.scrollY;
        if (y >= top) current = id;
      }
      setActive(current);
    };

    compute();
    window.addEventListener("scroll", compute, { passive: true });
    window.addEventListener("resize", compute);
    return () => {
      window.removeEventListener("scroll", compute);
      window.removeEventListener("resize", compute);
    };
  }, [ids]);

  return active;
}
