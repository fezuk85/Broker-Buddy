import { describe, it, expect } from "vitest";
import { derivePostcodeArea, deriveRegionFromPostcode, asCompletePostcode } from "./postcodeRegions";

describe("derivePostcodeArea", () => {
  it("extracts a two-letter area", () => {
    expect(derivePostcodeArea("SW1A 1AA")).toBe("SW");
  });

  it("extracts a one-letter area", () => {
    expect(derivePostcodeArea("B1 1AA")).toBe("B");
  });

  it("is case-insensitive", () => {
    expect(derivePostcodeArea("sw1a 1aa")).toBe("SW");
  });

  it("handles no space between area and district", () => {
    expect(derivePostcodeArea("M11AE")).toBe("M");
  });

  it("returns null for an empty string", () => {
    expect(derivePostcodeArea("")).toBeNull();
  });

  it("returns null for unparseable input", () => {
    expect(derivePostcodeArea("not a postcode")).toBeNull();
  });

  it("distinguishes a two-letter area from its one-letter prefix", () => {
    expect(derivePostcodeArea("BA1 1AA")).toBe("BA");
    expect(derivePostcodeArea("B1 1AA")).toBe("B");
  });
});

describe("deriveRegionFromPostcode", () => {
  it("resolves a London postcode", () => {
    expect(deriveRegionFromPostcode("SW1A 1AA")).toBe("London");
  });

  it("resolves a Scotland postcode", () => {
    expect(deriveRegionFromPostcode("EH1 1AA")).toBe("Scotland");
  });

  it("resolves a Northern Ireland postcode", () => {
    expect(deriveRegionFromPostcode("BT1 1AA")).toBe("Northern Ireland");
  });

  it("resolves a Wales postcode", () => {
    expect(deriveRegionFromPostcode("CF10 1AA")).toBe("Wales");
  });

  it("distinguishes Birmingham (West Midlands) from Bath (South West)", () => {
    expect(deriveRegionFromPostcode("B1 1AA")).toBe("West Midlands");
    expect(deriveRegionFromPostcode("BA1 1AA")).toBe("South West");
  });

  it("returns null for an empty postcode", () => {
    expect(deriveRegionFromPostcode("")).toBeNull();
  });

  it("returns null for an unrecognised area", () => {
    expect(deriveRegionFromPostcode("ZZ1 1AA")).toBeNull();
  });
});

describe("asCompletePostcode", () => {
  it("accepts complete, well-formed postcodes in various valid shapes", () => {
    expect(asCompletePostcode("SW1A 1AA")).toBe("SW1A 1AA");
    expect(asCompletePostcode("CF23 5PQ")).toBe("CF23 5PQ");
    expect(asCompletePostcode("M1 1AE")).toBe("M1 1AE");
    expect(asCompletePostcode("de23 8pl")).toBe("DE23 8PL"); // trims/uppercases
  });

  it("accepts a postcode missing its internal space", () => {
    expect(asCompletePostcode("CF235PQ")).toBe("CF235PQ");
  });

  it("rejects partial postcodes typed character-by-character", () => {
    // This is the exact scenario that was firing a live API request on every keystroke.
    for (const partial of ["C", "CF", "CF2", "CF23", "CF23 ", "CF23 5", "CF23 5P"]) {
      expect(asCompletePostcode(partial)).toBeUndefined();
    }
  });

  it("rejects empty input", () => {
    expect(asCompletePostcode("")).toBeUndefined();
  });

  it("rejects garbage input", () => {
    expect(asCompletePostcode("not a postcode")).toBeUndefined();
  });
});
