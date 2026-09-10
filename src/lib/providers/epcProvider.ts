/**
 * EpcProvider — Energy Performance Certificate data, backed by MHCLG's official "Get Energy
 * Performance Data" API (get-energy-performance-data.communities.gov.uk) rather than scraping.
 * Domestic EPCs, England & Wales only — Scotland and Northern Ireland run separate registers.
 *
 * The real lookup (RealEpcProvider) calls our own /api/epc route, which holds the API's Bearer
 * token server-side (EPC_API_TOKEN env var) — never exposed to the browser. If that env var
 * isn't configured, or no postcode is entered, or the API returns no match, this degrades to
 * "unavailable" rather than fabricating a certificate.
 */
import { AddressQuery, DataSourceKind } from "./types";

export type EpcRating = "A" | "B" | "C" | "D" | "E" | "F" | "G";

export interface EpcCertificate {
  currentRating: EpcRating;
  potentialRating: EpcRating;
  certificateDate: string; // ISO date
  totalFloorAreaSqm: number;
  propertyType: string;
  /** Not currently populated — the API only exposes this as a numeric code requiring a separate decode call. */
  builtForm?: string;
  /** Raw API enum code (e.g. "M"), not a decoded date range — decoding needs a further /api/codes/info call, not yet implemented. */
  constructionAgeBand?: string;
  mainHeatingType?: string;
  currentEnergyEfficiencyScore?: number;
  potentialEnergyEfficiencyScore?: number;
}

export interface EpcQueryResult {
  source: DataSourceKind;
  sourceLabel: string;
  certificate: EpcCertificate | null;
}

export interface EpcProvider {
  getLatestCertificate(query: AddressQuery): Promise<EpcQueryResult>;
}

export class UnavailableEpcProvider implements EpcProvider {
  async getLatestCertificate(): Promise<EpcQueryResult> {
    return {
      source: "unavailable",
      sourceLabel: "EPC open data (gov.uk) — not yet connected",
      certificate: null,
    };
  }
}

/**
 * Real EPC lookup via our server-side /api/epc route. Matches by postcode only (not full
 * address/UPRN), so at a postcode covering multiple flats this returns the most recently
 * registered EPC for *any* of them — may not be the exact property. Full address/UPRN matching
 * is a Phase 2 improvement.
 */
export class RealEpcProvider implements EpcProvider {
  async getLatestCertificate(query: AddressQuery): Promise<EpcQueryResult> {
    if (!query.postcode) {
      return { source: "unavailable", sourceLabel: "EPC open data — no postcode entered", certificate: null };
    }

    let res: Response;
    try {
      res = await fetch(`/api/epc?postcode=${encodeURIComponent(query.postcode)}`);
    } catch {
      return { source: "unavailable", sourceLabel: "EPC open data — lookup failed", certificate: null };
    }

    if (res.status === 503) {
      return {
        source: "unavailable",
        sourceLabel: "EPC open data — API not configured (EPC_API_TOKEN not set)",
        certificate: null,
      };
    }
    if (!res.ok) {
      return { source: "unavailable", sourceLabel: "EPC open data — lookup failed", certificate: null };
    }

    const body = (await res.json()) as { certificate: EpcCertificate | null };
    if (!body.certificate) {
      return {
        source: "unavailable",
        sourceLabel: "MHCLG Get Energy Performance Data — no certificate found for this postcode",
        certificate: null,
      };
    }

    return {
      source: "public-open-data",
      sourceLabel: "MHCLG Get Energy Performance Data (domestic EPC, England & Wales)",
      certificate: body.certificate,
    };
  }
}
