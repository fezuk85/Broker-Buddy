/**
 * Stamp Duty Land Tax (SDLT) for residential purchases in England & Northern Ireland.
 * Wales (Land Transaction Tax) and Scotland (LBTT) use different rates and are out of scope.
 *
 * Rates verified against gov.uk/stamp-duty-land-tax/residential-property-rates (September 2026):
 *  - Standard: 0% to £125k, 2% to £250k, 5% to £925k, 10% to £1.5m, 12% above.
 *  - First-time buyers: 0% to £300k, 5% on £300k-£500k; no relief at all if the price exceeds £500k.
 *  - Additional dwellings: +5% on the whole price (not applied under £40,000). No first-time buyer relief.
 *  - Non-UK residents: +2% on the whole price.
 *
 * Deliberately not modelled: mixed-use/non-residential, leasehold rent, corporate buyers (17% flat
 * rate), multiple-dwellings relief, and the 6-month refund rule for replacing a main residence.
 */

export type BuyerType = "standard" | "first-time" | "additional";

export interface StampDutyBand {
  label: string;
  fromPrice: number;
  toPrice: number | null;
  ratePercent: number;
  amountInBand: number;
  taxDue: number;
}

export interface StampDutyResult {
  price: number;
  bands: StampDutyBand[];
  baseTax: number;
  additionalPropertySurcharge: number;
  nonResidentSurcharge: number;
  totalTax: number;
  effectiveRatePercent: number | null;
  firstTimeBuyerReliefApplied: boolean;
  /** Set when a first-time buyer was selected but relief could not be applied, with the reason. */
  firstTimeBuyerReliefNote: string | null;
}

export const ADDITIONAL_PROPERTY_SURCHARGE_PERCENT = 5;
export const NON_RESIDENT_SURCHARGE_PERCENT = 2;
export const ADDITIONAL_PROPERTY_MIN_PRICE = 40_000;
export const FIRST_TIME_BUYER_MAX_PRICE = 500_000;

interface RateBand {
  upTo: number | null;
  ratePercent: number;
}

const STANDARD_BANDS: RateBand[] = [
  { upTo: 125_000, ratePercent: 0 },
  { upTo: 250_000, ratePercent: 2 },
  { upTo: 925_000, ratePercent: 5 },
  { upTo: 1_500_000, ratePercent: 10 },
  { upTo: null, ratePercent: 12 },
];

const FIRST_TIME_BUYER_BANDS: RateBand[] = [
  { upTo: 300_000, ratePercent: 0 },
  { upTo: 500_000, ratePercent: 5 },
];

function formatBandLabel(from: number, to: number | null): string {
  const fmt = (n: number) => `£${n.toLocaleString("en-GB")}`;
  return to === null ? `Above ${fmt(from)}` : `${fmt(from)} – ${fmt(to)}`;
}

function applyBands(price: number, rateBands: RateBand[]): StampDutyBand[] {
  const bands: StampDutyBand[] = [];
  let lower = 0;
  for (const band of rateBands) {
    const upper = band.upTo === null ? Infinity : band.upTo;
    const amountInBand = Math.max(0, Math.min(price, upper) - lower);
    bands.push({
      label: formatBandLabel(lower, band.upTo),
      fromPrice: lower,
      toPrice: band.upTo,
      ratePercent: band.ratePercent,
      amountInBand,
      taxDue: (amountInBand * band.ratePercent) / 100,
    });
    lower = upper;
    if (price <= upper) break;
  }
  return bands;
}

export function calculateStampDuty(inputs: {
  price: number;
  buyerType: BuyerType;
  nonUkResident: boolean;
}): StampDutyResult {
  const price = Number.isFinite(inputs.price) && inputs.price > 0 ? inputs.price : 0;

  let firstTimeBuyerReliefApplied = false;
  let firstTimeBuyerReliefNote: string | null = null;
  let rateBands = STANDARD_BANDS;

  if (inputs.buyerType === "first-time") {
    if (price <= FIRST_TIME_BUYER_MAX_PRICE) {
      rateBands = FIRST_TIME_BUYER_BANDS;
      firstTimeBuyerReliefApplied = true;
    } else {
      firstTimeBuyerReliefNote =
        "First-time buyer relief is not available above £500,000 — standard rates apply to the whole price.";
    }
  }

  const bands = applyBands(price, rateBands);
  const baseTax = bands.reduce((sum, b) => sum + b.taxDue, 0);

  const additionalPropertySurcharge =
    inputs.buyerType === "additional" && price >= ADDITIONAL_PROPERTY_MIN_PRICE
      ? (price * ADDITIONAL_PROPERTY_SURCHARGE_PERCENT) / 100
      : 0;
  const nonResidentSurcharge = inputs.nonUkResident ? (price * NON_RESIDENT_SURCHARGE_PERCENT) / 100 : 0;

  const totalTax = baseTax + additionalPropertySurcharge + nonResidentSurcharge;

  return {
    price,
    bands,
    baseTax,
    additionalPropertySurcharge,
    nonResidentSurcharge,
    totalTax,
    effectiveRatePercent: price > 0 ? (totalTax / price) * 100 : null,
    firstTimeBuyerReliefApplied,
    firstTimeBuyerReliefNote,
  };
}
