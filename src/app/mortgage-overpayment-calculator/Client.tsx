"use client";

import { useMemo, useState } from "react";
import { calculateOverpayment } from "@/lib/calc";
import { formatGbp, formatPercent, formatYearsMonths } from "@/lib/format";
import { CalculatorPage } from "@/components/CalculatorPage";
import { Field, NumberInput } from "@/components/Field";
import { Section } from "@/components/Section";
import { StatTile } from "@/components/StatTile";
import { OverpaymentGuide } from "@/content/guides/overpayment";

function monthsToYearsMonths(months: number): string {
  return formatYearsMonths(Math.floor(months / 12), months % 12);
}

export default function OverpaymentCalculatorClient() {
  const [balance, setBalance] = useState(200_000);
  const [rate, setRate] = useState(5);
  const [termYears, setTermYears] = useState(25);
  const [monthlyOverpayment, setMonthlyOverpayment] = useState(200);
  const [lumpSum, setLumpSum] = useState(0);

  const result = useMemo(
    () =>
      calculateOverpayment({
        balance,
        annualInterestRatePercent: rate,
        remainingTermYears: termYears,
        monthlyOverpayment,
        lumpSumNow: lumpSum,
      }),
    [balance, rate, termYears, monthlyOverpayment, lumpSum]
  );

  return (
    <CalculatorPage
      slug="mortgage-overpayment-calculator"
      h1="Mortgage Overpayment Calculator"
      intro="See how much interest and how much time you could save by overpaying your repayment mortgage each month, with a one-off lump sum, or both."
      disclaimer="Assumes a repayment mortgage at a constant interest rate for the whole remaining term, and that overpayments shorten the term. Early repayment charges are not modelled — check your lender's annual overpayment allowance."
      inputs={
        <Section title="Your mortgage">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Outstanding balance">
              <NumberInput prefix="£" value={balance} onChange={setBalance} />
            </Field>
            <Field label="Interest rate (%)">
              <NumberInput suffix="%" value={rate} onChange={setRate} step={0.05} />
            </Field>
            <Field label="Remaining term (years)">
              <NumberInput suffix="years" value={termYears} onChange={setTermYears} step={1} />
            </Field>
            <Field label="Monthly overpayment">
              <NumberInput prefix="£" value={monthlyOverpayment} onChange={setMonthlyOverpayment} />
            </Field>
            <Field label="One-off lump sum now">
              <NumberInput prefix="£" value={lumpSum} onChange={setLumpSum} />
            </Field>
          </div>
        </Section>
      }
      results={
        result ? (
          <>
            <Section title="What overpaying saves you">
              <div className="grid grid-cols-2 gap-3">
                <StatTile label="Interest saved" value={formatGbp(result.interestSaved)} accent="primary" />
                <StatTile label="Time saved" value={result.monthsSaved === 0 ? "—" : monthsToYearsMonths(result.monthsSaved)} accent="primary" />
                <StatTile label="New end of mortgage" value={monthsToYearsMonths(result.withOverpaymentMonths)} subValue={`instead of ${monthsToYearsMonths(result.baselineMonths)}`} />
                <StatTile label="Required monthly payment" value={formatGbp(result.requiredMonthlyPayment, 2)} subValue="before overpayment" />
              </div>
            </Section>

            <Section title="Comparison">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[var(--bb-muted)]">
                    <th className="font-medium py-1 pr-3"></th>
                    <th className="font-medium py-1 pr-3">No overpayment</th>
                    <th className="font-medium py-1 text-right">With overpayment</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-[var(--bb-border)]">
                    <td className="py-1.5 pr-3">Time to clear</td>
                    <td className="py-1.5 pr-3">{monthsToYearsMonths(result.baselineMonths)}</td>
                    <td className="py-1.5 text-right">{monthsToYearsMonths(result.withOverpaymentMonths)}</td>
                  </tr>
                  <tr className="border-t border-[var(--bb-border)]">
                    <td className="py-1.5 pr-3">Total interest</td>
                    <td className="py-1.5 pr-3">{formatGbp(result.baselineTotalInterest)}</td>
                    <td className="py-1.5 text-right">{formatGbp(result.withOverpaymentTotalInterest)}</td>
                  </tr>
                </tbody>
              </table>
              <p
                className="mt-3 text-sm"
                style={{ color: result.firstYearOverpaymentPercentOfBalance > 10 ? "var(--bb-warning-text)" : "var(--bb-muted)" }}
              >
                First-year overpayments: {formatPercent(result.firstYearOverpaymentPercentOfBalance)} of your balance.
                {result.firstYearOverpaymentPercentOfBalance > 10
                  ? " That is above the 10% annual allowance many lenders permit during a fixed or discounted deal — check for early repayment charges."
                  : " Many lenders allow up to 10% a year without a charge, but check your own deal."}
              </p>
            </Section>
          </>
        ) : (
          <Section title="What overpaying saves you">
            <p className="text-sm text-[var(--bb-muted)]">Enter a balance and remaining term to see the impact.</p>
          </Section>
        )
      }
      explanation={
        <p>
          Interest is charged on your outstanding balance each month. Overpaying reduces the balance sooner, so every
          later month accrues less interest and the mortgage is cleared earlier. This calculator keeps your required
          payment the same and applies overpayments on top, shortening the term.
        </p>
      }
      guide={<OverpaymentGuide />}
      faqs={[
        {
          question: "How much can I overpay on my mortgage without a penalty?",
          answer:
            "Many fixed and discounted deals allow up to 10% of the outstanding balance each year without an early repayment charge, but limits vary by lender and product. Tracker and variable deals often have no limit. Check your mortgage terms.",
        },
        {
          question: "Is it better to reduce the term or the monthly payment?",
          answer:
            "Shortening the term saves the most interest because you keep paying the same amount. Reducing the payment gives more monthly breathing room but saves less interest overall.",
        },
        {
          question: "Does a lump sum or monthly overpayment save more?",
          answer:
            "A lump sum made early has the biggest effect per pound because it stops interest accruing for the longest time; regular monthly overpayments build up steadily. The calculator lets you compare both.",
        },
        {
          question: "Does this account for rate changes?",
          answer:
            "No. It assumes the same interest rate for the whole remaining term. If your rate changes when a fixed deal ends, the actual savings will differ.",
        },
      ]}
    />
  );
}
