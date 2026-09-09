/**
 * PropertySaleProvider — historic sale-price data, intended to be backed by HM Land Registry
 * Price Paid Data for England & Wales (see /data-sources for attribution requirements).
 *
 * Phase 1 ships only a stub implementation: it returns "unavailable" for every query rather
 * than fabricating sale history. Wiring this up to the real HMLR bulk/API data is Phase 2.
 */
import { AddressQuery, DataSourceKind } from "./types";

export interface PropertySale {
  pricePaid: number;
  saleDate: string; // ISO date
  propertyType: "detached" | "semi-detached" | "terraced" | "flat" | "other";
  newBuild: boolean;
  tenure: "freehold" | "leasehold";
  addressLine1: string;
  postcode: string;
  uprn?: string;
}

export interface PropertySaleQueryResult {
  source: DataSourceKind;
  sourceLabel: string;
  sales: PropertySale[];
}

export interface PropertySaleProvider {
  /** Exact subject-property sale history, ideally matched by UPRN rather than address text. */
  getSalesForProperty(query: AddressQuery): Promise<PropertySaleQueryResult>;
  /** Nearby comparable transactions, optionally filtered by property type / date range. */
  getComparableSales(
    query: AddressQuery,
    filters?: { propertyType?: PropertySale["propertyType"]; sinceDate?: string; radiusMiles?: number }
  ): Promise<PropertySaleQueryResult>;
}

/**
 * Placeholder implementation. Returns no data with source "unavailable" — the UI must show
 * "Insufficient data" rather than inventing sale history. Replace with a real HMLR-backed
 * implementation (bulk CSV import + postcode/UPRN index, or the HMLR API) in Phase 2.
 */
export class UnavailablePropertySaleProvider implements PropertySaleProvider {
  async getSalesForProperty(): Promise<PropertySaleQueryResult> {
    return { source: "unavailable", sourceLabel: "HM Land Registry Price Paid Data (not yet connected)", sales: [] };
  }

  async getComparableSales(): Promise<PropertySaleQueryResult> {
    return { source: "unavailable", sourceLabel: "HM Land Registry Price Paid Data (not yet connected)", sales: [] };
  }
}
