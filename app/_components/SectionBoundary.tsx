"use client";

import { unstable_catchError as catchError } from "next/error";

/**
 * Drops a single page section when its data fetch fails, leaving the rest of
 * the page standing.
 *
 * `Suspense` only handles a *pending* promise. A *rejected* one flies straight
 * past it to the nearest error boundary — so without this, one unreachable
 * MongoDB takes down the entire route, including the sections on it that touch
 * no database at all.
 *
 * Rendering nothing is deliberate, and matches what these sections already do
 * on an empty result (`if (items.length === 0) return null`). A visitor can do
 * nothing about our database being down, and a half-broken panel reads worse
 * than an absent one. The error is not swallowed: Next still logs it
 * server-side, so it stays visible in the pm2 / journald output.
 *
 * Only for supporting sections. Where listings *are* the content — /buy, /rent,
 * a suburb page — the visitor does need telling, so those fall through to
 * `app/error.tsx` instead.
 */
function DropSection() {
  return null;
}

// The type argument is given explicitly: the fallback takes no props, so there
// is nothing for `catchError` to infer them from.
export const SectionBoundary = catchError<Record<string, unknown>>(DropSection);
