/**
 * HouseholdExpenditureProvider — maps a household profile to an ONS Family Spending benchmark.
 *
 * IMPORTANT: this is a statistical benchmark, not the borrower's actual expenditure, and it is
 * NOT a lender affordability assessment. See /affordability disclaimers.
 *
 * The included categories deliberately EXCLUDE mortgage/rent payments and Council Tax, since
 * those are calculated elsewhere in the case and must not be double-counted. ONS Family Spending
 * "housing" category itself is also excluded for the same reason — only day-to-day living cost
 * categories are summed.
 */
import { DataSourceKind } from "./types";
import { UkRegion } from "@/lib/data/postcodeRegions";

export interface HouseholdProfile {
  grossAnnualIncome: number;
  adults: number;
  dependentChildren: number;
  /** Derived from the property postcode (see postcodeRegions.ts) — never free text. Null/undefined uses the UK average. */
  region?: UkRegion | null;
}

export interface ExpenditureCategoryBreakdown {
  food: number;
  utilities: number;
  transport: number;
  householdGoods: number;
  clothing: number;
  communication: number;
  recreation: number;
  otherExpenditure: number;
}

export interface HouseholdExpenditureEstimate {
  weeklyTotal: number;
  monthlyTotal: number;
  weeklyBreakdown: ExpenditureCategoryBreakdown;
  monthlyBreakdown: ExpenditureCategoryBreakdown;
  benchmarkLabel: string;
  excludedCategories: string[];
  regionUsed: UkRegion | "UK average";
}

export interface HouseholdExpenditureResult {
  source: DataSourceKind;
  sourceLabel: string;
  estimate: HouseholdExpenditureEstimate | null;
}

export interface HouseholdExpenditureProvider {
  getBenchmark(profile: HouseholdProfile): Promise<HouseholdExpenditureResult>;
}

const EXCLUDED_CATEGORIES = [
  "Mortgage / rent payments",
  "Council Tax",
  "ONS 'housing, fuel & power' capital costs (mortgage interest, rent)",
];

/**
 * Simplified rule-based approximation of ONS Family Spending, banded by household size and
 * income decile. These are NOT the live ONS dataset figures — they are illustrative weekly
 * spend-per-adult-equivalent figures loosely modelled on published Family Spending patterns,
 * clearly labelled as a benchmark. Replace with a real ONS dataset lookup in Phase 2.
 */
const BASE_WEEKLY_PER_ADULT: ExpenditureCategoryBreakdown = {
  food: 55,
  utilities: 30,
  transport: 45,
  householdGoods: 25,
  clothing: 15,
  communication: 12,
  recreation: 35,
  otherExpenditure: 20,
};

const CHILD_MULTIPLIER = 0.55;

/**
 * Illustrative regional cost-of-living adjustment, modelled on well-known general regional
 * spending patterns (London/South East higher, North/Wales/NI lower). These are NOT figures
 * taken from ONS's regional Family Spending breakdown — that would need real region-level
 * ONS data this Phase 1 model doesn't have. 1.0 = UK average.
 */
const REGION_COST_ADJUSTMENT: Record<UkRegion, number> = {
  London: 1.25,
  "South East": 1.1,
  "East of England": 1.05,
  "South West": 1.0,
  "East Midlands": 0.95,
  "West Midlands": 0.95,
  "Yorkshire and the Humber": 0.9,
  "North West": 0.9,
  "North East": 0.85,
  Wales: 0.9,
  Scotland: 0.95,
  "Northern Ireland": 0.9,
};

export class RuleBasedHouseholdExpenditureProvider implements HouseholdExpenditureProvider {
  async getBenchmark(profile: HouseholdProfile): Promise<HouseholdExpenditureResult> {
    const adults = Math.max(0, profile.adults || 0);
    const children = Math.max(0, profile.dependentChildren || 0);

    if (adults === 0 && children === 0) {
      return {
        source: "unavailable",
        sourceLabel: "ONS Family Spending (benchmark)",
        estimate: null,
      };
    }

    const equivalentAdults = adults + children * CHILD_MULTIPLIER;
    const incomeScale = incomeAdjustmentFactor(profile.grossAnnualIncome);
    const regionScale = profile.region ? REGION_COST_ADJUSTMENT[profile.region] : 1;
    const regionUsed = profile.region ?? "UK average";

    const weeklyBreakdown = Object.fromEntries(
      Object.entries(BASE_WEEKLY_PER_ADULT).map(([key, value]) => [
        key,
        Math.round(value * equivalentAdults * incomeScale * regionScale),
      ])
    ) as unknown as ExpenditureCategoryBreakdown;

    const weeklyTotal = Object.values(weeklyBreakdown).reduce((sum, v) => sum + v, 0);

    const monthlyBreakdown = Object.fromEntries(
      Object.entries(weeklyBreakdown).map(([key, value]) => [key, Math.round((value * 52) / 12)])
    ) as unknown as ExpenditureCategoryBreakdown;

    return {
      source: "modelled-illustrative",
      sourceLabel:
        "Modelled on ONS Family Spending category patterns (Phase 1 approximation — not the live ONS dataset)",
      estimate: {
        weeklyTotal,
        monthlyTotal: Math.round((weeklyTotal * 52) / 12),
        weeklyBreakdown,
        monthlyBreakdown,
        benchmarkLabel: `${adults} adult${adults === 1 ? "" : "s"}, ${children} dependent child${children === 1 ? "" : "ren"}, ${regionUsed}`,
        excludedCategories: EXCLUDED_CATEGORIES,
        regionUsed,
      },
    };
  }
}

/** Higher-income households tend to report modestly higher discretionary spend in Family Spending data. */
function incomeAdjustmentFactor(grossAnnualIncome: number): number {
  if (!(grossAnnualIncome > 0)) return 1;
  if (grossAnnualIncome < 20_000) return 0.85;
  if (grossAnnualIncome < 40_000) return 1.0;
  if (grossAnnualIncome < 70_000) return 1.15;
  return 1.3;
}
