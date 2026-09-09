import { describe, it, expect } from "vitest";
import { calculateLtv, calculateMaxLoanAtLtvBands } from "./ltv";

describe("calculateLtv", () => {
  it("computes standard LTV, equity and additional borrowing", () => {
    const r = calculateLtv({
      propertyValue: 300_000,
      currentMortgageBalance: 150_000,
      additionalBorrowingRequired: 20_000,
    });
    expect(r.currentLtvPercent).toBeCloseTo(50, 5);
    expect(r.totalProposedBorrowing).toBe(170_000);
    expect(r.proposedLtvPercent).toBeCloseTo(56.6667, 3);
    expect(r.equity).toBe(150_000);
    expect(r.equityAfterProposedBorrowing).toBe(130_000);
  });

  it("returns null LTV when property value is zero", () => {
    const r = calculateLtv({
      propertyValue: 0,
      currentMortgageBalance: 100_000,
      additionalBorrowingRequired: 0,
    });
    expect(r.currentLtvPercent).toBeNull();
    expect(r.proposedLtvPercent).toBeNull();
  });

  it("handles negative equity (mortgage > property value)", () => {
    const r = calculateLtv({
      propertyValue: 200_000,
      currentMortgageBalance: 250_000,
      additionalBorrowingRequired: 0,
    });
    expect(r.currentLtvPercent).toBeCloseTo(125, 5);
    expect(r.equity).toBe(-50_000);
  });

  it("handles zero balances", () => {
    const r = calculateLtv({
      propertyValue: 300_000,
      currentMortgageBalance: 0,
      additionalBorrowingRequired: 0,
    });
    expect(r.currentLtvPercent).toBe(0);
    expect(r.equity).toBe(300_000);
  });
});

describe("calculateMaxLoanAtLtvBands", () => {
  it("computes max loan and additional borrowing for each band", () => {
    const rows = calculateMaxLoanAtLtvBands(300_000, 150_000, [50, 75, 95]);
    expect(rows).toHaveLength(3);
    expect(rows[0]).toEqual({ ltvPercent: 50, maxLoan: 150_000, additionalBorrowingAvailable: 0 });
    expect(rows[1].maxLoan).toBeCloseTo(225_000, 5);
    expect(rows[1].additionalBorrowingAvailable).toBeCloseTo(75_000, 5);
    expect(rows[2].additionalBorrowingAvailable).toBeCloseTo(135_000, 5);
  });

  it("floors additional borrowing available at zero when already above the band", () => {
    const rows = calculateMaxLoanAtLtvBands(300_000, 280_000, [50]);
    expect(rows[0].additionalBorrowingAvailable).toBe(0);
  });

  it("handles zero property value", () => {
    const rows = calculateMaxLoanAtLtvBands(0, 0, [50]);
    expect(rows[0].maxLoan).toBe(0);
  });
});
