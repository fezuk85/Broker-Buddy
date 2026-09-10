/**
 * Lookup against the VOA's "Council Tax: stock of properties, 2025" release, file CTSOP1.1 —
 * counts of properties by Council Tax band, at LSOA (small area) level, as at 31 March 2025.
 * Per-property bands are legally restricted data (Commissioners for Revenue and Customs Act
 * 2005) — this is the closest legitimate open proxy: the most common ("modal") band among
 * properties in the same small area as the postcode entered, not the confirmed band for the
 * specific property. See src/lib/data/councilTax/ctsop11LsoaBands.json for extraction notes.
 *
 * Row shape: [lsoaCode, bandACount, bandBCount, ..., bandHCount]. A `null` count means the VOA
 * suppressed the value (disclosure control on small numbers) or it wasn't applicable — never
 * treated as zero, since that would bias the modal-band calculation.
 *
 * Keyed on the 2021 LSOA code (e.g. "E01013567"), which is exactly what onspdApiClient's
 * fetchPostcodeGeography returns as lsoa2021Code.
 */
import ctsop11Data from "@/lib/data/councilTax/ctsop11LsoaBands.json";
import { CouncilTaxBand } from "../councilTaxProvider";

type LsoaBandRow = [string, ...Array<number | null>];

const BANDS: CouncilTaxBand[] = ["A", "B", "C", "D", "E", "F", "G", "H"];

const BY_LSOA_CODE = new Map<string, LsoaBandRow>((ctsop11Data as LsoaBandRow[]).map((row) => [row[0], row]));

export interface AreaTypicalBand {
  band: CouncilTaxBand;
  propertyCountInBand: number;
  totalPropertiesInArea: number;
}

/**
 * Returns the most common Council Tax band among properties in the given LSOA, or null if the
 * LSOA isn't in the dataset or has no usable (non-suppressed) band counts.
 */
export function getAreaTypicalBand(lsoaCode: string): AreaTypicalBand | null {
  const row = BY_LSOA_CODE.get(lsoaCode);
  if (!row) return null;

  let bestBand: CouncilTaxBand | null = null;
  let bestCount = -1;
  let total = 0;
  for (let i = 0; i < BANDS.length; i++) {
    const count = row[i + 1] as number | null;
    if (count == null) continue;
    total += count;
    if (count > bestCount) {
      bestCount = count;
      bestBand = BANDS[i];
    }
  }

  if (!bestBand || bestCount <= 0) return null;
  return { band: bestBand, propertyCountInBand: bestCount, totalPropertiesInArea: total };
}
