import { describe, it, expect } from "vitest";
import { calculateAnnualChildBenefit, calculateChildBenefitWithCharge, calculateMarriageAllowance, CHILD_BENEFIT_RATES } from "./benefits";

describe("calculateAnnualChildBenefit", () => {
  it("computes benefit for one child (eldest rate only)", () => {
    expect(calculateAnnualChildBenefit(1)).toBeCloseTo(CHILD_BENEFIT_RATES.eldestWeekly * 52, 2);
  });

  it("computes benefit for two children (eldest + additional rate)", () => {
    const expected = (CHILD_BENEFIT_RATES.eldestWeekly + CHILD_BENEFIT_RATES.additionalWeekly) * 52;
    expect(calculateAnnualChildBenefit(2)).toBeCloseTo(expected, 2);
  });

  it("computes benefit for three children", () => {
    const expected = (CHILD_BENEFIT_RATES.eldestWeekly + 2 * CHILD_BENEFIT_RATES.additionalWeekly) * 52;
    expect(calculateAnnualChildBenefit(3)).toBeCloseTo(expected, 2);
  });

  it("returns zero for no children", () => {
    expect(calculateAnnualChildBenefit(0)).toBe(0);
  });

  it("handles negative input as zero", () => {
    expect(calculateAnnualChildBenefit(-2)).toBe(0);
  });

  it("floors a fractional number of children", () => {
    expect(calculateAnnualChildBenefit(1.9)).toBeCloseTo(CHILD_BENEFIT_RATES.eldestWeekly * 52, 2);
  });
});

describe("calculateChildBenefitWithCharge", () => {
  it("applies no charge below the £60,000 threshold", () => {
    const r = calculateChildBenefitWithCharge(2, 55_000);
    expect(r.chargePercent).toBe(0);
    expect(r.netAnnualChildBenefit).toBeCloseTo(r.grossAnnualChildBenefit, 2);
  });

  it("applies a partial charge midway through the taper", () => {
    // £70,000 is halfway between 60,000 and 80,000 -> 50% charge
    const r = calculateChildBenefitWithCharge(2, 70_000);
    expect(r.chargePercent).toBeCloseTo(50, 5);
    expect(r.netAnnualChildBenefit).toBeCloseTo(r.grossAnnualChildBenefit * 0.5, 2);
  });

  it("claws back 100% at or above £80,000", () => {
    const r = calculateChildBenefitWithCharge(2, 90_000);
    expect(r.chargePercent).toBe(100);
    expect(r.netAnnualChildBenefit).toBeCloseTo(0, 5);
  });

  it("returns zero benefit and zero charge with no children", () => {
    const r = calculateChildBenefitWithCharge(0, 90_000);
    expect(r.grossAnnualChildBenefit).toBe(0);
    expect(r.netAnnualChildBenefit).toBe(0);
  });

  it("handles exactly the threshold as no charge", () => {
    const r = calculateChildBenefitWithCharge(1, 60_000);
    expect(r.chargePercent).toBe(0);
  });

  it("handles negative income as zero income", () => {
    const r = calculateChildBenefitWithCharge(1, -1000);
    expect(r.chargePercent).toBe(0);
    expect(r.netAnnualChildBenefit).toBeCloseTo(r.grossAnnualChildBenefit, 2);
  });
});

describe("calculateMarriageAllowance", () => {
  it("is eligible when the lower earner is under the personal allowance and the higher earner is basic rate", () => {
    const r = calculateMarriageAllowance(8_000, 30_000);
    expect(r.eligible).toBe(true);
    expect(r.transferAmount).toBe(1_260);
    expect(r.annualTaxSaving).toBeCloseTo(252, 2);
  });

  it("is ineligible when the lower earner exceeds the personal allowance", () => {
    const r = calculateMarriageAllowance(15_000, 30_000);
    expect(r.eligible).toBe(false);
    expect(r.reason).toMatch(/12,570/);
    expect(r.annualTaxSaving).toBe(0);
  });

  it("is ineligible when the higher earner is a higher-rate taxpayer", () => {
    const r = calculateMarriageAllowance(5_000, 60_000);
    expect(r.eligible).toBe(false);
    expect(r.reason).toMatch(/basic-rate/);
  });

  it("is ineligible when the higher earner is themselves a non-taxpayer", () => {
    const r = calculateMarriageAllowance(5_000, 10_000);
    expect(r.eligible).toBe(false);
  });

  it("handles zero income for both partners", () => {
    const r = calculateMarriageAllowance(0, 0);
    expect(r.eligible).toBe(false);
  });
});
