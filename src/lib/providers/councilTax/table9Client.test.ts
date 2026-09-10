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

  it("returns Cardiff's real Welsh charges, including the Band I that England doesn't have (cross-checked against the source CSV)", () => {
    const result = getChargesForAuthority("W06000015");
    expect(result?.authority).toBe("Cardiff");
    expect(result?.charges.D).toBeCloseTo(2013.18, 2);
    expect(result?.charges.I).toBeCloseTo(4697.42, 2);
  });

  it("returns null for an unknown ONS code", () => {
    expect(getChargesForAuthority("Z99999999")).toBeNull();
  });
});
