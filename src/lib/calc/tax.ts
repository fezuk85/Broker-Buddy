/**
 * UK income tax, National Insurance and dividend tax maths (England, Wales & Northern Ireland
 * rates — Scotland uses different income tax bands and is out of scope for Phase 1).
 *
 * Rates/thresholds below are the 2025/26 tax year figures. Personal allowance and the basic/
 * higher rate thresholds have been frozen by government policy since 2021/22 (through at least
 * 2027/28), so these are expected to hold for several years, but should be re-verified against
 * HMRC's published rates before relying on them long-term.
 *
 * Simplifications (documented, not fabricated): calculated on a full tax-year basis (ignores
 * pay-period NI quirks), assumes no pension contributions, no student loan, no Scottish rates,
 * no marriage allowance, no benefits-in-kind. These are illustrative estimates, not tax advice.
 */

export const TAX_YEAR_LABEL = "2025/26 (England, Wales & Northern Ireland)";

export const PERSONAL_ALLOWANCE = 12_570;
const PA_TAPER_START = 100_000; // PA reaches £0 at £125,140 (reduced £1 per £2 over this)

export const BASIC_RATE_LIMIT = 50_270; // upper bound of income taxed at basic rate
const HIGHER_RATE_LIMIT = 125_140; // upper bound of income taxed at higher rate

const INCOME_TAX_BASIC_RATE = 0.2;
const INCOME_TAX_HIGHER_RATE = 0.4;
const INCOME_TAX_ADDITIONAL_RATE = 0.45;

const NI_PRIMARY_THRESHOLD = 12_570;
const NI_UPPER_EARNINGS_LIMIT = 50_270;
const NI_MAIN_RATE = 0.08;
const NI_UPPER_RATE = 0.02;

const DIVIDEND_ALLOWANCE = 500;
const DIVIDEND_BASIC_RATE = 0.0875;
const DIVIDEND_HIGHER_RATE = 0.3375;
const DIVIDEND_ADDITIONAL_RATE = 0.3935;

/** Personal allowance after the £100k-£125,140 taper (£1 lost per £2 of income over £100k). */
export function calculatePersonalAllowance(grossAnnualIncome: number): number {
  if (!(grossAnnualIncome > PA_TAPER_START)) return PERSONAL_ALLOWANCE;
  const reduction = (grossAnnualIncome - PA_TAPER_START) / 2;
  return Math.max(0, PERSONAL_ALLOWANCE - reduction);
}

export interface TaxBandAmount {
  label: string;
  ratePercent: number;
  amountInBand: number;
  taxDue: number;
}

export interface IncomeTaxResult {
  personalAllowance: number;
  taxableIncome: number;
  bands: TaxBandAmount[];
  totalIncomeTax: number;
}

/** Income tax on salary/employment income only (no dividends). */
export function calculateIncomeTax(grossAnnualIncome: number): IncomeTaxResult {
  const income = Math.max(0, grossAnnualIncome || 0);
  const personalAllowance = calculatePersonalAllowance(income);
  const taxableIncome = Math.max(0, income - personalAllowance);

  const basicBandSize = Math.max(0, BASIC_RATE_LIMIT - PERSONAL_ALLOWANCE);
  const higherBandSize = Math.max(0, HIGHER_RATE_LIMIT - BASIC_RATE_LIMIT);

  const inBasic = Math.min(taxableIncome, basicBandSize);
  const inHigher = Math.min(Math.max(0, taxableIncome - basicBandSize), higherBandSize);
  const inAdditional = Math.max(0, taxableIncome - basicBandSize - higherBandSize);

  const bands: TaxBandAmount[] = [
    { label: "Basic rate", ratePercent: INCOME_TAX_BASIC_RATE * 100, amountInBand: inBasic, taxDue: inBasic * INCOME_TAX_BASIC_RATE },
    { label: "Higher rate", ratePercent: INCOME_TAX_HIGHER_RATE * 100, amountInBand: inHigher, taxDue: inHigher * INCOME_TAX_HIGHER_RATE },
    {
      label: "Additional rate",
      ratePercent: INCOME_TAX_ADDITIONAL_RATE * 100,
      amountInBand: inAdditional,
      taxDue: inAdditional * INCOME_TAX_ADDITIONAL_RATE,
    },
  ];

  return {
    personalAllowance,
    taxableIncome,
    bands,
    totalIncomeTax: bands.reduce((sum, b) => sum + b.taxDue, 0),
  };
}

export interface NationalInsuranceResult {
  bands: TaxBandAmount[];
  totalNationalInsurance: number;
}

/** Employee (Class 1) National Insurance, calculated on an annual basis. */
export function calculateNationalInsurance(grossAnnualIncome: number): NationalInsuranceResult {
  const income = Math.max(0, grossAnnualIncome || 0);
  const mainBandSize = Math.max(0, NI_UPPER_EARNINGS_LIMIT - NI_PRIMARY_THRESHOLD);

  const inMain = Math.min(Math.max(0, income - NI_PRIMARY_THRESHOLD), mainBandSize);
  const inUpper = Math.max(0, income - NI_UPPER_EARNINGS_LIMIT);

  const bands: TaxBandAmount[] = [
    { label: `${NI_MAIN_RATE * 100}%`, ratePercent: NI_MAIN_RATE * 100, amountInBand: inMain, taxDue: inMain * NI_MAIN_RATE },
    { label: `${NI_UPPER_RATE * 100}%`, ratePercent: NI_UPPER_RATE * 100, amountInBand: inUpper, taxDue: inUpper * NI_UPPER_RATE },
  ];

  return { bands, totalNationalInsurance: bands.reduce((sum, b) => sum + b.taxDue, 0) };
}

export interface SalaryTakeHomeResult {
  grossAnnual: number;
  personalAllowance: number;
  incomeTax: IncomeTaxResult;
  nationalInsurance: NationalInsuranceResult;
  totalDeductions: number;
  netAnnual: number;
  netMonthly: number;
  netWeekly: number;
  effectiveTaxRatePercent: number;
}

export function calculateSalaryTakeHome(grossAnnualIncome: number): SalaryTakeHomeResult {
  const grossAnnual = Math.max(0, grossAnnualIncome || 0);
  const incomeTax = calculateIncomeTax(grossAnnual);
  const nationalInsurance = calculateNationalInsurance(grossAnnual);
  const totalDeductions = incomeTax.totalIncomeTax + nationalInsurance.totalNationalInsurance;
  const netAnnual = grossAnnual - totalDeductions;

  return {
    grossAnnual,
    personalAllowance: incomeTax.personalAllowance,
    incomeTax,
    nationalInsurance,
    totalDeductions,
    netAnnual,
    netMonthly: netAnnual / 12,
    netWeekly: netAnnual / 52,
    effectiveTaxRatePercent: grossAnnual > 0 ? (totalDeductions / grossAnnual) * 100 : 0,
  };
}

export interface DividendTaxResult {
  bands: TaxBandAmount[];
  dividendAllowanceUsed: number;
  taxableDividends: number;
  totalDividendTax: number;
}

/**
 * Dividend tax. Dividends are treated as the "top slice" of income — they're taxed after
 * salary/other income has used up the personal allowance and basic/higher-rate bands, per
 * HMRC's ordering rules.
 */
export function calculateDividendTax(grossSalary: number, grossDividends: number): DividendTaxResult {
  const salary = Math.max(0, grossSalary || 0);
  const dividends = Math.max(0, grossDividends || 0);

  const personalAllowance = calculatePersonalAllowance(salary + dividends);
  // How much of the personal allowance is left after salary uses its share first.
  const paLeftForDividends = Math.max(0, personalAllowance - Math.max(0, salary - 0));
  const salaryTaxableIncome = Math.max(0, salary - personalAllowance);

  const basicBandSize = Math.max(0, BASIC_RATE_LIMIT - PERSONAL_ALLOWANCE);
  const higherBandSize = Math.max(0, HIGHER_RATE_LIMIT - BASIC_RATE_LIMIT);
  const basicBandUsedBySalary = Math.min(salaryTaxableIncome, basicBandSize);
  const higherBandUsedBySalary = Math.min(Math.max(0, salaryTaxableIncome - basicBandSize), higherBandSize);

  const dividendsAfterPA = Math.max(0, dividends - paLeftForDividends);
  const dividendAllowanceUsed = Math.min(dividendsAfterPA, DIVIDEND_ALLOWANCE);
  const taxableDividends = Math.max(0, dividendsAfterPA - DIVIDEND_ALLOWANCE);

  const basicRemaining = Math.max(0, basicBandSize - basicBandUsedBySalary);
  const higherRemaining = Math.max(0, higherBandSize - higherBandUsedBySalary);

  const inBasic = Math.min(taxableDividends, basicRemaining);
  const inHigher = Math.min(Math.max(0, taxableDividends - basicRemaining), higherRemaining);
  const inAdditional = Math.max(0, taxableDividends - basicRemaining - higherRemaining);

  const bands: TaxBandAmount[] = [
    { label: "Basic rate", ratePercent: DIVIDEND_BASIC_RATE * 100, amountInBand: inBasic, taxDue: inBasic * DIVIDEND_BASIC_RATE },
    { label: "Higher rate", ratePercent: DIVIDEND_HIGHER_RATE * 100, amountInBand: inHigher, taxDue: inHigher * DIVIDEND_HIGHER_RATE },
    {
      label: "Additional rate",
      ratePercent: DIVIDEND_ADDITIONAL_RATE * 100,
      amountInBand: inAdditional,
      taxDue: inAdditional * DIVIDEND_ADDITIONAL_RATE,
    },
  ];

  return {
    bands,
    dividendAllowanceUsed,
    taxableDividends,
    totalDividendTax: bands.reduce((sum, b) => sum + b.taxDue, 0),
  };
}

export interface SalaryDividendTakeHomeResult {
  grossSalary: number;
  grossDividends: number;
  grossTotal: number;
  incomeTaxOnSalary: IncomeTaxResult;
  nationalInsuranceOnSalary: NationalInsuranceResult;
  dividendTax: DividendTaxResult;
  totalTaxAndNi: number;
  netAnnual: number;
  netMonthly: number;
  netWeekly: number;
}

/** Combined salary + dividends take-home. NI applies to salary only (dividends aren't subject to NI). */
export function calculateSalaryDividendTakeHome(grossSalary: number, grossDividends: number): SalaryDividendTakeHomeResult {
  const salary = Math.max(0, grossSalary || 0);
  const dividends = Math.max(0, grossDividends || 0);

  const incomeTaxOnSalary = calculateIncomeTax(salary);
  const nationalInsuranceOnSalary = calculateNationalInsurance(salary);
  const dividendTax = calculateDividendTax(salary, dividends);

  const totalTaxAndNi = incomeTaxOnSalary.totalIncomeTax + nationalInsuranceOnSalary.totalNationalInsurance + dividendTax.totalDividendTax;
  const grossTotal = salary + dividends;
  const netAnnual = grossTotal - totalTaxAndNi;

  return {
    grossSalary: salary,
    grossDividends: dividends,
    grossTotal,
    incomeTaxOnSalary,
    nationalInsuranceOnSalary,
    dividendTax,
    totalTaxAndNi,
    netAnnual,
    netMonthly: netAnnual / 12,
    netWeekly: netAnnual / 52,
  };
}
