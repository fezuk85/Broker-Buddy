import { describe, it, expect } from "vitest";
import { getIndexMovement } from "./ukhpiClient";
import ukhpiData from "@/lib/data/ukhpi/localAuthorityIndex.json";

describe("getIndexMovement", () => {
  it("computes real percentage movement for Derby between a real sale date and the latest available month", () => {
    // Cross-checked against the source CSV: Derby (E06000015) index was 102.0 in 2026-06 (latest).
    const result = getIndexMovement("E06000015", "2024-06-14");
    expect(result).not.toBeNull();
    expect(result?.asOfMonth).toBe("2026-06");
    expect(result?.fromMonth).toBe("2024-06");
    // Sanity: movement should be a real (possibly negative) finite number, not NaN/Infinity.
    expect(Number.isFinite(result?.movementPercent)).toBe(true);
  });

  it("falls back to the earliest available month for a sale date before the series starts", () => {
    // Derby's series in the source CSV starts 1995-01 (matches HM Land Registry's documented
    // "England and Wales since January 1995" coverage).
    const result = getIndexMovement("E06000015", "1980-01-01");
    expect(result).not.toBeNull();
    expect(result?.fromMonth).toBe("1995-01");
  });

  it("returns null for a local authority code not in the dataset (e.g. Scotland/NI, or an unknown code)", () => {
    expect(getIndexMovement("S12000034", "2020-01-01")).toBeNull();
    expect(getIndexMovement("Z99999999", "2020-01-01")).toBeNull();
  });

  it("compares trailing three-month averages at both ends, not single noisy months", () => {
    const derby = (ukhpiData as [string, string, number][]).filter((r) => r[0] === "E06000015");
    const value = (ym: string) => derby.find((r) => r[1] === ym)![2];
    const from = (value("2024-04") + value("2024-05") + value("2024-06")) / 3;
    const to = (value("2026-04") + value("2026-05") + value("2026-06")) / 3;

    const result = getIndexMovement("E06000015", "2024-06-14");
    expect(result?.movementPercent).toBeCloseTo((to / from - 1) * 100, 6);
  });

  it("gives a positive movement for a real rising market (Derby, 2021 to latest)", () => {
    expect(getIndexMovement("E06000015", "2021-01-15")!.movementPercent).toBeGreaterThan(10);
  });
});
