/**
 * HousePriceIndexProvider — regional/property-type market movement, used to index a historic
 * sale price forward to today (Method 1 of the indicative valuation model). Intended to be
 * backed by the UK House Price Index (HM Land Registry / ONS) open data.
 */
import { DataSourceKind } from "./types";

export interface IndexMovementQuery {
  postcodeArea?: string; // e.g. "SW1"
  propertyType?: string;
  fromDate: string; // ISO date
  toDate: string; // ISO date
}

export interface IndexMovementResult {
  source: DataSourceKind;
  sourceLabel: string;
  /** Cumulative percentage price movement between fromDate and toDate, or null if unavailable. */
  percentChange: number | null;
}

export interface HousePriceIndexProvider {
  getMovement(query: IndexMovementQuery): Promise<IndexMovementResult>;
}

export class UnavailableHousePriceIndexProvider implements HousePriceIndexProvider {
  async getMovement(): Promise<IndexMovementResult> {
    return {
      source: "unavailable",
      sourceLabel: "UK House Price Index — not yet connected",
      percentChange: null,
    };
  }
}
