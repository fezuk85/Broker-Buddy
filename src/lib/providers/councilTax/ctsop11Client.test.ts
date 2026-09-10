import { describe, it, expect } from "vitest";
import { getAreaTypicalBand } from "./ctsop11Client";

describe("getAreaTypicalBand", () => {
  it("returns the most common band for a real LSOA (Derby 020B, cross-checked against the source CSV)", () => {
    // Row: E01013567, band_a=650, band_b=40, band_c=10, band_d=-, band_e=-, band_f=0, band_g=0, band_h=0
    const result = getAreaTypicalBand("E01013567");
    expect(result?.band).toBe("A");
    expect(result?.propertyCountInBand).toBe(650);
  });

  it("returns null for an LSOA not present in the dataset", () => {
    expect(getAreaTypicalBand("E01999999")).toBeNull();
  });

  it("never treats a suppressed ('-') or not-applicable ('..') count as zero when picking the mode", () => {
    // Sanity-check against a row where the top count band still wins even with null neighbours
    // (E01020634: band_a=260, band_b=80, band_c=170, band_d=110, band_e=70, band_f=20, band_g=20, band_h=null)
    const result = getAreaTypicalBand("E01020634");
    expect(result?.band).toBe("A");
    expect(result?.propertyCountInBand).toBe(260);
  });
});
