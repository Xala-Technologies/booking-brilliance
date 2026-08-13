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
 * invisible *and* user-visible at the same time.
 *
 * It is a RATCHET, not a gate. The 26 pre-existing errors are recorded in
 * ts-baseline.json per file; this fails when a file gains errors or a new file
 * appears. Fixing one and lowering its baseline is always welcome; the point
 * is that the number can only go down.
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
    // tsc exits non-zero whenever there is at least one error, which is the
    // expected state until the baseline reaches zero.
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
