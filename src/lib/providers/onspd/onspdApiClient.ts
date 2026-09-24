/**
 * Client for ONS Geography's live Postcode Directory query service (ArcGIS REST, no auth) —
 * verified live via direct requests before building. Resolves a postcode to its local authority
 * district and LSOA (2021), which Council Tax's charge-by-band and area-typical-band lookups,
 * and the UK HPI index-movement lookup, are keyed on.
 *
 * This calls the live query layer rather than importing the ~242MB quarterly ONSPD bulk file —
 * the data only changes four times a year, so results are safe to cache aggressively, but a
 * live call avoids shipping/refreshing a large dataset for Phase 1.
 *
 * Field names on the live layer are UPPERCASE (PCDS, LAD26CD, LSOA21CD) — different casing from
 * the downloadable CSVs (pcds, lad26cd, lsoa21cd). Normalised to our own lowerCamelCase shape here.
 *
 * This used to also resolve a human-readable local authority name via a second ArcGIS query
 * (LAD_APR_2025_UK_NC_v2), and failed the whole lookup if that second call didn't return a name —
 * even though nothing downstream (Council Tax, the UK HPI index-movement join) actually used the
 * name, only the LAD code. That meant a hiccup on that unrelated second endpoint silently killed
 * a perfectly good local authority code, breaking Council Tax estimates and the indexed property
 * valuation for postcodes that resolved fine. Removed — the postcode directory query alone is
 * both necessary and sufficient here.
 *
 * Both the layer index and the LAD field name have since moved: the service's queryable layer is
 * 0 ("ONSPD_LATEST_UK_Live"), not 1 (querying layer 1 returns a generic {"error":{"code":400,
 * "message":"Invalid URL"}} rather than a normal empty result, which silently broke every lookup);
 * and ONS's annual boundary refresh has rolled the local authority field from LAD25CD to LAD26CD
 * (confirmed against the live layer's own schema — GET .../FeatureServer/0?f=json — since this
 * field gets renamed every year, expect it to need updating again for LAD27CD etc.).
 */

const POSTCODE_DIRECTORY_BASE =
  "https://services1.arcgis.com/ESMARspQHYMw9BZ9/arcgis/rest/services/Online_ONS_Postcode_Directory_Live/FeatureServer/0/query";

interface ArcGisQueryResponse<T> {
  features: Array<{ attributes: T }>;
}

interface PostcodeDirectoryAttributes {
  PCDS: string;
  LAD26CD?: string;
  LSOA21CD?: string;
  LSOA11CD?: string;
  LAT?: number;
  LONG?: number;
  DOTERM?: string | null;
}

export interface PostcodeGeography {
  postcode: string;
  localAuthorityCode: string;
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
    outFields: "PCDS,LAD26CD,LSOA21CD,LSOA11CD,LAT,LONG,DOTERM",
    f: "json",
  });

  const res = await fetchImpl(`${POSTCODE_DIRECTORY_BASE}?${params.toString()}`);
  if (!res.ok) throw new Error(`ONS Postcode Directory lookup failed with status ${res.status}`);

  const body = (await res.json()) as ArcGisQueryResponse<PostcodeDirectoryAttributes>;
  const attrs = body.features?.[0]?.attributes;
  if (!attrs?.LAD26CD) return null;

  return {
    postcode: normalized,
    localAuthorityCode: attrs.LAD26CD,
    lsoa2021Code: attrs.LSOA21CD ?? undefined,
    lsoa2011Code: attrs.LSOA11CD ?? undefined,
    terminated: Boolean(attrs.DOTERM),
  };
}
