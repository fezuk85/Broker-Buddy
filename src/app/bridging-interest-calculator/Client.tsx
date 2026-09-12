"use client";

import { useMemo, useState } from "react";
import { calculateBridgingLoan, BridgingInterestType } from "@/lib/calc";
import { formatGbp } from "@/lib/format";
import { CalculatorPage } from "@/components/CalculatorPage";
import { Field, NumberInput, SelectInput } from "@/components/Field";
import { Section } from "@/components/Section";
import { StatTile } from "@/components/StatTile";

export default function BridgingCalculatorClient() {
  const [netLoan, setNetLoan] = useState(200_000);
  const [monthlyRate, setMonthlyRate] = useState(0.75);
  const [termMonths, setTermMonths] = useState(9);
  const [interestType, setInterestType] = useState<BridgingInterestType>("retained");
  const [arrangementFeePercent, setArrangementFeePercent] = useState(2);
  const [brokerFee, setBrokerFee] = useState(1_000);
  const [valuationFee, setValuationFee] = useState(350);
  const [otherFees, setOtherFees] = useState(500);

  const result = useMemo(
    () =>
      calculateBridgingLoan({
        netLoanRequired: netLoan,
        monthlyInterestRatePercent: monthlyRate,
        termMonths,
        interestType,
        arrangementFeePercent,
        brokerFee,
        valuationFee,
        otherFees,
      }),
    [netLoan, monthlyRate, termMonths, interestType, arrangementFeePercent, brokerFee, valuationFee, otherFees]
  );

  return (
    <CalculatorPage
      h1="Bridging Loan Interest Calculator"
      intro="Estimate the gross loan, total interest, fees and total cost of a bridging loan, with retained or serviced interest."
      disclaimer="Generic maths only — not specific to any lender's product. Always confirm exact terms, fees and interest calculation method with the lender."
      inputs={
        <Section title="Your details">
          <div className="grid grid-cols-1 gap-3">
            <Field label="Net loan required">
              <NumberInput value={netLoan} onChange={setNetLoan} />
            </Field>
            <Field label="Monthly interest rate (%)">
              <NumberInput value={monthlyRate} onChange={setMonthlyRate} step={0.01} />
            </Field>
            <Field label="Term (months)">
              <NumberInput value={termMonths} onChange={setTermMonths} min={1} step={1} />
            </Field>
            <Field label="Interest type">
              <SelectInput
                value={interestType}
                onChange={setInterestType}
                options={[
                  { value: "retained", label: "Retained (deducted from advance)" },
                  { value: "serviced", label: "Serviced (paid monthly)" },
                ]}
              />
            </Field>
            <Field label="Arrangement fee (%)">
              <NumberInput value={arrangementFeePercent} onChange={setArrangementFeePercent} step={0.1} />
            </Field>
            <Field label="Broker fee">
              <NumberInput value={brokerFee} onChange={setBrokerFee} />
            </Field>
            <Field label="Valuation fee">
              <NumberInput value={valuationFee} onChange={setValuationFee} />
            </Field>
            <Field label="Other fees" hint="e.g. application/booking fee, telegraphic transfer fee, exit fee">
              <NumberInput value={otherFees} onChange={setOtherFees} />
            </Field>
          </div>
        </Section>
      }
      results={
        <Section title="Results">
          {result ? (
            <div className="grid grid-cols-2 gap-3">
              <StatTile label="Gross loan" value={formatGbp(result.grossLoan)} accent="primary" />
              <StatTile label="Total interest" value={formatGbp(result.totalInterest)} />
              <StatTile label="Total fees" value={formatGbp(result.totalFees)} />
              <StatTile label="Total repayment" value={formatGbp(result.totalRepayment)} />
              <StatTile label="Effective cost" value={formatGbp(result.effectiveCost)} />
            </div>
          ) : (
            <p className="text-sm text-[var(--bb-muted)]">
              This combination of rate, term and fees isn&apos;t fundable with retained interest —
              try a shorter term, lower rate, or switch to serviced interest.
            </p>
          )}
        </Section>
      }
      explanation={
        <>
          <p>
            With <strong>retained</strong> interest, the lender deducts the full term&apos;s
            interest from the loan up front, so the gross loan has to be larger than the net
            amount you receive. With <strong>serviced</strong> interest, you pay interest monthly
            and the loan itself stays at the net amount.
          </p>
        </>
      }
      faqs={[
        {
          question: "What's the difference between retained and serviced interest?",
          answer:
            "Retained interest is deducted upfront from the loan so you don't make monthly interest payments; serviced interest is paid monthly, keeping the loan balance lower.",
        },
        {
          question: "Does this include exit fees?",
          answer: "No — enter any exit fee as part of 'other fees' if known, since terms vary by lender.",
        },
      ]}
    />
  );
}
