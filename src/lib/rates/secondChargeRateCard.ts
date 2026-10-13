/**
 * United Trust Bank (UTB) Residential Second Charge Loans rate card, transcribed from the lender's
 * own product guide PDF the user supplied ("Core24044-Resi-Second-Charge-v1-25.09.26.pdf",
 * effective 25 September 2026). This is real, lender-published data — not invented or scraped —
 * but it's a snapshot of one lender's pricing at one point in time, so it's shown with that source
 * and date attached rather than presented as a live or universal rate, and will go stale as the
 * lender repriced; update this file (or re-upload a newer PDF) when that happens.
 *
 * Each "Max LTV" column on the real card is a band ceiling (e.g. the "65%" column prices any loan
 * up to and including 65% combined LTV) — findSecondChargeRate() picks the smallest band that
 * covers the actual combined LTV, matching how the lender's own card is read.
 */

export const RATE_CARD_SOURCE = {
  lender: "United Trust Bank (UTB)",
  product: "Residential Second Charge Loans",
  effectiveDate: "2026-09-25",
  reference: "Core24044-Resi-Second-Charge-v1-25.09.26",
};

export type CreditProfile = "super-prime" | "prime-plus" | "prime" | "near-prime" | "specialist";

export const CREDIT_PROFILE_OPTIONS: { value: CreditProfile; label: string }[] = [
  { value: "super-prime", label: "Super Prime" },
  { value: "prime-plus", label: "Prime Plus" },
  { value: "prime", label: "Prime" },
  { value: "near-prime", label: "Near Prime" },
  { value: "specialist", label: "Specialist" },
];

export type SecondChargeProduct = "boe-tracker" | "2yr-fix" | "3yr-fix" | "5yr-fix" | "5yr-fix-no-erc";

export const PRODUCT_OPTIONS: { value: SecondChargeProduct; label: string }[] = [
  { value: "2yr-fix", label: "2 Yr Fix" },
  { value: "3yr-fix", label: "3 Yr Fix" },
  { value: "5yr-fix", label: "5 Yr Fix" },
  { value: "5yr-fix-no-erc", label: "5 Yr Fix, No ERC" },
  { value: "boe-tracker", label: "BoE Lifetime Tracker (variable)" },
];

/**
 * Early repayment charge schedule per product, read straight off the same rate card — identical
 * across all five credit profiles (only the rates themselves vary by profile). These reducing,
 * term-matched structures (3%/2% on a 2yr fix, 5%/4%/3%/2%/2% on a 5yr fix, etc.) are a standard
 * shape across second-charge lenders generally, not unique to this one, so they double as a
 * reasonable default for any product/lender until the actual offer is confirmed.
 */
export const PRODUCT_ERC: Record<SecondChargeProduct, string> = {
  "boe-tracker": "3% in year 1, 2% in year 2",
  "2yr-fix": "3% in year 1, 2% in year 2",
  "3yr-fix": "3% in year 1, 2% in year 2, 2% in year 3",
  "5yr-fix": "5% in year 1, 4% in year 2, 3% in year 3, 2% in year 4, 2% in year 5",
  "5yr-fix-no-erc": "None",
};

/** One rate card row: a credit profile's pricing across every LTV band for every product. `null`
 * means that band/product isn't offered for this profile (e.g. no lender goes to 90% on this card).
 * Tracker rates are a margin over the Bank of England base rate, not a standalone figure. */
interface ProfileRates {
  maxLtvBands: number[]; // ascending, e.g. [60, 65, 70, 75, 80, 85]
  rates: Record<Exclude<SecondChargeProduct, "boe-tracker">, (number | null)[]>;
  trackerMarginPercent: (number | null)[];
}

const RATE_CARD: Record<CreditProfile, ProfileRates> = {
  "super-prime": {
    maxLtvBands: [60, 65, 70, 75, 80, 85],
    rates: {
      "2yr-fix": [6.39, 6.39, 6.59, 6.94, 7.84, 9.04],
      "3yr-fix": [6.39, 6.39, 6.64, 7.19, 8.04, 9.24],
      "5yr-fix": [6.54, 6.54, 6.54, 6.54, 7.05, 7.25],
      "5yr-fix-no-erc": [7.0, 7.05, 7.34, 7.34, 7.69, 7.89],
    },
    trackerMarginPercent: [3.74, 3.74, 4.04, 4.54, 5.74, 7.24],
  },
  "prime-plus": {
    maxLtvBands: [60, 65, 70, 75, 80, 85],
    rates: {
      "2yr-fix": [6.69, 6.69, 6.69, 7.04, 8.04, 9.14],
      "3yr-fix": [6.69, 6.69, 6.69, 7.29, 8.24, 9.34],
      "5yr-fix": [6.59, 6.59, 6.59, 6.59, 7.1, 7.3],
      "5yr-fix-no-erc": [7.1, 7.15, 7.35, 7.35, 7.79, 7.99],
    },
    trackerMarginPercent: [4.34, 4.34, 4.34, 4.64, 5.94, 7.34],
  },
  prime: {
    maxLtvBands: [60, 65, 70, 75, 80, 85],
    rates: {
      "2yr-fix": [7.99, 7.99, 7.99, 8.34, 9.24, 10.39],
      "3yr-fix": [7.99, 7.99, 7.99, 8.34, 9.24, 10.37],
      "5yr-fix": [6.99, 6.99, 7.09, 7.25, 7.4, 7.95],
      "5yr-fix-no-erc": [7.6, 7.6, 7.6, 7.84, 8.14, 8.79],
    },
    trackerMarginPercent: [5.34, 5.34, 5.34, 5.64, 6.14, 7.64],
  },
  "near-prime": {
    maxLtvBands: [60, 65, 70, 75, 80, 85],
    rates: {
      "2yr-fix": [9.29, 9.29, 9.29, 9.39, 10.14, 11.55],
      "3yr-fix": [9.29, 9.29, 9.29, 9.39, 10.14, 11.63],
      "5yr-fix": [7.64, 7.64, 7.64, 7.8, 8.65, 9.55],
      "5yr-fix-no-erc": [7.95, 7.95, 7.95, 8.39, 9.39, 10.14],
    },
    trackerMarginPercent: [5.54, 5.54, 5.54, 6.14, 7.34, 8.84],
  },
  specialist: {
    // This lender caps Specialist at 80% combined LTV — no 85% band offered, unlike the other tiers.
    maxLtvBands: [60, 65, 70, 75, 80],
    rates: {
      "2yr-fix": [9.49, 9.49, 9.49, 9.69, 10.44],
      "3yr-fix": [9.49, 9.49, 9.49, 9.59, 10.34],
      "5yr-fix": [7.84, 7.84, 7.84, 8.0, 8.85],
      "5yr-fix-no-erc": [8.15, 8.15, 8.15, 8.59, 9.59],
    },
    trackerMarginPercent: [5.74, 5.74, 5.74, 6.24, 7.44],
  },
};

export interface SecondChargeRateMatch {
  maxLtvBand: number;
  ratePercent: number | null;
  trackerMarginPercent: number | null;
}

/** Looks up the rate for a credit profile/product at a given combined LTV, using the smallest
 * band on the card that covers it (how the lender's own card is read). Returns null if the LTV
 * exceeds every band this lender offers for that credit profile. */
export function findSecondChargeRate(
  creditProfile: CreditProfile,
  product: SecondChargeProduct,
  combinedLtvPercent: number
): SecondChargeRateMatch | null {
  const profile = RATE_CARD[creditProfile];
  const bandIndex = profile.maxLtvBands.findIndex((band) => combinedLtvPercent <= band);
  if (bandIndex === -1) return null;

  const maxLtvBand = profile.maxLtvBands[bandIndex];
  if (product === "boe-tracker") {
    return { maxLtvBand, ratePercent: null, trackerMarginPercent: profile.trackerMarginPercent[bandIndex] };
  }
  return { maxLtvBand, ratePercent: profile.rates[product][bandIndex], trackerMarginPercent: null };
}

/** Full rate grid for one credit profile, for display — every product across every LTV band. */
export function getFullRateGrid(creditProfile: CreditProfile) {
  const profile = RATE_CARD[creditProfile];
  return {
    maxLtvBands: profile.maxLtvBands,
    rows: [
      { product: "boe-tracker" as const, label: "BoE Lifetime Tracker", values: profile.trackerMarginPercent.map((m) => (m == null ? null : `BBR +${m.toFixed(2)}%`)) },
      { product: "2yr-fix" as const, label: "2 Yr Fix", values: profile.rates["2yr-fix"].map((r) => (r == null ? null : `${r.toFixed(2)}%`)) },
      { product: "3yr-fix" as const, label: "3 Yr Fix", values: profile.rates["3yr-fix"].map((r) => (r == null ? null : `${r.toFixed(2)}%`)) },
      { product: "5yr-fix" as const, label: "5 Yr Fix", values: profile.rates["5yr-fix"].map((r) => (r == null ? null : `${r.toFixed(2)}%`)) },
      { product: "5yr-fix-no-erc" as const, label: "5 Yr Fix, No ERC", values: profile.rates["5yr-fix-no-erc"].map((r) => (r == null ? null : `${r.toFixed(2)}%`)) },
    ],
  };
}
