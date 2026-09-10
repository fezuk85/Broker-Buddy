/**
 * CouncilTaxProvider — postcode/address to local authority, band and annual charge.
 *
 * RealCouncilTaxProvider gives an instant, no-manual-entry estimate: it resolves the postcode's
 * local authority and LSOA (ONS Postcode Directory), takes the most common Council Tax band
 * among properties in that small area (VOA CTSOP1.1 — per-property bands are legally restricted
 * data, so this is the closest legitimate open proxy, not a confirmed band for the specific
 * property), and prices it using MHCLG's official per-authority, per-band charges (Table 9).
 * Always labelled "modelled-illustrative" — never presented as the confirmed figure.
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

interface CouncilTaxEstimateApiResponse {
  estimate: {
    localAuthority: string;
    band: CouncilTaxBand;
    annualChargeGbp: number;
    bandIsAreaTypical: true;
  } | null;
  reason?: string;
}

/**
 * Real, no-manual-entry Council Tax estimate via our server-side /api/council-tax route. The
 * band shown is the most common band among properties in the postcode's local area (VOA
 * CTSOP1.1), not confirmed for the specific property — official per-property bands are legally
 * restricted data with no open bulk source. Always "modelled-illustrative", never "public-open-data".
 */
export class RealCouncilTaxProvider implements CouncilTaxProvider {
  async lookup(query: AddressQuery): Promise<CouncilTaxResult> {
    if (!query.postcode) {
      return { source: "unavailable", sourceLabel: "Council Tax estimate — no postcode entered", details: null };
    }

    let res: Response;
    try {
      res = await fetch(`/api/council-tax?postcode=${encodeURIComponent(query.postcode)}`);
    } catch {
      return { source: "unavailable", sourceLabel: "Council Tax estimate — lookup failed", details: null };
    }

    if (!res.ok) {
      return { source: "unavailable", sourceLabel: "Council Tax estimate — lookup failed", details: null };
    }

    const body = (await res.json()) as CouncilTaxEstimateApiResponse;
    if (!body.estimate) {
      return {
        source: "unavailable",
        sourceLabel: "Council Tax estimate — no data available for this postcode",
        details: null,
      };
    }

    return {
      source: "modelled-illustrative",
      sourceLabel:
        "Illustrative estimate: most common Council Tax band in this postcode's local area (VOA), priced using MHCLG's official per-authority charges — not confirmed for this specific property",
      details: {
        localAuthority: body.estimate.localAuthority,
        band: body.estimate.band,
        annualChargeGbp: body.estimate.annualChargeGbp,
      },
    };
  }
}
