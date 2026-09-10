"use client";

import { useMemo, useState } from "react";
import { calculateSalaryDividendTakeHome, TAX_YEAR_LABEL } from "@/lib/calc";
import { formatGbp } from "@/lib/format";
import { CalculatorPage } from "@/components/CalculatorPage";
import { Field, NumberInput } from "@/components/Field";
import { Section } from "@/components/Section";
import { StatTile } from "@/components/StatTile";
import { BenefitsSection } from "@/components/BenefitsSection";

export default function DividendCalculatorClient() {
  const [grossSalary, setGrossSalary] = useState(12_570);
  const [grossDividends, setGrossDividends] = useState(40_000);

  const result = useMemo(() => calculateSalaryDividendTakeHome(grossSalary, grossDividends), [grossSalary, grossDividends]);

  return (
    <CalculatorPage
      h1="Salary + Dividend Take-Home Calculator"
      intro={`Common for limited company directors: combine a salary and dividends and see the net take-home. Dividends are taxed correctly on top of salary, using ${TAX_YEAR_LABEL} rates.`}
      disclaimer={`Estimates only, based on published HMRC rates for ${TAX_YEAR_LABEL}. Assumes no other income, pension contributions or student loan. Does not cover Corporation Tax on the company's profits before dividends are declared. Net take-home figures above do not include Child Benefit or Marriage Allowance shown below. Not tax advice — consult an accountant for company tax planning.`}
      inputs={
        <Section title="Your income">
          <div className="grid grid-cols-1 gap-3">
            <Field label="Gross annual salary" hint="Often set at the NI/PA threshold for directors, but enter your actual figure">
              <NumberInput value={grossSalary} onChange={setGrossSalary} />
            </Field>
            <Field label="Gross annual dividends">
              <NumberInput value={grossDividends} onChange={setGrossDividends} />
            </Field>
          </div>
        </Section>
      }
      results={
        <>
          <Section title="Take-home pay">
            <div className="grid grid-cols-2 gap-3">
              <StatTile label="Net annual" value={formatGbp(result.netAnnual)} accent="primary" />
              <StatTile label="Net monthly" value={formatGbp(result.netMonthly)} accent="primary" />
              <StatTile label="Net weekly" value={formatGbp(result.netWeekly)} />
              <StatTile label="Gross total" value={formatGbp(result.grossTotal)} />
            </div>
          </Section>
          <Section title="Tax breakdown">
            <div className="grid grid-cols-2 gap-3">
              <StatTile label="Income tax on salary" value={formatGbp(result.incomeTaxOnSalary.totalIncomeTax)} />
              <StatTile label="NI on salary" value={formatGbp(result.nationalInsuranceOnSalary.totalNationalInsurance)} />
              <StatTile label="Tax on dividends" value={formatGbp(result.dividendTax.totalDividendTax)} />
              <StatTile label="Total tax & NI" value={formatGbp(result.totalTaxAndNi)} />
            </div>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[var(--bb-muted)]">
                    <th className="font-medium py-1 pr-4">Dividend band</th>
                    <th className="font-medium py-1 pr-4">Amount in band</th>
                    <th className="font-medium py-1">Tax due</th>
                  </tr>
                </thead>
                <tbody>
                  {result.dividendTax.dividendAllowanceUsed > 0 && (
                    <tr className="border-t border-[var(--bb-border)]">
                      <td className="py-1.5 pr-4">Dividend allowance (0%)</td>
                      <td className="py-1.5 pr-4">{formatGbp(result.dividendTax.dividendAllowanceUsed)}</td>
                      <td className="py-1.5">{formatGbp(0)}</td>
                    </tr>
                  )}
                  {result.dividendTax.bands
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
                </tbody>
              </table>
            </div>
          </Section>
          <BenefitsSection primaryIncome={result.grossTotal} />
        </>
      }
      explanation={
        <>
          <p>
            Dividends are taxed as the &quot;top slice&quot; of your income — after your salary
            has used up your Personal Allowance and any basic/higher-rate band. A £500 dividend
            allowance applies at 0%, then dividends are taxed at 8.75% (basic rate), 33.75%
            (higher rate) or 39.35% (additional rate) depending which band they fall into.
          </p>
          <p>Dividends are not subject to National Insurance, unlike salary.</p>
        </>
      }
      faqs={[
        {
          question: "Why do directors often take a small salary plus dividends?",
          answer:
            "A salary around the NI/Personal Allowance threshold avoids employee NI while still qualifying for state pension credits, and dividends are taxed at lower rates than salary above that — but this doesn't account for Corporation Tax the company pays on its profits before dividends, or employer NI.",
        },
        {
          question: "Does this include Corporation Tax?",
          answer:
            "No — this calculator only covers personal tax on money you've already received as salary and dividends. Corporation Tax is paid by the company on its profits before dividends are declared.",
        },
        {
          question: "What order are salary and dividends taxed in?",
          answer: "Salary (and other non-dividend income) is taxed first, using up the Personal Allowance and lower bands; dividends are taxed on top.",
        },
        {
          question: "Does dividend income count towards the Child Benefit charge?",
          answer:
            "Yes — the High Income Child Benefit Charge looks at total adjusted net income, which includes dividends alongside salary, not just employment income.",
        },
      ]}
    />
  );
}
