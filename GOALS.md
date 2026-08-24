# GOALS.md

The standing growth objective for digilist.no. Written so a human can argue with
it and an agent can act on it without asking anyone.

## The rule about this file

**`growth.goals` is the source of truth. This file is the explanation.**

Every target below exists as a row in the `growth.goals` table in the growth
Postgres (Grafana datasource uid `digilist-postgres-growth`), seeded by
`collectors/migrations/002_growth_goals.sql` in `digilist-observability`. The
table is what the dashboards read and what the growth-fleet agents are supposed
to read. This file says *why* each number was chosen and what was true on the
day it was chosen.

So: **never change a target here alone.** Change the row, then change the prose.
A number that appears only in Markdown is a number no dashboard can check and no
agent can be measured against — which is exactly the failure this document was
written to end. If the two ever disagree, the table wins and this file is stale.

Live numbers:

| Where | What |
|---|---|
| `growth.v_goal_progress` | every goal beside its current value, with `gap`, `on_track`, `progress_pct` |
| `growth.v_goal_measures` | the measured side alone, one row per (metric, site, keyword) |
| Grafana uid `digilist-goals` | *Digilist / The #1 goal — target versus where we actually are* |

`on_track` is `NULL`, never `false`, when nothing has been measured. An
unmeasured goal is not a failing goal.

## The goal, stated so it can be settled

"Be #1 on SEO, GEO and AEO" cannot be won or lost, because nobody can say on
which day it happened. Three surfaces, three definitions of #1, three numbers:

### SEO — #1 means a position on a page of blue links

| # | Goal | Metric | Target | By | Baseline 2026-08-24 |
|---|---|---|---|---|---|
| 1 | Top 3 for all six commercial keywords | `serp_position` per keyword | `<= 3` | 2026-12-31 | none of the six has a measured position |
| 2 | Twenty keywords in the top 3 overall | `keywords_in_top3` | `>= 20` | 2027-03-31 | 2, and both are brand terms* |

\* The `notes` column on that goal row says `0 in the top 3`. The measured
reading on 2026-08-24 was 2 — `digilist` and `xala technologies`, i.e. people
who already knew our name. Zero commercial terms is the number that matters, and
it is what the note was reaching for. Correct the note when you next touch the
row; do not "fix" it by lowering the baseline recorded here.

The six commercial keywords, from `config/seo-targets.yaml` in
`digilist-observability` — these are the money terms, the ones somebody types
when they are shopping:

```
leie lokale               competitor lokaler.no holds #2
leie selskapslokale       competitor lokaler.no holds #3
utleie av lokaler         competitor lokaler.no holds #4
booking system utleie
leie møterom
bookingsystem for utleie
```

Goal 2 is as much about tracking more keywords as about ranking them: only 8
keywords are rank-tracked at all today, at avg position 29.1. Expanding
`seo-targets.yaml` is *part* of that goal, not a way around it — but each
keyword × device is a paid API call per collector per run, so read the `budget:`
block in that file before adding a batch.

### AEO — #1 means being inside Google's own answer, not beneath it

| Goal | Metric | Target | By | Baseline 2026-08-24 |
|---|---|---|---|---|
| Cited in most AI Overviews that appear | `ai_citation_rate` | `>= 0.60` | 2027-03-31 | **0.00** — an AI Overview appears on 9 of 16 tracked keyword-device pairs and cites us on none |

Ranking beneath an answer that never names us is worth less than the position
number suggests. `ai_answer_presence` (9/16 = 0.56) is context, not a win — it
tells us how much of the SERP is even contestable this way.

### GEO — #1 means being named when a chat engine answers the question

| Goal | Metric | Target | By | Baseline 2026-08-24 |
|---|---|---|---|---|
| Brand named in half of chat-engine answers | `geo_mention_rate` | `>= 0.50` | 2027-06-30 | **unmeasured — no probe has ever asked** |

Across ChatGPT, Perplexity, Gemini and Claude, on a fixed prompt set. Nobody
types "leie selskapslokale" into a chat engine; they type *"hvor kan jeg leie
selskapslokale i Oslo?"*. So GEO is keyed by a **prompt**, not a keyword, and it
needs its own probe and its own budget. `growth.geo_answers`
(`003_geo_answer_engines.sql`) is the table; `geo_citation_rate` (linked, not
merely named) is tracked beside it.

## The measured baseline, 2026-08-24

Trailing 28 days, from `growth.*`. Recorded here so progress is provable rather
than remembered.

**Search, whole property**

| | |
|---|---|
| Clicks | 21 |
| Impressions | 7,150 |
| CTR | 0.29% |
| Avg position | 29.1 |
| Distinct GSC queries | 1,032 |
| Keywords rank-tracked | 8 |
| Sitemap URLs | 460 |
| Pages earning any traffic | 10 |

1,032 queries earning 21 clicks is the whole story in one line: the site is
*seen* and not *clicked*.

**Per site**

| Site | Impressions | Clicks | Avg position | Queries |
|---|---|---|---|---|
| digilist-www | 6,554 | 19 | 31.0 | 1,032 |
| xala-www | 592 | 2 | 26.8 | 47 |
| digilist-app | 2 | 0 | — | 1 |

The marketplace (`app.digilist.no`) is effectively unindexed.

**AEO** — AI Overview present on 9 of 16 keyword-device pairs; we are cited in
0. `growth.ai_answers.competitors_cited` is empty on every row, so "who *is*
cited" is currently unknown, not zero.

**GEO** — not instrumented.

**Competitor** — lokaler.no: 4 keywords, avg position 12.3, holding #2/#3/#4 on
three of our six money terms.

## What the baseline says to do first

Not goals — the readings that already tell us where the cheap wins are. An agent
picking work should start here.

**Striking distance: ranked well, zero clicks.** These are snippet and title
problems, not rank problems. The position is the control group for a metadata
rewrite.

```
kuvertpris                                          5.1   36 impr
lokalerbookingssystem                               5.6   44
digitalt bookingssystem                             5.9   28
loker paa nett                                      4.1   19   (verify the exact query string first)
bookingsystem kommune                               4.1   17
navnefest lokale                                    8.3   28
hvordan digitalisere booking av kommunale lokaler   4.6   24
modernisering av fagsystemer                        5.0   19
lokaler til leie tromsø                             9.8   19
lokaler til leie sandnes                            9.7   19
padelbane                                          12.5   36   (page 2 — this one IS a rank problem)
```

**Top impression pages.**

```
/en/leie/kontorlokaler              753 impr,  0 clicks, pos 45.8   was Disallow'd
/lokaler-til-leie/trondheim         409 impr,  0 clicks, pos 32.4
/leie                               381 impr,  2 clicks, pos 22.2
/lokaler-til-leie/drammen           274 impr,  3 clicks, pos 17.5
/en/booking-av-lokaler-og-moterom   209 impr,  0 clicks, pos 66.7   was Disallow'd too
```

Our single biggest impression source could not be clicked. A `Disallow`'d URL is
still indexed — as a URL-only listing with no title and no snippet — so its CTR
is structurally 0%, and `Disallow` *also* stops Google from ever seeing a
`noindex` tag on that page, which is why neither URL could be removed either.

**The `Disallow: /en/` block was deleted on 2026-08-24**, so these readings are
the baseline *before* the fix, not a description of the current config. Both URLs
are now crawlable and answer for themselves: `/en/leie/kontorlokaler` is a
prerendered `noindex, follow` stub canonical to `/leie/kontorlokaler`, so the 753
impressions should decay toward zero as Google drops the URL and consolidates
onto the Norwegian page. Do not read that decay as a regression — it is the
intended outcome. `/en/booking-av-lokaler-og-moterom` is in `TRANSLATED_PATHS`,
has English copy, and was blocked by the same rule; it is now indexable and in
`sitemap.xml`, so it is the one of the two that should *gain*.

See `CLAUDE.md` → *The `/en` trap* and the comment block in `public/robots.txt`
for the full reasoning. There is no `Allow` list to keep in step any more.

## Known blockers — read before claiming a number moved

Named honestly, because a goal with an unmeasurable metric looks identical to a
goal we are failing.

1. **GEO cannot be measured at all yet.** No answer-engine probe collector
   exists — `collectors/src/collectors/` holds `dataforseo`, `serpapi` and
   `search-console`, and nothing else. `answer_engines:` entries in
   `seo-targets.yaml` are `enabled: false` documentation. The prompt set does
   not exist either: `growth.geo_answers` is keyed by `prompt_id`, and chat
   answers are non-deterministic, so a `geo_prompts:` block with stable slugs
   and several runs per prompt per day has to land with the probe. Until then
   `geo_mention_rate` shows `NULL`, which is the honest reading.

2. **The six commercial goal rows are seeded against `site = 'digilist-app'`,
   but the keywords in `seo-targets.yaml` point at `digilist-www`.**
   `v_goal_progress` joins on site, so those six goals will read `NULL`
   current_value forever until one side is corrected. Fix one side deliberately
   — do not "just make the join work". Note also that `growth.serp_rank`'s
   primary key does not include `site`, so correcting the YAML does not rewrite
   rows already written today; a backfill `UPDATE` is needed.

3. **`growth.ai_answers.competitors_cited` is empty on every row.** SerpAPI
   returns the AI Overview as a stub carrying a `page_token`; the sources array
   needs a second, deferred call. So *"cited in 0"* is unconfirmed rather than
   proven, and every AEO reading taken before that fix should be treated as
   provisional.

4. **The backlink gap against lokaler.no is unmeasured.** `growth.backlinks` and
   `growth.referring_domains` exist (`004_backlinks.sql`), but no collector
   fills them. Their lead may be authority rather than on-page, and we currently
   cannot tell — which means we cannot say whether any of the six commercial
   keywords are reachable by content work alone.

5. **growth-fleet is only half-installed in this repo.** A
   `xaheen.config.json` now exists at the root, so `core/host.ts` can resolve
   this project — but there is still no `.xaheen/` directory, no agent has run
   here, and nothing writes to `growth.agent_runs` / `growth.agent_findings`
   (`005_agent_findings.sql`), which are the seam that would let the dashboards
   see what the agents found. So the eleven agents still cannot read these goals
   out of `growth.goals` or write findings back, and the observability stack and
   the agent fleet remain two systems that cannot see each other. See
   `CLAUDE.md` → *Two SEO systems*.

6. **Collector health.** `search-console` failed twice in the last 7 days, and
   `serpapi` has a run stuck in status `running`. Check
   `growth.collector_runs` before reading any "the number dropped" as a result.

## Changing a goal

1. `UPDATE growth.goals SET target_value = …, updated_at = now() WHERE …` (or
   set `status` to `achieved` / `paused` / `abandoned` — never delete a row; the
   history is the point).
2. Update `002_growth_goals.sql` so a fresh database seeds the same thing. Its
   inserts are `ON CONFLICT DO NOTHING`, so re-running it will *not* reset a
   target you have moved.
3. Update this file to explain the change and keep the baseline column intact.
   The 2026-08-24 baseline never changes — it is what makes progress provable.
