/**
 * A small diagonal arrow (↗) with a slide-up hover animation.
 *
 * Drop this inside any element that has a `group` class, next to the text —
 * on hover the arrow slides up-and-out while a fresh one slides in from below,
 * matching the button hover style used across the site.
 */
export function ArrowInline() {
  return (
    <span
      aria-hidden
      className="relative ml-[6px] inline-flex h-[12px] w-[12px] shrink-0 overflow-hidden align-[-1px]"
    >
      <svg
        viewBox="0 0 24 24"
        className="absolute inset-0 h-full w-full transition-transform duration-400 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:rotate-45"
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
