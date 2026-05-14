import { cn } from "@/lib/utils";

interface SectionRuleProps {
  label?: string;
  align?: "left" | "center" | "right";
  className?: string;
}

export function SectionRule({ label, align = "left", className }: SectionRuleProps) {
  if (!label) {
    return <div className={cn("rule-h my-8", className)} />;
  }

  const alignment =
    align === "center"
      ? "justify-center"
      : align === "right"
      ? "justify-end"
      : "justify-start";

  return (
    <div className={cn("flex items-center gap-6 mb-10 lg:mb-12", alignment, className)}>
      {align !== "left" && <div className="flex-1 h-px bg-rule" />}
      <span className="editorial-mono-caption whitespace-nowrap">{label}</span>
      {align !== "right" && <div className="flex-1 h-px bg-rule" />}
    </div>
  );
}
