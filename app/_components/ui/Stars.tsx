export function Stars({ rating, size = 22 }: { rating: number; size?: number }) {
  return (
    <div
      className="flex gap-[2px] leading-none text-amber-500"
      style={{ fontSize: `${size}px` }}
      aria-label={`${rating} out of 5 stars`}
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} aria-hidden className={i < rating ? "" : "text-gray-300"}>
          ★
        </span>
      ))}
    </div>
  );
}
