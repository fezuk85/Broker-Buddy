"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { calculateHelpToBuy } from "@/lib/calc";
import { formatGbp, formatPercent } from "@/lib/format";
import { CalculatorPage } from "@/components/CalculatorPage";
import { Field, NumberInput } from "@/components/Field";
import { Section } from "@/components/Section";
import { StatTile } from "@/components/StatTile";
import { HelpToBuyFeeGuide } from "@/content/guides/helpToBuyFee";

export default function HelpToBuyFeeClient() {
  const [price, setPrice] = useState(250_000);
  const [pct, setPct] = useState(20);
  const [value, setValue] = useState(270_000);
  const [rpi, setRpi] = useState(4);
  const [years, setYears] = useState(10);

  const result = useMemo(
    () =>
      calculateHelpToBuy({
        purchasePrice: price,
        equityLoanPercent: pct,
        currentValue: value,
        rpiPercent: rpi,
        yearsToShow: years,
      }),
    [price, pct, value, rpi, years]
  );

  return (
    <CalculatorPage
      slug="help-to-buy-fee-calculator"
      h1="Help to Buy Equity Loan Fee Calculator"
      intro="See the fee your Help to Buy equity loan charges after year five, how it rises each year, and what it would cost to repay the loan at today's value."
      disclaimer="Illustrative only, based on the government's published Help to Buy equity loan (England, 2013 to 2021) terms and an RPI figure you choose. Your actual fees are set by Homes England's Mortgage Administrator, so check your latest statement. Not advice."
      inputs={
        <Section title="Your equity loan">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Purchase price">
              <NumberInput prefix="£" value={price} onChange={setPrice} />
            </Field>
            <Field label="Equity loan (% of price)">
              <NumberInput suffix="%" value={pct} onChange={setPct} step={5} />
            </Field>
            <Field label="Home's current value">
              <NumberInput prefix="£" value={value} onChange={setValue} />
            </Field>
            <Field label="Assumed yearly RPI (%)">
              <NumberInput suffix="%" value={rpi} onChange={setRpi} step={0.5} />
            </Field>
            <Field label="Years of fees to show">
              <NumberInput suffix="years" value={years} onChange={setYears} step={1} />
            </Field>
          </div>
        </Section>
      }
      results={
        result ? (
          <>
            <Section title="What it costs now">
              <div className="grid grid-cols-2 gap-3">
                <StatTile label="Equity loan at purchase" value={formatGbp(result.equityLoanAmount)} />
                <StatTile
                  label="Cost to repay in full today"
                  value={formatGbp(result.repayInFullToday)}
                  subValue={`${result.repaymentChange >= 0 ? "+" : "−"}${formatGbp(Math.abs(result.repaymentChange))} vs the original loan`}
                  accent="primary"
                />
                <StatTile label="Fee from year 6 (a month)" value={formatGbp(result.years[0].monthlyFee, 2)} subValue="includes the £1 management fee" />
                <StatTile label="Smallest part repayment" value={formatGbp(result.minimumPartRepayment)} subValue="10% of current value" />
              </div>
            </Section>

            <Section title={`Fees over ${result.years.length} fee-paying years`}>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[var(--bb-muted)]">
                    <th className="font-medium py-1 pr-3">Year</th>
                    <th className="font-medium py-1 pr-3">Fee rate</th>
                    <th className="font-medium py-1 pr-3">A month</th>
                    <th className="font-medium py-1 text-right">A year</th>
                  </tr>
                </thead>
                <tbody>
                  {result.years.map((y) => (
                    <tr key={y.year} className="border-t border-[var(--bb-border)]">
                      <td className="py-1.5 pr-3">{y.year}</td>
                      <td className="py-1.5 pr-3">{formatPercent(y.feeRatePercent, 2)}</td>
                      <td className="py-1.5 pr-3">{formatGbp(y.monthlyFee, 2)}</td>
                      <td className="py-1.5 text-right">{formatGbp(y.annualFee + 12)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="mt-3 text-sm text-[var(--bb-muted)]">
                Total fees over these years: <strong>{formatGbp(result.totalFeesOverPeriod)}</strong>, on top of repaying
                the loan itself. If you are thinking about borrowing to clear it, compare the routes with our{" "}
                <Link href="/second-charge-vs-early-repayment-charge" className="underline hover:text-[var(--bb-foreground)]">
                  second charge vs early repayment charge calculator
                </Link>{" "}
                and read how a{" "}
                <Link href="/help-to-buy-second-charge" className="underline hover:text-[var(--bb-foreground)]">
                  second charge works on a Help to Buy home
                </Link>
                .
              </p>
            </Section>
          </>
        ) : (
          <Section title="What it costs now">
            <p className="text-sm text-[var(--bb-muted)]">Enter your purchase price, equity loan percentage and current value.</p>
          </Section>
        )
      }
      explanation={
        <p>
          The equity loan is interest-free for five years. From year six the government&apos;s guide says you pay a fee of
          1.75% a year of the equity loan amount at purchase, and that fee rate then rises each year by the increase in RPI
          plus 1%. There is also a £1 monthly management fee. Repaying means paying your loan share of the home&apos;s current
          market value, so it goes up if your home has gone up in value.
        </p>
      }
      guide={<HelpToBuyFeeGuide />}
      faqs={[
        {
          question: "When does the Help to Buy equity loan fee start?",
          answer:
            "After five years. The government's buyers' guide says the fee is 1.75% a year of the equity loan amount at purchase, and it then rises each year by the increase in RPI plus 1%. A £1 monthly management fee applies from the start.",
        },
        {
          question: "How much does it cost to repay a Help to Buy equity loan?",
          answer:
            "You repay your loan percentage of the home's value at the time, not the original amount. If your home is worth more now, repaying costs more; if it is worth less, it costs less. An independent valuation is needed and you pay for it.",
        },
        {
          question: "Can I repay part of the equity loan?",
          answer:
            "Yes. Part repayments (staircasing) can be made at any time, and each must be at least 10% of the home's current market value.",
        },
        {
          question: "Does this calculator use my actual fee?",
          answer:
            "No. It follows the published rules and the RPI you enter, so treat it as an estimate. Your Help to Buy statement shows the amounts you are actually charged.",
        },
      ]}
    />
  );
}
