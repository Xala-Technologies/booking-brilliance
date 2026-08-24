import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

/**
 * api.digilist.no served ZERO security headers (#220, #122): no HSTS, no
 * nosniff, no frame policy. The audit had flagged it for weeks and the fix kept
 * being filed as an nginx change — but this host's vhost is hand-maintained on
 * the VPS, and infra/apply-security-headers.sh only targets docs.digilist.no,
 * so nothing in this repo could deliver it. The service ships from here, so the
 * headers do too.
 *
 * Asserted against the source rather than a live request because that is what
 * CI can see. The live check is `curl -sI https://api.digilist.no/health`.
 */
const SRC = readFileSync(
  join(dirname(fileURLToPath(import.meta.url)), "index.mjs"),
  "utf8",
);
const NGINX_SNIPPET = readFileSync(
  join(dirname(fileURLToPath(import.meta.url)), "..", "infra", "nginx", "security-headers.conf"),
  "utf8",
);

describe("the API service sets its own security headers", () => {
  for (const header of [
    "Strict-Transport-Security",
    "X-Frame-Options",
    "X-Content-Type-Options",
    "X-XSS-Protection",
    "Referrer-Policy",
    "Permissions-Policy",
  ]) {
    it(`sets ${header}`, () => {
      expect(SRC).toContain(`"${header}"`);
    });
  }

  it("puts them on every response, not just one endpoint", () => {
    // corsHeaders is spread into json() and into each writeHead that answers
    // directly, so folding the security headers into it covers all of them.
    // If someone splits these apart, this is the line that notices.
    expect(SRC).toMatch(/const corsHeaders = \{\s*\.\.\.securityHeaders,/);
  });

  it("agrees with the nginx snippet header for header, so the two cannot drift", () => {
    // Same policy from either delivery path. If the vhost later gains the
    // include, the duplicate is at least identical rather than contradictory —
    // per RFC 6797 §8.1 a client honours whichever STS header arrives first.
    // This caught a real drift on the first run: the service was written with
    // a two-year max-age copied from a knowledge doc while the snippet — and
    // digilist.no live — say one year.
    const nginx = Object.fromEntries(
      [...NGINX_SNIPPET.matchAll(/add_header\s+([\w-]+)\s+"([^"]*)"/g)].map((m) => [m[1], m[2]]),
    );
    for (const [header, value] of Object.entries(nginx)) {
      const fromNode = new RegExp(`"${header}":\\s*\n?\\s*"([^"]+)"`).exec(SRC)?.[1];
      expect(fromNode, `${header} missing from server/index.mjs`).toBe(value);
    }
  });
});
