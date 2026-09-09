import { describe, it, expect } from "vitest";
import {
  ageBetween,
  currentAge,
  ageAtTermEnd,
  oldestApplicantDob,
  maxTermForLenderMaxAge,
  calculateMaxTermsAcrossLenderAges,
} from "./age";

describe("ageBetween", () => {
  it("computes exact years and months", () => {
    const dob = new Date("1990-06-15");
    const asOf = new Date("2026-01-15");
    const age = ageBetween(dob, asOf);
    expect(age).toEqual({ years: 35, months: 7, totalMonths: 35 * 12 + 7 });
  });

  it("rounds down when birthday for the month has not occurred yet", () => {
    const dob = new Date("1990-06-20");
    const asOf = new Date("2026-01-15");
    const age = ageBetween(dob, asOf);
    expect(age).toEqual({ years: 35, months: 6, totalMonths: 35 * 12 + 6 });
  });

  it("returns null for an invalid date", () => {
    expect(ageBetween(new Date("not-a-date"), new Date())).toBeNull();
  });

  it("returns null when date of birth is in the future", () => {
    const future = new Date();
    future.setFullYear(future.getFullYear() + 5);
    expect(ageBetween(future, new Date())).toBeNull();
  });

  it("handles a newborn (age zero)", () => {
    const today = new Date("2026-01-15");
    expect(ageBetween(new Date("2026-01-01"), today)).toEqual({ years: 0, months: 0, totalMonths: 0 });
  });

  it("handles a very old applicant", () => {
    const today = new Date("2026-01-15");
    const age = ageBetween(new Date("1926-01-15"), today);
    expect(age?.years).toBe(100);
  });
});

describe("currentAge / ageAtTermEnd", () => {
  it("computes age at end of a 300-month (25yr) term", () => {
    const today = new Date("2026-01-15");
    const dob = new Date("1990-01-15");
    expect(currentAge(dob, today)?.years).toBe(36);
    const end = ageAtTermEnd(dob, 300, today);
    expect(end?.years).toBe(61);
  });

  it("returns null for negative term", () => {
    expect(ageAtTermEnd(new Date("1990-01-01"), -12, new Date())).toBeNull();
  });

  it("handles a zero-month term (age unchanged)", () => {
    const today = new Date("2026-01-15");
    const dob = new Date("1990-01-15");
    expect(ageAtTermEnd(dob, 0, today)).toEqual(currentAge(dob, today));
  });
});

describe("oldestApplicantDob", () => {
  it("picks the earlier (older) date of birth", () => {
    const older = new Date("1970-01-01");
    const younger = new Date("1995-01-01");
    expect(oldestApplicantDob([younger, older])).toEqual(older);
  });

  it("ignores missing applicant 2", () => {
    const only = new Date("1990-01-01");
    expect(oldestApplicantDob([only, undefined, null])).toEqual(only);
  });

  it("returns null when no valid DOBs given", () => {
    expect(oldestApplicantDob([null, undefined])).toBeNull();
  });
});

describe("maxTermForLenderMaxAge", () => {
  it("computes the max term in whole months", () => {
    const today = new Date("2026-01-15");
    const dob = new Date("1990-01-15"); // exactly 36 today
    const result = maxTermForLenderMaxAge(dob, 70, today);
    expect(result?.maxTermMonths).toBe(34 * 12);
    expect(result?.maxTermYears).toBeCloseTo(34, 5);
  });

  it("returns zero (not negative) when already past the lender max age", () => {
    const today = new Date("2026-01-15");
    const dob = new Date("1940-01-15"); // 86 today
    const result = maxTermForLenderMaxAge(dob, 70, today);
    expect(result?.maxTermMonths).toBe(0);
  });

  it("returns null for an invalid DOB", () => {
    expect(maxTermForLenderMaxAge(new Date("bad"), 70)).toBeNull();
  });
});

describe("calculateMaxTermsAcrossLenderAges", () => {
  it("returns a row for each standard lender max age", () => {
    const today = new Date("2026-01-15");
    const dob = new Date("1990-01-15");
    const rows = calculateMaxTermsAcrossLenderAges(dob, [70, 75, 80, 85], today);
    expect(rows).toHaveLength(4);
    expect(rows.map((r) => r.lenderMaxAge)).toEqual([70, 75, 80, 85]);
    expect(rows[0].maxTermMonths).toBeLessThan(rows[1].maxTermMonths);
  });
});
