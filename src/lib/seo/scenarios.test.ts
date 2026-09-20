import { describe, expect, it } from "vitest";
import { getCalculator } from "./calculators";
import { CASE_CALCULATOR_SLUG, SCENARIOS } from "./scenarios";

describe("home page scenarios", () => {
  it("has unique scenario ids", () => {
    const ids = SCENARIOS.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("only points at real calculators (or the Case Calculator)", () => {
    for (const s of SCENARIOS) {
      for (const t of s.tools) {
        expect(t.slug === CASE_CALCULATOR_SLUG || getCalculator(t.slug) !== undefined, `${s.id}: ${t.slug}`).toBe(true);
      }
    }
  });

  it("lists no tool twice within a scenario", () => {
    for (const s of SCENARIOS) {
      const slugs = s.tools.map((t) => t.slug);
      expect(new Set(slugs).size, s.id).toBe(slugs.length);
    }
  });

  it("includes the age / max term calculator in the second-charge scenario", () => {
    const sc = SCENARIOS.find((s) => s.id === "second-charge");
    expect(sc?.tools.some((t) => t.slug === "mortgage-term-age-calculator")).toBe(true);
  });

  it("uses every standalone calculator at least once, so none is orphaned from the home page", () => {
    const used = new Set(SCENARIOS.flatMap((s) => s.tools.map((t) => t.slug)));
    for (const slug of ["salary-calculator", "dividend-calculator", "bridging-interest-calculator", "btl-icr-calculator"]) {
      expect(used.has(slug), slug).toBe(true);
    }
  });
});
