import { Fragment } from "react";
import { ArrowRight } from "lucide-react";

/**
 * A small horizontal (desktop) / vertical (mobile) pipeline diagram: labelled
 * step nodes joined by arrows. Pure DOM text — crawlable for SEO, theme-aware,
 * and styled to match the editorial system. The last step is highlighted as the
 * outcome.
 */
export function AgentFlow({ steps }: { steps: string[] }) {
  return (
    <div
      className="flex flex-col lg:flex-row lg:items-stretch gap-1.5 lg:gap-0"
      role="list"
      aria-label="Slik jobber agenten, steg for steg"
    >
      {steps.map((step, i) => {
        const isLast = i === steps.length - 1;
        return (
          <Fragment key={step}>
            <div
              role="listitem"
              className={[
                "flex-1 flex items-center justify-center text-center rounded-sm px-3 py-3",
                "font-mono text-[12px] leading-snug uppercase tracking-wide",
                isLast
                  ? "bg-navy/5 border border-navy/20 text-navy"
                  : "bg-paper border border-rule text-ink-soft",
              ].join(" ")}
            >
              {step}
            </div>
            {!isLast && (
              <div className="flex items-center justify-center shrink-0 text-accent-text px-1 lg:px-1.5">
                <ArrowRight className="h-4 w-4 rotate-90 lg:rotate-0" strokeWidth={1.75} />
              </div>
            )}
          </Fragment>
        );
      })}
    </div>
  );
}

export default AgentFlow;
