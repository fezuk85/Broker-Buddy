/** Age and mortgage-term-vs-age maths. */

export interface AgeYearsMonths {
  years: number;
  months: number;
  totalMonths: number;
}

/** Whole years + remainder months between two dates (b - a), floored at 0. Null on invalid/future dates. */
export function ageBetween(dateOfBirth: Date, asOf: Date): AgeYearsMonths | null {
  if (Number.isNaN(dateOfBirth.getTime()) || Number.isNaN(asOf.getTime())) return null;
  if (dateOfBirth.getTime() > asOf.getTime()) return null;

  let years = asOf.getFullYear() - dateOfBirth.getFullYear();
  let months = asOf.getMonth() - dateOfBirth.getMonth();
  if (asOf.getDate() < dateOfBirth.getDate()) months -= 1;
  if (months < 0) {
    years -= 1;
    months += 12;
  }
  years = Math.max(0, years);
  return { years, months, totalMonths: years * 12 + months };
}

export function currentAge(dateOfBirth: Date, today: Date = new Date()): AgeYearsMonths | null {
  return ageBetween(dateOfBirth, today);
}

/** Age (years+months) an applicant will reach at the end of a mortgage term in months. */
export function ageAtTermEnd(
  dateOfBirth: Date,
  termMonths: number,
  today: Date = new Date()
): AgeYearsMonths | null {
  if (!Number.isFinite(termMonths) || termMonths < 0) return null;
  const end = new Date(today);
  end.setMonth(end.getMonth() + Math.round(termMonths));
  return ageBetween(dateOfBirth, end);
}

/** For joint applicants, the oldest DOB (earliest date) is the limiting applicant by default. */
export function oldestApplicantDob(dobs: Array<Date | null | undefined>): Date | null {
  const valid = dobs.filter((d): d is Date => !!d && !Number.isNaN(d.getTime()));
  if (valid.length === 0) return null;
  return valid.reduce((oldest, d) => (d.getTime() < oldest.getTime() ? d : oldest));
}

export interface MaxTermResult {
  lenderMaxAge: number;
  maxTermMonths: number;
  maxTermYears: number;
}

/**
 * Maximum term (in whole months) so the limiting applicant does not exceed lenderMaxAge
 * at term end. Returns 0 months (not negative) if the applicant is already past the max age.
 */
export function maxTermForLenderMaxAge(
  dateOfBirth: Date,
  lenderMaxAge: number,
  today: Date = new Date()
): MaxTermResult | null {
  const age = currentAge(dateOfBirth, today);
  if (!age) return null;
  const monthsUntilMaxAge = lenderMaxAge * 12 - age.totalMonths;
  const maxTermMonths = Math.max(0, Math.floor(monthsUntilMaxAge));
  return {
    lenderMaxAge,
    maxTermMonths,
    maxTermYears: maxTermMonths / 12,
  };
}

export const STANDARD_LENDER_MAX_AGES = [70, 75, 80, 85] as const;

export function calculateMaxTermsAcrossLenderAges(
  dateOfBirth: Date,
  lenderMaxAges: readonly number[] = STANDARD_LENDER_MAX_AGES,
  today: Date = new Date()
): MaxTermResult[] {
  return lenderMaxAges
    .map((age) => maxTermForLenderMaxAge(dateOfBirth, age, today))
    .filter((r): r is MaxTermResult => r !== null);
}
