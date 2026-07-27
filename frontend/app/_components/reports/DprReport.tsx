import Script from "next/script";

/**
 * LeadPlus Digital Property Report (DPR) integration.
 *
 * Renders the mount point the widget hydrates into, then loads the
 * third-party loader script. `next/script` dedupes by `src`, so the
 * loader is only fetched once even across client navigations.
 *
 * Integration snippet (per LeadPlus guide):
 *   <div id="daintegration" data-cid="943"></div>
 *   <script src="https://dpr.leadplus.com.au/main.js"></script>
 */
export function DprReport({ cid = "943" }: { cid?: string }) {
  return (
    <>
      <div id="daintegration" data-cid={cid} />
      <Script src="https://dpr.leadplus.com.au/main.js" strategy="afterInteractive" />
    </>
  );
}
