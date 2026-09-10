import { describe, it, expect } from "vitest";
import { RuleBasedHouseholdExpenditureProvider } from "./householdExpenditureProvider";

describe("RuleBasedHouseholdExpenditureProvider", () => {
  it("uses the UK average when no region is given", async () => {
    const r = await new RuleBasedHouseholdExpenditureProvider().getBenchmark({
      grossAnnualIncome: 40_000,
      adults: 2,
      dependentChildren: 0,
    });
    expect(r.estimate?.regionUsed).toBe("UK average");
  });

  it("scales spending up for London relative to the UK average", async () => {
    const provider = new RuleBasedHouseholdExpenditureProvider();
    const average = await provider.getBenchmark({ grossAnnualIncome: 40_000, adults: 2, dependentChildren: 0 });
    const london = await provider.getBenchmark({ grossAnnualIncome: 40_000, adults: 2, dependentChildren: 0, region: "London" });

    expect(london.estimate!.weeklyTotal).toBeGreaterThan(average.estimate!.weeklyTotal);
    expect(london.estimate?.regionUsed).toBe("London");
  });

  it("scales spending down for a lower-cost region relative to the UK average", async () => {
    const provider = new RuleBasedHouseholdExpenditureProvider();
    const average = await provider.getBenchmark({ grossAnnualIncome: 40_000, adults: 2, dependentChildren: 0 });
    const northEast = await provider.getBenchmark({
      grossAnnualIncome: 40_000,
      adults: 2,
      dependentChildren: 0,
      region: "North East",
    });

    expect(northEast.estimate!.weeklyTotal).toBeLessThan(average.estimate!.weeklyTotal);
  });

  it("includes the region in the benchmark label", async () => {
    const r = await new RuleBasedHouseholdExpenditureProvider().getBenchmark({
      grossAnnualIncome: 40_000,
      adults: 1,
      dependentChildren: 0,
      region: "Scotland",
    });
    expect(r.estimate?.benchmarkLabel).toContain("Scotland");
  });

  it("still returns unavailable with no household members, regardless of region", async () => {
    const r = await new RuleBasedHouseholdExpenditureProvider().getBenchmark({
      grossAnnualIncome: 40_000,
      adults: 0,
      dependentChildren: 0,
      region: "London",
    });
    expect(r.source).toBe("unavailable");
    expect(r.estimate).toBeNull();
  });
});
