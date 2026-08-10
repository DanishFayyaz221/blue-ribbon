"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Nav } from "./_components/layout/Nav";
import { Footer } from "./_components/layout/Footer";

/**
 * Fallback for routes whose content *is* listing data — /buy, /rent, the suburb
 * pages, a property page, /agents.
 *
 * Distinct from an empty result, which `EmptyListings` already covers and which
 * is a legitimate state on this site. This is the other case: we could not read
 * the database at all. Saying "no properties found" then would be a lie, and
 * would quietly hide an outage behind a plausible-looking page.
 *
 * `notFound()` is not caught here — Next throws a special error for it that
 * error boundaries pass through — so a genuinely unknown suburb still 404s
 * rather than landing on this screen.
 */
export default function ErrorPage({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-white">
      <Nav />
      <main>
        <div className="container-page py-[clamp(48px,6vw,110px)]">
          <div className="flex flex-col items-center rounded-[16px] border border-brand-silver/60 bg-brand-soft/30 px-[24px] py-[clamp(40px,5vw,72px)] text-center">
            <h1 className="font-display text-[clamp(18px,1.6vw,26px)] font-semibold text-brand-bunker">
              We couldn&rsquo;t load our listings
            </h1>
            <p className="mt-[10px] max-w-[460px] font-display text-[clamp(13px,0.95vw,15px)] leading-[1.6] text-brand-bunker/70">
              This is a problem on our end, not with your search. It is usually
              brief — try again in a moment.
            </p>

            <div className="mt-[22px] flex flex-col items-center gap-[12px] sm:flex-row">
              {/* Re-fetches and re-renders the server components, which a plain
                  state reset would not do — the database connection is what
                  needs retrying, not the UI. */}
              <button
                type="button"
                onClick={() => unstable_retry()}
                className="inline-flex h-[46px] items-center justify-center rounded-[23px] bg-brand-navy px-[26px] font-display text-[14px] font-semibold text-white transition hover:opacity-90"
              >
                Try again
              </button>
              <Link
                href="/"
                className="inline-flex h-[46px] items-center justify-center rounded-[23px] border border-brand-navy px-[26px] font-display text-[14px] font-semibold text-brand-navy transition hover:bg-brand-soft"
              >
                Back to home
              </Link>
            </div>

            {/* In production the real message is withheld to avoid leaking
                connection details; this digest is the only handle that ties the
                visitor's report back to the server log. */}
            {error.digest && (
              <p className="mt-[20px] font-display text-[12px] text-brand-bunker/45">
                Reference: {error.digest}
              </p>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
