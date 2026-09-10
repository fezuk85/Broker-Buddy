/**
 * UK postcode AREA (the letter prefix before the digits, e.g. "SW" in "SW1A 1AA") to region
 * lookup — used to derive a coarse region from a property postcode without needing the full
 * ONS Postcode Directory (which isn't wired up yet; see /data-sources).
 *
 * This is a structural geography mapping (which postcode areas fall in which of the UK's 12
 * ITL1 regions) — not a live dataset, and stable over time since postcode area boundaries
 * change extremely rarely. It is intentionally coarse: postcode areas don't align perfectly
 * with region boundaries, so postcodes near a regional edge (e.g. Outer London/South East,
 * or East Midlands/West Midlands) may resolve to a neighbouring region. Good enough for a
 * cost-of-living adjustment; not precise enough for anything requiring an exact match.
 */

export const UK_REGIONS = [
  "London",
  "South East",
  "South West",
  "East of England",
  "East Midlands",
  "West Midlands",
  "Yorkshire and the Humber",
  "North West",
  "North East",
  "Wales",
  "Scotland",
  "Northern Ireland",
] as const;

export type UkRegion = (typeof UK_REGIONS)[number];

const POSTCODE_AREA_TO_REGION: Record<string, UkRegion> = {
  // London
  E: "London", EC: "London", N: "London", NW: "London", SE: "London", SW: "London", W: "London", WC: "London",
  // South East
  BN: "South East", CT: "South East", GU: "South East", ME: "South East", MK: "South East", OX: "South East",
  PO: "South East", RG: "South East", RH: "South East", SL: "South East", SO: "South East", TN: "South East",
  HP: "South East", KT: "South East", SM: "South East", TW: "South East", CR: "South East",
  // South West
  BA: "South West", BH: "South West", BS: "South West", DT: "South West", EX: "South West", GL: "South West",
  PL: "South West", SN: "South West", SP: "South West", TA: "South West", TQ: "South West", TR: "South West",
  // East of England
  AL: "East of England", CB: "East of England", CM: "East of England", CO: "East of England", EN: "East of England",
  IP: "East of England", LU: "East of England", NR: "East of England", PE: "East of England", SG: "East of England",
  SS: "East of England", WD: "East of England",
  // East Midlands
  DE: "East Midlands", DN: "East Midlands", LE: "East Midlands", LN: "East Midlands", NG: "East Midlands", NN: "East Midlands",
  // West Midlands
  B: "West Midlands", CV: "West Midlands", DY: "West Midlands", HR: "West Midlands", ST: "West Midlands",
  TF: "West Midlands", WR: "West Midlands", WS: "West Midlands", WV: "West Midlands",
  // Yorkshire and the Humber
  BD: "Yorkshire and the Humber", HD: "Yorkshire and the Humber", HG: "Yorkshire and the Humber",
  HU: "Yorkshire and the Humber", HX: "Yorkshire and the Humber", LS: "Yorkshire and the Humber",
  S: "Yorkshire and the Humber", WF: "Yorkshire and the Humber", YO: "Yorkshire and the Humber",
  // North West
  BB: "North West", BL: "North West", CA: "North West", CH: "North West", CW: "North West", FY: "North West",
  L: "North West", LA: "North West", M: "North West", OL: "North West", PR: "North West", SK: "North West",
  WA: "North West", WN: "North West",
  // North East
  DH: "North East", DL: "North East", NE: "North East", SR: "North East", TS: "North East",
  // Wales
  CF: "Wales", LD: "Wales", LL: "Wales", NP: "Wales", SA: "Wales", SY: "Wales",
  // Scotland
  AB: "Scotland", DD: "Scotland", DG: "Scotland", EH: "Scotland", FK: "Scotland", G: "Scotland", HS: "Scotland",
  IV: "Scotland", KA: "Scotland", KW: "Scotland", KY: "Scotland", ML: "Scotland", PA: "Scotland", PH: "Scotland",
  TD: "Scotland", ZE: "Scotland",
  // Northern Ireland
  BT: "Northern Ireland",
};

/** Extracts the postcode AREA (letters before the first digit), e.g. "SW1A 1AA" -> "SW". Null if unparseable. */
export function derivePostcodeArea(postcode: string): string | null {
  const cleaned = (postcode || "").trim().toUpperCase();
  const match = cleaned.match(/^([A-Z]{1,2})\d/);
  return match ? match[1] : null;
}

/** Best-effort region for a postcode. Null if the postcode is empty, unparseable, or the area isn't recognised. */
export function deriveRegionFromPostcode(postcode: string): UkRegion | null {
  const area = derivePostcodeArea(postcode);
  if (!area) return null;
  return POSTCODE_AREA_TO_REGION[area] ?? null;
}

// Standard UK postcode format (outward + inward code, e.g. "SW1A 1AA", "M1 1AE", "CF23 5PQ").
// Doesn't verify the postcode actually exists — that's what the live lookups are for — only that
// it's a complete, well-formed postcode worth sending to an external API.
const UK_POSTCODE_FORMAT = /^[A-Z]{1,2}[0-9][A-Z0-9]? ?[0-9][A-Z]{2}$/;

/**
 * Returns the postcode in standard "outward inward" form (a single space before the final 3
 * characters — the inward code is always 1 digit + 2 letters) if it's a *complete, well-formed*
 * UK postcode, otherwise undefined. Used to gate live postcode lookups (HM Land Registry,
 * Council Tax etc.) so a partial postcode typed character-by-character never gets sent to an
 * external API — without this, every keystroke while typing a postcode would fire a fresh
 * (mostly invalid) request to each connected data source.
 *
 * Normalising the spacing here (not just validating it) matters: HM Land Registry's API does an
 * exact-match postcode query, so "DE238PL" (no space, still a well-formed postcode) silently
 * returned zero results even though "DE23 8PL" has real data — fixed by always returning the
 * correctly-spaced form regardless of how the user typed it.
 */
export function asCompletePostcode(postcode: string): string | undefined {
  const cleaned = (postcode || "").trim().toUpperCase();
  if (!UK_POSTCODE_FORMAT.test(cleaned)) return undefined;
  const compact = cleaned.replace(/\s+/g, "");
  return `${compact.slice(0, -3)} ${compact.slice(-3)}`;
}
