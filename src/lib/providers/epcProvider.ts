/**
 * EpcProvider — Energy Performance Certificate data, intended to be backed by the official
 * EPC open-data service (gov.uk / epc.opendatacommunities.org) rather than scraping.
 *
 * Phase 1 ships a stub that returns "unavailable"; wiring in the real API (which requires
 * a registered API key) is Phase 2.
 */
import { AddressQuery, DataSourceKind } from "./types";

export type EpcRating = "A" | "B" | "C" | "D" | "E" | "F" | "G";

export interface EpcCertificate {
  currentRating: EpcRating;
  potentialRating: EpcRating;
  certificateDate: string; // ISO date
  totalFloorAreaSqm: number;
  propertyType: string;
  builtForm: string;
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
