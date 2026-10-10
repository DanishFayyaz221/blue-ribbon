/**
 * Off-site addresses the chrome links to, in one place so the nav and the
 * footer cannot drift apart.
 *
 * Its own module rather than living in Footer.tsx: Nav is a client component,
 * and importing from the footer would pull that whole server component — and
 * everything it imports — into the client bundle for the sake of a string.
 */

/** Our agency profile on Rate My Agent — where the badge points. */
export const RATE_MY_AGENT_URL =
  "https://www.ratemyagent.com.au/real-estate-agency/blue-ribbon-realtors-pendle-hill-bi090/sales/overview";

/**
 * The office address as it is shown in the site chrome, on two lines.
 *
 * One constant because it was written out at four display sites and had
 * already drifted into three different forms — with and without "Suite",
 * "Street" against "St", a comma before the suburb on some and not others.
 * The next correction should land once, not four times.
 *
 * Rendered with `whitespace-pre-line`, so the newline is the line break the
 * design asks for rather than a `<br>` in every caller.
 */
export const OFFICE_ADDRESS =
  "Suite 11, 76-80 Station St,\nWentworthville NSW 2145";

/** The same address on one line, for prose and link titles. */
export const OFFICE_ADDRESS_INLINE = OFFICE_ADDRESS.replace("\n", " ");

/** Google Maps, centred on the office — what the address links to. */
export const OFFICE_MAP_URL =
  "https://maps.google.com/?q=Blue+Ribbon+Real+Estate,+11/76-80+Station+St,+Wentworthville+NSW+2145";
