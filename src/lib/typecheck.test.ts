import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

/**
 * The repo had no typecheck at all.
 *
 * `pnpm lint` is `eslint .`; `pnpm build` is Vite, which strips types without
 * checking them. So `tsc` had never run in CI, and 26 type errors had
 * accumulated unnoticed — including a duplicate key in the copy dictionary,
 * where the later definition silently wins. Two components shared
 * `pilot.cta` with different meanings, so one of them had been rendering the
 * other's button label.
 *
 * That is the argument for this test rather than a lint rule: the failure was
 * invisible *and* user-visible at the same time. And `pilot.cta` was not the
 * only one. Working the baseline down turned up the same shape of defect over
 * and over: three `<TrustBadge>`s on the demo block passed their text as
 * `children` to a component that only reads `label`, so they had always
 * rendered as empty bordered boxes; `MarketplaceHub` handed `SEO` its FAQ as
 * `{q, a}` instead of `{question, answer}`, so four hub pages emitted
 * FAQPage JSON-LD with no question and no answer in it; `OccasionGuide`
 * asked for a heading `size="lg"` that is not in the union, missed the
 * lookup table, and rendered a section heading at body-text size on five
 * landing pages. Every one of those was live, none was visible to eslint or
 * to Vite, and each was a single line at a call site.
 *
 * It is a RATCHET, not a gate — but the baseline is now CLEARED and it holds
 * at zero: ts-baseline.json is `{}`, so any file with any error is a
 * regression. `pr-check.yml` also runs `pnpm typecheck` directly, which is
 * the faster signal; this test is what keeps the number from being quietly
 * negotiated back up by re-adding entries to the baseline.
 *
 * If you are here because this failed: fix the error. Do not add a baseline
 * entry, and do not reach for `any`, `@ts-expect-error` or a `!` — those
 * restore exactly the silence that let `pilot.cta` ship.
 */
const BASELINE: Record<string, number> = JSON.parse(
  readFileSync("ts-baseline.json", "utf8"),
);

function currentErrors(): Record<string, number> {
  let out = "";
  try {
    out = execFileSync(
      "npx",
      ["tsc", "--noEmit", "-p", "tsconfig.app.json"],
      { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] },
    );
  } catch (err) {
    // tsc exits non-zero whenever there is at least one error. Now that the
    // baseline is empty that should never happen — but read its stdout anyway,
    // so the failure names the offending files instead of just blowing up.
    out = String((err as { stdout?: string }).stdout ?? "");
  }
  const counts: Record<string, number> = {};
  for (const line of out.split("\n")) {
    const m = /^(src\/[^(]+)\(\d+,\d+\): error TS/.exec(line);
    if (m) counts[m[1]] = (counts[m[1]] ?? 0) + 1;
  }
  return counts;
}

describe("type errors never increase", () => {
  it("has no file above its recorded baseline", { timeout: 180_000 }, () => {
    const now = currentErrors();
    const regressions = Object.entries(now)
      .filter(([file, n]) => n > (BASELINE[file] ?? 0))
      .map(([file, n]) => `${file}: ${n} (baseline ${BASELINE[file] ?? 0})`);

    expect(
      regressions,
      `new type errors — run: npx tsc --noEmit -p tsconfig.app.json\n${regressions.join("\n")}`,
    ).toEqual([]);
  });
});
