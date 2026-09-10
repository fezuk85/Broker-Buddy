"use client";

import { useEffect, useMemo, useState } from "react";
import { CaseState } from "./types";
import {
  calculateLtv,
  calculateMaxLoanAtLtvBands,
  totalHouseholdGrossIncome,
  calculateLoanToIncome,
  calculateMaxBorrowingByMultiple,
  currentAge,
  ageAtTermEnd,
  oldestApplicantDob,
  calculateMaxTermsAcrossLenderAges,
  calculateRepaymentPayment,
  calculateInterestOnlyPayment,
  calculateRateComparison,
  calculateGrossYield,
  calculateIcrExamples,
  calculateMaxLoanFromRent,
} from "@/lib/calc";
import { calculateIndicativeValuation } from "@/lib/valuation/indicativeValuation";
import {
  RuleBasedHouseholdExpenditureProvider,
  HouseholdExpenditureResult,
} from "@/lib/providers/householdExpenditureProvider";
import { UnavailableEpcProvider, EpcQueryResult } from "@/lib/providers/epcProvider";
import { ManualCouncilTaxProvider, CouncilTaxResult } from "@/lib/providers/councilTaxProvider";

function parseDob(dob: string): Date | null {
  if (!dob) return null;
  const d = new Date(dob);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function useCaseCalculations(caseState: CaseState) {
  const { property, applicants, household, mortgage, rental } = caseState;
  const termMonths = mortgage.termYears * 12;

  const ltv = useMemo(
    () =>
      calculateLtv({
        propertyValue: property.value,
        currentMortgageBalance: mortgage.currentBalance,
        additionalBorrowingRequired: mortgage.additionalBorrowing,
      }),
    [property.value, mortgage.currentBalance, mortgage.additionalBorrowing]
  );

  const maxLoanBands = useMemo(
    () => calculateMaxLoanAtLtvBands(property.value, mortgage.currentBalance),
    [property.value, mortgage.currentBalance]
  );

  const totalIncome = useMemo(
    () =>
      totalHouseholdGrossIncome({
        applicant1GrossIncome: applicants.applicant1.grossIncome,
        applicant2GrossIncome: applicants.applicant2?.grossIncome,
      }),
    [applicants]
  );

  const lti = useMemo(() => calculateLoanToIncome(ltv.totalProposedBorrowing, totalIncome), [ltv, totalIncome]);

  const incomeMultiples = useMemo(() => calculateMaxBorrowingByMultiple(totalIncome), [totalIncome]);

  const dob1 = parseDob(applicants.applicant1.dob);
  const dob2 = parseDob(applicants.applicant2?.dob ?? "");
  const limitingDob = useMemo(() => oldestApplicantDob([dob1, dob2]), [dob1, dob2]);

  const applicant1Age = useMemo(() => (dob1 ? currentAge(dob1) : null), [dob1]);
  const applicant2Age = useMemo(() => (dob2 ? currentAge(dob2) : null), [dob2]);
  const ageAtEndOfTerm = useMemo(
    () => (limitingDob ? ageAtTermEnd(limitingDob, termMonths) : null),
    [limitingDob, termMonths]
  );
  const maxTermsByLenderAge = useMemo(
    () => (limitingDob ? calculateMaxTermsAcrossLenderAges(limitingDob) : []),
    [limitingDob]
  );
  const maxTermAtSelectedLenderAge = useMemo(
    () => maxTermsByLenderAge.find((r) => r.lenderMaxAge === mortgage.lenderMaxAge) ?? null,
    [maxTermsByLenderAge, mortgage.lenderMaxAge]
  );

  const repayment = useMemo(
    () =>
      calculateRepaymentPayment({
        loanAmount: ltv.totalProposedBorrowing,
        annualInterestRatePercent: mortgage.interestRatePercent,
        termMonths,
      }),
    [ltv.totalProposedBorrowing, mortgage.interestRatePercent, termMonths]
  );

  const interestOnlyPayment = useMemo(
    () => calculateInterestOnlyPayment(ltv.totalProposedBorrowing, mortgage.interestRatePercent),
    [ltv.totalProposedBorrowing, mortgage.interestRatePercent]
  );

  const rateComparison = useMemo(
    () =>
      calculateRateComparison(
        ltv.totalProposedBorrowing,
        mortgage.interestRatePercent,
        termMonths,
        mortgage.repaymentType
      ),
    [ltv.totalProposedBorrowing, mortgage.interestRatePercent, termMonths, mortgage.repaymentType]
  );

  const rentalYield = useMemo(() => calculateGrossYield(property.value, rental.monthlyRent), [property.value, rental.monthlyRent]);

  const icrExamples = useMemo(
    () => calculateIcrExamples(ltv.totalProposedBorrowing, rental.stressRatePercent, rental.monthlyRent || undefined),
    [ltv.totalProposedBorrowing, rental.stressRatePercent, rental.monthlyRent]
  );

  const maxLoanFromRent = useMemo(
    () => calculateMaxLoanFromRent(rental.monthlyRent, rental.stressRatePercent, rental.icrPercent),
    [rental.monthlyRent, rental.stressRatePercent, rental.icrPercent]
  );

  const valuation = useMemo(() => calculateIndicativeValuation({}), []); // Phase 1: no live sale/index data connected yet

  const [expenditure, setExpenditure] = useState<HouseholdExpenditureResult | null>(null);
  useEffect(() => {
    let cancelled = false;
    new RuleBasedHouseholdExpenditureProvider()
      .getBenchmark({
        grossAnnualIncome: totalIncome,
        adults: household.adults,
        dependentChildren: household.dependentChildren,
      })
      .then((r) => {
        if (!cancelled) setExpenditure(r);
      });
    return () => {
      cancelled = true;
    };
  }, [totalIncome, household.adults, household.dependentChildren]);

  const [councilTax, setCouncilTax] = useState<CouncilTaxResult | null>(null);
  useEffect(() => {
    let cancelled = false;
    new ManualCouncilTaxProvider(household.monthlyCouncilTax).lookup().then((r) => {
      if (!cancelled) setCouncilTax(r);
    });
    return () => {
      cancelled = true;
    };
  }, [household.monthlyCouncilTax]);

  const [epc, setEpc] = useState<EpcQueryResult | null>(null);
  useEffect(() => {
    let cancelled = false;
    new UnavailableEpcProvider().getLatestCertificate().then((r) => {
      if (!cancelled) setEpc(r);
    });
    return () => {
      cancelled = true;
    };
  }, [property.postcode, property.addressLine1]);

  const monthlyMortgagePayment =
    mortgage.repaymentType === "repayment" ? repayment?.monthlyPayment ?? null : interestOnlyPayment;

  const affordability = useMemo(() => {
    if (!expenditure?.estimate) return null;
    const monthlyExpenditure = expenditure.estimate.monthlyTotal;
    const monthlyCouncilTax = councilTax?.details?.annualChargeGbp ? councilTax.details.annualChargeGbp / 12 : 0;
    const mortgagePayment = monthlyMortgagePayment ?? 0;
    const credit = household.monthlyCreditCommitments || 0;
    const totalOutgoings = monthlyExpenditure + monthlyCouncilTax + mortgagePayment + credit;
    return { monthlyExpenditure, monthlyCouncilTax, mortgagePayment, credit, totalOutgoings };
  }, [expenditure, councilTax, monthlyMortgagePayment, household.monthlyCreditCommitments]);

  return {
    termMonths,
    ltv,
    maxLoanBands,
    totalIncome,
    lti,
    incomeMultiples,
    applicant1Age,
    applicant2Age,
    ageAtEndOfTerm,
    maxTermsByLenderAge,
    maxTermAtSelectedLenderAge,
    repayment,
    interestOnlyPayment,
    monthlyMortgagePayment,
    rateComparison,
    rentalYield,
    icrExamples,
    maxLoanFromRent,
    valuation,
    expenditure,
    councilTax,
    epc,
    affordability,
  };
}
