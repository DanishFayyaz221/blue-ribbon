import Link from "next/link";

type Props = {
  page: number;
  totalPages: number;
  /** Route to link to, e.g. "/buy". */
  basePath: string;
  /**
   * Active filters to carry across pages. Without these, clicking "next"
   * silently drops the user's search and shows unfiltered results.
   */
  params?: Record<string, string | undefined>;
};

/**
 * Link-based pagination for server-rendered listing pages.
 *
 * The existing `Pagination` component holds its page in local state, which
 * cannot drive a server query. This renders real navigations so each page is
 * a shareable, crawlable URL.
 */
export function PagerLinks({ page, totalPages, basePath, params = {} }: Props) {
  if (totalPages <= 1) return null;

  const href = (p: number) => {
    const search = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value) search.set(key, value);
    }
    if (p > 1) search.set("page", String(p));
    const qs = search.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  };
  const arrow =
    "flex h-[20px] w-[20px] items-center justify-center text-brand-bunker transition hover:text-brand-navy";
  const disabled = "flex h-[20px] w-[20px] items-center justify-center opacity-30";

  return (
    <nav aria-label="Pagination" className="flex justify-center">
      <div className="flex items-center gap-[18px] rounded-full border border-brand-silver px-[20px] py-[10px]">
        {page > 1 ? (
          <Link href={href(page - 1)} aria-label="Previous page" className={arrow}>
            <Chevron direction="left" />
          </Link>
        ) : (
          <span className={disabled} aria-hidden>
            <Chevron direction="left" />
          </span>
        )}

        <span className="font-display text-[14px] font-medium text-brand-bunker tabular-nums">
          {page} / {totalPages}
        </span>

        {page < totalPages ? (
          <Link href={href(page + 1)} aria-label="Next page" className={arrow}>
            <Chevron direction="right" />
          </Link>
        ) : (
          <span className={disabled} aria-hidden>
            <Chevron direction="right" />
          </span>
        )}
      </div>
    </nav>
  );
}

function Chevron({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[16px] w-[16px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <polyline points={direction === "left" ? "15 18 9 12 15 6" : "9 18 15 12 9 6"} />
    </svg>
  );
}
