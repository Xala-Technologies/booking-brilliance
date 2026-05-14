import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface TrustBadgeProps {
  label: string;
  caption?: string;
  icon?: ReactNode;
  inverted?: boolean;
  className?: string;
}

export function TrustBadge({
  label,
  caption,
  icon,
  inverted = false,
  className,
}: TrustBadgeProps) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 p-4 border-hairline",
        inverted
          ? "border-paper/20 text-paper"
          : "border-rule text-ink",
        className
      )}
    >
      {icon && (
        <div className={cn("mt-0.5 shrink-0", inverted ? "text-paper" : "text-accent-text")}>
          {icon}
        </div>
      )}
      <div className="flex flex-col gap-0.5">
        <span
          className={cn(
            "font-mono text-xs uppercase tracking-widest",
            inverted ? "text-paper" : "text-ink"
          )}
        >
          {label}
        </span>
        {caption && (
          <span
            className={cn(
              "text-sm",
              inverted ? "text-paper/70" : "text-ink-faint"
            )}
          >
            {caption}
          </span>
        )}
      </div>
    </div>
  );
}
