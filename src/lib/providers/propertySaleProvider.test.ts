import { describe, it, expect } from "vitest";
import { matchSalesToAddress, type PropertySale } from "./propertySaleProvider";

function sale(addressLine1: string, pricePaid: number, saleDate: string): PropertySale {
  return {
    addressLine1,
    pricePaid,
    saleDate,
    propertyType: "terraced",
    newBuild: false,
    tenure: "freehold",
    postcode: "DE23 8PL",
  };
}

// Real addresses from HM Land Registry for DE23 8PL, most recent first.
const SALES = [
  sale("164 PEAR TREE STREET", 130_000, "2024-06-14"),
  sale("162 PEAR TREE STREET", 125_000, "2023-12-15"),
  sale("154 PEAR TREE STREET", 170_000, "2023-06-29"),
  sale("162 PEAR TREE STREET", 90_000, "2022-07-01"),
  sale("16 PEAR TREE STREET", 75_000, "2010-03-01"),
];

describe("matchSalesToAddress", () => {
  it("matches a house number as a whole word, not a substring (16 must not match 162/164)", () => {
    const r = matchSalesToAddress(SALES, "16");
    expect(r.status).toBe("matched");
    if (r.status === "matched") {
      expect(r.sales).toHaveLength(1);
      expect(r.sales[0].addressLine1).toBe("16 PEAR TREE STREET");
    }
  });

  it("returns all sales of one property, most recent first", () => {
    const r = matchSalesToAddress(SALES, "162");
    expect(r.status).toBe("matched");
    if (r.status === "matched") {
      expect(r.sales.map((s) => s.pricePaid)).toEqual([125_000, 90_000]);
    }
  });

  it("is case-insensitive and ignores punctuation", () => {
    const r = matchSalesToAddress(SALES, "164, pear tree street");
    expect(r.status).toBe("matched");
  });

  it("reports ambiguity instead of silently choosing when several properties match", () => {
    const r = matchSalesToAddress(SALES, "Pear Tree Street");
    expect(r.status).toBe("ambiguous");
    if (r.status === "ambiguous") expect(r.addresses.length).toBeGreaterThan(1);
  });

  it("reports no match for an address with no sales", () => {
    expect(matchSalesToAddress(SALES, "999").status).toBe("none");
  });

  it("returns every sale when the query is empty", () => {
    const r = matchSalesToAddress(SALES, "  ");
    expect(r.status).toBe("matched");
    if (r.status === "matched") expect(r.sales).toHaveLength(SALES.length);
  });
});
