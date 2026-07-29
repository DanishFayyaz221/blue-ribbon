// REAXML timestamps are not ISO 8601. The documented form is
// `YYYY-MM-DD-HH:MM:SS`, but feeds in the wild also emit
// `YYYY-MM-DD HH:MM:SS` and plain ISO. Accept all three.
const REAXML_DATE = /^(\d{4})-(\d{2})-(\d{2})[-T ](\d{2}):(\d{2}):(\d{2})/;

/**
 * Parses a REAXML timestamp into a Date, or returns null if unparseable.
 *
 * REAXML carries no timezone offset. Feed timestamps are agency-local, and
 * every mutual client of this feed is Australian, so values are interpreted as
 * Australia/Sydney and stored as UTC.
 */
export function parseReaxmlDate(value: string | undefined | null): Date | null {
  if (!value) return null;

  let trimmed = String(value).trim();

  // Date-only values (`<dateAvailable>2026-07-23</dateAvailable>`) must still
  // resolve to Sydney midnight. Falling through to `new Date()` would treat
  // them as UTC and land them on the previous day locally.
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    trimmed = `${trimmed}-00:00:00`;
  }

  const match = REAXML_DATE.exec(trimmed);

  if (!match) {
    const fallback = new Date(trimmed);
    return Number.isNaN(fallback.getTime()) ? null : fallback;
  }

  const [, year, month, day, hour, minute, second] = match;

  // Sydney is UTC+10, or UTC+11 while daylight saving is active. Resolve the
  // real offset by asking Intl rather than hardcoding it.
  const naiveUtc = Date.UTC(
    Number(year),
    Number(month) - 1,
    Number(day),
    Number(hour),
    Number(minute),
    Number(second),
  );

  return new Date(naiveUtc - sydneyOffsetMs(naiveUtc));
}

const SYDNEY_PARTS = new Intl.DateTimeFormat("en-US", {
  timeZone: "Australia/Sydney",
  hour12: false,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
});

function sydneyOffsetMs(utcMs: number): number {
  const parts = SYDNEY_PARTS.formatToParts(new Date(utcMs));
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value);

  const asSydney = Date.UTC(
    get("year"),
    get("month") - 1,
    get("day"),
    // Intl renders midnight as hour 24 in some runtimes.
    get("hour") % 24,
    get("minute"),
    get("second"),
  );

  return asSydney - utcMs;
}
