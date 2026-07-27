import Link from "next/link";

export type Crumb = { label: string; href?: string };

export function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="font-display text-[13px] sm:text-[14px] font-medium text-brand-bunker/70"
    >
      <ol className="flex items-center gap-[6px]">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={`${item.label}-${i}`} className="flex items-center gap-[6px]">
              {item.href && !isLast ? (
                <Link href={item.href} className="hover:underline">
                  {item.label}
                </Link>
              ) : (
                <span className={isLast ? "text-brand-bunker" : ""}>{item.label}</span>
              )}
              {!isLast && <span aria-hidden className="text-brand-bunker/40">{">"}</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
