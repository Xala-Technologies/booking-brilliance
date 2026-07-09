import { ReactNode } from "react";
import { ConvexProvider, ConvexReactClient } from "convex/react";

/**
 * Scoped Convex provider — wraps ONLY the routes that actually use Convex
 * (status, blog preview, the admin/intelligence dashboard). This file is the
 * sole importer of `convex/react`, and it's loaded via React.lazy in App.tsx,
 * so the ~69KB Convex client chunk is kept out of the marketing entry bundle
 * (the public pages never call Convex). See App.tsx.
 *
 * Module-level singleton client so navigating between Convex routes reuses one
 * connection instead of spinning up a new client per mount.
 */
const convexUrl = import.meta.env.VITE_CONVEX_URL ?? "";
const convex = new ConvexReactClient(
  convexUrl || "https://placeholder.convex.cloud",
);

export default function ConvexScope({ children }: { children: ReactNode }) {
  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}
