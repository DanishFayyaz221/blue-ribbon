/**
 * Locally-maintained agent profiles.
 *
 * The Agentbox feed supplies names, emails and phone numbers, but no photo,
 * role or biography — so those live here and are merged onto the feed data at
 * render time.
 *
 * Keyed by lowercased email, which is what the feed uses as a stable
 * identifier. Add an entry when someone joins; an agent with no entry still
 * appears on the team page using the fallback photo and role, so a missing
 * profile degrades gracefully instead of hiding a real person.
 *
 * Do not add people here who are not in the feed. Names on this page are
 * representations about who works at the agency.
 */
export type AgentProfile = {
  role: string;
  /**
   * Path to this person's own headshot. Leave undefined until you have one —
   * their initials are shown instead. Never point two people at the same
   * photo: a team page states who works here, and one colleague's face under
   * another's name is a false claim, not a placeholder.
   */
  image?: string;
  bio?: string;
  /**
   * Position in the team listing, lowest first. Without it the team is
   * ordered by how many listings each person is on, which moves with the
   * feed — so whoever happened to be busiest that week led the page, and the
   * Managing Director could sit third. Anyone with no rank follows those who
   * have one, still ordered by listing count among themselves.
   */
  order?: number;
};

export const FALLBACK_PROFILE: AgentProfile = {
  role: "Sales & Leasing",
};

export const AGENT_PROFILES: Record<string, AgentProfile> = {
  "sales@blueribbonre.com.au": {
    role: "Managing Director",
    image: "/our-team/5.png",
    order: 1,
  },
  "ritu@blueribbonre.com.au": {
    role: "Property Manager",
    image: "/our-team/8.png",
    order: 2,
  },
  "neil@blueribbonre.com.au": {
    role: "Sales Executive / L.R.E.A.",
    image: "/our-team/7.png",
    order: 3,
  },
};

export function profileFor(email: string | undefined): AgentProfile {
  if (!email) return FALLBACK_PROFILE;
  return AGENT_PROFILES[email.toLowerCase()] ?? FALLBACK_PROFILE;
}
