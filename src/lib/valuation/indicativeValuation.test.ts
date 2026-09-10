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

  it("prefers recent comparables over decades of unadjusted nominal prices", () => {
    // Regression test: a street with one recent high sale and many old, much lower nominal sales
    // (e.g. from the 1990s-2010s) should not have its median dragged down by ancient prices when
    // there are enough recent sales on their own to form a reliable median.
    const r = calculateIndicativeValuation({
      asOfDate: "2026-09-10",
      comparableSales: [
        { pricePaid: 370_000, saleDate: "2025-11-14" },
        { pricePaid: 310_000, saleDate: "2025-05-09" },
        { pricePaid: 250_000, saleDate: "2024-10-15" },
        // Old sales that should be excluded from the recency-filtered median.
        { pricePaid: 46_000, saleDate: "1996-04-02" },
        { pricePaid: 58_000, saleDate: "1997-11-28" },
        { pricePaid: 62_000, saleDate: "1999-02-05" },
        { pricePaid: 77_000, saleDate: "2000-05-31" },
        { pricePaid: 119_000, saleDate: "2006-01-31" },
        { pricePaid: 134_500, saleDate: "2012-06-27" },
      ],
    });
    expect(r.insufficientData).toBe(false);
    expect(r.methods).toHaveLength(1);
    expect(r.methods[0].estimate).toBe(310_000);
    expect(r.methods[0].detail).toContain("in the last 24 months");
  });

  it("falls back to the full sale history when there are fewer than 3 recent comparables", () => {
    const r = calculateIndicativeValuation({
      asOfDate: "2026-09-10",
      comparableSales: [
        { pricePaid: 370_000, saleDate: "2025-11-14" },
        { pricePaid: 134_500, saleDate: "2012-06-27" },
        { pricePaid: 119_000, saleDate: "2006-01-31" },
      ],
    });
    expect(r.insufficientData).toBe(false);
    expect(r.methods).toHaveLength(1);
    expect(r.methods[0].estimate).toBe(134_500);
    expect(r.methods[0].detail).toContain("fewer than 3 in the last 24 months");
  });

  it("anchors the combined estimate to the indexed estimate when a specific property is matched, rather than averaging it down with comparables", () => {
    // Regression test for a real user-reported case: once a house number is entered and matched
    // to the property's own real, very recent (10 months ago) sale, the combined estimate should
    // reflect that known trajectory — certainly not fall below the price the property itself just
    // achieved — even though nearby but different comparable properties sold for less.
    const r = calculateIndicativeValuation({
      asOfDate: "2026-09-10",
      lastKnownSale: { price: 370_000, date: "2025-11-14" },
      indexMovementPercent: 0.59,
      comparableSales: [
        { pricePaid: 370_000, saleDate: "2025-11-14" },
        { pricePaid: 310_000, saleDate: "2025-05-09" },
        { pricePaid: 223_000, saleDate: "2025-03-11" },
        { pricePaid: 200_000, saleDate: "2025-03-03" },
      ],
    });
    expect(r.methods).toHaveLength(2);
    const indexedEstimate = r.methods.find((m) => m.method === "historic-sale-indexation")!.estimate;
    // The combined estimate should equal the indexed estimate exactly — not be diluted by
    // averaging with the comparable-sales figure — and, since the index movement was positive,
    // it comes out above the last known sale price.
    expect(r.combinedEstimate).toBe(indexedEstimate);
    expect(r.combinedEstimate!).toBeGreaterThan(370_000);
    // The range should still bracket the property's own real, recent sale price.
    expect(r.rangeLow!).toBeLessThanOrEqual(370_000);
  });

  it("falls back to averaging comparable-based methods when no specific property is matched (no indexed estimate)", () => {
    const r = calculateIndicativeValuation({
      asOfDate: "2026-09-10",
      comparableSales: [
        { pricePaid: 370_000, saleDate: "2025-11-14" },
        { pricePaid: 310_000, saleDate: "2025-05-09" },
        { pricePaid: 223_000, saleDate: "2025-03-11" },
        { pricePaid: 200_000, saleDate: "2025-03-03" },
      ],
    });
    expect(r.methods).toHaveLength(1);
    expect(r.combinedEstimate).toBe(r.methods[0].estimate);
  });
});
