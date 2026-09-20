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

const wales = (price: number, extra: Partial<Parameters<typeof calculateStampDuty>[0]> = {}) =>
  calculateStampDuty({ price, buyerType: "standard", nonUkResident: false, region: "wales", ...extra });
const scotland = (price: number, extra: Partial<Parameters<typeof calculateStampDuty>[0]> = {}) =>
  calculateStampDuty({ price, buyerType: "standard", nonUkResident: false, region: "scotland", ...extra });

describe("calculateStampDuty — England is the default region", () => {
  it("gives the same answer with and without an explicit england-ni region", () => {
    expect(std(450_000, { region: "england-ni" }).totalTax).toBe(std(450_000).totalTax);
    expect(std(450_000).taxShortName).toBe("SDLT");
  });
});

describe("calculateStampDuty — Wales (LTT)", () => {
  it("is zero at or below £225,000", () => {
    expect(wales(225_000).totalTax).toBe(0);
    expect(wales(150_000).totalTax).toBe(0);
  });

  it("£300,000 → £4,500 (6% of £75k)", () => {
    expect(wales(300_000).totalTax).toBeCloseTo(4_500, 2);
  });

  it("£500,000 → £18,000 (£10,500 + 7.5% of £100k)", () => {
    expect(wales(500_000).totalTax).toBeCloseTo(18_000, 2);
  });

  it("£1,000,000 → £61,750", () => {
    expect(wales(1_000_000).totalTax).toBeCloseTo(61_750, 2);
  });

  it("£2,000,000 → £171,750 across all five bands", () => {
    const r = wales(2_000_000);
    expect(r.totalTax).toBeCloseTo(171_750, 2);
    expect(r.bands).toHaveLength(5);
    expect(r.taxShortName).toBe("LTT");
  });

  it("uses the higher residential bands, by slice, for an additional dwelling of £300,000 → £19,950", () => {
    const r = wales(300_000, { buyerType: "additional" });
    expect(r.higherRatesApplied).toBe(true);
    expect(r.totalTax).toBeCloseTo(19_950, 2);
    expect(r.additionalPropertySurcharge).toBe(0);
  });

  it("applies the higher rates from £40,000 but not below", () => {
    expect(wales(40_000, { buyerType: "additional" }).totalTax).toBeCloseTo(2_000, 2);
    const under = wales(39_999, { buyerType: "additional" });
    expect(under.higherRatesApplied).toBe(false);
    expect(under.totalTax).toBe(0);
  });

  it("has no first-time buyer relief and says so", () => {
    const r = wales(300_000, { buyerType: "first-time" });
    expect(r.firstTimeBuyerReliefApplied).toBe(false);
    expect(r.firstTimeBuyerReliefNote).toMatch(/no first-time buyer relief/i);
    expect(r.totalTax).toBeCloseTo(wales(300_000).totalTax, 2);
  });

  it("ignores the non-UK resident flag (no surcharge in Wales) and notes it", () => {
    const r = wales(300_000, { nonUkResident: true });
    expect(r.nonResidentSurcharge).toBe(0);
    expect(r.totalTax).toBeCloseTo(4_500, 2);
    expect(r.notes.join(" ")).toMatch(/no non-UK resident surcharge/i);
  });
});

describe("calculateStampDuty — Scotland (LBTT)", () => {
  it("is zero at or below £145,000", () => {
    expect(scotland(145_000).totalTax).toBe(0);
  });

  it("£300,000 → £4,600 (2% of £105k + 5% of £50k)", () => {
    expect(scotland(300_000).totalTax).toBeCloseTo(4_600, 2);
  });

  it("£500,000 → £23,350", () => {
    expect(scotland(500_000).totalTax).toBeCloseTo(23_350, 2);
  });

  it("£1,000,000 → £78,350 across all five bands", () => {
    const r = scotland(1_000_000);
    expect(r.totalTax).toBeCloseTo(78_350, 2);
    expect(r.bands).toHaveLength(5);
    expect(r.taxShortName).toBe("LBTT");
  });

  it("first-time buyer relief lifts the nil-rate band to £175,000 (saves £600 above £250k)", () => {
    const ftb = (p: number) => scotland(p, { buyerType: "first-time" });
    expect(ftb(175_000).totalTax).toBe(0);
    expect(ftb(200_000).totalTax).toBeCloseTo(500, 2);
    expect(ftb(300_000).totalTax).toBeCloseTo(4_000, 2);
    expect(ftb(300_000).firstTimeBuyerReliefApplied).toBe(true);
    expect(scotland(300_000).totalTax - ftb(300_000).totalTax).toBeCloseTo(600, 2);
  });

  it("keeps the first-time buyer saving at any price (no price cap)", () => {
    expect(scotland(900_000).totalTax - scotland(900_000, { buyerType: "first-time" }).totalTax).toBeCloseTo(600, 2);
  });

  it("adds the 8% Additional Dwelling Supplement on the whole price: £300,000 → £28,600", () => {
    const r = scotland(300_000, { buyerType: "additional" });
    expect(r.additionalPropertySurcharge).toBeCloseTo(24_000, 2);
    expect(r.additionalPropertySurchargeLabel).toMatch(/Additional Dwelling Supplement \(8%/);
    expect(r.totalTax).toBeCloseTo(28_600, 2);
  });

  it("does not charge the ADS under £40,000", () => {
    expect(scotland(39_999, { buyerType: "additional" }).additionalPropertySurcharge).toBe(0);
  });

  it("ignores the non-UK resident flag (no surcharge in Scotland) and notes it", () => {
    const r = scotland(300_000, { nonUkResident: true });
    expect(r.nonResidentSurcharge).toBe(0);
    expect(r.notes.join(" ")).toMatch(/no non-UK resident surcharge/i);
  });
});
