import { ElementType, HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { getFraunces, FrauncesSize } from "@/lib/fonts";

// Extends the intrinsic heading attributes so callers can pass `id` (anchor
// targets), `aria-label` (the hero's rotating word needs a stable accessible
// name) and `style` (per-page font-variation overrides). Before this, those
// three were type errors at eleven call sites.
interface EditorialHeadingProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  size?: "hero" | "display" | "section" | "sub";
  children: ReactNode;
  className?: string;
}

const SIZE_CLASSES: Record<NonNullable<EditorialHeadingProps["size"]>, string> = {
  hero: "text-4xl md:text-5xl lg:text-6xl tracking-tight",
  display: "text-3xl md:text-4xl lg:text-5xl tracking-tight",
  section: "text-2xl md:text-3xl lg:text-4xl tracking-tight",
  sub: "text-lg md:text-xl",
};

const SIZE_TO_FRAUNCES: Record<NonNullable<EditorialHeadingProps["size"]>, FrauncesSize> = {
  hero: "hero",
  display: "display",
  section: "section",
  sub: "sub",
};

export function EditorialHeading({
  as: Tag = "h2",
  size = "section",
  children,
  className,
  style,
  ...rest
}: EditorialHeadingProps) {
  const variation = getFraunces(SIZE_TO_FRAUNCES[size]);

  return (
    <Tag
      className={cn(
        "font-serif text-ink",
        SIZE_CLASSES[size],
        size === "sub" && "italic",
        className
      )}
      style={{
        fontVariationSettings: variation,
        lineHeight: size === "hero" ? 1.0 : size === "display" ? 1.02 : 1.08,
        letterSpacing: size === "hero" ? "-0.02em" : "-0.015em",
        // Caller-supplied style wins — pages override fontVariationSettings.
        ...style,
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
