# XAL-448: Description is 201 chars (recommend ≤165) (description.long)

> Auto-prepared by Digilist Improvements Agent. Run Claude in this worktree:
> `/loop In the marketing repo (/root/booking-brilliance), fix SEO meta description length on blog posts (finding: description.long, recommend <=165 chars). Steps: 1) In src/content/blog/, shorten the `description:` frontmatter to <=165 chars for every post that exceeds it. Currently over-limit: hva-er-bookingsystem-kommunale-lokaler.md (201), leie-sal-billigst-kommune-pris-guide.md (183), bryllupslokale-kommune-krav-kapasitet-sammenligning.md (167). Re-verify by measuring each file's description length. Keep Norwegian Bokmål, preserve the primary keywords and meaning, do not truncate mid-word. 2) These descriptions render into the meta tag via src/pages/BlogPost.tsx:103 (post.description) and BlogPreview.tsx; confirm no other transformation shortens or lengthens them. 3) Add a lightweight guard so this cannot regress: extend the existing content/build validation (or add a small script in scripts/ run in the build/test step) that fails when any blog frontmatter description is >165 chars, mirroring the ≤165 convention already documented at src/components/UseCasePage.tsx:62. 4) Acceptance: every src/content/blog/*.md description is <=165 chars; the guard fails on an over-limit description and passes on the fixed set; existing build and tests are green. Do not change post body copy. Ensure lint/build/tests pass before opening a PR.`

## Implementation contract — complete this before writing code
- **Problem:** In the marketing repo (/root/booking-brilliance), fix SEO meta description length on blog posts (finding: description.long, recommend <=165 chars). Steps: 1) In src/content/blog/, shorten the `description:` frontmatter to <=165 chars for every post that exceeds it. Currently over-limit: hva-er-bookingsystem-kommunale-lokaler.md (201), leie-sal-billigst-kommune-pris-guide.md (183), bryllupslokale-kommune-krav-kapasitet-sammenligning.md (167). Re-verify by measuring each file's description length. Keep Norwegian Bokmål, preserve the primary keywords and meaning, do not truncate mid-word. 2) These descriptions render into the meta tag via src/pages/BlogPost.tsx:103 (post.description) and BlogPreview.tsx; confirm no other transformation shortens or lengthens them. 3) Add a lightweight guard so this cannot regress: extend the existing content/build validation (or add a small script in scripts/ run in the build/test step) that fails when any blog frontmatter description is >165 chars, mirroring the ≤165 convention already documented at src/components/UseCasePage.tsx:62. 4) Acceptance: every src/content/blog/*.md description is <=165 chars; the guard fails on an over-limit description and passes on the fixed set; existing build and tests are green. Do not change post body copy. Ensure lint/build/tests pass before opening a PR.
- **Business objective:** _why this matters (from the Linear issue)_
- **Repository / branch:** `/root/booking-brilliance` @ `agent/xal-448-description-is-201-chars-recommend-165-descripti`
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
- One issue → one branch (`agent/xal-448-description-is-201-chars-recommend-165-descripti`) → one independently reviewable change. Never main.
- Smallest valid change. No opportunistic refactoring, no broad formatting changes, no hidden dependency on another open PR.
- Validation is mandatory and staged — "code written" ≠ "compiled" ≠ "tests passed" ≠ "acceptance demonstrated". Collect evidence (test output / logs) before opening the PR.
- If scope expands beyond "Files likely affected", or the change grows large, STOP and escalate ("BLOCKED:") rather than pressing on.
- Open a PR only when green (otherwise a draft PR with a note). Delete this file before opening the PR.

Linear: https://linear.app/xala-technologies/issue/XAL-448/description-is-201-chars-recommend-165-descriptionlong
