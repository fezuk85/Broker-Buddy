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

  it("weights the indexed estimate heavily (not exclusively) for a very recent matched sale", () => {
    // Once a house number is entered and matched to the property's own real, very recent (10
    // months ago) sale, that sale should dominate the combined estimate — it's the strongest
    // evidence available — but it's now blended rather than treated as gospel, so a much lower
    // set of comparables still pulls the figure down slightly rather than being ignored outright.
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
    const comparableEstimate = r.methods.find((m) => m.method === "comparable-sales")!.estimate;
    // Blended, not exactly equal to either input method...
    expect(r.combinedEstimate).not.toBe(indexedEstimate);
    expect(r.combinedEstimate).not.toBe(comparableEstimate);
    // ...but much closer to the recent indexed estimate than to the weaker comparables.
    expect(r.combinedEstimate!).toBeGreaterThan((indexedEstimate + comparableEstimate) / 2);
    expect(r.combinedEstimate!).toBeGreaterThan(340_000);
  });

  it("lets current comparable sales pull the combined estimate up when the matched sale is old and stale", () => {
    // The reported case this change addresses: a property's own last known sale was 15 years ago,
    // and the area-wide index multiplier alone landed well below what recent local sales show. The
    // stale indexed estimate should now be outweighed by current comparable evidence, not treated
    // as the final answer.
    const r = calculateIndicativeValuation({
      asOfDate: "2026-09-24",
      lastKnownSale: { price: 140_000, date: "2011-02-11" },
      indexMovementPercent: 31.5, // roughly matches the real Tower Hamlets movement since 2011
      comparableSales: [
        { pricePaid: 430_000, saleDate: "2025-09-03" },
        { pricePaid: 460_000, saleDate: "2024-03-01" },
        { pricePaid: 450_000, saleDate: "2021-09-29" },
      ],
    });
    const indexedEstimate = r.methods.find((m) => m.method === "historic-sale-indexation")!.estimate;
    const comparableEstimate = r.methods.find((m) => m.method === "comparable-sales")!.estimate;
    expect(indexedEstimate).toBeCloseTo(184_100, -2);
    // The stale index alone would say ~£184k; blending with current comparables should pull the
    // combined figure up substantially above that, not leave it stuck near the stale number.
    expect(r.combinedEstimate!).toBeGreaterThan(indexedEstimate * 1.3);
    expect(r.combinedEstimate!).toBeLessThan(comparableEstimate);
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
