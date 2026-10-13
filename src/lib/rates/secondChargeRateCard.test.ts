import { describe, it, expect } from "vitest";
import { findSecondChargeRate, getFullRateGrid } from "./secondChargeRateCard";

describe("findSecondChargeRate", () => {
  it("picks the exact band when combined LTV matches a band ceiling", () => {
    const r = findSecondChargeRate("super-prime", "2yr-fix", 65);
    expect(r).toEqual({ maxLtvBand: 65, ratePercent: 6.39, trackerMarginPercent: null });
  });

  it("rounds up to the next band when combined LTV falls between bands", () => {
    // 62% isn't a band on the card — the next band up (65%) prices it, same as the lender's own card.
    const r = findSecondChargeRate("super-prime", "2yr-fix", 62);
    expect(r?.maxLtvBand).toBe(65);
    expect(r?.ratePercent).toBe(6.39);
  });

  it("returns the tracker margin, not a flat rate, for the tracker product", () => {
    const r = findSecondChargeRate("prime", "boe-tracker", 70);
    expect(r).toEqual({ maxLtvBand: 70, ratePercent: null, trackerMarginPercent: 5.34 });
  });

  it("returns null when the LTV exceeds every band this lender offers for that profile", () => {
    // Specialist tops out at 80% on this card — no 85% band like the other tiers.
    expect(findSecondChargeRate("specialist", "2yr-fix", 82)).toBeNull();
    expect(findSecondChargeRate("super-prime", "2yr-fix", 90)).toBeNull();
  });

  it("returns a rate for every published credit profile at a representative LTV", () => {
    for (const profile of ["super-prime", "prime-plus", "prime", "near-prime", "specialist"] as const) {
      const r = findSecondChargeRate(profile, "5yr-fix", 70);
      expect(r?.ratePercent).toBeGreaterThan(0);
    }
  });
});

describe("getFullRateGrid", () => {
  it("returns one row per product, each with a value per LTV band", () => {
    const grid = getFullRateGrid("super-prime");
    expect(grid.maxLtvBands).toEqual([60, 65, 70, 75, 80, 85]);
    expect(grid.rows).toHaveLength(5);
    for (const row of grid.rows) {
      expect(row.values).toHaveLength(grid.maxLtvBands.length);
    }
  });

  it("has fewer LTV bands for Specialist, which this lender caps at 80%", () => {
    const grid = getFullRateGrid("specialist");
    expect(grid.maxLtvBands).toEqual([60, 65, 70, 75, 80]);
  });
});
