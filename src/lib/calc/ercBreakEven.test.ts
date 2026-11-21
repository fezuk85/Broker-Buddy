import { describe, it, expect } from "vitest";
import { calculateErcBreakEven } from "./ercBreakEven";

const base = {
  existingBalance: 200_000,
  existingRatePercent: 2.5,
  remainingTermYears: 20,
  extraBorrowing: 30_000,
  ercPercent: 3,
  newMortgageRatePercent: 5,
  secondChargeRatePercent: 8.5,
  secondChargeTermYears: 10,
  secondChargeFees: 0,
  remortgageFees: 0,
  horizonYears: 5,
};

describe("calculateErcBreakEven", () => {
  it("a low-rate existing mortgage with an ERC makes the second charge cheaper", () => {
    const r = calculateErcBreakEven(base)!;
    expect(r.cheaperRoute).toBe("second-charge");
    expect(r.secondChargeAdvantage).toBeGreaterThan(0);
    expect(r.ercAmount).toBeCloseTo(6000, 2);
  });

  it("with no ERC and a modest rate gap, remortgaging is cheaper", () => {
    const r = calculateErcBreakEven({ ...base, ercPercent: 0, existingRatePercent: 5, newMortgageRatePercent: 5 })!;
    expect(r.cheaperRoute).toBe("remortgage");
    expect(r.secondChargeAdvantage).toBeLessThan(0);
  });

  it("break-even ERC sits between 0 and 15 and the routes cost the same there", () => {
    const inputs = { ...base, existingRatePercent: 5, newMortgageRatePercent: 5 };
    const r = calculateErcBreakEven(inputs)!;
    expect(r.breakEvenErcPercent).not.toBeNull();
    const be = r.breakEvenErcPercent!;
    expect(be).toBeGreaterThan(0);
    expect(be).toBeLessThan(15);
    const at = calculateErcBreakEven({ ...inputs, ercPercent: be })!;
    expect(Math.abs(at.secondChargeAdvantage)).toBeLessThan(5);
  });

  it("break-even is null when the second charge is already cheaper with no ERC at all", () => {
    // Existing mortgage at 2.5% and a new one at 5%: remortgaging loses even if there is no ERC.
    const r = calculateErcBreakEven({ ...base, ercPercent: 0 })!;
    expect(r.cheaperRoute).toBe("second-charge");
    expect(r.breakEvenErcPercent).toBeNull();
  });

  it("break-even is null when remortgaging stays cheaper even with a 15% ERC", () => {
    const r = calculateErcBreakEven({ ...base, existingRatePercent: 5, newMortgageRatePercent: 3, secondChargeRatePercent: 14, extraBorrowing: 100_000, horizonYears: 10 })!;
    expect(r.breakEvenErcPercent).toBeNull();
  });

  it("fees on the second charge raise its cost", () => {
    const withFees = calculateErcBreakEven({ ...base, secondChargeFees: 3000 })!;
    const without = calculateErcBreakEven(base)!;
    expect(withFees.secondChargeCost).toBeGreaterThan(without.secondChargeCost);
  });

  it("returns null for unusable inputs", () => {
    expect(calculateErcBreakEven({ ...base, existingBalance: 0 })).toBeNull();
    expect(calculateErcBreakEven({ ...base, extraBorrowing: 0 })).toBeNull();
    expect(calculateErcBreakEven({ ...base, remainingTermYears: 0 })).toBeNull();
  });
});
