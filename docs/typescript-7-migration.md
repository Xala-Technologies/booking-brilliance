# TypeScript 7 migration — Digilist marketing site + agent tooling

Status: **Phase 1 complete (prep + baseline + TS6-readiness).** TypeScript 7 is
**not** installed by this PR. Phase 2 (actual TS7 adoption) is scoped at the
bottom of this document.

TypeScript 7.0 (the native, Go-based compiler; `latest` on npm since
2026-07-08) does **not yet expose the programmatic compiler API**
(`typescript.createProgram`, `LanguageService`, etc.). Any tool that imports the
`typescript` package's JS API therefore still needs a JS-based TypeScript
(5.x today, 6.x once it stabilises) installed **side-by-side** with the native
`tsc`. This document records what in this repo depends on that API and what does
not, so Phase 2 can flip the compiler without breaking the build, the linter, or
the `tsx`-run agents.

---

## 1. Baseline (recorded 2026-07-11)

### Toolchain versions

| Tool | Spec (package.json) | Resolved |
| --- | --- | --- |
| node | — (now pinned via `.node-version`) | 20.20.0 |
| pnpm | — (now pinned via `packageManager`) | 10.33.4 |
| typescript | `^5.9.3` (was `^5.8.3`) | 5.9.3 |
| typescript-eslint | `^8.38.0` | 8.52.0 |
| @typescript-eslint/* + ts-api-utils | (transitive) | 8.52.0 / ts-api-utils 2.4.0 **bound to `typescript@5.9.3`** |
| tsx | `^4.22.0` | 4.22.0 (bundles esbuild `~0.28.0`) |
| vite | `^5.4.19` | 5.4.21 |
| @vitejs/plugin-react-swc | `^3.11.0` | 3.11.0 (uses `@swc/core` 1.15.8) |
| react / react-dom | `^18.3.1` | 18.3.1 |
| @types/react / @types/react-dom | `^18.3.23` / `^18.3.7` | 18.3.x |
| @types/node | `^22.16.5` | 22.19.3 |
| eslint | `^9.32.0` | 9.39.2 |
| @playwright/test | `^1.61.1` | 1.61.1 |
| vitest | `^2.1.9` | 2.1.9 |

> Note: the repo uses `@vitejs/plugin-react-swc` (SWC transpiler), **not**
> `@vitejs/plugin-react` (Babel). Neither the build nor the dev server invokes
> `tsc` — type stripping is done by SWC (build/dev) and esbuild (tsx/vitest).

### Command timings & status

Measured on a freshly-installed `node_modules` (this was a clean worktree; a
`pnpm install --frozen-lockfile` was required before anything resolved — see the
gotcha below). Times are indicative, single run, on the CI-class sandbox.

| Command | Cold | Warm | Status |
| --- | --- | --- | --- |
| `tsc -b` (there is **no** `typecheck` npm script) | ~13–15 s (`--force`) | ~12 s | ❌ 12 pre-existing type errors (exit 2) |
| `pnpm lint` (`eslint .`) | ~5.5 s | — | ❌ 25 errors + 17 warnings (pre-existing) |
| `pnpm build` (`vite build` + SSR build + `scripts/prerender.mjs`) | ~14.7 s | ~14.6 s | ✅ green — 53 pages prerendered + sitemap, SSR bodies + critical CSS inlined |
| `pnpm seo:test` (`vitest run tools/seo-crawler`) | ~1.6 s | — | ✅ 22 passed |
| `pnpm e2e:test --project=public` (Playwright, **hits live prod** `https://digilist.no`) | ~8.5 s | — | ✅ 6 passed |

**Pre-existing red gates (NOT introduced by this PR, NOT fixed here — out of
scope for Phase 1):**

- **`tsc` is never run as a gate.** There is no `typecheck` script; Vite/SWC and
  esbuild strip types without checking them, and the ESLint config uses the
  non-type-aware `typescript-eslint` recommended preset. Running `tsc -b`
  surfaces **12 latent type errors**, all in `src/` (codes: 6×TS2339, 3×TS2741,
  2×TS2367, 1×TS2322 — e.g. `EditorialHeading` missing `id` prop,
  `TrustBadge` missing `label`, a `DockNavigation` never-narrowing). Fixing
  these means touching component code and is deferred to Phase 2.
- **`pnpm lint` reports 25 errors / 17 warnings**, including lint of the
  auto-generated `convex/_generated/*` files (not in the ESLint `ignores`), plus
  `@typescript-eslint/no-explicit-any` (14), `react-hooks/*` (9),
  `react-refresh/only-export-components` (7), and a few whitespace/escape rules.
  Pre-existing; not addressed here.

The gates this PR keeps green are the ones the project actually ships on:
**build (+ prerender)** and **tests (vitest + Playwright public suite)**.

### Gotcha for reviewers / CI

- `dist-server/` **is committed** (tracked build output). Running `pnpm build`
  rewrites `dist-server/entry-server.js`; do not commit that churn as part of a
  toolchain PR — `git checkout -- dist-server/` after building.
- `tsc -b` writes `tsconfig.app.tsbuildinfo` / `tsconfig.node.tsbuildinfo` to the
  repo root. These are now git-ignored (`*.tsbuildinfo`).

---

## 2. Compatibility audit — who uses the TypeScript compiler API?

Repo-wide grep for programmatic compiler-API usage
(`from 'typescript'`, `require('typescript')`, `ts.createProgram`,
`ts.createSourceFile`, `CompilerHost`, `LanguageService`, `ts-morph`,
`ts-loader`, `fork-ts-checker`) across `src/`, `tools/`, `scripts/`, `server/`,
`convex/`, `apps/`, and all config files:

### First-party code: **zero** direct compiler-API usage

- **`tools/` agents** (content-agent, improvements-agent, e2e-agent,
  pr-review-agent, docs-rag, seo-crawler, site-intelligence) — run via **`tsx`**,
  which transpiles with **esbuild**, not the `typescript` package. None of them
  `import 'typescript'`. They are **TS-compiler-version-independent** and will
  run unchanged under a TS7 world.
- **Vite / prerender / SSR** — `vite.config.ts` uses `@vitejs/plugin-react-swc`
  (SWC). The build is `vite build` → `vite build --ssr src/entry-server.tsx`
  → `node scripts/prerender.mjs`. `prerender.mjs` is plain ESM (no TS API); it
  imports the SSR bundle's `render()` and gracefully no-ops if the bundle or
  Convex env is absent. **No `tsc` in the build path.**
- **Playwright** — configs and specs are executed by Playwright's own esbuild
  loader; no `typescript` API import.
- **`ts-loader` / `fork-ts-checker` / `ts-morph`** — **not present** anywhere.

### Transitive compiler-API consumers (the side-by-side blockers)

| Package | How it uses the TS API | Phase-2 impact |
| --- | --- | --- |
| `typescript-eslint` 8.52.0 → `@typescript-eslint/typescript-estree`, `@typescript-eslint/project-service`, `ts-api-utils` 2.4.0 | Parses/queries source via the programmatic `typescript` API. In the lockfile `ts-api-utils` is bound as `2.4.0(typescript@5.9.3)`. | **Needs a JS-based TypeScript on disk.** Cannot consume TS7-native alone until typescript-eslint ships a TS7-API-compatible release. |
| `tsx` 4.22.0 | esbuild only — **does not** touch the TS API. | None. Works under TS7. |
| `@vitejs/plugin-react-swc` 3.11.0 (`@swc/core`) | SWC — **does not** touch the TS API. | None. |
| `vitest` 2.1.9 / `vite` 5.4.21 | esbuild — **does not** touch the TS API. | None. |

### Conclusion: is a side-by-side TS6/TS7 setup needed?

**Yes — but only for the linter.** When Phase 2 introduces the native TS7 `tsc`:

- Keep a **JS-based `typescript` (5.9.x today, or 6.x once it stabilises)**
  installed as a devDependency so `typescript-eslint`/`ts-api-utils` keep working
  for type-aware linting and editor/IDE tooling.
- Use the **native `tsc` (7.x)** purely for a fast `typecheck` gate / emit.
- Everything else in the build and the `tsx`-run agents is already decoupled from
  the `typescript` package and needs no side-by-side shim.

This "two typescripts" state is temporary: it ends once typescript-eslint ships a
release that speaks the TS7 native API.

---

## 3. Toolchain pinning (done in this PR)

- **`packageManager`** pinned in `package.json`: `pnpm@10.33.4` (Corepack-honoured).
- **`.node-version`** added: `20.20.0` (was missing; no `.nvmrc` either).
- **Project-local `tsc`** confirmed — no npm script calls a global `tsc`; all TS
  tooling resolves through `node_modules/.bin` via pnpm. (Heads-up: a bare `tsc`
  on `PATH` may resolve to a *sibling* worktree's binary; always invoke via
  `pnpm exec tsc` / npm scripts, never bare `tsc`.)
- **`*.tsbuildinfo`** added to `.gitignore`.

---

## 4. TS6 bridge / readiness

The standard Microsoft migration path is 5.x → **6.0 (JS-based, transitional —
turns 7.0's removals into deprecation warnings)** → 7.0 (native). Step 4 of this
task asked to "upgrade to `typescript@^6` if below 6."

**Blocker discovered — there is no stable TypeScript 6.** As of 2026-07-11 the
npm dist-tags are:

```
beta   6.0.0-beta
rc     7.0.1-rc
latest 7.0.2
next   7.1.0-dev.*
```

Only `6.0.0-beta` + nightly `6.0.0-dev.*` builds exist on the `6.x` line, and
`typescript@^6` does **not** resolve (a `6.0.0-beta` prerelease does not satisfy
the `^6.0.0` range per semver). Pinning a beta compiler as the committed
toolchain would contradict this PR's "reversible, adds no features, tests green"
mandate.

**Decision:** stay on the **latest stable 5.x (5.9.3)** and make the repo
*TS6-ready* rather than installing a beta:

- Bumped the `typescript` devDependency floor from `^5.8.3` → `^5.9.3` so the
  toolchain deliberately tracks the newest 5.x line (the one that emits the most
  TS6-forward deprecation signals). Resolved version is unchanged (5.9.3), so
  this is zero-runtime-risk.
- **No `ignoreDeprecations` is present or needed.** Audited all three tsconfigs
  (`tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`): none use any
  compiler option deprecated/removed in TS6/7 (no `suppressImplicitAnyIndexErrors`,
  `noImplicitUseStrict`, `keyofStringsOnly`, `importsNotUsedAsValues`,
  `preserveValueImports`, `out`, `charset`, etc.). The configs use modern
  `moduleResolution: "bundler"`, `isolatedModules`, `moduleDetection: "force"`,
  `verbatim`-free `react-jsx` — all TS7-compatible. **No deprecations to resolve.**

Phase 2 will re-evaluate: adopt `typescript@6` once it ships stable, or go
straight to the TS7 native compiler + a retained 5.x/6.x for the linter (§2).

---

## 5. Validation (this PR)

Ran after the changes in §3–§4:

- `pnpm build` — ✅ green, prerender still produces all 53 pages + sitemap, SSR
  bodies and critical CSS inlined.
- `pnpm seo:test` — ✅ 22 passed.
- `pnpm e2e:test --project=public` — ✅ 6 passed (live prod).
- `pnpm lint` / `tsc -b` — unchanged from baseline (pre-existing reds, §1); this
  PR neither improves nor regresses them.

The `typescript@^5.9.3` spec bump updates only the specifier in
`pnpm-lock.yaml`; the resolved graph is identical.

---

## 6. Rollback plan

This PR is fully reversible and touches no runtime code:

1. `git revert <this-commit>` (or drop the PR). That restores `package.json`
   (`typescript` spec, `packageManager`), removes `.node-version`, the
   `.gitignore` line, and this doc.
2. Run `pnpm install` to restore the previous `pnpm-lock.yaml` specifier
   (resolved versions are unchanged, so this is a no-op for the dependency graph).
3. No dist/build-output, `src/`, `tools/`, `convex/`, or config-behaviour changes
   were made, so nothing else needs reverting.

---

## 7. Phase 2 — planned TS7 adoption (NOT in this PR)

1. Install the native compiler side-by-side: keep `typescript@5.9.x` (or `@6`
   when stable) for `typescript-eslint`; add the TS7 native `tsc` for a fast
   `typecheck` gate. Add a `"typecheck"` npm script.
2. Burn down the **12 latent `tsc` errors** (§1) so a `typecheck` gate can be
   green, then wire it into CI.
3. Optionally clean up the **25 lint errors / 17 warnings** and add
   `convex/_generated` to the ESLint `ignores`.
4. Re-audit §2 when `typescript-eslint` ships a TS7-native-API release — at that
   point the side-by-side JS `typescript` can be dropped.
5. Keep `tsx`-run agents, Vite/SWC build, prerender, and Playwright as-is — they
   are already compiler-version-independent.
