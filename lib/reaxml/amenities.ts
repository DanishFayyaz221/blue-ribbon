/**
 * Human-readable labels for REAXML amenity flags.
 *
 * The parser discovers amenities dynamically rather than from a fixed list, so
 * a flag Agentbox adds later still reaches the database. This map only affects
 * presentation — anything unmapped falls back to a de-camelCased version of the
 * key, so a new amenity renders sensibly instead of disappearing.
 */
export const AMENITY_LABELS: Record<string, string> = {
  airConditioning: "Air conditioning",
  alarmSystem: "Alarm system",
  balcony: "Balcony",
  broadband: "Broadband",
  builtInRobes: "Built-in robes",
  courtyard: "Courtyard",
  deck: "Deck",
  dishwasher: "Dishwasher",
  ductedCooling: "Ducted cooling",
  ductedHeating: "Ducted heating",
  evaporativeCooling: "Evaporative cooling",
  floorboards: "Floorboards",
  fullyFenced: "Fully fenced",
  gasHeating: "Gas heating",
  greyWaterSystem: "Grey water system",
  gym: "Gym",
  hydronicHeating: "Hydronic heating",
  insideSpa: "Inside spa",
  intercom: "Intercom",
  openFirePlace: "Open fireplace",
  outdoorEnt: "Outdoor entertaining",
  outsideSpa: "Outside spa",
  poolAboveGround: "Above-ground pool",
  poolInGround: "In-ground pool",
  remoteGarage: "Remote garage",
  reverseCycleAirCon: "Reverse-cycle air conditioning",
  rumpusRoom: "Rumpus room",
  secureParking: "Secure parking",
  shed: "Shed",
  solarHotWater: "Solar hot water",
  solarPanels: "Solar panels",
  splitSystemAirCon: "Split-system air conditioning",
  splitsystemHeating: "Split-system heating",
  study: "Study",
  tennisCourt: "Tennis court",
  vacuumSystem: "Ducted vacuum",
  waterTank: "Water tank",
  // Rental allowances, which live under a different element but read the same
  // way to a visitor.
  furnished: "Furnished",
  petFriendly: "Pet friendly",
  smokers: "Smoking permitted",
};

export function amenityLabel(key: string): string {
  return (
    AMENITY_LABELS[key] ??
    key
      .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
      .replace(/^./, (c) => c.toUpperCase())
  );
}

/**
 * Amenities offered as filters, in the order they appear in the search bar.
 *
 * Deliberately short: these are the ones people actually search on, and a long
 * checkbox list buries them. `petFriendly` comes from `allowances` rather than
 * `features`, and is handled separately in the query.
 */
export const FILTERABLE_AMENITIES = [
  "poolInGround",
  "airConditioning",
  "secureParking",
  "balcony",
  "study",
  "builtInRobes",
  "fullyFenced",
] as const;
