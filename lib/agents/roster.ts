import { agentSlug, type FeedAgent } from "@/lib/db/queries";

/**
 * Colleagues the Agentbox feed does not return yet.
 *
 * `getAgents` builds the team from the listings themselves — it unwinds
 * `agents` across published properties — so someone only appears once a
 * listing carries their name. That is right for the feed's own data, but it
 * means a new starter is invisible on the team page until their first listing
 * goes live, which can be weeks.
 *
 * These entries fill that gap. They are merged with the feed, never instead
 * of it: the moment Agentbox starts returning one of these people, the feed's
 * record wins for everything the feed actually knows — name, email, phone,
 * mobile, listing count — because that is the live source and this file is a
 * hand-maintained copy that will drift. Only the role, photo and ordering,
 * which the feed does not carry at all, keep coming from
 * `lib/agents/profiles.ts`.
 *
 * Matching is by lowercased email, the same key `getAgents` groups on, so the
 * handover produces no duplicate card.
 *
 * Add someone here only when they genuinely work at the agency: a name on
 * this page is a representation about who the visitor would be dealing with.
 * Remove the entry when they leave — the feed will not do it for you, since
 * the feed never knew about them.
 */
export type RosterEntry = {
  name: string;
  email: string;
  /** As supplied by the agency. Rendered under the name on the team card. */
  mobile?: string;
};

export const LOCAL_ROSTER: RosterEntry[] = [
  {
    name: "Bal Gautam",
    email: "bal@blueribbonre.com.au",
    mobile: "0456 562 525",
  },
  {
    name: "Udaya Uppalapati",
    email: "udaya@blueribbonre.com.au",
    mobile: "0461 404 040",
  },
  {
    name: "Manish Darishetty",
    email: "manish@blueribbonre.com.au",
    mobile: "0462 626 262",
  },
];

/**
 * The feed's agents plus any roster entry the feed has not caught up with.
 *
 * Feed first and unconditionally: an entry here is dropped as soon as the
 * same email arrives from Agentbox, so the live record is what renders and
 * the two can never both produce a card.
 *
 * `listingCount: 0` is deliberate — the card hides the line entirely at zero
 * rather than claiming "0 current listings", and a roster entry has no
 * listings by definition (if they had one, the feed would be returning them).
 */
export function withLocalRoster(feed: FeedAgent[]): FeedAgent[] {
  const known = new Set(
    feed.map((a) => (a.email ?? a.name).toLowerCase()),
  );

  const extras: FeedAgent[] = LOCAL_ROSTER.filter(
    (r) => !known.has(r.email.toLowerCase()),
  ).map((r) => ({
    key: r.email.toLowerCase(),
    slug: agentSlug(r.name),
    name: r.name,
    email: r.email,
    mobile: r.mobile,
    listingCount: 0,
  }));

  return [...feed, ...extras];
}
