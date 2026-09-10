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
  calculateSalaryTakeHome,
} from "@/lib/calc";
import { calculateIndicativeValuation } from "@/lib/valuation/indicativeValuation";
import {
  RuleBasedHouseholdExpenditureProvider,
  HouseholdExpenditureResult,
} from "@/lib/providers/householdExpenditureProvider";
import { RealEpcProvider, EpcQueryResult } from "@/lib/providers/epcProvider";
import { ManualCouncilTaxProvider, RealCouncilTaxProvider, CouncilTaxResult } from "@/lib/providers/councilTaxProvider";
import { RealPropertySaleProvider, PropertySaleQueryResult } from "@/lib/providers/propertySaleProvider";
import { deriveRegionFromPostcode, asCompletePostcode } from "@/lib/data/postcodeRegions";

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

  const derivedRegion = useMemo(() => deriveRegionFromPostcode(property.postcode), [property.postcode]);

  /**
   * Only a complete, well-formed postcode is sent to any external lookup (EPC, HM Land Registry,
   * Council Tax). Without this, every keystroke while typing a postcode fires a fresh request per
   * data source against a partial/invalid postcode — wasteful, and each MHCLG EPC search call in
   * particular fails with a 400 for a malformed postcode, which showed up as real production
   * errors. derivedRegion above is unaffected — it's a local, synchronous lookup, not a network call.
   */
  const completePostcode = useMemo(() => asCompletePostcode(property.postcode), [property.postcode]);

  const [expenditure, setExpenditure] = useState<HouseholdExpenditureResult | null>(null);
  useEffect(() => {
    let cancelled = false;
    new RuleBasedHouseholdExpenditureProvider()
      .getBenchmark({
        grossAnnualIncome: totalIncome,
        adults: household.adults,
        dependentChildren: household.dependentChildren,
        region: derivedRegion,
      })
      .then((r) => {
        if (!cancelled) setExpenditure(r);
      });
    return () => {
      cancelled = true;
    };
  }, [totalIncome, household.adults, household.dependentChildren, derivedRegion]);

  /**
   * Council Tax: a user-entered figure always wins (it's the confirmed real amount). With no
   * manual figure entered, falls back to the automatic estimate (most common band locally,
   * priced from official per-authority charges) so there's still a usable number with zero
   * manual lookup required — clearly labelled "modelled-illustrative" rather than confirmed.
   */
  const [councilTaxEstimate, setCouncilTaxEstimate] = useState<CouncilTaxResult | null>(null);
  useEffect(() => {
    let cancelled = false;
    new RealCouncilTaxProvider().lookup({ postcode: completePostcode }).then((r) => {
      if (!cancelled) setCouncilTaxEstimate(r);
    });
    return () => {
      cancelled = true;
    };
  }, [completePostcode]);

  const [manualCouncilTax, setManualCouncilTax] = useState<CouncilTaxResult | null>(null);
  useEffect(() => {
    let cancelled = false;
    new ManualCouncilTaxProvider(household.monthlyCouncilTax).lookup().then((r) => {
      if (!cancelled) setManualCouncilTax(r);
    });
    return () => {
      cancelled = true;
    };
  }, [household.monthlyCouncilTax]);

  const councilTax =
    manualCouncilTax?.source === "manual-entry" ? manualCouncilTax : councilTaxEstimate ?? manualCouncilTax;

  /**
   * EPC lookup requires a house name/number as well as a postcode. MHCLG's search API can only
   * be queried by postcode (no address-level narrowing confirmed), so a postcode alone risks
   * returning the wrong property at any postcode covering multiple flats/houses — better to show
   * nothing than a plausible-looking but potentially wrong EPC for a specific property.
   */
  const [epcFetchResult, setEpcFetchResult] = useState<EpcQueryResult | null>(null);
  useEffect(() => {
    if (!property.addressLine1.trim()) return;

    let cancelled = false;
    new RealEpcProvider().getLatestCertificate({ postcode: completePostcode }).then((r) => {
      if (!cancelled) setEpcFetchResult(r);
    });
    return () => {
      cancelled = true;
    };
  }, [completePostcode, property.addressLine1]);

  const epc: EpcQueryResult | null = useMemo(
    () =>
      property.addressLine1.trim()
        ? epcFetchResult
        : {
            source: "unavailable",
            sourceLabel: "EPC open data — enter a house name/number as well as a postcode to check for an EPC",
            certificate: null,
          },
    [property.addressLine1, epcFetchResult]
  );

  const [salesHistory, setSalesHistory] = useState<PropertySaleQueryResult | null>(null);
  useEffect(() => {
    let cancelled = false;
    new RealPropertySaleProvider().getSalesForProperty({ postcode: completePostcode, addressLine1: property.addressLine1 }).then((r) => {
      if (!cancelled) setSalesHistory(r);
    });
    return () => {
      cancelled = true;
    };
  }, [completePostcode, property.addressLine1]);

  /**
   * The subject property's own last sale — only trustworthy when addressLine1 was entered and
   * salesHistory matched to that specific address (source "public-open-data"), not when it's
   * just "every sale at this postcode". getSalesForProperty already returns most-recent-first.
   */
  const lastKnownSale = useMemo(() => {
    if (!property.addressLine1.trim() || salesHistory?.source !== "public-open-data") return null;
    const mostRecent = salesHistory.sales[0];
    return mostRecent ? { price: mostRecent.pricePaid, date: mostRecent.saleDate } : null;
  }, [property.addressLine1, salesHistory]);

  const [indexMovementFetchResult, setIndexMovementFetchResult] = useState<{ movementPercent: number } | null>(null);
  useEffect(() => {
    if (!completePostcode || !lastKnownSale) return;
    let cancelled = false;
    fetch(`/api/house-price-index?postcode=${encodeURIComponent(completePostcode)}&sinceDate=${lastKnownSale.date}`)
      .then((res) => (res.ok ? res.json() : { movement: null }))
      .then((body: { movement: { movementPercent: number } | null }) => {
        if (!cancelled) setIndexMovementFetchResult(body.movement);
      })
      .catch(() => {
        if (!cancelled) setIndexMovementFetchResult(null);
      });
    return () => {
      cancelled = true;
    };
  }, [completePostcode, lastKnownSale]);

  const indexMovement = useMemo(
    () => (completePostcode && lastKnownSale ? indexMovementFetchResult : null),
    [completePostcode, lastKnownSale, indexMovementFetchResult]
  );

  /**
   * Indicative valuation: comparable-sales method runs on real HM Land Registry sale history for
   * the postcode. Floor area comes from the EPC record (when found) but HMLR's sale data has no
   * per-sale floor area, so the floor-area-comparison method still can't fire — it needs >= 3
   * comparables that each have their own floor area, which this data doesn't have. The indexed
   * estimate (historic-sale-indexation) now runs on HM Land Registry's real UK House Price Index
   * for the property's local authority — only when a house name/number was entered and matched
   * to that specific property's own sale history (see lastKnownSale above); without an address
   * match there's no single "last sale" to index from, so it's correctly omitted rather than
   * indexing an arbitrary postcode-wide sale.
   */
  const valuation = useMemo(() => {
    const comparableSales = (salesHistory?.sales ?? []).map((s) => ({
      pricePaid: s.pricePaid,
      saleDate: s.saleDate,
      propertyType: s.propertyType,
    }));
    return calculateIndicativeValuation({
      comparableSales,
      subjectFloorAreaSqm: epc?.certificate?.totalFloorAreaSqm ?? null,
      lastKnownSale,
      indexMovementPercent: indexMovement?.movementPercent ?? null,
    });
  }, [salesHistory, epc, lastKnownSale, indexMovement]);

  const monthlyMortgagePayment =
    mortgage.repaymentType === "repayment" ? repayment?.monthlyPayment ?? null : interestOnlyPayment;

  /**
   * Net income is derived from the same gross incomes used for LTI, run through the salary
   * take-home engine (calculateSalaryTakeHome) — assumes employment/PAYE income with no pension
   * contributions, same simplification as the salary calculator. Not a substitute for actual
   * take-home pay (payslips, self-employed accounts, etc.).
   */
  const netMonthlyIncome = useMemo(() => {
    const applicant1Net = calculateSalaryTakeHome(applicants.applicant1.grossIncome).netMonthly;
    const applicant2Net = applicants.applicant2 ? calculateSalaryTakeHome(applicants.applicant2.grossIncome).netMonthly : 0;
    return applicant1Net + applicant2Net;
  }, [applicants]);

  const affordability = useMemo(() => {
    if (!expenditure?.estimate) return null;
    const monthlyExpenditure = expenditure.estimate.monthlyTotal;
    const monthlyCouncilTax = councilTax?.details?.annualChargeGbp ? councilTax.details.annualChargeGbp / 12 : 0;
    const mortgagePayment = monthlyMortgagePayment ?? 0;
    const credit = household.monthlyCreditCommitments || 0;
    const totalOutgoings = monthlyExpenditure + monthlyCouncilTax + mortgagePayment + credit;
    const remainingAfterOutgoings = netMonthlyIncome - totalOutgoings;
    const outgoingsPercentOfNetIncome = netMonthlyIncome > 0 ? (totalOutgoings / netMonthlyIncome) * 100 : null;
    return {
      monthlyExpenditure,
      monthlyCouncilTax,
      mortgagePayment,
      credit,
      totalOutgoings,
      netMonthlyIncome,
      remainingAfterOutgoings,
      outgoingsPercentOfNetIncome,
    };
  }, [expenditure, councilTax, monthlyMortgagePayment, household.monthlyCreditCommitments, netMonthlyIncome]);

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
    derivedRegion,
    expenditure,
    councilTax,
    epc,
    salesHistory,
    affordability,
  };
}
