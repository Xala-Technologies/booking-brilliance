/**
 * /admin/intelligence — Ecosystem Overview page.
 * Top: page hero + KPI tile row.
 * Below: surface tiles per active target.
 */
import { useOutletContext } from "react-router-dom";
import { useMemo } from "react";
import { useMutation, useQuery } from "convex/react";
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Loader2,
  TrendingUp,
} from "lucide-react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import {
  AUDIT_LABEL,
  ENV_LABEL,
  SURFACE_LABEL,
  adminToken,
  getEcosystemKpis,
  type AuditType,
  type IntelligenceCtx,
  type LatestRun,
  type RecentRun,
  scoreClass,
} from "./intelligence-shared";

interface AlertRow {
  _id: Id<"alerts">;
  kind: string;
  surface: string;
  audit_type: string;
  severity: "error" | "warn";
  title: string;
  detail: string;
  first_seen_at: string;
  last_seen_at: string;
  occurrence_count: number;
}

export default function IntelligenceOverview() {
  const { snap, running, runScan } = useOutletContext<IntelligenceCtx>();

  const byTarget = useMemo(() => {
    const m = new Map<string, LatestRun[]>();
    if (!snap) return m;
    for (const r of snap.latest) {
      const arr = m.get(r.target_name) ?? [];
      arr.push(r);
      m.set(r.target_name, arr);
    }
    return m;
  }, [snap]);

  if (!snap) {
    return (
      <div className="flex items-center gap-2 text-ink-soft">
        <Loader2 className="h-4 w-4 animate-spin" /> Henter status…
      </div>
    );
  }

  // SINGLE SOURCE OF TRUTH — every KPI on this page reads from the
  // same helper that the shell's top bar + sidebar use. Numbers are
  // computed once in Convex (convex/audits/state.ts).
  const kpis = getEcosystemKpis(snap);
  const activeCount = kpis?.surfacesTotal ?? 0;

  return (
    <div>
      <header className="mb-10 flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="editorial-mono-caption text-accent-text mb-2">
            ØKOSYSTEM-OVERSIKT
          </p>
          <h2
            className="font-serif text-4xl lg:text-5xl xl:text-6xl text-ink leading-[1.04]"
            style={{ fontVariationSettings: '"opsz" 96, "wght" 480' }}
          >
            Oversikt
          </h2>
          <p className="text-base text-ink mt-3 max-w-prose leading-relaxed">
            Live status på tvers av {activeCount} aktive overflater i
            Digilist-økosystemet. Skanninger kjøres automatisk hver natt
            og kan startes manuelt per overflate eller for hele systemet.
          </p>
        </div>
        {kpis && (
          <div className="flex items-center gap-3">
            <Badge
              icon={CheckCircle2}
              label="SUNNE"
              value={`${kpis.surfacesHealthy}/${kpis.surfacesTotal}`}
              tone={
                kpis.surfacesWithErrors === 0
                  ? "good"
                  : kpis.surfacesWithErrors >= 2
                    ? "bad"
                    : "warn"
              }
            />
            <Badge
              icon={TrendingUp}
              label="SNITT"
              value={kpis.avgScore}
              tone={
                kpis.avgScore >= 85
                  ? "good"
                  : kpis.avgScore >= 60
                    ? "warn"
                    : "bad"
              }
            />
          </div>
        )}
      </header>

      {kpis && (
        <section className="mb-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-rule border border-rule">
            {[
              {
                label: "Overflater aktive",
                value: kpis.surfacesTotal,
                sub: `${kpis.surfacesHealthy} sunne · ${kpis.surfacesWithErrors} med feil`,
                tone: undefined as string | undefined,
              },
              {
                label: "Snittscore",
                value: kpis.avgScore,
                sub: "på tvers av siste skanninger",
                tone: undefined,
              },
              {
                label: "Feil",
                value: kpis.errorCount,
                sub: "krever umiddelbar handling",
                tone:
                  kpis.errorCount > 0
                    ? "text-red-700 dark:text-red-400"
                    : undefined,
              },
              {
                label: "Advarsler",
                value: kpis.warnCount,
                sub: "anbefalt utbedring",
                tone:
                  kpis.warnCount > 0
                    ? "text-amber-700 dark:text-amber-400"
                    : undefined,
              },
            ].map((c) => (
              <div
                key={c.label}
                className="bg-paper p-6 lg:p-7 flex flex-col gap-2"
              >
                <p className="font-mono text-[0.6rem] tracking-widest uppercase text-ink-faint">
                  {c.label}
                </p>
                <p
                  className={cn(
                    "font-serif text-5xl lg:text-6xl font-medium leading-none mt-1",
                    c.tone ?? "text-ink",
                  )}
                >
                  {c.value}
                </p>
                <p className="text-xs text-ink mt-1">{c.sub}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <AlertsPanel />

      {snap.recent.length > 0 && (
        <section className="mb-12">
          <div className="flex items-baseline justify-between mb-4 border-b border-rule pb-3">
            <p className="editorial-mono-caption text-accent-text inline-flex items-center gap-2">
              <Clock className="h-3.5 w-3.5" /> SISTE AKTIVITET
            </p>
            <a
              href="/admin/intelligence/scans"
              className="font-mono text-[0.6rem] uppercase tracking-widest text-accent-text hover:underline decoration-hairline underline-offset-4"
            >
              SE ALLE SKANNINGER ›
            </a>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-px bg-rule border border-rule">
            {snap.recent.slice(0, 6).map((r) => (
              <ActivityTile key={r.id} run={r} />
            ))}
          </div>
        </section>
      )}

      <section>
        <div className="flex items-baseline justify-between mb-4 border-b border-rule pb-3">
          <p className="editorial-mono-caption text-accent-text">
            OVERFLATER
          </p>
          <p className="font-mono text-[0.6rem] uppercase tracking-widest text-ink-faint">
            {snap.targets.length} TOTALT · {activeCount} AKTIVE
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-rule border border-rule">
          {snap.targets.map((t) => {
            const runs = byTarget.get(t.name) ?? [];
            // Always render the canonical 6 audit columns so every card
            // has identical structure (1 row × 6 cols on desktop, 2 × 3
            // on mobile). Surfaces that don't run a given audit get an
            // explicit "—" so the grid stays aligned across cards
            // regardless of per-surface check profile.
            const ALL_AUDITS: AuditType[] = [
              "uptime",
              "performance",
              "seo",
              "a11y",
              "security",
              "links",
            ];
            const enabled = new Set<AuditType>(
              t.checks && t.checks.length > 0 ? t.checks : ALL_AUDITS,
            );
            const scores = ALL_AUDITS.map((type) => ({
              type,
              enabled: enabled.has(type),
              run: runs.find((r) => r.audit_type === type),
            }));
            // Overall only averages audits the surface actually opts into
            // — otherwise SPA-style surfaces (uptime+security only) get
            // their score halved by phantom "—" cells.
            const have = scores.filter((s) => s.enabled && s.run);
            const overall =
              have.length === 0
                ? null
                : Math.round(
                    have.reduce((sum, s) => sum + (s.run?.avg_score ?? 0), 0) /
                      have.length,
                  );
            const isRunning = running === t.name;
            return (
              <div
                key={t.name}
                className="bg-paper p-6 lg:p-7 flex flex-col gap-3 h-full"
              >
                <header className="flex items-center justify-between">
                  <span className="editorial-mono-caption text-accent-text">
                    {t.name.toUpperCase()}
                  </span>
                  <span
                    className={cn(
                      "font-mono text-[0.55rem] tracking-widest inline-flex items-center gap-1",
                      t.is_active ? "text-green-700" : "text-ink-faint",
                    )}
                  >
                    <span
                      className={cn(
                        "h-1.5 w-1.5 rounded-full",
                        t.is_active ? "bg-green-700" : "bg-ink-faint",
                      )}
                    />
                    {t.is_active ? "AKTIV" : "INAKTIV"}
                  </span>
                </header>

                <div className="flex flex-wrap items-center gap-1.5">
                  {t.type && (
                    <span className="font-mono text-[0.55rem] tracking-widest uppercase border border-hairline rounded-sm px-1.5 py-0.5 text-ink">
                      {SURFACE_LABEL[t.type]}
                    </span>
                  )}
                  {t.environment && (
                    <span
                      className={cn(
                        "font-mono text-[0.55rem] tracking-widest uppercase border rounded-sm px-1.5 py-0.5",
                        t.environment === "production"
                          ? "border-green-700 text-green-700"
                          : t.environment === "staging"
                            ? "border-amber-700 text-amber-700"
                            : "border-hairline text-ink-faint",
                      )}
                    >
                      {ENV_LABEL[t.environment]}
                    </span>
                  )}
                  {t.requiresAuth && (
                    <span className="font-mono text-[0.55rem] tracking-widest uppercase border border-hairline rounded-sm px-1.5 py-0.5 text-ink">
                      Innlogging
                    </span>
                  )}
                </div>

                <a
                  href={t.origin}
                  target="_blank"
                  rel="noopener"
                  className="font-serif text-2xl text-ink leading-[1.1] inline-flex items-baseline gap-1.5 hover:underline decoration-hairline underline-offset-4 group transition-colors"
                  style={{ fontVariationSettings: '"opsz" 36, "wght" 540' }}
                >
                  {t.label}
                  <ArrowUpRight className="h-3.5 w-3.5 text-ink-faint group-hover:text-accent-text transition-colors flex-shrink-0" />
                </a>
                <p className="text-sm text-ink-soft leading-relaxed line-clamp-2 min-h-[2.6em]">
                  {t.description}
                </p>

                {/* Hero score block — left rail with the overall number,
                    right rail with audit-type sparkline. Same layout in
                    every card so the eye can compare surfaces by
                    skimming vertically. */}
                <div className="mt-auto pt-4 border-t border-rule">
                  <div className="flex items-end justify-between gap-4 mb-3">
                    <div className="flex items-baseline gap-1.5">
                      <span
                        className={cn(
                          "font-serif text-[3.25rem] lg:text-6xl font-medium leading-none tabular-nums",
                          scoreClass(overall),
                        )}
                        style={{
                          fontVariationSettings: '"opsz" 96, "wght" 540',
                        }}
                      >
                        {overall === null ? "—" : overall}
                      </span>
                      <span className="font-mono text-[0.55rem] uppercase tracking-widest text-ink-faint">
                        /100
                      </span>
                    </div>
                    <span
                      className={cn(
                        "font-mono text-[0.55rem] uppercase tracking-widest",
                        overall === null
                          ? "text-ink-faint"
                          : overall >= 85
                            ? "text-green-700"
                            : overall >= 60
                              ? "text-amber-700"
                              : "text-red-700",
                      )}
                    >
                      {overall === null
                        ? "Ingen data"
                        : overall >= 85
                          ? "Sunn"
                          : overall >= 60
                            ? "Krever oppfølging"
                            : "Kritisk"}
                    </span>
                  </div>

                  {/* Canonical 6-cell score row — uptime, performance,
                      seo, a11y, security, links. Always six columns; the
                      cells that don't apply to this surface render as a
                      muted en-dash so cards line up vertically. */}
                  <div className="grid grid-cols-3 lg:grid-cols-6 gap-px bg-rule border border-rule rounded-sm overflow-hidden">
                    {scores.map((s) => (
                      <div
                        key={s.type}
                        className={cn(
                          "px-2 py-2.5 flex flex-col gap-0.5",
                          s.enabled
                            ? "bg-paper"
                            : "bg-paper-deep/40",
                        )}
                        title={
                          s.enabled
                            ? AUDIT_LABEL[s.type]
                            : `${AUDIT_LABEL[s.type]} — kjøres ikke på denne overflaten`
                        }
                      >
                        <p
                          className={cn(
                            "font-mono text-[0.5rem] tracking-widest uppercase truncate",
                            s.enabled ? "text-ink-faint" : "text-ink-faint/50",
                          )}
                        >
                          {AUDIT_LABEL[s.type].slice(0, 6)}
                        </p>
                        <p
                          className={cn(
                            "font-serif text-lg font-medium leading-none tabular-nums",
                            !s.enabled
                              ? "text-ink-faint/40"
                              : s.run
                                ? scoreClass(s.run.avg_score)
                                : "text-ink-faint",
                          )}
                          style={{
                            fontVariationSettings: '"opsz" 30, "wght" 520',
                          }}
                        >
                          {!s.enabled
                            ? "·"
                            : s.run
                              ? Math.round(s.run.avg_score)
                              : "—"}
                        </p>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => runScan(t.name)}
                    disabled={!t.is_active || isRunning}
                    className={cn(
                      "w-full mt-3 inline-flex items-center justify-center gap-2 rounded-sm px-3 py-2.5 text-[0.65rem] uppercase tracking-widest font-medium transition-all",
                      t.is_active
                        ? "bg-navy text-on-navy hover:bg-navy/90 hover:shadow-sm"
                        : "bg-paper-deep text-ink-faint cursor-not-allowed",
                      isRunning && "opacity-60",
                    )}
                  >
                    {isRunning ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        Skanner overflaten…
                      </>
                    ) : (
                      <>
                        <Activity className="h-3.5 w-3.5" />
                        Kjør skanning
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function ActivityTile({ run }: { run: RecentRun }) {
  const score = Math.round(run.avg_score);
  const minutesAgo = Math.max(
    0,
    Math.round((Date.now() - new Date(run.started_at).getTime()) / 60000),
  );
  const when =
    minutesAgo < 60
      ? `${minutesAgo} min siden`
      : minutesAgo < 60 * 24
        ? `${Math.round(minutesAgo / 60)}t siden`
        : `${Math.round(minutesAgo / (60 * 24))}d siden`;
  return (
    <div className="bg-paper p-4 flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between">
        <span className="editorial-mono-caption text-accent-text truncate">
          {run.target_name.toUpperCase()}
        </span>
        <span
          className={cn(
            "font-mono text-[0.55rem] uppercase tracking-widest",
            run.status === "ok"
              ? "text-green-700"
              : run.status === "error"
                ? "text-red-700"
                : "text-ink-faint",
          )}
        >
          {run.status}
        </span>
      </div>
      <p className="text-xs text-ink">{AUDIT_LABEL[run.audit_type]}</p>
      <div className="flex items-baseline justify-between mt-1 pt-2 border-t border-rule">
        <span
          className={cn(
            "font-serif text-2xl font-medium tabular-nums leading-none",
            scoreClass(run.avg_score),
          )}
        >
          {score}
        </span>
        <span className="font-mono text-[0.55rem] uppercase tracking-widest text-ink-faint">
          {when}
        </span>
      </div>
    </div>
  );
}

function Badge({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number | string;
  tone: "good" | "warn" | "bad";
}) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-3 rounded-sm px-4 py-3 border",
        tone === "good" && "bg-green-50 border-green-700/40 dark:bg-green-950/40",
        tone === "warn" && "bg-amber-50 border-amber-700/40 dark:bg-amber-950/40",
        tone === "bad" && "bg-red-50 border-red-700/40 dark:bg-red-950/40",
      )}
    >
      <Icon
        className={cn(
          "h-4 w-4 flex-shrink-0",
          tone === "good" && "text-green-700",
          tone === "warn" && "text-amber-700",
          tone === "bad" && "text-red-700",
        )}
      />
      <div className="flex flex-col leading-tight">
        <span
          className={cn(
            "font-mono text-[0.55rem] uppercase tracking-widest",
            tone === "good" && "text-green-700 dark:text-green-400",
            tone === "warn" && "text-amber-700 dark:text-amber-400",
            tone === "bad" && "text-red-700 dark:text-red-400",
          )}
        >
          {label}
        </span>
        <span
          className={cn(
            "font-serif text-lg font-medium",
            tone === "good" && "text-green-700 dark:text-green-400",
            tone === "warn" && "text-amber-700 dark:text-amber-400",
            tone === "bad" && "text-red-700 dark:text-red-400",
          )}
        >
          {value}
        </span>
      </div>
    </div>
  );
}

/**
 * Live regression alerts panel — shown on the overview directly under
 * the KPI strip so a slip is the first thing a reviewer sees. Reads
 * from convex.audits.alerts.listOpen (reactive — auto-refreshes when
 * the cron's detectRegressions runs).
 */
const ALERT_KIND_LABEL_NO: Record<string, string> = {
  "score-drop": "POENGFALL",
  "new-error": "NY FEIL",
  "uptime-down": "NEDETID",
  "ssl-expiring": "SSL UTLØPER",
};

function AlertsPanel() {
  const alerts = useQuery(api.audits.alerts.listOpen, {
    adminToken: adminToken(),
  }) as AlertRow[] | undefined;
  const resolve = useMutation(api.audits.alerts.resolve);
  if (!alerts || alerts.length === 0) return null;
  const errors = alerts.filter((a) => a.severity === "error");
  const warns = alerts.filter((a) => a.severity === "warn");
  return (
    <section className="mb-12">
      <div className="flex items-baseline justify-between mb-4 border-b border-rule pb-3">
        <p className="editorial-mono-caption text-red-700 dark:text-red-400 inline-flex items-center gap-2">
          <AlertTriangle className="h-3.5 w-3.5" /> ÅPNE VARSLER
        </p>
        <p className="font-mono text-[0.6rem] uppercase tracking-widest text-ink-faint">
          {errors.length} FEIL · {warns.length} ADVARSEL
        </p>
      </div>
      <ul className="divide-y divide-rule border-y border-rule">
        {alerts.slice(0, 8).map((a) => (
          <li
            key={a._id}
            className="grid grid-cols-1 md:grid-cols-[auto_1fr_auto] gap-3 md:gap-5 items-start py-4"
          >
            <span
              className={cn(
                "font-mono text-[0.55rem] tracking-widest uppercase rounded-sm px-2 py-1 inline-block w-fit",
                a.severity === "error"
                  ? "bg-red-700 text-on-navy"
                  : "bg-amber-700 text-on-navy",
              )}
            >
              {ALERT_KIND_LABEL_NO[a.kind] ?? a.kind}
            </span>
            <div className="min-w-0">
              <p
                className="font-serif text-base lg:text-lg text-ink leading-snug"
                style={{ fontVariationSettings: '"opsz" 24, "wght" 540' }}
              >
                {a.title}
              </p>
              <p className="text-xs text-ink-soft mt-0.5 line-clamp-1">
                {a.detail}
              </p>
              <p className="font-mono text-[0.55rem] tracking-widest uppercase text-ink-faint mt-1">
                {a.surface} · {a.audit_type} · {a.occurrence_count}×
                {a.first_seen_at !== a.last_seen_at &&
                  ` · sist ${new Date(a.last_seen_at).toLocaleString("nb-NO")}`}
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                resolve({ adminToken: adminToken(), id: a._id }).catch(() => {})
              }
              className="justify-self-start md:justify-self-end font-mono text-[0.6rem] tracking-widest uppercase border border-hairline-strong rounded-sm px-2.5 py-1.5 hover:bg-paper-deep"
            >
              Resolve
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
