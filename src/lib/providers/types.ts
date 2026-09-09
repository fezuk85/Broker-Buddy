/**
 * Shared provider contracts for Broker Buddy's property/finance data modules.
 *
 * The calculation engine and UI never depend on a specific data supplier directly —
 * everything goes through these interfaces so a "manual entry" implementation can be
 * swapped for a public-data or licensed-data implementation later without touching
 * the rest of the app.
 */

/** Where a piece of data actually came from — shown to the user so nothing is presented as more authoritative than it is. */
export type DataSourceKind =
  | "manual-entry"
  | "public-open-data"
  | "licensed-data"
  | "modelled-illustrative"
  | "unavailable";

export interface Sourced<T> {
  value: T;
  source: DataSourceKind;
  /** Human-readable citation, e.g. "HM Land Registry Price Paid Data" */
  sourceLabel?: string;
  asOf?: string;
}

export interface AddressQuery {
  postcode?: string;
  addressLine1?: string;
  uprn?: string;
}
