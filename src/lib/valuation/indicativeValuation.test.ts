import { describe, it, expect } from "vitest";
import { calculateIndicativeValuation } from "./indicativeValuation";

describe("calculateIndicativeValuation", () => {
  it("reports insufficient data when there is nothing to go on", () => {
    const r = calculateIndicativeValuation({});
    expect(r.insufficientData).toBe(true);
    expect(r.combinedEstimate).toBeNull();
    expect(r.confidence).toBeNull();
  });

  it("uses historic sale indexation alone when that is all that's available", () => {
    const r = calculateIndicativeValuation({
      lastKnownSale: { price: 285_000, date: "2018-03-01" },
      indexMovementPercent: 23.5,
    });
    expect(r.insufficientData).toBe(false);
    expect(r.methods).toHaveLength(1);
    expect(r.combinedEstimate).toBeCloseTo(285_000 * 1.235, 0);
  });

  it("ignores comparable-sales method when fewer than 3 comparables given", () => {
    const r = calculateIndicativeValuation({
      comparableSales: [
        { pricePaid: 300_000, saleDate: "2025-01-01" },
        { pricePaid: 310_000, saleDate: "2025-02-01" },
      ],
    });
    expect(r.insufficientData).toBe(true);
  });

  it("combines all three methods and produces a range and confidence", () => {
    const r = calculateIndicativeValuation({
      lastKnownSale: { price: 285_000, date: "2018-03-01" },
      indexMovementPercent: 23.5,
      comparableSales: [
        { pricePaid: 350_000, saleDate: "2025-01-01", floorAreaSqm: 85 },
        { pricePaid: 360_000, saleDate: "2025-02-01", floorAreaSqm: 90 },
        { pricePaid: 370_000, saleDate: "2025-03-01", floorAreaSqm: 92 },
        { pricePaid: 355_000, saleDate: "2025-04-01", floorAreaSqm: 88 },
      ],
      subjectFloorAreaSqm: 89,
    });
    expect(r.methods).toHaveLength(3);
    expect(r.combinedEstimate).toBeGreaterThan(300_000);
    expect(r.rangeLow).toBeLessThan(r.combinedEstimate!);
    expect(r.rangeHigh).toBeGreaterThan(r.combinedEstimate!);
    expect(["LOW", "MEDIUM", "HIGH"]).toContain(r.confidence);
  });

  it("never produces a negative or zero range from valid positive inputs", () => {
    const r = calculateIndicativeValuation({
      lastKnownSale: { price: 100_000, date: "2020-01-01" },
      indexMovementPercent: 5,
    });
    expect(r.rangeLow!).toBeGreaterThan(0);
  });
});
