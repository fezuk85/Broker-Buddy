/**
 * Server-only client for MHCLG's official "Get Energy Performance Data" API
 * (get-energy-performance-data.communities.gov.uk) — domestic EPCs, England & Wales only.
 * Scotland and Northern Ireland run separate EPC registers not covered by this API.
 *
 * This file must never run in the browser — it needs a Bearer token kept server-side (see the
 * EPC_API_TOKEN environment variable, read only by src/app/api/epc/route.ts). The token is a
 * static value from the account's "My Bearer token" page — no key/secret exchange or refresh
 * flow.
 *
 * Two-step flow, per MHCLG's technical documentation: search returns a thin summary (including
 * certificateNumber) for matching properties; the full certificate — floor area, ratings,
 * heating, construction age band etc. — has to be fetched separately per certificate number.
 *
 * Field names deliberately differ in case between the two endpoints: search responses are
 * camelCase, the certificate endpoint is snake_case. This is documented API behaviour, not a bug
 * here.
 */
import { EpcCertificate, EpcRating } from "../epcProvider";

const API_BASE = "https://api.get-energy-performance-data.communities.gov.uk";

interface DomesticSearchResult {
  certificateNumber: string;
  registrationDate: string;
  currentEnergyEfficiencyBand?: string;
  schemaType?: string;
}

interface DomesticSearchResponse {
  data: DomesticSearchResult[];
}

interface DomesticCertificateResponse {
  data: {
    current_energy_efficiency_band?: string;
    potential_energy_efficiency_band?: string;
    energy_rating_current?: number;
    energy_rating_potential?: number;
    total_floor_area?: number;
    dwelling_type?: string;
    inspection_date?: string;
    registration_date?: string;
    sap_building_parts?: Array<{ construction_age_band?: string }>;
    main_heating?: Array<{ description?: { value?: string } }>;
  };
}

function authHeaders(token: string): HeadersInit {
  return { Authorization: `Bearer ${token}`, Accept: "application/json" };
}

const VALID_RATINGS: readonly EpcRating[] = ["A", "B", "C", "D", "E", "F", "G"];

function asRating(value: string | undefined): EpcRating | undefined {
  const upper = value?.toUpperCase();
  return VALID_RATINGS.find((r) => r === upper);
}

/**
 * Looks up the most recently registered domestic EPC for a postcode and returns it mapped into
 * our EpcCertificate shape. Returns null if no certificate is found (the API returns 404 for a
 * postcode with no matches, per its docs — not an empty array).
 *
 * Note: matches by postcode only, not full address/UPRN — at a postcode covering multiple flats
 * this returns the most recently registered EPC for *any* of them, which may not be the specific
 * property. Full address/UPRN matching is a Phase 2 improvement once HMLR/UPRN matching exists.
 */
export async function fetchDomesticEpcForPostcode(
  postcode: string,
  token: string,
  fetchImpl: typeof fetch = fetch
): Promise<EpcCertificate | null> {
  const searchParams = new URLSearchParams({ postcode: postcode.trim().toUpperCase(), page_size: "50" });
  const searchRes = await fetchImpl(`${API_BASE}/api/domestic/search?${searchParams.toString()}`, {
    headers: authHeaders(token),
  });

  if (searchRes.status === 404) return null;
  if (!searchRes.ok) throw new Error(`EPC search failed with status ${searchRes.status}`);

  const searchBody = (await searchRes.json()) as DomesticSearchResponse;
  const results = searchBody.data ?? [];
  if (results.length === 0) return null;

  const mostRecent = [...results].sort((a, b) => (a.registrationDate < b.registrationDate ? 1 : -1))[0];

  const certParams = new URLSearchParams({ certificate_number: mostRecent.certificateNumber });
  const certRes = await fetchImpl(`${API_BASE}/api/certificate?${certParams.toString()}`, {
    headers: authHeaders(token),
  });

  if (!certRes.ok) throw new Error(`EPC certificate fetch failed with status ${certRes.status}`);

  const certBody = (await certRes.json()) as DomesticCertificateResponse;
  return mapDomesticCertificate(certBody.data);
}

/** Pure mapping from the API's raw snake_case certificate fields to our EpcCertificate shape. */
export function mapDomesticCertificate(raw: DomesticCertificateResponse["data"]): EpcCertificate | null {
  const currentRating = asRating(raw.current_energy_efficiency_band);
  const potentialRating = asRating(raw.potential_energy_efficiency_band);
  const certificateDate = raw.inspection_date ?? raw.registration_date;

  // The two fields our disclaimers/consumers treat as required — without them there's nothing
  // useful to show, so don't return a half-populated certificate.
  if (!currentRating || !potentialRating || !certificateDate) return null;

  return {
    currentRating,
    potentialRating,
    certificateDate,
    totalFloorAreaSqm: raw.total_floor_area ?? 0,
    propertyType: raw.dwelling_type ?? "Not stated",
    // construction_age_band is a raw enum code (e.g. "M"), not a decoded date range — decoding
    // it requires an extra call to the API's /api/codes/info endpoint per schema version, not
    // yet implemented. Shown as-is in the UI, clearly labelled as a code.
    constructionAgeBand: raw.sap_building_parts?.[0]?.construction_age_band,
    mainHeatingType: raw.main_heating?.[0]?.description?.value,
    currentEnergyEfficiencyScore: raw.energy_rating_current,
    potentialEnergyEfficiencyScore: raw.energy_rating_potential,
  };
}
