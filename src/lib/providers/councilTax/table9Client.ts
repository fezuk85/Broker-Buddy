/**
 * Lookup against MHCLG's "Council Tax levels set by local authorities in England 2026 to 2027"
 * statistical release, Table 9 (area council tax for a dwelling occupied by 2 adults, by band,
 * per local authority). Sourced from the release's own ODS file — see
 * src/lib/data/councilTax/table9Charges.json for how it was extracted (296 authorities,
 * verified against the release's own "Area council tax ranges from £1,028 ... to £2,765" figures).
 *
 * Keyed on the ONS local authority code (e.g. "E06000015"), which is exactly what
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

/** Returns the full band A-H charge table for a local authority, or null if the ONS code isn't in the release. */
export function getChargesForAuthority(onsCode: string): CouncilTaxCharges | null {
  const entry = BY_ONS_CODE.get(onsCode);
  if (!entry) return null;
  return { authority: entry.authority, charges: entry.charges };
}
