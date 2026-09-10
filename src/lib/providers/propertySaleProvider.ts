/**
 * PropertySaleProvider — historic sale-price data, backed by HM Land Registry Price Paid Data
 * for England & Wales via the real-time Linked Data API (see /data-sources for attribution
 * requirements). Scotland and Northern Ireland run separate registers not covered here.
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

const HMLR_SOURCE_LABEL = "HM Land Registry Price Paid Data (England & Wales)";

async function lookupSalesByPostcode(postcode: string): Promise<PropertySale[] | null> {
  let res: Response;
  try {
    res = await fetch(`/api/property-sales?postcode=${encodeURIComponent(postcode)}`);
  } catch {
    return null;
  }
  if (!res.ok) return null;
  const body = (await res.json()) as { sales: PropertySale[] };
  return body.sales;
}

/**
 * Real HM Land Registry lookup via our server-side /api/property-sales route. Matched by
 * postcode only, not full address/UPRN — the API's Address Data has no UPRN field, so
 * getSalesForProperty narrows to the subject address by matching addressLine1 text within the
 * postcode's results, which is best-effort, not exact. getComparableSales returns other sales
 * at the same postcode; there's no geographic radius search in the underlying API, so
 * `radiusMiles` is accepted but not applied — postcode-level proximity is the resolution
 * available in Phase 1.
 */
export class RealPropertySaleProvider implements PropertySaleProvider {
  async getSalesForProperty(query: AddressQuery): Promise<PropertySaleQueryResult> {
    if (!query.postcode) {
      return { source: "unavailable", sourceLabel: "HM Land Registry Price Paid Data — no postcode entered", sales: [] };
    }

    const sales = await lookupSalesByPostcode(query.postcode);
    if (sales === null) {
      return { source: "unavailable", sourceLabel: "HM Land Registry Price Paid Data — lookup failed", sales: [] };
    }

    const matched = query.addressLine1
      ? sales.filter((s) => s.addressLine1.toLowerCase().includes(query.addressLine1!.toLowerCase()))
      : sales;

    if (matched.length === 0) {
      return {
        source: "unavailable",
        sourceLabel: query.addressLine1
          ? "HM Land Registry Price Paid Data — no matching sale found for this address"
          : "HM Land Registry Price Paid Data — no sales found for this postcode",
        sales: [],
      };
    }

    return { source: "public-open-data", sourceLabel: HMLR_SOURCE_LABEL, sales: matched };
  }

  async getComparableSales(
    query: AddressQuery,
    filters?: { propertyType?: PropertySale["propertyType"]; sinceDate?: string; radiusMiles?: number }
  ): Promise<PropertySaleQueryResult> {
    if (!query.postcode) {
      return { source: "unavailable", sourceLabel: "HM Land Registry Price Paid Data — no postcode entered", sales: [] };
    }

    const sales = await lookupSalesByPostcode(query.postcode);
    if (sales === null) {
      return { source: "unavailable", sourceLabel: "HM Land Registry Price Paid Data — lookup failed", sales: [] };
    }

    let filtered = sales;
    if (filters?.propertyType) filtered = filtered.filter((s) => s.propertyType === filters.propertyType);
    if (filters?.sinceDate) filtered = filtered.filter((s) => s.saleDate >= filters.sinceDate!);

    if (filtered.length === 0) {
      return {
        source: "unavailable",
        sourceLabel: "HM Land Registry Price Paid Data — no comparable sales found for this postcode",
        sales: [],
      };
    }

    return {
      source: "public-open-data",
      sourceLabel: `${HMLR_SOURCE_LABEL} — matched at postcode level only, not by radius`,
      sales: filtered,
    };
  }
}
