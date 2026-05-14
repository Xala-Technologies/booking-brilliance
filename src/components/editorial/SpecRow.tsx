import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SpecRowProps {
  label: string;
  value: ReactNode;
  mono?: boolean;
  className?: string;
}

export function SpecRow({ label, value, mono = true, className }: SpecRowProps) {
  return (
    <div
      className={cn(
        "flex items-baseline gap-3 py-3 border-b border-rule last:border-b-0",
        className
      )}
    >
      <span
        className={cn(
          "shrink-0 text-sm uppercase tracking-widest text-ink-faint",
          mono ? "font-mono text-xs" : "font-sans"
        )}
      >
        {label}
      </span>
      <span
        aria-hidden="true"
        className="flex-1 border-b border-dotted border-rule translate-y-[-3px]"
      />
      <span
        className={cn(
          "shrink-0 text-ink text-right",
          mono ? "font-mono text-sm" : "font-serif text-base"
        )}
      >
        {value}
      </span>
    </div>
  );
}
