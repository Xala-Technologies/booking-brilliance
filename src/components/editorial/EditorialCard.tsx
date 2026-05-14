import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface EditorialCardProps {
  children: ReactNode;
  bleed?: boolean;
  inverted?: boolean;
  className?: string;
  as?: "div" | "article" | "section";
}

export function EditorialCard({
  children,
  bleed = false,
  inverted = false,
  className,
  as: Tag = "div",
}: EditorialCardProps) {
  return (
    <Tag
      className={cn(
        "rounded-sm",
        bleed ? "p-0 overflow-hidden" : "p-8 lg:p-10",
        "border-hairline",
        inverted
          ? "bg-navy text-on-navy border-on-navy/20"
          : "bg-paper border-rule",
        className
      )}
    >
      {children}
    </Tag>
  );
}
