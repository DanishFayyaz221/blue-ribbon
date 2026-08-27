import Link from "next/link";

export type Crumb = { label: string; href?: string };

export function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav
      aria-label="Breadcrumb"
      // Row-level padding gives every crumb the same vertical hit area. An
      // inline <a>'s hover zone otherwise clings to the glyph line, so the
      // link only registered once the pointer reached the underline row.
      className="font-display text-[13px] sm:text-[14px] font-medium text-brand-bunker/70 py-[6px]"
    >
      <ol className="flex items-center gap-[6px]">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={`${item.label}-${i}`} className="flex items-center gap-[6px]">
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="inline-flex items-center self-stretch hover:underline"
                >
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
