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

function addressTokens(address: string): string[] {
  return address
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean);
}

export type AddressMatch =
  | { status: "matched"; sales: PropertySale[] }
  | { status: "none" }
  | { status: "ambiguous"; addresses: string[] };

/**
 * Narrows a postcode's sales to one specific property. Every word the user typed must appear as a
 * whole word in the sale's address ("16" matches "16 Pear Tree Street" but NOT "162" or "164" —
 * a plain substring match used to pick up neighbouring houses and index the wrong property's
 * price). If the words match more than one distinct address (e.g. "Pear Tree Street" alone, or a
 * block of flats), the result is "ambiguous" rather than silently choosing one.
 */
export function matchSalesToAddress(sales: PropertySale[], addressLine1: string): AddressMatch {
  const queryTokens = addressTokens(addressLine1);
  if (queryTokens.length === 0) return { status: "matched", sales };

  const byAddress = new Map<string, PropertySale[]>();
  for (const sale of sales) {
    const tokens = addressTokens(sale.addressLine1);
    if (!queryTokens.every((t) => tokens.includes(t))) continue;
    const key = tokens.join(" ");
    const list = byAddress.get(key);
    if (list) list.push(sale);
    else byAddress.set(key, [sale]);
  }

  if (byAddress.size === 0) return { status: "none" };
  if (byAddress.size > 1) {
    return { status: "ambiguous", addresses: [...byAddress.values()].map((list) => list[0].addressLine1) };
  }
  return { status: "matched", sales: [...byAddress.values()][0] };
}

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

    const match = query.addressLine1 ? matchSalesToAddress(sales, query.addressLine1) : { status: "matched" as const, sales };

    if (match.status === "ambiguous") {
      const examples = match.addresses.slice(0, 3).join("; ");
      return {
        source: "unavailable",
        sourceLabel: `HM Land Registry Price Paid Data — several properties match "${query.addressLine1}" (e.g. ${examples}). Enter the full house number or name to pick one.`,
        sales: [],
      };
    }

    if (match.status === "none" || match.sales.length === 0) {
      return {
        source: "unavailable",
        sourceLabel: query.addressLine1
          ? "HM Land Registry Price Paid Data — no matching sale found for this address"
          : "HM Land Registry Price Paid Data — no sales found for this postcode",
        sales: [],
      };
    }

    const matched = match.sales;
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
