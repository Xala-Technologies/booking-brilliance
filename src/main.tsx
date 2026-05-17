import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// status.digilist.no is a single-purpose host that always renders the
// /status page. nginx serves /status/index.html for any request, but
// React Router reads window.location.pathname on hydrate and would
// route to "/" (the homepage) on a request to status.digilist.no/.
// Rewrite the pathname before React mounts so the router lands on the
// Status component and the SSR'd HTML matches the hydrated tree.
if (
  typeof window !== "undefined" &&
  window.location.hostname === "status.digilist.no" &&
  !window.location.pathname.startsWith("/status")
) {
  window.history.replaceState(
    {},
    "",
    "/status" +
      (window.location.pathname === "/" ? "" : window.location.pathname) +
      window.location.search +
      window.location.hash,
  );
}

createRoot(document.getElementById("root")!).render(<App />);

// Drop the SSR LCP guard (see index.css) on the next animation frame.
// framer-motion's hydration runs its entry animations from the same
// inline `opacity:0` styles the CSS rule was overriding, so the visual
// effect is the editorial fade-in starting fresh — no flash of the
// content disappearing, just an extra tick of "already visible".
requestAnimationFrame(() => {
  document.documentElement.dataset.hydrated = "true";
});
