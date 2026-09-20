/**
 * Residential property purchase tax for the three UK tax regimes:
 *  - England & Northern Ireland: Stamp Duty Land Tax (SDLT)
 *  - Wales: Land Transaction Tax (LTT)
 *  - Scotland: Land and Buildings Transaction Tax (LBTT)
 *
 * Rates verified against the official sources in September 2026:
 *
 * England & NI (gov.uk/stamp-duty-land-tax/residential-property-rates):
 *  - Standard: 0% to £125k, 2% to £250k, 5% to £925k, 10% to £1.5m, 12% above.
 *  - First-time buyers: 0% to £300k, 5% on £300k-£500k; no relief at all if the price exceeds £500k.
 *  - Additional dwellings: +5% on the whole price (not applied under £40,000). No first-time buyer relief.
 *  - Non-UK residents: +2% on the whole price.
 *
 * Wales (gov.wales/land-transaction-tax-rates-and-bands):
 *  - Main rates (from 10 Oct 2022): 0% to £225k, 6% to £400k, 7.5% to £750k, 10% to £1.5m, 12% above.
 *  - Higher rates for additional dwellings (from 11 Dec 2024, £40,000 or more): 5% to £180k, 8.5% to £250k,
 *    10% to £400k, 12.5% to £750k, 15% to £1.5m, 17% above. These REPLACE the main rates (charged by band).
 *  - No first-time buyer relief and no non-resident surcharge.
 *
 * Scotland (revenue.scot; unchanged in the Scottish Budget 2026-27):
 *  - Standard: 0% to £145k, 2% to £250k, 5% to £325k, 10% to £750k, 12% above.
 *  - First-time buyers: nil-rate band rises to £175k (worth up to £600); no price cap.
 *  - Additional Dwelling Supplement (ADS): 8% of the whole price (from 5 Dec 2024) when £40,000 or more,
 *    added to the LBTT. An additional-property buyer is not a first-time buyer.
 *  - No non-resident surcharge.
 *
 * Deliberately not modelled: mixed-use/non-residential, leasehold rent, corporate buyers, multiple-dwellings
 * relief, replacement-of-main-residence refunds, and transactions agreed before the rate changes above.
 */

export type BuyerType = "standard" | "first-time" | "additional";
export type TaxRegion = "england-ni" | "wales" | "scotland";

export interface StampDutyBand {
  label: string;
  fromPrice: number;
  toPrice: number | null;
  ratePercent: number;
  amountInBand: number;
  taxDue: number;
}

export interface StampDutyResult {
  region: TaxRegion;
  /** e.g. "Stamp Duty Land Tax (SDLT)". */
  taxName: string;
  /** e.g. "SDLT". */
  taxShortName: string;
  price: number;
  bands: StampDutyBand[];
  baseTax: number;
  additionalPropertySurcharge: number;
  /** Label for the surcharge row, or null when the region has no flat surcharge. */
  additionalPropertySurchargeLabel: string | null;
  nonResidentSurcharge: number;
  totalTax: number;
  effectiveRatePercent: number | null;
  firstTimeBuyerReliefApplied: boolean;
  /** Set when a first-time buyer was selected but relief could not be applied, with the reason. */
  firstTimeBuyerReliefNote: string | null;
  /** Wales only: the higher residential rates replaced the main rates. */
  higherRatesApplied: boolean;
  /** Anything the user selected that does not apply in this region. */
  notes: string[];
}

export const ADDITIONAL_PROPERTY_SURCHARGE_PERCENT = 5;
export const NON_RESIDENT_SURCHARGE_PERCENT = 2;
export const ADDITIONAL_PROPERTY_MIN_PRICE = 40_000;
export const FIRST_TIME_BUYER_MAX_PRICE = 500_000;
export const SCOTLAND_ADS_PERCENT = 8;

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

const WALES_MAIN_BANDS: RateBand[] = [
  { upTo: 225_000, ratePercent: 0 },
  { upTo: 400_000, ratePercent: 6 },
  { upTo: 750_000, ratePercent: 7.5 },
  { upTo: 1_500_000, ratePercent: 10 },
  { upTo: null, ratePercent: 12 },
];

const WALES_HIGHER_BANDS: RateBand[] = [
  { upTo: 180_000, ratePercent: 5 },
  { upTo: 250_000, ratePercent: 8.5 },
  { upTo: 400_000, ratePercent: 10 },
  { upTo: 750_000, ratePercent: 12.5 },
  { upTo: 1_500_000, ratePercent: 15 },
  { upTo: null, ratePercent: 17 },
];

const SCOTLAND_STANDARD_BANDS: RateBand[] = [
  { upTo: 145_000, ratePercent: 0 },
  { upTo: 250_000, ratePercent: 2 },
  { upTo: 325_000, ratePercent: 5 },
  { upTo: 750_000, ratePercent: 10 },
  { upTo: null, ratePercent: 12 },
];

const SCOTLAND_FIRST_TIME_BUYER_BANDS: RateBand[] = [
  { upTo: 175_000, ratePercent: 0 },
  { upTo: 250_000, ratePercent: 2 },
  { upTo: 325_000, ratePercent: 5 },
  { upTo: 750_000, ratePercent: 10 },
  { upTo: null, ratePercent: 12 },
];

const REGION_NAMES: Record<TaxRegion, { taxName: string; taxShortName: string }> = {
  "england-ni": { taxName: "Stamp Duty Land Tax (SDLT)", taxShortName: "SDLT" },
  wales: { taxName: "Land Transaction Tax (LTT)", taxShortName: "LTT" },
  scotland: { taxName: "Land and Buildings Transaction Tax (LBTT)", taxShortName: "LBTT" },
};

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
  /** Defaults to England & Northern Ireland. */
  region?: TaxRegion;
}): StampDutyResult {
  const region: TaxRegion = inputs.region ?? "england-ni";
  const price = Number.isFinite(inputs.price) && inputs.price > 0 ? inputs.price : 0;
  const isAdditional = inputs.buyerType === "additional";
  const additionalApplies = isAdditional && price >= ADDITIONAL_PROPERTY_MIN_PRICE;

  let firstTimeBuyerReliefApplied = false;
  let firstTimeBuyerReliefNote: string | null = null;
  let higherRatesApplied = false;
  let rateBands: RateBand[];
  const notes: string[] = [];

  if (region === "wales") {
    if (additionalApplies) {
      rateBands = WALES_HIGHER_BANDS;
      higherRatesApplied = true;
    } else {
      rateBands = WALES_MAIN_BANDS;
    }
    if (inputs.buyerType === "first-time") {
      firstTimeBuyerReliefNote = "There is no first-time buyer relief in Wales — the main LTT rates apply.";
    }
  } else if (region === "scotland") {
    if (inputs.buyerType === "first-time") {
      rateBands = SCOTLAND_FIRST_TIME_BUYER_BANDS;
      firstTimeBuyerReliefApplied = true;
    } else {
      rateBands = SCOTLAND_STANDARD_BANDS;
    }
  } else {
    rateBands = STANDARD_BANDS;
    if (inputs.buyerType === "first-time") {
      if (price <= FIRST_TIME_BUYER_MAX_PRICE) {
        rateBands = FIRST_TIME_BUYER_BANDS;
        firstTimeBuyerReliefApplied = true;
      } else {
        firstTimeBuyerReliefNote =
          "First-time buyer relief is not available above £500,000 — standard rates apply to the whole price.";
      }
    }
  }

  const bands = applyBands(price, rateBands);
  const baseTax = bands.reduce((sum, b) => sum + b.taxDue, 0);

  let additionalPropertySurcharge = 0;
  let additionalPropertySurchargeLabel: string | null = null;
  if (region === "england-ni" && additionalApplies) {
    additionalPropertySurcharge = (price * ADDITIONAL_PROPERTY_SURCHARGE_PERCENT) / 100;
    additionalPropertySurchargeLabel = `Additional property surcharge (${ADDITIONAL_PROPERTY_SURCHARGE_PERCENT}% of price)`;
  } else if (region === "scotland" && additionalApplies) {
    additionalPropertySurcharge = (price * SCOTLAND_ADS_PERCENT) / 100;
    additionalPropertySurchargeLabel = `Additional Dwelling Supplement (${SCOTLAND_ADS_PERCENT}% of price)`;
  }

  let nonResidentSurcharge = 0;
  if (inputs.nonUkResident) {
    if (region === "england-ni") {
      nonResidentSurcharge = (price * NON_RESIDENT_SURCHARGE_PERCENT) / 100;
    } else {
      notes.push(`There is no non-UK resident surcharge for ${REGION_NAMES[region].taxShortName}.`);
    }
  }

  const totalTax = baseTax + additionalPropertySurcharge + nonResidentSurcharge;

  return {
    region,
    ...REGION_NAMES[region],
    price,
    bands,
    baseTax,
    additionalPropertySurcharge,
    additionalPropertySurchargeLabel,
    nonResidentSurcharge,
    totalTax,
    effectiveRatePercent: price > 0 ? (totalTax / price) * 100 : null,
    firstTimeBuyerReliefApplied,
    firstTimeBuyerReliefNote,
    higherRatesApplied,
    notes,
  };
}
