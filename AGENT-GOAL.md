# XAL-1166: Lighthouse Ytelse-score 77/100 (mål ≥90). (lighthouse.performance)

> Auto-prepared by Digilist Improvements Agent. Run Claude in this worktree:
> `/loop In the Digilist marketing repo, open src/components/ThemedVideo.tsx and change the <video> preload attribute at line 65 from preload="auto" to preload="metadata" (the hero video is not the measured LCP element on digilist.no — HeroSection.tsx:76-79 documents that the H1 text is the LCP element per XAL-316, so eager-preloading the video wastes bandwidth that could go to the real LCP path). Acceptance criteria: (1) the single-line attribute change lands with no other behavior change to ThemedVideo; (2) run a Lighthouse trace against the live or a local build of digilist.no in devtools-throttled mode (NOT simulate mode, which is known noisy on this VPS per PR #107) and record the before/after Performance score in the PR description; (3) confirm via the trace that the H1 text remains the LCP element (no regression versus XAL-316's finding) and that CLS does not regress from its current ~0.001-0.101 range; (4) all existing tests pass before opening the PR. This is a narrow, well-scoped one-line fix — do not touch HeroSection.tsx's hero-image/preload logic beyond this attribute, since a prior attempt to preload the hero image was tried and reverted for stealing bandwidth from the real LCP element (see PR history for XAL-316/#130).`

## Implementation contract — complete this before writing code
- **Problem:** In the Digilist marketing repo, open src/components/ThemedVideo.tsx and change the <video> preload attribute at line 65 from preload="auto" to preload="metadata" (the hero video is not the measured LCP element on digilist.no — HeroSection.tsx:76-79 documents that the H1 text is the LCP element per XAL-316, so eager-preloading the video wastes bandwidth that could go to the real LCP path). Acceptance criteria: (1) the single-line attribute change lands with no other behavior change to ThemedVideo; (2) run a Lighthouse trace against the live or a local build of digilist.no in devtools-throttled mode (NOT simulate mode, which is known noisy on this VPS per PR #107) and record the before/after Performance score in the PR description; (3) confirm via the trace that the H1 text remains the LCP element (no regression versus XAL-316's finding) and that CLS does not regress from its current ~0.001-0.101 range; (4) all existing tests pass before opening the PR. This is a narrow, well-scoped one-line fix — do not touch HeroSection.tsx's hero-image/preload logic beyond this attribute, since a prior attempt to preload the hero image was tried and reverted for stealing bandwidth from the real LCP element (see PR history for XAL-316/#130).
- **Business objective:** _why this matters (from the Linear issue)_
- **Repository / branch:** `/root/booking-brilliance` @ `agent/xal-1166-lighthouse-ytelse-score-77-100-mal-90`
- **Scope:** _the one change this branch delivers_
- **Out of scope:** _what you will NOT touch — no opportunistic refactor, no formatting sweeps_
- **Acceptance criteria:** _observable, demonstrable outcomes_
- **Architecture constraints:** _boundaries + patterns to follow_
- **Files likely affected:** _list them; if this grows well beyond the list, escalate_
- **Testing requirements:** _what proves it works_
- **Security considerations:** _secrets, RBAC, injection, dependencies_
- **Rollback strategy:** _how to revert safely_
- **Definition of done:** compiled · tests green · acceptance demonstrated with evidence · one reviewable change · no attribution

## Delivery rules
- One issue → one branch (`agent/xal-1166-lighthouse-ytelse-score-77-100-mal-90`) → one independently reviewable change. Never main.
- Smallest valid change. No opportunistic refactoring, no broad formatting changes, no hidden dependency on another open PR.
- Validation is mandatory and staged — "code written" ≠ "compiled" ≠ "tests passed" ≠ "acceptance demonstrated". Collect evidence (test output / logs) before opening the PR.
- If scope expands beyond "Files likely affected", or the change grows large, STOP and escalate ("BLOCKED:") rather than pressing on.
- Open a PR only when green (otherwise a draft PR with a note). Delete this file before opening the PR.

## Full issue — from Linear (the source of truth for scope & acceptance)
> The Linear MCP in this environment may be bound to the WRONG workspace, so
> do NOT rely on it to read this ticket — everything you need is below. If
> something essential is genuinely missing here (e.g. a screenshot), STOP and
> end with "CLARIFICATION:" rather than guessing.

**Classification:** improvement · severity minor · priority P3

Lighthouse Ytelse-score 77/100 (mål ≥90). (lighthouse.performance). Lighthouse Ytelse-score 77/100 (mål ≥90).
Regel: lighthouse.performance
Overflate: Marketing — [digilist.no](<http://digilist.no>)
Affiserte sider: 1
Eksempel-URL: [https://digilist.no](<https://digilist.no>) Observed at [https://digilist.no](<https://digilist.no>). Classification: improvement/minor — partial. Relevant code: src/components/ThemedVideo.tsx:65, src/components/HeroSection.tsx:76-79.

**Scope**
Downgrade ThemedVideo.tsx:65 preload from "auto" to "metadata" since the video is not the LCP element; measure before/after with a devtools-throttled (not simulate-mode) Lighthouse trace. Touch points: src/components/ThemedVideo.tsx:65 (preload="auto" on autoPlay hero video, unaddressed since PR #200 (2026-07-27), still unchanged as of 82nd+ same lever re-verification); src/components/HeroSection.tsx:76-79 (comment confirms H1 text (not video) is the measured LCP element per XAL-316 — fix must not regress this).

**Done when**

- [ ] Downgrade ThemedVideo.tsx:65 preload from "auto" to "metadata" since the video is not the LCP element; measure before/after with a devtools-throttled (not simulate-mode) Lighthouse trace.
- [ ] Verify on [https://digilist.no](<https://digilist.no>).

#### Run as Claude loop (in `/root/booking-brilliance`, on a new branch)

```
/loop In the Digilist marketing repo, open src/components/ThemedVideo.tsx and change the <video> preload attribute at line 65 from preload="auto" to preload="metadata" (the hero video is not the measured LCP element on digilist.no — HeroSection.tsx:76-79 documents that the H1 text is the LCP element per XAL-316, so eager-preloading the video wastes bandwidth that could go to the real LCP path). Acceptance criteria: (1) the single-line attribute change lands with no other behavior change to ThemedVideo; (2) run a Lighthouse trace against the live or a local build of digilist.no in devtools-throttled mode (NOT simulate mode, which is known noisy on this VPS per PR #107) and record the before/after Performance score in the PR description; (3) confirm via the trace that the H1 text remains the LCP element (no regression versus XAL-316's finding) and that CLS does not regress from its current ~0.001-0.101 range; (4) all existing tests pass before opening the PR. This is a narrow, well-scoped one-line fix — do not touch HeroSection.tsx's hero-image/preload logic beyond this attribute, since a prior attempt to preload the hero image was tried and reverted for stealing bandwidth from the real LCP element (see PR history for XAL-316/#130).
```

*Auto-generated by Digilist Improvements Agent (Linear specialist) from performance/lighthouse.performance@marketing + code analysis (graph @ 7056eb44). Move to the approval state to prepare an implementation branch.*

Linear: https://linear.app/xala-technologies/issue/XAL-1166/lighthouse-ytelse-score-77100-mal-90-lighthouseperformance
