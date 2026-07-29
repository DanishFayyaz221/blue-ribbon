/**
 * Parses a REAXML file and prints what came out. Run against a real Agentbox
 * delivery before trusting the schema:
 *
 *   npx tsx scripts/test-parse.ts <path-to-xml>
 */
import { readFileSync } from "node:fs";
import { parseFeed } from "../lib/reaxml/parse";

const file = process.argv[2];

if (!file) {
  console.error("usage: tsx scripts/test-parse.ts <path-to-xml>");
  process.exit(1);
}

const xml = readFileSync(file, "utf8");
const { listings, skipped } = parseFeed(xml, file, process.env.REAPIT_AGENT_ID ?? "BRB04");

console.log(`parsed ${listings.length} listing(s), skipped ${skipped.length}`);
for (const s of skipped) console.log(`  SKIP ${s.uniqueID ?? "?"} - ${s.reason}`);

for (const l of listings) {
  console.log("\n" + "=".repeat(70));
  console.log(`${l.uniqueID}  ${l.category}/${l.status}  public=${l.isPublic}`);
  console.log(`  address    ${l.address.full}`);
  console.log(`  slug       ${l.slug}`);
  console.log(`  modTime    ${l.modTime.toISOString()}`);
  console.log(`  type       ${l.propertyType}`);
  console.log(`  price      ${l.price.value} ${l.price.period ?? ""} (display=${l.price.display}) view="${l.price.view}"`);
  console.log(`  bond       ${l.bond}`);
  console.log(`  available  ${l.dateAvailable?.toISOString() ?? "-"}`);
  console.log(`  location   ${l.location ? l.location.coordinates.join(", ") : "none"}`);
  console.log(`  region     ${l.region}`);
  console.log(`  beds/bath  ${l.features.bedrooms}/${l.features.bathrooms}  parking=${l.features.totalParking}`);
  console.log(`  land/bldg  ${l.landArea?.value ?? "-"} / ${l.buildingArea?.value ?? "-"}`);
  console.log(`  amenities  ${l.features.amenities.join(", ")}`);
  console.log(`  other      ${l.features.other.join(" | ")}`);
  console.log(`  images     ${l.images.length}  floorplans ${l.floorplans.length}`);
  console.log(`  first img  ${l.images[0]?.sourceUrl ?? "-"}`);
  console.log(`  img mod    ${l.images[0]?.modTime?.toISOString() ?? "-"}`);
  console.log(`  agents     ${l.agents.map((a) => `${a.name} <${a.email}> ${a.mobile ?? ""}`).join(" | ")}`);
  console.log(`  video      ${l.videoUrl ?? "-"}`);
  console.log(`  headline   ${l.headline}`);
}

// Every delivered file carries the SFTP username and password as plaintext
// attributes on <propertyList>. Prove they never reach the stored document.
//
// The credentials are read out of the file under test rather than hardcoded,
// so this script never contains a real secret.
const serialised = JSON.stringify(listings);
const credentials = [
  /<propertyList[^>]*\busername="([^"]+)"/.exec(xml)?.[1],
  /<propertyList[^>]*\bpassword="([^"]+)"/.exec(xml)?.[1],
].filter((v): v is string => Boolean(v));

const leaked = credentials.filter((c) => serialised.includes(c));

if (credentials.length === 0) {
  console.log("\ncredential leak check: SKIPPED - no credentials in this file");
} else if (leaked.length === 0) {
  console.log(`\ncredential leak check: PASS - ${credentials.length} credential(s) stripped`);
} else {
  console.log(`\ncredential leak check: FAIL - ${leaked.length} credential(s) reached the output`);
  process.exitCode = 1;
}
