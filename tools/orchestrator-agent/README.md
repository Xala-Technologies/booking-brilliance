# CTO / orchestrator-agent

Den tekniske sjefen i Digilist-agentflåten. Kjører på en HEARTBEAT: leser
flåtetilstanden, driver den menneskegodkjente arbeidskøen mot PR, resonnerer om
prioriteringer med Opus, og tildeler arbeid til riktig spesialist.

Den bygger ikke kode på nytt: den gjenbruker de eksisterende primitivene
(`runClaudeAgent`, `OpenBrain`, `LinearClient`, og spesielt `prepareApproved` +
`implementPending` fra improvements-agent). CTO-en er dirigenten, ikke en ny
utfører.

## Heartbeat-loopen

Hver syklus (`cto:run`, eller `cto:loop` med intervall):

1. **Todo-driver (den aktive delen).** Les Linear "Todo" - alt du har godkjent.
   Sorter etter Linear-prioritet (Urgent=1 forst, sa High=2, Normal=3, Low=4,
   uavgjort etter `createdAt`). For HVER Todo-sak, i prioritetsrekkefolge:
   - **Utdyp forst** nar saken er tynn eller mangler et `/loop`-mål (det normale:
     et menneske slipper en enlinjes sak i Todo). CTO-en bygger et emne fra
     tittel + beskrivelse, kjorer analyze-steget (`analyzeItem`, grunnet i
     kodegrafen via codebase-memory), og skriver en ordentlig detaljert
     beskrivelse + en selvstendig `/loop`-GOAL tilbake pa Linear-saken i
     agent-formatet (`Kjør som Claude-loop (i <repo>)` + \`\`\``/loop …`\`\`\`).
     En Todo-sak blir aldri hoppet over for manglende mål: den far et.
   - **Driv den:** `prepareApproved` lager branchen og flytter Todo -> In
     Progress, `implementPending` kjorer kodeagenten pa den delte runneren, apner
     en PR og flytter -> In Review (eller legger igjen en BLOKKERT/AVKLARING-
     kommentar + etikett hvis den star fast).
2. **Les resten av flåtetilstanden** inn i et `FleetState`-objekt: Linear-saker
   (alle tilstander, etiketter, prioritet), Open Brain (emner/vurderinger/
   forberedte/lærdommer), apne PR-er pa tvers av Digilist-repoene via `gh`
   (sjekker, review-verdikt).
3. **Resonnering (Opus via `runClaudeAgent`).** Avgjor hva som betyr noe nå,
   hvilken spesialist som bor eie hver ikke-Todo-sak, foreslatt prioritet/
   alvorlighet, og blokkeringer som trenger deg. Returnerer en strukturert plan
   `{ assignments, blockers, summary }`.
4. **Handlinger - kun de trygge delene.** Sett Linear-prioritet/etiketter,
   skriv en CTO-briefing, lagre plan + lærdommer i Open Brain, og loft
   blokkeringer opp til deg. Den driver Todo -> PR, men **merger eller deployer
   aldri**, og flytter aldri noe INN i Todo (det er din beslutning) med mindre
   `CTO_AUTOPILOT=1`.

## Rådgivende vs autopilot

- **Rådgivende (standard):** trygg by design. Todo er den menneskelige
  godkjenningsporten. CTO-en driver godkjent arbeid til en PR du gjennomgar, og
  gir rad om alt annet (tildelinger, prioritet, blokkeringer) uten a flytte noe
  inn i koen selv.
- **Autopilot (`CTO_AUTOPILOT=1`):** CTO-en far i tillegg lov til a flytte saker
  den anbefaler inn i Todo (`promote`). Den merger og deployer fortsatt aldri -
  utfallet er alltid en PR.

## Kommandoer

```bash
pnpm cto:run                 # en syklus
pnpm cto:run -- --dry-run    # les + resonner, endre ingenting
pnpm cto:run -- --no-reason  # bare driv Todo-koen (hopp over Opus-passet)
pnpm cto:run -- --limit 1    # bygg maks 1 sak denne syklusen
pnpm cto:loop                # heartbeat (CTO_INTERVAL_MIN, standard 20)
pnpm cto:test                # enhetstester (normalisering + plan-parsing)
```

## Miljøvariabler

| Variabel | Standard | Beskrivelse |
| --- | --- | --- |
| `LINEAR_API_KEY` | (påkrevd) | Personlig Linear-nøkkel |
| `LINEAR_TEAM_KEY` | `XAL` | Team |
| `IMPROVEMENTS_LINEAR_PROJECT` | `Digilist - Improvements Agent` | Prosjektet CTO-en styrer |
| `IMPROVEMENTS_APPROVE_STATE` | `Todo` | Godkjenningsporten |
| `LLM_PROVIDER` | `api` | Sett `claude-cli` for Claude Max-abonnementet |
| `CTO_REASON_MODEL` | review-modellen (Opus) | Modell for resonneringspasset |
| `CTO_INTERVAL_MIN` | `20` | Heartbeat-intervall (`<=0` = én syklus) |
| `CTO_MAX_CYCLES` | `0` | Maks antall sykluser i loopen (0 = ubegrenset) |
| `CTO_AUTOPILOT` | (av) | `1` lar CTO-en flytte saker inn i Todo |
| `CTO_REPOS` | `xalatechnologies/booking-brilliance,xalatechnologies/Digilist` | Repoer den skanner for apne PR-er |
| `CTO_BRIEFING_ISSUE` | (av) | Linear-sak (id/identifikator) å poste briefing-sammendraget som kommentar på |
| `DIGILIST_REPO_PATH` | `/root/Digilist` | Digilist-utsjekk for prepare/implement |

Briefinger skrives til `tools/orchestrator-agent/state/briefing-<sha>.md` (og
`briefing-latest.md`). Katalogen er gitignorert.

## Kjøring på VPS + systemd-timer

Runneren speiler de andre VPS-runnerne (git reset origin/main, `load-env.sh`,
`LLM_PROVIDER=claude-cli`, `unset ANTHROPIC_API_KEY`):

```bash
tools/orchestrator-agent/vps-cto-runner.sh run
tools/orchestrator-agent/vps-cto-runner.sh loop
```

Kjor Todo-driver-heartbeaten hyppig med en systemd-timer, f.eks. hvert 20.
minutt:

```ini
# /etc/systemd/system/digilist-cto.service
[Unit]
Description=Digilist CTO / orchestrator heartbeat
After=network-online.target

[Service]
Type=oneshot
ExecStart=/root/booking-brilliance/tools/orchestrator-agent/vps-cto-runner.sh run
TimeoutStartSec=0
```

```ini
# /etc/systemd/system/digilist-cto.timer
[Unit]
Description=Kjør Digilist CTO-heartbeat hvert 20. minutt

[Timer]
OnBootSec=5min
OnUnitActiveSec=20min
Persistent=true

[Install]
WantedBy=timers.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now digilist-cto.timer
```

### Forholdet til improvements-timerne

Denne heartbeaten driver hele Todo -> prepare -> implement -> PR-kjeden selv, og
kan derfor **erstatte** de separate `digilist-improvements-prepare`- og
`digilist-improvements-implement`-timerne: nar CTO-en kjorer hvert 20. minutt,
plukker den opp godkjente saker, klargjor branchene og bygger dem, akkurat som de
to timerne gjorde hver for seg.

Denne PR-en avinstallerer dem ikke. Nar du har verifisert at CTO-heartbeaten
gjor jobben i produksjon, kan du deaktivere de to gamle timerne:

```bash
sudo systemctl disable --now digilist-improvements-prepare.timer
sudo systemctl disable --now digilist-improvements-implement.timer
```

`digilist-improvements-run.timer` (analyse + arkivering av nye forslag) er et
eget steg og bor sta.

## Design

- `src/state.ts` - samler `FleetState` (Linear + Open Brain + `gh`-PR-er) og
  normaliserer det. Rene hjelpere (`normalizeIssue`, `sortIssuesByPriority`,
  `classifyChecks`, `normalizePr`) er enhetstestet uten nettverk.
- `src/drive.ts` - Todo -> utdyp -> prepare -> implement-loopen. Gjenbruker
  `analyzeItem`, `goalMarkdown`, `prepareApproved` og `implementPending`.
- `src/orchestrate.ts` - Opus-resonnering -> plan. `buildReasoningPrompt` og
  `parsePlan` er rene og testet.
- `src/briefing.ts` - skriver den menneskelesbare briefingen.
- `src/run.ts` - `cto:run`, en syklus. `src/loop.ts` - `cto:loop`, heartbeaten.
