/**
 * Lookup against HM Land Registry's UK House Price Index (UK HPI) — England & Wales local
 * authority districts only (see src/lib/data/ukhpi/localAuthorityIndex.json for extraction
 * notes: full historic CSV download, `Index` column, filtered to England unitary/district/
 * metropolitan-borough/London-borough codes (E06/E07/E08/E09) and Welsh unitary authorities
 * (W06) — the same ONS local authority codes onspdApiClient's fetchPostcodeGeography already
 * resolves a postcode to, so no separate region/slug mapping is needed.
 *
 * The index is a normalised value (January 2015 = 100), not a price — comparing the index at two
 * dates for the same area gives the real percentage price movement between them, independent of
 * absolute price level. Scotland (S12) and Northern Ireland (N09) publish on the same series but
 * aren't covered here (no ONSPD/Council Tax local-authority resolution for them yet either).
 */
import ukhpiData from "@/lib/data/ukhpi/localAuthorityIndex.json";

type IndexRow = [string, string, number]; // [areaCode, "YYYY-MM", index]

interface MonthIndex {
  yearMonth: string;
  index: number;
}

const BY_AREA = new Map<string, MonthIndex[]>();
for (const [areaCode, yearMonth, index] of ukhpiData as IndexRow[]) {
  const list = BY_AREA.get(areaCode);
  if (list) list.push({ yearMonth, index });
  else BY_AREA.set(areaCode, [{ yearMonth, index }]);
}
// Ensure chronological order so "most recent" and "at or before a date" lookups are simple scans.
for (const list of BY_AREA.values()) list.sort((a, b) => (a.yearMonth < b.yearMonth ? -1 : 1));

export interface IndexMovement {
  movementPercent: number;
  fromMonth: string;
  asOfMonth: string;
}

/**
 * Returns the real percentage price movement for a local authority between the month of
 * `sinceDateIso` and the most recent month we have index data for. If the given date is before
 * our earliest available month for that area, falls back to the earliest available month (the
 * full series starts January 1995, so this should only affect a handful of very old sales).
 * Returns null if the local authority code isn't in the dataset at all.
 */
export function getIndexMovement(areaCode: string, sinceDateIso: string): IndexMovement | null {
  const rows = BY_AREA.get(areaCode);
  if (!rows || rows.length === 0) return null;

  const sinceYearMonth = sinceDateIso.slice(0, 7);
  const fromRow = [...rows].reverse().find((r) => r.yearMonth <= sinceYearMonth) ?? rows[0];
  const toRow = rows[rows.length - 1];

  if (!(fromRow.index > 0)) return null;

  return {
    movementPercent: (toRow.index / fromRow.index - 1) * 100,
    fromMonth: fromRow.yearMonth,
    asOfMonth: toRow.yearMonth,
  };
}
