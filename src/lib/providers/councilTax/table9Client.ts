/**
 * Lookup against official per-authority, per-band Council Tax charges — combined from two
 * separate country releases into one dataset (src/lib/data/councilTax/table9Charges.json):
 *
 * - England (296 authorities, bands A-H): MHCLG's "Council Tax levels set by local authorities
 *   in England 2026 to 2027", Table 9 (area council tax for a dwelling occupied by 2 adults, by
 *   band, per local authority) — sourced from the release's own ODS file, verified against its
 *   own "Area council tax ranges from £1,028 ... to £2,765" figures.
 * - Wales (22 authorities, bands A-I — Wales has a ninth band England doesn't): the Welsh
 *   Government/StatsWales "Council tax levels by billing authority and band" dataset, 2026-27,
 *   the "area" figure (matching England's convention: billing authority + police + community
 *   council combined). The disabled-relief "A-" reduced-band row and the Wales-wide aggregate
 *   ("Total Unitary Authorities", W92000004) are excluded — only real billing authorities.
 *
 * Scotland and Northern Ireland aren't covered — see /data-sources.
 *
 * Keyed on the ONS local authority code (e.g. "E06000015", "W06000015"), which is exactly what
 * onspdApiClient's fetchPostcodeGeography returns as localAuthorityCode.
 */
import table9Data from "@/lib/data/councilTax/table9Charges.json";
import { CouncilTaxBand } from "../councilTaxProvider";

interface Table9Entry {
  onsCode: string;
  authority: string;
  charges: Partial<Record<CouncilTaxBand, number | null>>;
}

const BY_ONS_CODE = new Map<string, Table9Entry>((table9Data as Table9Entry[]).map((e) => [e.onsCode, e]));

export interface CouncilTaxCharges {
  authority: string;
  charges: Partial<Record<CouncilTaxBand, number | null>>;
}

/** Returns the full band charge table for a local authority, or null if the ONS code isn't in either release. */
export function getChargesForAuthority(onsCode: string): CouncilTaxCharges | null {
  const entry = BY_ONS_CODE.get(onsCode);
  if (!entry) return null;
  return { authority: entry.authority, charges: entry.charges };
}
