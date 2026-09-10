/** The single "case" object the whole app reads from and writes to. No login required — persisted to localStorage only. */

export interface ApplicantInput {
  dob: string; // yyyy-mm-dd, or "" if not entered
  grossIncome: number;
}

export interface CaseState {
  property: {
    value: number;
    postcode: string;
    addressLine1: string;
  };
  applicants: {
    applicant1: ApplicantInput;
    applicant2: ApplicantInput | null;
  };
  household: {
    adults: number;
    dependentChildren: number;
    monthlyCreditCommitments: number;
    monthlyCouncilTax: number;
  };
  mortgage: {
    currentBalance: number;
    additionalBorrowing: number;
    interestRatePercent: number;
    repaymentType: "repayment" | "interest-only";
    termYears: number;
    lenderMaxAge: number;
  };
  rental: {
    monthlyRent: number;
    stressRatePercent: number;
    icrPercent: number;
  };
}

export const DEFAULT_CASE: CaseState = {
  property: {
    value: 300_000,
    postcode: "",
    addressLine1: "",
  },
  applicants: {
    applicant1: { dob: "1990-01-01", grossIncome: 40_000 },
    applicant2: null,
  },
  household: {
    adults: 1,
    dependentChildren: 0,
    monthlyCreditCommitments: 0,
    monthlyCouncilTax: 0,
  },
  mortgage: {
    currentBalance: 150_000,
    additionalBorrowing: 0,
    interestRatePercent: 5.0,
    repaymentType: "repayment",
    termYears: 25,
    lenderMaxAge: 75,
  },
  rental: {
    monthlyRent: 0,
    stressRatePercent: 5.5,
    icrPercent: 145,
  },
};
