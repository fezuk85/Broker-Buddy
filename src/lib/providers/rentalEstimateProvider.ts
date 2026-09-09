/**
 * RentalEstimateProvider — abstraction for automatic rent estimation.
 *
 * Phase 1 ONLY supports manual rent entry — Rightmove/Zoopla are never scraped. If a licensed
 * rental-data product (Rightmove, Zoopla, PropertyData, VOA, etc.) is procured commercially in
 * future, implement this interface against it; the UI does not need to change.
 */
import { AddressQuery, DataSourceKind } from "./types";

export interface RentalEstimate {
  monthlyRent: number;
  rangeLow?: number;
  rangeHigh?: number;
}

export interface RentalEstimateResult {
  source: DataSourceKind;
  sourceLabel: string;
  estimate: RentalEstimate | null;
}

export interface RentalEstimateProvider {
  getEstimate(query: AddressQuery, propertyType?: string, bedrooms?: number): Promise<RentalEstimateResult>;
}

export class UnavailableRentalEstimateProvider implements RentalEstimateProvider {
  async getEstimate(): Promise<RentalEstimateResult> {
    return {
      source: "unavailable",
      sourceLabel: "Automatic rental estimate — no licensed data source connected yet",
      estimate: null,
    };
  }
}

/** Wraps a user-entered monthly rent figure so manual entry flows through the same interface. */
export class ManualRentalEstimateProvider implements RentalEstimateProvider {
  constructor(private readonly monthlyRent: number) {}

  async getEstimate(): Promise<RentalEstimateResult> {
    if (!(this.monthlyRent > 0)) {
      return { source: "unavailable", sourceLabel: "Manual entry", estimate: null };
    }
    return {
      source: "manual-entry",
      sourceLabel: "Manually entered by user",
      estimate: { monthlyRent: this.monthlyRent },
    };
  }
}
