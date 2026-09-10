/**
 * Client for ONS Geography's live Postcode Directory query service (ArcGIS REST, no auth) —
 * verified live via direct requests before building. Resolves a postcode to its local authority
 * district and LSOA (2021), which Council Tax's charge-by-band and area-typical-band lookups are
 * keyed on.
 *
 * This calls the live query layer rather than importing the ~242MB quarterly ONSPD bulk file —
 * the data only changes four times a year, so results are safe to cache aggressively, but a
 * live call avoids shipping/refreshing a large dataset for Phase 1.
 *
 * Field names on the live layer are UPPERCASE (PCDS, LAD25CD, LSOA21CD) — different casing from
 * the downloadable CSVs (pcds, lad25cd, lsoa21cd). Normalised to our own lowerCamelCase shape here.
 */

const POSTCODE_DIRECTORY_BASE =
  "https://services1.arcgis.com/ESMARspQHYMw9BZ9/arcgis/rest/services/Online_ONS_Postcode_Directory_Live/FeatureServer/1/query";
const LAD_NAMES_BASE =
  "https://services1.arcgis.com/ESMARspQHYMw9BZ9/arcgis/rest/services/LAD_APR_2025_UK_NC_v2/FeatureServer/0/query";

interface ArcGisQueryResponse<T> {
  features: Array<{ attributes: T }>;
}

interface PostcodeDirectoryAttributes {
  PCDS: string;
  LAD25CD?: string;
  LSOA21CD?: string;
  LSOA11CD?: string;
  LAT?: number;
  LONG?: number;
  DOTERM?: string | null;
}

interface LadNameAttributes {
  LAD25CD: string;
  LAD25NM: string;
}

export interface PostcodeGeography {
  postcode: string;
  localAuthorityCode: string;
  localAuthorityName: string;
  lsoa2021Code?: string;
  lsoa2011Code?: string;
  /** True if this postcode has been officially terminated (ONSPD's DOTERM field is set) — still resolvable, but flagged. */
  terminated: boolean;
}

/** Formats a postcode into the standard "outward inward" form with a single space, e.g. "de238pl" -> "DE23 8PL". */
function normalizePostcode(postcode: string): string {
  const compact = postcode.replace(/\s+/g, "").toUpperCase();
  if (compact.length < 5) return compact;
  return `${compact.slice(0, -3)} ${compact.slice(-3)}`;
}

async function queryLadName(ladCode: string, fetchImpl: typeof fetch): Promise<string | undefined> {
  const params = new URLSearchParams({
    where: `LAD25CD='${ladCode}'`,
    outFields: "LAD25CD,LAD25NM",
    f: "json",
  });
  const res = await fetchImpl(`${LAD_NAMES_BASE}?${params.toString()}`);
  if (!res.ok) return undefined;
  const body = (await res.json()) as ArcGisQueryResponse<LadNameAttributes>;
  return body.features?.[0]?.attributes?.LAD25NM;
}

/**
 * Resolves a postcode to its local authority district and LSOA via the live ONS Postcode
 * Directory query service. Returns null for a postcode with no match — never throws for a
 * not-found result, only for an actual request failure.
 */
export async function fetchPostcodeGeography(
  postcode: string,
  fetchImpl: typeof fetch = fetch
): Promise<PostcodeGeography | null> {
  const normalized = normalizePostcode(postcode);
  const params = new URLSearchParams({
    where: `PCDS='${normalized}'`,
    outFields: "PCDS,LAD25CD,LSOA21CD,LSOA11CD,LAT,LONG,DOTERM",
    f: "json",
  });

  const res = await fetchImpl(`${POSTCODE_DIRECTORY_BASE}?${params.toString()}`);
  if (!res.ok) throw new Error(`ONS Postcode Directory lookup failed with status ${res.status}`);

  const body = (await res.json()) as ArcGisQueryResponse<PostcodeDirectoryAttributes>;
  const attrs = body.features?.[0]?.attributes;
  if (!attrs?.LAD25CD) return null;

  const localAuthorityName = await queryLadName(attrs.LAD25CD, fetchImpl);
  if (!localAuthorityName) return null;

  return {
    postcode: normalized,
    localAuthorityCode: attrs.LAD25CD,
    localAuthorityName,
    lsoa2021Code: attrs.LSOA21CD ?? undefined,
    lsoa2011Code: attrs.LSOA11CD ?? undefined,
    terminated: Boolean(attrs.DOTERM),
  };
}
