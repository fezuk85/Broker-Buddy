import { describe, it, expect } from "vitest";
import {
  totalHouseholdGrossIncome,
  calculateLoanToIncome,
  calculateMaxBorrowingByMultiple,
} from "./income";

describe("totalHouseholdGrossIncome", () => {
  it("sums two applicants", () => {
    expect(totalHouseholdGrossIncome({ applicant1GrossIncome: 40_000, applicant2GrossIncome: 30_000 })).toBe(70_000);
  });

  it("handles missing second applicant", () => {
    expect(totalHouseholdGrossIncome({ applicant1GrossIncome: 40_000 })).toBe(40_000);
  });
});

describe("calculateLoanToIncome", () => {
  it("computes LTI", () => {
    expect(calculateLoanToIncome(200_000, 50_000)).toBeCloseTo(4, 5);
  });

  it("returns null when income is zero", () => {
    expect(calculateLoanToIncome(200_000, 0)).toBeNull();
  });

  it("returns null for negative income", () => {
    expect(calculateLoanToIncome(200_000, -10)).toBeNull();
  });
});

describe("calculateMaxBorrowingByMultiple", () => {
  it("computes borrowing at each multiple", () => {
    const rows = calculateMaxBorrowingByMultiple(50_000, [4, 4.5, 5]);
    expect(rows.map((r) => r.maxBorrowing)).toEqual([200_000, 225_000, 250_000]);
  });

  it("clamps negative income to zero", () => {
    const rows = calculateMaxBorrowingByMultiple(-1000, [4]);
    expect(rows[0].maxBorrowing).toBe(0);
  });
});
