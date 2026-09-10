import { describe, it, expect } from "vitest";
import { getChargesForAuthority } from "./table9Client";

describe("getChargesForAuthority", () => {
  it("returns the full band A-H charges for a known ONS local authority code", () => {
    const result = getChargesForAuthority("E09000007"); // Camden
    expect(result?.authority).toBe("Camden");
    expect(result?.charges.D).toBeCloseTo(2207.55, 2);
    expect(result?.charges.A).toBeCloseTo(1471.7, 2);
    expect(result?.charges.H).toBeCloseTo(4415.1, 2);
  });

  it("returns Derby's real Table 9 figures (cross-checked against the source ODS)", () => {
    const result = getChargesForAuthority("E06000015");
    expect(result?.authority).toBe("Derby");
    expect(result?.charges.D).toBeCloseTo(2306, 2);
  });

  it("returns null for an unknown or non-English ONS code", () => {
    expect(getChargesForAuthority("Z99999999")).toBeNull();
  });
});
