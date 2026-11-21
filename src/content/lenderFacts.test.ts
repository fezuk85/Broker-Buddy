import { describe, it, expect } from "vitest";
import { LENDER_PROFILES } from "./lenderFacts";

describe("lender facts", () => {
  it("every fact has a source link and a date", () => {
    for (const lender of LENDER_PROFILES) {
      expect(lender.facts.length).toBeGreaterThan(0);
      for (const fact of lender.facts) {
        expect(fact.source.startsWith("https://")).toBe(true);
        expect(fact.date.length).toBeGreaterThan(0);
        expect(fact.text.length).toBeGreaterThan(10);
      }
    }
  });

  it("slugs are unique", () => {
    const slugs = LENDER_PROFILES.map((l) => l.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});
