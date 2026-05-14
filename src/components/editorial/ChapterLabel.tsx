import { cn } from "@/lib/utils";

interface ChapterLabelProps {
  numeral: string;
  title: string;
  active?: boolean;
  className?: string;
}

export function ChapterLabel({ numeral, title, active = false, className }: ChapterLabelProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-3 transition-colors",
        active ? "text-ink" : "text-ink-faint hover:text-ink",
        className
      )}
    >
      <span
        className={cn(
          "font-mono text-xs tracking-widest",
          active ? "text-accent-text" : "text-ink-faint"
        )}
      >
        {numeral}
      </span>
      <span className="w-px h-3 bg-rule" aria-hidden="true" />
      <span
        className={cn(
          "font-sans text-xs uppercase tracking-widest",
          active && "underline underline-offset-8 decoration-[0.5px] decoration-ink"
        )}
      >
        {title}
      </span>
    </span>
  );
}
