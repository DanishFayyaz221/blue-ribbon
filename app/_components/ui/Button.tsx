import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

type Variant = "primary" | "outline" | "outline-dark" | "ghost";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center font-display font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-sky";

const variants: Record<Variant, string> = {
  primary:
    "bg-brand-navy text-white hover:bg-brand-navy-deep",
  outline:
    "border border-white text-white hover:bg-white/10",
  "outline-dark":
    "border border-brand-navy text-brand-navy hover:bg-brand-navy hover:text-white",
  ghost: "text-brand-navy hover:opacity-70",
};

const sizes: Record<Size, string> = {
  sm: "h-[44px] px-6 rounded-[18px] text-sm",
  md: "h-[56px] px-7 rounded-[20px] text-[15px]",
  lg: "h-[60px] sm:h-[68px] lg:h-[72px] px-7 rounded-[22px] lg:rounded-[24px] text-[15px] sm:text-[17px] lg:text-[19px]",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
  fullWidth?: boolean;
};

type ButtonProps = CommonProps & ComponentPropsWithoutRef<"button"> & { href?: undefined };
type AnchorProps = CommonProps & { href: string };

export function Button(props: ButtonProps | AnchorProps) {
  const {
    variant = "primary",
    size = "md",
    className = "",
    fullWidth = false,
    children,
  } = props;

  const cls = `${base} ${variants[variant]} ${sizes[size]} ${fullWidth ? "w-full" : ""} ${className}`;

  if ("href" in props && props.href) {
    return (
      <Link href={props.href} className={cls}>
        {children}
      </Link>
    );
  }

  const { ...rest } = props as ButtonProps;
  return (
    <button type="button" {...rest} className={cls}>
      {children}
    </button>
  );
}
