import { ButtonHTMLAttributes, AnchorHTMLAttributes, forwardRef, ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "outline" | "link" | "inverted";
type Size = "sm" | "md" | "lg";

interface CommonProps {
  variant?: Variant;
  size?: Size;
  icon?: ReactNode | boolean;
  children: ReactNode;
  className?: string;
}

type ButtonOnly = ButtonHTMLAttributes<HTMLButtonElement> &
  CommonProps & { href?: undefined };
type AnchorOnly = AnchorHTMLAttributes<HTMLAnchorElement> &
  CommonProps & { href: string };

type EditorialButtonProps = ButtonOnly | AnchorOnly;

const VARIANT_CLASSES: Record<Variant, string> = {
  primary:
    "bg-navy text-on-navy border border-navy hover:bg-navy-soft hover:border-navy-soft",
  outline:
    "bg-transparent text-ink border border-hairline-strong hover:bg-paper-deep",
  inverted:
    "bg-paper text-ink border border-paper hover:bg-paper-deep",
  link:
    "bg-transparent text-ink border-0 px-0 hover:underline underline-offset-8 decoration-[0.5px]",
};

const SIZE_CLASSES: Record<Size, string> = {
  sm: "text-xs px-4 py-2 gap-2",
  md: "text-sm px-5 py-3 gap-2.5",
  lg: "text-sm px-6 py-4 gap-3",
};

const BASE =
  "group inline-flex items-center justify-center rounded-sm font-sans uppercase tracking-widest font-medium transition-colors duration-quick ease-editorial focus:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2 focus-visible:ring-offset-paper";

export const EditorialButton = forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  EditorialButtonProps
>((props, ref) => {
  const {
    variant = "primary",
    size = "md",
    icon = true,
    children,
    className,
    ...rest
  } = props;

  const showIcon = icon === true || (icon && icon !== false);
  const iconNode =
    icon === true || icon === undefined ? (
      <ArrowUpRight
        className="h-4 w-4 transition-transform duration-quick ease-editorial group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        aria-hidden="true"
      />
    ) : (
      icon
    );

  const classes = cn(
    BASE,
    VARIANT_CLASSES[variant],
    SIZE_CLASSES[size],
    className
  );

  if ("href" in rest && rest.href !== undefined) {
    return (
      <a
        ref={ref as React.Ref<HTMLAnchorElement>}
        className={classes}
        {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        <span>{children}</span>
        {showIcon && iconNode}
      </a>
    );
  }

  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      className={classes}
      {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      <span>{children}</span>
      {showIcon && iconNode}
    </button>
  );
});

EditorialButton.displayName = "EditorialButton";
