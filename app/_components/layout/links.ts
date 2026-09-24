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
