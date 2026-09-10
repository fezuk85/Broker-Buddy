/**
 * Client for HM Land Registry's Price Paid Data Linked Data API (landregistry.data.gov.uk).
 * Verified live via direct requests (see PR description) — no deprecation, no auth required.
 *
 * Base URL and endpoint shape confirmed from landregistry.data.gov.uk/app/doc/ppd and by making
 * real requests: https://landregistry.data.gov.uk/data/ppi/transaction-record.json accepts
 * `propertyAddress.postcode`, `_sort`, `_pageSize` (silently capped at 200 by the service) and
 * date/price range params. No API key, no registration, no rate-limit documented anywhere —
 * treat that absence as "no guarantee", not "no limit", and cache results.
 *
 * `transactionDate` comes back in the JSON serialisation as a non-ISO string, e.g.
 * "Fri, 14 Jun 2024" — parsed here into an ISO date rather than passed through raw.
 *
 * Address Data (postcode, PAON, SAON, street, locality, town, district, county) carries a
 * separate Royal Mail/Ordnance Survey licence restriction on top of the OGL: use is permitted
 * "for personal and/or non-commercial use" and "to display for the purpose of providing
 * residential property price information services" — which is exactly what this does. See
 * /data-sources for the full attribution and licensing text.
 */
import { PropertySale } from "../propertySaleProvider";

const API_BASE = "https://landregistry.data.gov.uk/data/ppi";

interface RawEnumRef {
  _about: string;
  label?: Array<{ _value: string }>;
}

interface RawAddress {
  _about: string;
  paon?: string;
  saon?: string;
  street?: string;
  locality?: string;
  town?: string;
  district?: string;
  county?: string;
  postcode?: string;
}

interface RawTransactionRecord {
  pricePaid: number;
  transactionDate: string;
  newBuild: boolean;
  estateType?: RawEnumRef;
  propertyType?: RawEnumRef;
  propertyAddress?: RawAddress;
}

interface TransactionRecordResponse {
  result: {
    items: RawTransactionRecord[];
    next?: string;
  };
}

function enumLabel(ref: RawEnumRef | undefined): string | undefined {
  return ref?.label?.[0]?._value;
}

const PROPERTY_TYPE_MAP: Record<string, PropertySale["propertyType"]> = {
  Detached: "detached",
  "Semi-Detached": "semi-detached",
  Terraced: "terraced",
  "Flats/Maisonettes": "flat",
  Other: "other",
};

/** Parses the API's non-ISO transactionDate strings, e.g. "Fri, 14 Jun 2024", into ISO (YYYY-MM-DD). */
function parseTransactionDate(raw: string): string | undefined {
  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) return undefined;
  return parsed.toISOString().slice(0, 10);
}

function mapTransactionRecord(raw: RawTransactionRecord): PropertySale | null {
  const saleDate = parseTransactionDate(raw.transactionDate);
  const postcode = raw.propertyAddress?.postcode;
  if (!saleDate || !postcode || typeof raw.pricePaid !== "number") return null;

  const propertyTypeLabel = enumLabel(raw.propertyType);
  const estateTypeLabel = enumLabel(raw.estateType);
  const addressParts = [raw.propertyAddress?.saon, raw.propertyAddress?.paon, raw.propertyAddress?.street].filter(
    (part): part is string => Boolean(part)
  );

  return {
    pricePaid: raw.pricePaid,
    saleDate,
    propertyType: (propertyTypeLabel && PROPERTY_TYPE_MAP[propertyTypeLabel]) || "other",
    newBuild: raw.newBuild,
    tenure: estateTypeLabel === "Leasehold" ? "leasehold" : "freehold",
    addressLine1: addressParts.join(" ") || "Address not stated",
    postcode,
  };
}

/**
 * Fetches transaction-record sale history for a postcode, most recent first. Returns an empty
 * array (never throws) for a postcode with no matches — errors are reserved for actual request
 * failures so the caller can distinguish "no sales here" from "lookup broke".
 */
export async function fetchSalesForPostcode(
  postcode: string,
  limit: number = 50,
  fetchImpl: typeof fetch = fetch
): Promise<PropertySale[]> {
  const params = new URLSearchParams({
    "propertyAddress.postcode": postcode.trim().toUpperCase(),
    _sort: "-transactionDate",
    _pageSize: String(Math.min(limit, 200)),
  });

  const res = await fetchImpl(`${API_BASE}/transaction-record.json?${params.toString()}`, {
    headers: { Accept: "application/json" },
  });

  if (!res.ok) throw new Error(`HM Land Registry Price Paid Data lookup failed with status ${res.status}`);

  const body = (await res.json()) as TransactionRecordResponse;
  const items = body.result?.items ?? [];
  return items.map(mapTransactionRecord).filter((sale): sale is PropertySale => sale !== null);
}
