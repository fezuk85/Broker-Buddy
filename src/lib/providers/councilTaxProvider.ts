/**
 * CouncilTaxProvider — postcode/address to local authority, band and annual charge.
 * Phase 1 supports manual entry only; a real implementation should use official local
 * authority / VOA open data rather than scraping third-party council-tax sites.
 */
import { AddressQuery, DataSourceKind } from "./types";

export type CouncilTaxBand = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H";

export interface CouncilTaxDetails {
  localAuthority: string;
  band?: CouncilTaxBand;
  annualChargeGbp: number;
}

export interface CouncilTaxResult {
  source: DataSourceKind;
  sourceLabel: string;
  details: CouncilTaxDetails | null;
}

export interface CouncilTaxProvider {
  lookup(query: AddressQuery): Promise<CouncilTaxResult>;
}

export class UnavailableCouncilTaxProvider implements CouncilTaxProvider {
  async lookup(): Promise<CouncilTaxResult> {
    return {
      source: "unavailable",
      sourceLabel: "Local authority council tax data — not yet connected",
      details: null,
    };
  }
}

/** Wraps a user-entered monthly council tax figure so it flows through the same interface. */
export class ManualCouncilTaxProvider implements CouncilTaxProvider {
  constructor(private readonly monthlyAmountGbp: number) {}

  async lookup(): Promise<CouncilTaxResult> {
    if (!(this.monthlyAmountGbp > 0)) {
      return { source: "unavailable", sourceLabel: "Manual entry", details: null };
    }
    return {
      source: "manual-entry",
      sourceLabel: "Manually entered by user",
      details: {
        localAuthority: "Not specified",
        annualChargeGbp: this.monthlyAmountGbp * 12,
      },
    };
  }
}
