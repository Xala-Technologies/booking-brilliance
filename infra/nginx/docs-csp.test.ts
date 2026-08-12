import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * XAL-1010: docs.digilist.no served every security header except
 * Content-Security-Policy — infra/nginx/security-headers.conf omitted it on
 * purpose ("add a per-app CSP separately once its resource origins are
 * known") and that per-app policy was never written.
 *
 * These tests derive the origins the policy *must* allow from the docs app's
 * own source, rather than restating the policy string. That is the point: a
 * CSP is only correct relative to what the app loads, so when someone adds a
 * new font host, embed or API origin, the assertion that fails should be the
 * one describing the real resource — not a hard-coded copy of the header.
 *
 * Most CSP breakage is silent (a blocked font, a blank iframe, a dead search
 * box), so these run in CI rather than relying on someone eyeballing the
 * deployed site.
 */

const repoRoot = join(__dirname, "..", "..");
const cspConf = join(__dirname, "docs-csp.conf");
const applyScript = join(repoRoot, "infra", "apply-security-headers.sh");
const docsSrc = join(repoRoot, "apps", "docs", "src");

const conf = readFileSync(cspConf, "utf-8");

/** The `add_header Content-Security-Policy "..." always;` lines in the snippet. */
function headerLines(): string[] {
  return conf
    .split("\n")
    .filter((l) => !l.trimStart().startsWith("#"))
    .filter((l) => /add_header\s+Content-Security-Policy/i.test(l));
}

/** The policy string itself, unquoted. */
function policy(): string {
  const line = headerLines()[0];
  const match = line.match(/add_header\s+Content-Security-Policy(?:-Report-Only)?\s+"([^"]*)"/i);
  if (!match) throw new Error(`could not parse the policy out of: ${line}`);
  return match[1];
}

/** directive name -> its source list, e.g. "font-src" -> ["'self'", "https://fonts.gstatic.com"]. */
function directives(): Record<string, string[]> {
  const out: Record<string, string[]> = {};
  for (const part of policy().split(";")) {
    const tokens = part.trim().split(/\s+/).filter(Boolean);
    if (tokens.length === 0) continue;
    out[tokens[0]] = tokens.slice(1);
  }
  return out;
}

/**
 * Which directive actually governs `name`, following CSP's fallback chain to
 * default-src — so a policy that drops `font-src` and relies on `default-src`
 * is judged on what the browser would really enforce.
 */
function effective(name: string): string[] {
  const d = directives();
  if (d[name]) return d[name];
  const fallback: Record<string, string> = {
    "script-src": "default-src",
    "style-src": "default-src",
    "img-src": "default-src",
    "font-src": "default-src",
    "connect-src": "default-src",
    "frame-src": "default-src",
    "worker-src": "default-src",
    "manifest-src": "default-src",
  };
  return d[fallback[name]] ?? [];
}

/** Every distinct https origin a file references from a `url(...)`/embed position. */
function originsIn(relPath: string, pattern: RegExp): string[] {
  const text = readFileSync(join(docsSrc, relPath), "utf-8");
  const found = new Set<string>();
  for (const m of text.matchAll(pattern)) found.add(new URL(m[1]).origin);
  return [...found];
}

describe("docs.digilist.no Content-Security-Policy", () => {
  it("ships exactly one CSP add_header, in nginx-valid form", () => {
    const lines = headerLines();
    expect(lines, "the snippet must define the policy exactly once").toHaveLength(1);
    // A second add_header would not merge with the first — browsers intersect
    // the two policies, and the strictest one silently wins.
    expect(lines[0].trimEnd()).toMatch(/;$/);
    expect(lines[0]).toContain(" always;");
    // A bare newline inside the quoted value is a malformed HTTP header.
    expect(policy()).not.toMatch(/[\r\n]/);
  });

  it("locks down the directives that have no legitimate use here", () => {
    const d = directives();
    expect(d["default-src"]).toEqual(["'self'"]);
    expect(d["object-src"]).toEqual(["'none'"]);
    expect(d["base-uri"]).toEqual(["'self'"]);
    // The docs site has no forms and must never be framed.
    expect(d["form-action"]).toEqual(["'self'"]);
    expect(d["frame-ancestors"]).toEqual(["'none'"]);
  });

  it("allows the Google Fonts host that digilist-overrides.css @font-face's", () => {
    // The stylesheet pulls variable WOFF2s directly instead of the Google
    // Fonts CSS, so the font host — not a stylesheet host — is what matters.
    const origins = originsIn("styles/digilist-overrides.css", /url\(["']?(https:\/\/[^)"']+)/g);
    expect(origins.length, "expected at least one remote @font-face src").toBeGreaterThan(0);
    for (const origin of origins) {
      expect(effective("font-src"), `font-src must allow ${origin}`).toContain(origin);
    }
  });

  it("allows the Howdygo embed host the demo widget iframes", () => {
    // Every page renders the placeholder branch today; the iframe appears the
    // moment any MDX passes `demoId`, and a missing frame-src is a blank box.
    const origins = originsIn("components/widgets/HowdygoDemo.astro", /`(https:\/\/howdygo\.com[^`$]*)/g);
    expect(origins).toContain("https://howdygo.com");
    for (const origin of origins) {
      expect(effective("frame-src"), `frame-src must allow ${origin}`).toContain(origin);
    }
  });

  it("allows the federated-search host DocsSearch fetches", () => {
    const origins = originsIn("components/starlight/DocsSearch.astro", /"(https:\/\/convex[^"]*)"/g);
    expect(origins.length, "expected a federated-search default URL").toBeGreaterThan(0);
    for (const origin of origins) {
      expect(effective("connect-src"), `connect-src must allow ${origin}`).toContain(origin);
    }
    // Both environments are allowed so that flipping
    // PUBLIC_FEDERATED_SEARCH_URL never also needs an nginx change.
    expect(effective("connect-src")).toContain("https://convex.digilist.no");
    expect(effective("connect-src")).toContain("https://convex.dev.digilist.no");
  });

  it("keeps Pagefind's WebAssembly search working", () => {
    // Starlight bundles Pagefind, which compiles its index via
    // WebAssembly.instantiateStreaming. Any script-src without
    // 'wasm-unsafe-eval' blocks that and kills search on every page — the
    // single easiest way to break this site with a "tighter" policy.
    const pkg = readFileSync(join(repoRoot, "apps", "docs", "package.json"), "utf-8");
    expect(pkg, "guard assumes Starlight ships Pagefind").toContain("@astrojs/starlight");
    expect(effective("script-src")).toContain("'wasm-unsafe-eval'");
    expect(effective("worker-src"), "Pagefind spawns a same-origin worker").toContain("'self'");
  });

  it("permits the inline scripts and styles Starlight prebuilds", () => {
    // nginx serves static prebuilt HTML: no request-time nonce is possible,
    // and per-build hashes would go stale on every content rebuild. Documented
    // in docs-csp.conf — this policy is an origin allowlist, not XSS
    // containment. Pinned so nobody "hardens" it into a blank page.
    expect(effective("script-src")).toContain("'unsafe-inline'");
    expect(effective("style-src")).toContain("'unsafe-inline'");
    expect(effective("img-src"), "built Starlight CSS inlines SVG data URIs").toContain("data:");
  });
});

describe("apply-security-headers.sh wiring", () => {
  const script = readFileSync(applyScript, "utf-8");

  /** The VPS-side half of the script, which lives in a quoted heredoc. */
  function remoteScript(): string {
    const lines = script.split("\n");
    const start = lines.findIndex((l) => /^remote_script=\$\(cat <<'REMOTE'$/.test(l));
    expect(start, "could not find the remote heredoc").toBeGreaterThan(-1);
    const end = lines.indexOf("REMOTE", start + 1);
    expect(end, "unterminated remote heredoc").toBeGreaterThan(start);
    return lines.slice(start + 1, end).join("\n");
  }

  it("is valid bash (nothing else in CI parses this file)", () => {
    expect(() => execFileSync("bash", ["-n", applyScript])).not.toThrow();
  });

  it("the embedded remote script is valid bash too", () => {
    // The half that rewrites nginx configs on the VPS lives inside a quoted
    // heredoc, so `bash -n` on the file above treats it as a string and never
    // parses it — a syntax error in apply_one() would only surface mid-deploy,
    // after the first conf had already been edited. Check it separately.
    const remote = remoteScript();
    expect(remote).toContain("apply_one()");
    expect(() => execFileSync("bash", ["-n"], { input: remote })).not.toThrow();
  });

  it("stays idempotent when a host gets both snippets", () => {
    // Executed, not inspected: apply_one runs for real against a fixture conf
    // shaped like docs.digilist.no (a :80 redirect block and a :443 block,
    // both naming the host, the shared include already in place).
    //
    // This is what broke when the CSP was added. The previous check only
    // compared the line immediately after server_name, so once the CSP include
    // occupied that slot the shared-header check stopped recognising its own
    // line and re-inserted it on every run — includes grew 3, 5, 7, 9 ...,
    // sending every security header several times over.
    const dir = mkdtempSync(join(tmpdir(), "docs-csp-apply-"));
    const conf = join(dir, "docs.digilist.no");
    writeFileSync(
      conf,
      [
        "server {",
        "    listen 80;",
        "    server_name docs.digilist.no;",
        "    return 301 https://$host$request_uri;",
        "}",
        "",
        "server {",
        "    listen 443 ssl http2;",
        "    server_name docs.digilist.no;",
        "    include snippets/digilist-security-headers.conf;",
        "    root /var/www/docs.digilist.no;",
        "    location / {",
        "        try_files $uri $uri/ $uri.html /404.html;",
        "    }",
        "}",
        "",
      ].join("\n"),
    );

    const counts = (needle: string) =>
      readFileSync(conf, "utf-8")
        .split("\n")
        .filter((l) => l.includes(needle)).length;

    const applyBoth = [
      remoteScript(),
      `SHARED='    include snippets/digilist-security-headers.conf;'`,
      `CSP='    include snippets/digilist-docs-csp.conf;'`,
      `apply_one 'docs.digilist.no' '${conf}' "$SHARED" >/dev/null`,
      `apply_one 'docs.digilist.no' '${conf}' "$CSP" >/dev/null`,
    ].join("\n");

    execFileSync("bash", ["-s"], { input: applyBoth });
    // One of each per server block, and the CSP is actually added.
    expect(counts("digilist-security-headers.conf")).toBe(2);
    expect(counts("digilist-docs-csp.conf")).toBe(2);

    // Re-running the deploy must change nothing at all.
    execFileSync("bash", ["-s"], { input: applyBoth });
    execFileSync("bash", ["-s"], { input: applyBoth });
    expect(counts("digilist-security-headers.conf")).toBe(2);
    expect(counts("digilist-docs-csp.conf")).toBe(2);
  });

  it("does not mistake a neighbouring host's include for this one", () => {
    // dev.digilist.no and dashboard.dev.digilist.no share one conf file, so
    // the "already applied" check has to be scoped to the right server block:
    // a file-wide match would report the second host as done and it would
    // never get the headers.
    const dir = mkdtempSync(join(tmpdir(), "docs-csp-scope-"));
    const conf = join(dir, "digilist-dev");
    writeFileSync(
      conf,
      [
        "server {",
        "    server_name dev.digilist.no;",
        "    include snippets/digilist-security-headers.conf;",
        "    location / { proxy_pass http://127.0.0.1:3000; }",
        "}",
        "",
        "server {",
        "    server_name dashboard.dev.digilist.no;",
        "    location / { proxy_pass http://127.0.0.1:3001; }",
        "}",
        "",
      ].join("\n"),
    );

    execFileSync("bash", ["-s"], {
      input: [
        remoteScript(),
        `SHARED='    include snippets/digilist-security-headers.conf;'`,
        `apply_one 'dashboard.dev.digilist.no' '${conf}' "$SHARED" >/dev/null`,
      ].join("\n"),
    });

    const blocks = readFileSync(conf, "utf-8").split(/^server \{$/m).filter(Boolean);
    expect(blocks).toHaveLength(2);
    for (const block of blocks) {
      expect(
        block.split("\n").filter((l) => l.includes("digilist-security-headers.conf")),
        "each host's block must end up with exactly one include",
      ).toHaveLength(1);
    }
  });

  it("uploads and includes the docs CSP snippet", () => {
    // Without an APP_SNIPPETS entry the snippet exists in the repo but is
    // never shipped — the exact shape of "green CI, nothing deployed".
    expect(script).toMatch(/APP_SNIPPETS=\(/);
    const entry = script
      .split("\n")
      .find((l) => l.includes("infra/nginx/docs-csp.conf") && l.includes("docs.digilist.no"));
    expect(entry, "docs.digilist.no must map to infra/nginx/docs-csp.conf").toBeTruthy();
    expect(entry).toContain("/etc/nginx/sites-available/docs.digilist.no");
    expect(entry).toContain("/etc/nginx/snippets/digilist-docs-csp.conf");
  });

  it("verifies the deployed CSP on a nested page, not only the root", () => {
    // An add_header in any location block drops every header inherited from
    // server, so / can carry the policy while real pages do not.
    expect(script).toMatch(/content-security-policy/i);
    expect(script).toContain('"/kom-i-gang/"');
  });
});
