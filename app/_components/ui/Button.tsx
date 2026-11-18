import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

type Variant = "primary" | "outline" | "outline-dark" | "ghost" | "white" | "navy-to-white";
type Size = "sm" | "md" | "lg" | "xl";

const base =
  "group relative isolate inline-flex items-center justify-center gap-[8px] overflow-hidden font-display font-medium outline-none transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-sky/60";

const variants: Record<Variant, string> = {
  primary:
    "bg-brand-navy text-white before:absolute before:-inset-px before:z-0 before:translate-y-full before:bg-brand-navy-deep before:transition-transform before:duration-400 before:ease-[cubic-bezier(0.65,0,0.35,1)] hover:before:translate-y-0",
  outline:
    "border border-white text-white before:absolute before:-inset-px before:z-0 before:translate-y-full before:bg-white/15 before:transition-transform before:duration-400 before:ease-[cubic-bezier(0.65,0,0.35,1)] hover:before:translate-y-0",
  "outline-dark":
    "border border-brand-navy text-brand-navy before:absolute before:-inset-px before:z-0 before:translate-y-full before:bg-brand-navy before:transition-transform before:duration-400 before:ease-[cubic-bezier(0.65,0,0.35,1)] hover:text-white hover:before:translate-y-0",
  ghost: "text-brand-navy hover:opacity-70",
  white:
    "bg-white text-black before:absolute before:-inset-px before:z-0 before:translate-y-full before:bg-brand-navy before:transition-transform before:duration-400 before:ease-[cubic-bezier(0.65,0,0.35,1)] hover:bg-brand-navy hover:text-white hover:before:translate-y-0",
  // Navy at rest; on hover white slides up and the label turns navy. The
  // white fill stops inside the navy border (`inset-0`, not `-inset-px`), so
  // the button keeps its edge when it turns white on a white page.
  "navy-to-white":
    "border border-brand-navy bg-brand-navy text-white before:absolute before:inset-0 before:z-0 before:translate-y-full before:bg-white before:transition-transform before:duration-400 before:ease-[cubic-bezier(0.65,0,0.35,1)] hover:text-brand-navy hover:before:translate-y-0",
};

const sizes: Record<Size, string> = {
  sm: "h-[44px] px-6 rounded-[18px] text-sm",
  md: "h-[56px] px-7 rounded-[20px] text-[15px]",
  lg: "h-[60px] sm:h-[68px] lg:h-[72px] px-7 rounded-[22px] lg:rounded-[24px] text-[15px] sm:text-[17px] lg:text-[19px]",
  // Scales with the viewport up to the Ven banner's 1920 comp (83px tall,
  // 22px label). Used where the button sits on a full-width photo banner.
  xl: "h-[48px] px-[22px] rounded-[16px] text-[15px] sm:h-[clamp(44px,4.31vw,83px)] sm:px-[clamp(18px,2.13vw,41px)] sm:rounded-[clamp(14px,1.25vw,24px)] sm:text-[clamp(14px,1.16vw,22px)]",
};

// The arrow keeps its 14px at every size except xl, where it grows with the
// label (21px at 1920, as in the comp).
const arrowSizes: Record<Size, string> = {
  sm: "h-[14px] w-[14px]",
  md: "h-[14px] w-[14px]",
  lg: "h-[14px] w-[14px]",
  xl: "h-[14px] w-[14px] sm:h-[clamp(14px,1.08vw,21px)] sm:w-[clamp(14px,1.08vw,21px)]",
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
        <span className="relative z-10 inline-flex items-center gap-[8px]">
          {children}
          <ArrowIcon className={arrowSizes[size]} />
        </span>
      </Link>
    );
  }

  const { ...rest } = props as ButtonProps;
  return (
    <button type="button" {...rest} className={cls}>
      <span className="relative z-10 inline-flex items-center gap-[8px]">
        {children}
        <ArrowIcon className={arrowSizes[size]} />
      </span>
    </button>
  );
}

function ArrowIcon({ className }: { className: string }) {
  return (
    <span
      aria-hidden
      className={`relative inline-flex shrink-0 overflow-hidden ${className}`}
    >
      <svg
        viewBox="0 0 24 24"
        className="absolute inset-0 h-full w-full transition-transform duration-400 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:-translate-y-full"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="7" y1="17" x2="17" y2="7" />
        <polyline points="9 7 17 7 17 15" />
      </svg>
      <svg
        viewBox="0 0 24 24"
        className="absolute inset-0 h-full w-full translate-y-full transition-transform duration-400 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:translate-y-0"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="7" y1="17" x2="17" y2="7" />
        <polyline points="9 7 17 7 17 15" />
      </svg>
    </span>
  );
}
