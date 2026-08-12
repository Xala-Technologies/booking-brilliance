import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { scrollActionFor } from "./scroll-target";

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

/**
 * On route change:
 *   - If the URL has a hash, scroll to that anchor.
 *   - Otherwise go to the top.
 *
 * Reads the hash from `window.location`, NOT from `useLocation()`, and listens
 * for `hashchange` as well as route changes. Both are load-bearing.
 *
 * The FAQ category nav (and any other in-page anchor) uses a plain
 * `<a href="#id">`. That is a same-document navigation: it fires `hashchange`,
 * which React Router's `useLocation()` does not observe. The old version keyed
 * only off router state, so on an anchor click it either never re-ran or re-ran
 * with a stale empty hash, fell into the "no hash → top" branch, and undid the
 * browser's own jump.
 *
 * Measured on the live site before the fix: page at scrollY 800, click
 * "Teknologi" (section at 5631px), land at scrollY 0 with location.hash set to
 * "#teknologi". Every anchor on the site behaved that way, and it failed
 * silently — the page moves, so nothing looks broken; you just end up in the
 * wrong place and blame the link.
 *
 * Honors prefers-reduced-motion.
 */
const ScrollToTop = () => {
  const { pathname, key } = useLocation();

  useEffect(() => {
    const run = () => {
      // Live hash, not router state — see the note above.
      const action = scrollActionFor(window.location.hash, (id) => !!document.getElementById(id));

      if (action.kind === "none") return; // hash with no target: leave the reader where they are
      if (action.kind === "anchor") {
        const el = document.getElementById(action.id);
        el?.scrollIntoView({
          behavior: prefersReducedMotion() ? "auto" : "smooth",
          block: "start",
        });
        return;
      }

      const reduced = prefersReducedMotion();
      const distance = window.scrollY;
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: !reduced && distance < 2000 ? "smooth" : "auto",
      });
    };

    // Content can mount after the effect (route transition, lazy section), so
    // retry briefly before giving up on the anchor.
    let attempt = 0;
    const tick = () => {
      const id = window.location.hash.replace(/^#/, "");
      if (id && !document.getElementById(id) && attempt < 8) {
        attempt += 1;
        window.setTimeout(tick, 60);
        return;
      }
      run();
    };
    tick();

    // A plain `<a href="#x">` fires hashchange and nothing else. Without this
    // listener, in-page anchors are invisible to this component.
    window.addEventListener("hashchange", run);
    return () => window.removeEventListener("hashchange", run);
  }, [pathname, key]);

  return null;
};

export default ScrollToTop;
