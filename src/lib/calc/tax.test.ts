import { describe, it, expect } from "vitest";
import {
  calculatePersonalAllowance,
  calculateIncomeTax,
  calculateNationalInsurance,
  calculateSalaryTakeHome,
  calculateDividendTax,
  calculateSalaryDividendTakeHome,
} from "./tax";

describe("calculatePersonalAllowance", () => {
  it("returns full allowance below the taper threshold", () => {
    expect(calculatePersonalAllowance(50_000)).toBe(12_570);
  });

  it("tapers by £1 per £2 over £100k", () => {
    expect(calculatePersonalAllowance(110_000)).toBe(12_570 - 5_000);
  });

  it("reaches zero at £125,140", () => {
    expect(calculatePersonalAllowance(125_140)).toBe(0);
  });

  it("stays at zero above £125,140", () => {
    expect(calculatePersonalAllowance(200_000)).toBe(0);
  });

  it("handles zero income", () => {
    expect(calculatePersonalAllowance(0)).toBe(12_570);
  });
});

describe("calculateIncomeTax", () => {
  it("charges no tax below the personal allowance", () => {
    const r = calculateIncomeTax(10_000);
    expect(r.totalIncomeTax).toBe(0);
  });

  it("computes basic-rate tax on £50,000", () => {
    const r = calculateIncomeTax(50_000);
    expect(r.taxableIncome).toBeCloseTo(50_000 - 12_570, 5);
    expect(r.totalIncomeTax).toBeCloseTo((50_000 - 12_570) * 0.2, 2);
  });

  it("computes higher-rate tax correctly on £70,000", () => {
    const r = calculateIncomeTax(70_000);
    const basicBand = 50_270 - 12_570;
    const higherAmount = 70_000 - 50_270;
    const expected = basicBand * 0.2 + higherAmount * 0.4;
    expect(r.totalIncomeTax).toBeCloseTo(expected, 2);
  });

  it("computes additional-rate tax for a £150,000 salary (PA fully tapered to £0)", () => {
    // Band widths apply to *taxable* income (gross minus PA), not gross income directly.
    // At £150k, PA is £0, so taxable income = £150,000, and the additional-rate slice is
    // everything above the basic (£37,700) + higher (£74,870) band widths, i.e. above
    // £112,570 of taxable income — this is what produces the well-known 60% marginal
    // rate between £100k-£125,140 (PA loss adds to taxable income at the *current*
    // marginal band, not a fresh band at the bottom).
    const r = calculateIncomeTax(150_000);
    const additionalBand = r.bands.find((b) => b.label === "Additional rate")!;
    const expectedAdditionalBand = 150_000 - (37_700 + 74_870);
    expect(additionalBand.amountInBand).toBeCloseTo(expectedAdditionalBand, 2);
    expect(r.totalIncomeTax).toBeCloseTo(37_700 * 0.2 + 74_870 * 0.4 + expectedAdditionalBand * 0.45, 2);
  });

  it("handles zero income", () => {
    const r = calculateIncomeTax(0);
    expect(r.totalIncomeTax).toBe(0);
    expect(r.personalAllowance).toBe(12_570);
  });

  it("handles negative income as zero", () => {
    const r = calculateIncomeTax(-5000);
    expect(r.totalIncomeTax).toBe(0);
  });
});

describe("calculateNationalInsurance", () => {
  it("charges nothing below the primary threshold", () => {
    expect(calculateNationalInsurance(10_000).totalNationalInsurance).toBe(0);
  });

  it("charges 8% between the primary threshold and UEL", () => {
    const r = calculateNationalInsurance(30_000);
    expect(r.totalNationalInsurance).toBeCloseTo((30_000 - 12_570) * 0.08, 2);
  });

  it("charges 2% above the upper earnings limit", () => {
    const r = calculateNationalInsurance(80_000);
    const mainBand = (50_270 - 12_570) * 0.08;
    const upperBand = (80_000 - 50_270) * 0.02;
    expect(r.totalNationalInsurance).toBeCloseTo(mainBand + upperBand, 2);
  });

  it("handles zero income", () => {
    expect(calculateNationalInsurance(0).totalNationalInsurance).toBe(0);
  });
});

describe("calculateSalaryTakeHome", () => {
  it("computes net annual/monthly/weekly for £50,000", () => {
    const r = calculateSalaryTakeHome(50_000);
    expect(r.netAnnual).toBeCloseTo(50_000 - r.totalDeductions, 5);
    expect(r.netMonthly).toBeCloseTo(r.netAnnual / 12, 5);
    expect(r.netWeekly).toBeCloseTo(r.netAnnual / 52, 5);
    expect(r.netAnnual).toBeGreaterThan(0);
    expect(r.netAnnual).toBeLessThan(50_000);
  });

  it("handles zero salary", () => {
    const r = calculateSalaryTakeHome(0);
    expect(r.netAnnual).toBe(0);
    expect(r.effectiveTaxRatePercent).toBe(0);
  });

  it("never produces negative net pay for a very high salary", () => {
    const r = calculateSalaryTakeHome(1_000_000);
    expect(r.netAnnual).toBeGreaterThan(0);
    expect(r.totalDeductions).toBeLessThan(1_000_000);
  });
});

describe("calculateDividendTax", () => {
  it("covers dividends fully by the dividend allowance when small", () => {
    const r = calculateDividendTax(20_000, 400);
    expect(r.totalDividendTax).toBe(0);
    expect(r.dividendAllowanceUsed).toBeCloseTo(400, 2);
  });

  it("taxes dividends at basic rate above the allowance when salary is within basic band", () => {
    const r = calculateDividendTax(20_000, 5_000);
    const taxableAfterAllowance = 5_000 - 500;
    expect(r.totalDividendTax).toBeCloseTo(taxableAfterAllowance * 0.0875, 2);
  });

  it("pushes dividends into higher rate once salary + dividends cross the basic band", () => {
    const r = calculateDividendTax(48_000, 10_000);
    // salary uses most of the basic band; some dividends should land in the higher band
    const higherBand = r.bands.find((b) => b.label === "Higher rate")!;
    expect(higherBand.amountInBand).toBeGreaterThan(0);
  });

  it("handles zero salary and zero dividends", () => {
    const r = calculateDividendTax(0, 0);
    expect(r.totalDividendTax).toBe(0);
  });

  it("handles dividends only (no salary), using full personal allowance first", () => {
    const r = calculateDividendTax(0, 10_000);
    // 10,000 dividends: 10,000 - 12,570 PA < 0, so allowance covers everything
    expect(r.totalDividendTax).toBe(0);
  });
});

describe("calculateSalaryDividendTakeHome", () => {
  it("combines salary and dividend take-home consistently", () => {
    const r = calculateSalaryDividendTakeHome(30_000, 10_000);
    expect(r.grossTotal).toBe(40_000);
    expect(r.netAnnual).toBeCloseTo(r.grossTotal - r.totalTaxAndNi, 5);
    expect(r.netMonthly).toBeCloseTo(r.netAnnual / 12, 5);
  });

  it("does not charge NI on dividend income", () => {
    const salaryOnly = calculateSalaryDividendTakeHome(30_000, 0);
    const withDividends = calculateSalaryDividendTakeHome(30_000, 10_000);
    expect(withDividends.nationalInsuranceOnSalary.totalNationalInsurance).toBeCloseTo(
      salaryOnly.nationalInsuranceOnSalary.totalNationalInsurance,
      5
    );
  });

  it("handles zero salary and zero dividends", () => {
    const r = calculateSalaryDividendTakeHome(0, 0);
    expect(r.netAnnual).toBe(0);
  });
});
