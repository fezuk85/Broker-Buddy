"use client";

import { useMemo, useState } from "react";
import { calculateSalaryTakeHome, TAX_YEAR_LABEL } from "@/lib/calc";
import { formatGbp, formatPercent } from "@/lib/format";
import { CalculatorPage } from "@/components/CalculatorPage";
import { Field, NumberInput } from "@/components/Field";
import { Section } from "@/components/Section";
import { StatTile } from "@/components/StatTile";

export default function SalaryCalculatorClient() {
  const [grossSalary, setGrossSalary] = useState(50_000);

  const result = useMemo(() => calculateSalaryTakeHome(grossSalary), [grossSalary]);

  return (
    <CalculatorPage
      h1="Salary Take-Home Pay Calculator"
      intro={`Work out income tax, National Insurance and net take-home pay from a gross salary — annual, monthly and weekly. Uses ${TAX_YEAR_LABEL} rates.`}
      disclaimer={`Estimates only, based on published HMRC rates for ${TAX_YEAR_LABEL}. Assumes no pension contributions, student loan, benefits-in-kind or marriage allowance, and standard tax code. Not tax advice — for an exact figure, check your payslip or consult an accountant.`}
      inputs={
        <Section title="Your salary">
          <Field label="Gross annual salary">
            <NumberInput value={grossSalary} onChange={setGrossSalary} />
          </Field>
        </Section>
      }
      results={
        <>
          <Section title="Take-home pay">
            <div className="grid grid-cols-2 gap-3">
              <StatTile label="Net annual" value={formatGbp(result.netAnnual)} accent="primary" />
              <StatTile label="Net monthly" value={formatGbp(result.netMonthly)} accent="primary" />
              <StatTile label="Net weekly" value={formatGbp(result.netWeekly)} />
              <StatTile label="Effective tax rate" value={formatPercent(result.effectiveTaxRatePercent)} />
            </div>
          </Section>
          <Section title="Deductions">
            <div className="grid grid-cols-2 gap-3">
              <StatTile label="Income tax" value={formatGbp(result.incomeTax.totalIncomeTax)} />
              <StatTile label="National Insurance" value={formatGbp(result.nationalInsurance.totalNationalInsurance)} />
              <StatTile label="Personal allowance" value={formatGbp(result.personalAllowance)} />
              <StatTile label="Total deductions" value={formatGbp(result.totalDeductions)} />
            </div>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[var(--bb-muted)]">
                    <th className="font-medium py-1 pr-4">Band</th>
                    <th className="font-medium py-1 pr-4">Amount in band</th>
                    <th className="font-medium py-1">Tax due</th>
                  </tr>
                </thead>
                <tbody>
                  {result.incomeTax.bands
                    .filter((b) => b.amountInBand > 0)
                    .map((b) => (
                      <tr key={b.label} className="border-t border-[var(--bb-border)]">
                        <td className="py-1.5 pr-4">
                          {b.label} ({b.ratePercent}%)
                        </td>
                        <td className="py-1.5 pr-4">{formatGbp(b.amountInBand)}</td>
                        <td className="py-1.5">{formatGbp(b.taxDue)}</td>
                      </tr>
                    ))}
                  {result.nationalInsurance.bands
                    .filter((b) => b.amountInBand > 0)
                    .map((b) => (
                      <tr key={`ni-${b.label}`} className="border-t border-[var(--bb-border)]">
                        <td className="py-1.5 pr-4">NI ({b.label})</td>
                        <td className="py-1.5 pr-4">{formatGbp(b.amountInBand)}</td>
                        <td className="py-1.5">{formatGbp(b.taxDue)}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </Section>
        </>
      }
      explanation={
        <>
          <p>
            Your salary is taxed in bands: the first £12,570 is tax-free (your Personal Allowance
            — reduced by £1 for every £2 earned over £100,000, reaching £0 at £125,140), the next
            £37,700 is taxed at 20%, the next £74,870 at 40%, and anything beyond that at 45%.
          </p>
          <p>
            National Insurance is charged separately: 8% on earnings between £12,570 and £50,270,
            and 2% above that.
          </p>
        </>
      }
      faqs={[
        {
          question: "Does this include pension contributions?",
          answer: "No — enter your gross salary before any pension deduction. Pension contributions would reduce your taxable income further.",
        },
        {
          question: "What about Scottish Income Tax?",
          answer: "This calculator uses England, Wales & Northern Ireland rates. Scotland has different income tax bands and rates.",
        },
        {
          question: "Is this exact to the penny?",
          answer: "It's a close estimate based on annual HMRC rates. Your actual payslip may differ slightly due to pay-period rounding, tax codes, or other deductions.",
        },
      ]}
    />
  );
}
