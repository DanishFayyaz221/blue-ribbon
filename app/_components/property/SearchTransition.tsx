"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  createContext,
  useContext,
  useMemo,
  useTransition,
  type ComponentPropsWithoutRef,
  type FormEvent,
  type ReactNode,
} from "react";

type SearchTransition = {
  /** True while a search's new results are on their way. */
  pending: boolean;
  /** Navigate to a results URL in place, keeping the scroll position. */
  navigate: (href: string) => void;
};

const Ctx = createContext<SearchTransition | null>(null);

/**
 * In-place searching for the listing pages.
 *
 * The filters are still plain GET forms and links to shareable URLs, and the
 * server still does the filtering — but inside this provider a search is a
 * client-side navigation in a transition: the page is not reloaded, the
 * scroll position is kept, the old results stay on screen (dimmed, see
 * ResultsRegion) until the new ones arrive, and only then does the results
 * area change. Without JavaScript the forms and links work as they always
 * did.
 */
export function SearchTransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const value = useMemo<SearchTransition>(
    () => ({
      pending,
      navigate: (href) => {
        startTransition(() => {
          router.push(href, { scroll: false });
        });
      },
    }),
    [pending, router],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

/** Outside a provider a search is an ordinary navigation. */
export function useSearchTransition(): SearchTransition {
  const ctx = useContext(Ctx);
  return (
    ctx ?? {
      pending: false,
      navigate: (href) => {
        window.location.assign(href);
      },
    }
  );
}

/** Serialise a form's fields to a results URL, dropping empties and the default sort. */
export function formHref(form: HTMLFormElement, action: string): string {
  const sp = new URLSearchParams();
  for (const [key, value] of new FormData(form).entries()) {
    if (typeof value !== "string") continue;
    const v = value.trim();
    if (v) sp.append(key, v);
  }
  if (sp.get("sort") === "recent") sp.delete("sort");
  const qs = sp.toString();
  return qs ? `${action}?${qs}` : action;
}

/**
 * A GET form that searches in place. `action` and `method` stay on the form
 * so it still submits normally without JavaScript.
 */
export function SearchForm({
  action,
  children,
  ...rest
}: Omit<ComponentPropsWithoutRef<"form">, "action" | "method" | "onSubmit"> & {
  action: string;
  children: ReactNode;
}) {
  const { navigate } = useSearchTransition();
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    navigate(formHref(e.currentTarget, action));
  };
  return (
    <form action={action} method="get" onSubmit={onSubmit} {...rest}>
      {children}
    </form>
  );
}

/** A link to a results URL that searches in place. */
export function SearchLink({
  href,
  children,
  ...rest
}: Omit<ComponentPropsWithoutRef<typeof Link>, "href" | "onClick"> & {
  href: string;
  children: ReactNode;
}) {
  const { navigate } = useSearchTransition();
  return (
    <Link
      href={href}
      scroll={false}
      onClick={(e) => {
        // Let modified clicks open a new tab as usual.
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
        e.preventDefault();
        navigate(href);
      }}
      {...rest}
    >
      {children}
    </Link>
  );
}

/**
 * Wraps the results. While a search is pending the current results dim and
 * a spinner sits over them, so the change reads as this area reloading
 * rather than the page.
 */
export function ResultsRegion({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const { pending } = useSearchTransition();
  return (
    <div className={`relative ${className}`.trim()} aria-busy={pending}>
      <div
        className={`transition-opacity duration-300 ${
          pending ? "pointer-events-none opacity-40" : "opacity-100"
        }`}
      >
        {children}
      </div>
      {pending && (
        <div
          className="pointer-events-none absolute inset-x-0 top-[120px] flex justify-center"
          role="status"
          aria-live="polite"
        >
          <span className="sr-only">Loading results</span>
          <span
            aria-hidden
            className="h-[40px] w-[40px] animate-spin rounded-full border-[3px] border-brand-navy/20 border-t-brand-navy"
          />
        </div>
      )}
    </div>
  );
}
