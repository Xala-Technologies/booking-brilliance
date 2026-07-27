# XAL-756: 2 <h1> tags (recommend exactly one) (h1.multiple)

> Auto-prepared by Digilist Improvements Agent. Run Claude in this worktree:
> `/loop In the marketing repo (this booking-brilliance checkout), open src/content/blog/leie-bryllupslokale.md. Delete the leading markdown heading line '# Leie bryllupslokale: pris, kapasitet og booking, forklart' at line 14 and the blank line immediately following it, so the markdown body starts directly with the first '## ' subsection. Do not touch src/pages/BlogPost.tsx or the ReactMarkdown component config, and do not touch any other file in src/content/blog/. Acceptance criteria: `grep -c '^# ' src/content/blog/leie-bryllupslokale.md` returns 0; the page title and intro paragraph still render correctly (post.title is still rendered as the single h1 by BlogPost.tsx via EditorialHeading as="h1"). Run the repo's existing test/lint/build checks and confirm they are green before opening a PR.`

## Implementation contract — complete this before writing code
- **Problem:** In the marketing repo (this booking-brilliance checkout), open src/content/blog/leie-bryllupslokale.md. Delete the leading markdown heading line '# Leie bryllupslokale: pris, kapasitet og booking, forklart' at line 14 and the blank line immediately following it, so the markdown body starts directly with the first '## ' subsection. Do not touch src/pages/BlogPost.tsx or the ReactMarkdown component config, and do not touch any other file in src/content/blog/. Acceptance criteria: `grep -c '^# ' src/content/blog/leie-bryllupslokale.md` returns 0; the page title and intro paragraph still render correctly (post.title is still rendered as the single h1 by BlogPost.tsx via EditorialHeading as="h1"). Run the repo's existing test/lint/build checks and confirm they are green before opening a PR.
- **Business objective:** _why this matters (from the Linear issue)_
- **Repository / branch:** `/root/booking-brilliance` @ `agent/xal-756-2-h1-tags-recommend-exactly-one-h1`
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
- One issue → one branch (`agent/xal-756-2-h1-tags-recommend-exactly-one-h1`) → one independently reviewable change. Never main.
- Smallest valid change. No opportunistic refactoring, no broad formatting changes, no hidden dependency on another open PR.
- Validation is mandatory and staged — "code written" ≠ "compiled" ≠ "tests passed" ≠ "acceptance demonstrated". Collect evidence (test output / logs) before opening the PR.
- If scope expands beyond "Files likely affected", or the change grows large, STOP and escalate ("BLOCKED:") rather than pressing on.
- Open a PR only when green (otherwise a draft PR with a note). Delete this file before opening the PR.

## Full issue — from Linear (the source of truth for scope & acceptance)
> The Linear MCP in this environment may be bound to the WRONG workspace, so
> do NOT rely on it to read this ticket — everything you need is below. If
> something essential is genuinely missing here (e.g. a screenshot), STOP and
> end with "CLARIFICATION:" rather than guessing.

**Classification:** bug · severity minor · priority P3

Product gap: 2 <h1> tags (recommend exactly one) (h1.multiple). <!-- xaheen-triage -->
**defect** · severity minor — Affects one marketing blog page only, no data loss or blocked flow, and a one-line content edit fixes it with no template change.

The blog post page for leie-bryllupslokale renders two <h1> tags. BlogPost.tsx already renders post.title as the page's single h1 (EditorialHeading as="h1"), but the markdown body of this one post separately starts with a literal '# ' heading line, which ReactMarkdown renders as a second h1 since only h2 has a custom component override.

**Done when**

- [ ] grep -c '^# ' src/content/blog/leie-bryllupslokale.md returns 0
- [ ] [https://digilist.no/blogg/leie-bryllupslokale](<https://digilist.no/blogg/leie-bryllupslokale>) renders exactly one <h1> element

**Not included**

* Changes to src/pages/BlogPost.tsx or the ReactMarkdown component config
* Changes to any other blog post file

**How to verify**

* Load [https://digilist.no/blogg/leie-bryllupslokale](<https://digilist.no/blogg/leie-bryllupslokale>) and inspect the DOM: exactly one <h1>, page still shows the title and intro paragraph correctly

Target repo: `marketing`

<details><summary>Reporter's original text</summary>

**Classification:** bug · severity minor · priority P3

2 <h1> tags (recommend exactly one) (h1.multiple). 2 <h1> tags (recommend exactly one)
Regel: h1.multiple
Overflate: Marketing — [digilist.no](<http://digilist.no>)
Affiserte sider: 1
Eksempel-URL: [https://digilist.no/blogg/leie-bryllupslokale](<https://digilist.no/blogg/leie-bryllupslokale>) Observed at [https://digilist.no/blogg/leie-bryllupslokale](<https://digilist.no/blogg/leie-bryllupslokale>). Classification: bug/minor — fixable. Relevant code: src/pages/BlogPost.tsx:198, src/content/blog/leie-bryllupslokale.md:14, src/content/blog/*.md.

**Scope**
Remove the duplicate leading '# Leie bryllupslokale: pris, kapasitet og booking, forklart' heading line (and the blank line after it) from src/content/blog/leie-bryllupslokale.md, since BlogPost.tsx already renders post.title as the single h1. No template/code change needed. Touch points: src/pages/BlogPost.tsx:198 (template renders post.title as the page's h1 via EditorialHeading as="h1"); src/content/blog/leie-bryllupslokale.md:14 (markdown body also starts with a literal '# Leie bryllupslokale...' heading, rendered as a second h1 by ReactMarkdown (h2 is overridden in components, h1 is not)); src/content/blog/*.md (checked all other posts: only this file has a leading '# ' line; every other post correctly starts with '## ' sections).

**Done when**

- [ ] Remove the duplicate leading '# Leie bryllupslokale: pris, kapasitet og booking, forklart' heading line (and the

…(truncated)

</details> Current assessment: gap (bug, minor). Relevant code: src/content/blog/leie-bryllupslokale.md:14, src/pages/BlogPost.tsx:198, src/pages/BlogPost.tsx:230-263.

**Scope**
Delete line 14 (the '# Leie bryllupslokale: pris, kapasitet og booking, forklart' heading) and the blank line after it from src/content/blog/leie-bryllupslokale.md, so the body starts directly at the first '## ' section, matching every other post in src/content/blog/. Touch points: src/content/blog/leie-bryllupslokale.md:14 (literal '# Leie bryllupslokale: pris, kapasitet og booking, forklart' heading line duplicates the page title); src/pages/BlogPost.tsx:198 (EditorialHeading as="h1" already renders post.title as the page's single h1); src/pages/BlogPost.tsx:230-263 (ReactMarkdown components override only h2, so the markdown's leading '# ' renders as an unstyled second h1).

**Done when**

- [ ] Delete line 14 (the '# Leie bryllupslokale: pris, kapasitet og booking, forklart' heading) and the blank line after it from src/content/blog/leie-bryllupslokale.md, so the body starts directly at the first '## ' section, matching every other post in src/content/blog/.

## Code analysis (evidence, marketing @ 74bf7ef8)

Status: **gap** (confidence 98%)

* `src/content/blog/leie-bryllupslokale.md:14` — literal '# Leie bryllupslokale: pris, kapasitet og booking, forklart' heading line duplicates the page title
* `src/pages/BlogPost.tsx:198` — EditorialHeading as="h1" already renders post.title as the page's single h1
* `src/pages/BlogPost.tsx:230-263` — ReactMarkdown components override only h2, so the markdown's leading '# ' renders as an unstyled second h1

## Source

Product idea (XAL-756), from search demand

## Run as Claude loop (in `/root/booking-brilliance`, on a new branch)

```
/loop In the marketing repo (this booking-brilliance checkout), open src/content/blog/leie-bryllupslokale.md. Delete the leading markdown heading line '# Leie bryllupslokale: pris, kapasitet og booking, forklart' at line 14 and the blank line immediately following it, so the markdown body starts directly with the first '## ' subsection. Do not touch src/pages/BlogPost.tsx or the ReactMarkdown component config, and do not touch any other file in src/content/blog/. Acceptance criteria: `grep -c '^# ' src/content/blog/leie-bryllupslokale.md` returns 0; the page title and intro paragraph still render correctly (post.title is still rendered as the single h1 by BlogPost.tsx via EditorialHeading as="h1"). Run the repo's existing test/lint/build checks and confirm they are green before opening a PR.
```

---

*Auto-generated by Digilist Improvements Agent (Linear specialist) from XAL-756 + code analysis (graph @ 74bf7ef8). Move to the approval state to prepare an implementation branch.*

Linear: https://linear.app/xala-technologies/issue/XAL-756/2-h1-tags-recommend-exactly-one-h1multiple
