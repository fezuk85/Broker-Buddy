import { describe, it, expect } from "vitest";
import { calculateStampDuty } from "./stampDuty";

const std = (price: number, extra: Partial<Parameters<typeof calculateStampDuty>[0]> = {}) =>
  calculateStampDuty({ price, buyerType: "standard", nonUkResident: false, ...extra });

describe("calculateStampDuty — standard rates (England & NI)", () => {
  it("is zero at or below £125,000", () => {
    expect(std(125_000).totalTax).toBe(0);
    expect(std(80_000).totalTax).toBe(0);
  });

  it("£300,000 → £5,000 (2% of £125k + 5% of £50k)", () => {
    expect(std(300_000).totalTax).toBeCloseTo(5_000, 2);
  });

  it("£500,000 → £15,000", () => {
    expect(std(500_000).totalTax).toBeCloseTo(15_000, 2);
  });

  it("£1,000,000 → £43,750", () => {
    expect(std(1_000_000).totalTax).toBeCloseTo(43_750, 2);
  });

  it("£2,000,000 → £153,750 across all five bands", () => {
    const r = std(2_000_000);
    expect(r.totalTax).toBeCloseTo(153_750, 2);
    expect(r.bands).toHaveLength(5);
  });

  it("returns null effective rate and no tax for a zero price", () => {
    const r = std(0);
    expect(r.totalTax).toBe(0);
    expect(r.effectiveRatePercent).toBeNull();
  });
});

describe("calculateStampDuty — first-time buyers", () => {
  const ftb = (price: number) => calculateStampDuty({ price, buyerType: "first-time", nonUkResident: false });

  it("pays nothing up to £300,000", () => {
    const r = ftb(300_000);
    expect(r.totalTax).toBe(0);
    expect(r.firstTimeBuyerReliefApplied).toBe(true);
  });

  it("pays 5% only on the portion between £300k and £500k", () => {
    expect(ftb(400_000).totalTax).toBeCloseTo(5_000, 2);
    expect(ftb(500_000).totalTax).toBeCloseTo(10_000, 2);
  });

  it("loses relief entirely above £500,000 and pays standard rates on the whole price", () => {
    const r = ftb(500_001);
    expect(r.firstTimeBuyerReliefApplied).toBe(false);
    expect(r.firstTimeBuyerReliefNote).toMatch(/not available/);
    expect(r.totalTax).toBeCloseTo(std(500_001).totalTax, 2);
  });
});

describe("calculateStampDuty — surcharges", () => {
  it("adds 5% of the whole price for an additional property", () => {
    const r = calculateStampDuty({ price: 300_000, buyerType: "additional", nonUkResident: false });
    expect(r.additionalPropertySurcharge).toBeCloseTo(15_000, 2);
    expect(r.totalTax).toBeCloseTo(20_000, 2);
  });

  it("does not apply the additional-property surcharge under £40,000", () => {
    const r = calculateStampDuty({ price: 39_999, buyerType: "additional", nonUkResident: false });
    expect(r.additionalPropertySurcharge).toBe(0);
  });

  it("adds 2% of the whole price for non-UK residents, stacking with the additional surcharge", () => {
    const r = calculateStampDuty({ price: 300_000, buyerType: "additional", nonUkResident: true });
    expect(r.nonResidentSurcharge).toBeCloseTo(6_000, 2);
    expect(r.totalTax).toBeCloseTo(26_000, 2);
  });
});
