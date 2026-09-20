import { describe, expect, it } from "vitest";
import { CALCULATORS, CALCULATOR_GROUPS, getGroupedCalculators } from "./calculators";

describe("calculator navigation groups", () => {
  it("places every calculator in exactly one group", () => {
    const grouped = CALCULATOR_GROUPS.flatMap((g) => g.slugs);
    expect([...grouped].sort()).toEqual(CALCULATORS.map((c) => c.slug).sort());
  });

  it("resolves every group slug to a real calculator", () => {
    for (const { group, calculators } of getGroupedCalculators()) {
      expect(calculators).toHaveLength(group.slugs.length);
    }
  });
});
