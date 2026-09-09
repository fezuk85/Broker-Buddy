"use client";

import { useMemo, useState } from "react";
import { calculateLoanToIncome, calculateMaxBorrowingByMultiple } from "@/lib/calc";
import { formatGbp, formatMultiple } from "@/lib/format";
import { CalculatorPage } from "@/components/CalculatorPage";
import { Field, NumberInput } from "@/components/Field";
import { Section } from "@/components/Section";
import { StatTile } from "@/components/StatTile";

export default function LtiCalculatorClient() {
  const [loanAmount, setLoanAmount] = useState(200_000);
  const [income, setIncome] = useState(50_000);

  const lti = useMemo(() => calculateLoanToIncome(loanAmount, income), [loanAmount, income]);
  const multiples = useMemo(() => calculateMaxBorrowingByMultiple(income), [income]);

  return (
    <CalculatorPage
      h1="Loan-to-Income (LTI) Calculator"
      intro="See your mortgage as a multiple of household income, and compare it against common illustrative income multiples from 4x to 6x."
      disclaimer="Income multiples are mathematical illustrations only. Lender affordability criteria vary and depend on far more than a simple multiple."
      inputs={
        <Section title="Your details">
          <div className="grid grid-cols-1 gap-3">
            <Field label="Loan amount required">
              <NumberInput value={loanAmount} onChange={setLoanAmount} />
            </Field>
            <Field label="Total gross household income">
              <NumberInput value={income} onChange={setIncome} />
            </Field>
          </div>
        </Section>
      }
      results={
        <>
          <Section title="Results">
            <StatTile label="Loan-to-income" value={formatMultiple(lti)} accent="primary" />
          </Section>
          <Section title="Illustrative maximum borrowing by multiple">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {multiples.map((m) => (
                <StatTile key={m.multiple} label={`${m.multiple}x income`} value={formatGbp(m.maxBorrowing)} />
              ))}
            </div>
          </Section>
        </>
      }
      explanation={
        <p>
          Loan-to-income (LTI) expresses your mortgage as a multiple of gross annual household
          income: <strong>LTI = loan amount ÷ gross income</strong>. Lenders use their own
          affordability calculations — which consider expenditure, credit commitments, stress
          rates and more — rather than a simple multiple, but LTI is a useful first sense-check.
        </p>
      }
      faqs={[
        {
          question: "What income multiple can I borrow in the UK?",
          answer:
            "This varies significantly by lender and individual circumstances — commonly in the region of 4x to 5x income, sometimes higher for certain professions or higher earners.",
        },
        {
          question: "Does LTI include a second applicant's income?",
          answer: "Yes — enter the combined gross annual income of all applicants.",
        },
      ]}
    />
  );
}
