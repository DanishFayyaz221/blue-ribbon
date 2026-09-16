"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/**
 * Page-open animation: the page's content fades in and settles up over
 * ~0.8s (see `.page-enter` in globals.css) every time a page opens — on
 * first load and on every navigation.
 *
 * Keyed on the path, not the full URL: a new path remounts the wrapper and
 * replays the entrance, while a search on Buy or Rent, which only changes
 * the query string, keeps the wrapper and leaves the in-place results update
 * to do its own thing.
 *
 * The transform lives on the wrapper only for the animation's duration and
 * ends at `none`, so fixed elements (the menu sheet, modals) are not caught
 * in a transformed ancestor once the page is at rest.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return (
    <div key={pathname} className="page-enter">
      {children}
    </div>
  );
}
