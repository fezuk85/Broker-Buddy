"use client";

import { useMemo, useState } from "react";
import { calculateErcBreakEven } from "@/lib/calc";
import { formatGbp, formatPercent } from "@/lib/format";
import { CalculatorPage } from "@/components/CalculatorPage";
import { Field, NumberInput } from "@/components/Field";
import { Section } from "@/components/Section";
import { StatTile } from "@/components/StatTile";
import { ErcBreakEvenGuide } from "@/content/guides/ercBreakEven";

export default function ErcBreakEvenClient() {
  const [balance, setBalance] = useState(180_000);
  const [existingRate, setExistingRate] = useState(2.5);
  const [termYears, setTermYears] = useState(20);
  const [extra, setExtra] = useState(30_000);
  const [ercPercent, setErcPercent] = useState(3);
  const [newRate, setNewRate] = useState(5);
  const [scRate, setScRate] = useState(9);
  const [scTerm, setScTerm] = useState(10);
  const [scFees, setScFees] = useState(1_500);
  const [reFees, setReFees] = useState(1_000);
  const [horizon, setHorizon] = useState(5);

  const result = useMemo(
    () =>
      calculateErcBreakEven({
        existingBalance: balance,
        existingRatePercent: existingRate,
        remainingTermYears: termYears,
        extraBorrowing: extra,
        ercPercent,
        newMortgageRatePercent: newRate,
        secondChargeRatePercent: scRate,
        secondChargeTermYears: scTerm,
        secondChargeFees: scFees,
        remortgageFees: reFees,
        horizonYears: horizon,
      }),
    [balance, existingRate, termYears, extra, ercPercent, newRate, scRate, scTerm, scFees, reFees, horizon]
  );

  const headline = !result
    ? ""
    : result.cheaperRoute === "level"
      ? "The two routes cost about the same over this period."
      : result.cheaperRoute === "second-charge"
        ? `On these numbers the second charge is cheaper by about ${formatGbp(Math.abs(result.secondChargeAdvantage))} over ${Math.round(result.horizonMonths / 12)} years.`
        : `On these numbers remortgaging now is cheaper by about ${formatGbp(Math.abs(result.secondChargeAdvantage))} over ${Math.round(result.horizonMonths / 12)} years.`;

  return (
    <CalculatorPage
      slug="second-charge-vs-early-repayment-charge"
      h1="Second Charge vs Early Repayment Charge Calculator"
      intro="Need to raise money but your mortgage has an early repayment charge? Compare taking a second charge loan with paying the charge and remortgaging now, and see the early repayment charge at which the two routes cost the same."
      disclaimer="An illustration only, using constant rates and the figures you enter. It is not a quote, a lending decision or advice, and your own lender's terms will differ. Check the real early repayment charge on your mortgage and speak to a qualified adviser before deciding."
      inputs={
        <>
          <Section title="Your current mortgage">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Outstanding balance">
                <NumberInput prefix="£" value={balance} onChange={setBalance} />
              </Field>
              <Field label="Current interest rate (%)">
                <NumberInput suffix="%" value={existingRate} onChange={setExistingRate} step={0.05} />
              </Field>
              <Field label="Remaining term (years)">
                <NumberInput suffix="years" value={termYears} onChange={setTermYears} step={1} />
              </Field>
              <Field label="Early repayment charge (% of balance)">
                <NumberInput suffix="%" value={ercPercent} onChange={setErcPercent} step={0.5} />
              </Field>
            </div>
          </Section>

          <Section title="Extra money you need">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Amount to borrow">
                <NumberInput prefix="£" value={extra} onChange={setExtra} />
              </Field>
              <Field label="Compare over (years)">
                <NumberInput suffix="years" value={horizon} onChange={setHorizon} step={1} />
              </Field>
            </div>
          </Section>

          <Section title="Route 1: second charge loan">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Second charge rate (%)">
                <NumberInput suffix="%" value={scRate} onChange={setScRate} step={0.05} />
              </Field>
              <Field label="Second charge term (years)">
                <NumberInput suffix="years" value={scTerm} onChange={setScTerm} step={1} />
              </Field>
              <Field label="Fees, added to the loan">
                <NumberInput prefix="£" value={scFees} onChange={setScFees} />
              </Field>
            </div>
          </Section>

          <Section title="Route 2: remortgage now">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="New mortgage rate (%)">
                <NumberInput suffix="%" value={newRate} onChange={setNewRate} step={0.05} />
              </Field>
              <Field label="Fees, added to the loan">
                <NumberInput prefix="£" value={reFees} onChange={setReFees} />
              </Field>
            </div>
          </Section>
        </>
      }
      results={
        result ? (
          <>
            <Section title="Which costs less?">
              <p className="text-sm font-medium">{headline}</p>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <StatTile label="Second charge route: interest + fees" value={formatGbp(result.secondChargeCost)} subValue="all your borrowing, over the period" accent={result.cheaperRoute === "second-charge" ? "primary" : undefined} />
                <StatTile label="Remortgage route: interest + fees" value={formatGbp(result.remortgageCost)} subValue={`including ${formatGbp(result.ercAmount)} ERC`} accent={result.cheaperRoute === "remortgage" ? "primary" : undefined} />
                <StatTile label="Monthly: both loans" value={formatGbp(result.secondChargeMonthlyTotal, 2)} />
                <StatTile label="Monthly: new mortgage" value={formatGbp(result.remortgageMonthly, 2)} />
              </div>
            </Section>

            <Section title="The tipping point">
              {result.breakEvenErcPercent !== null ? (
                <p className="text-sm text-[var(--bb-muted)]">
                  With these rates, remortgaging only wins if the early repayment charge is below about{" "}
                  <strong>{formatPercent(result.breakEvenErcPercent)}</strong> of your balance (around{" "}
                  <strong>{formatGbp((balance * result.breakEvenErcPercent) / 100)}</strong>). Your charge is{" "}
                  {formatPercent(ercPercent)}.
                </p>
              ) : result.cheaperRoute === "second-charge" ? (
                <p className="text-sm text-[var(--bb-muted)]">
                  With these rates the second charge is cheaper even if the early repayment charge were nil, mainly
                  because replacing a low-rate mortgage with a higher-rate one costs more than borrowing a smaller
                  amount at a higher rate.
                </p>
              ) : (
                <p className="text-sm text-[var(--bb-muted)]">
                  With these rates remortgaging stays cheaper even with a very high early repayment charge.
                </p>
              )}
              <p className="mt-2 text-xs text-[var(--bb-muted)]">
                Costs are measured over {Math.round(result.horizonMonths / 12)} years: everything you pay in that time
                plus what you still owe at the end, minus the money you receive.
              </p>
            </Section>
          </>
        ) : (
          <Section title="Which costs less?">
            <p className="text-sm text-[var(--bb-muted)]">Enter a balance, a term and an amount to borrow to see the comparison.</p>
          </Section>
        )
      }
      explanation={
        <p>
          Both routes raise the same cash. A second charge leaves your existing mortgage, and its early repayment
          charge, untouched and adds a separate loan behind it. Remortgaging replaces the whole mortgage, so you pay
          the early repayment charge and the new, larger mortgage is at the new rate. The calculator adds up what you
          would pay on each route over your chosen period, including fees, and compares them.
        </p>
      }
      guide={<ErcBreakEvenGuide />}
      faqs={[
        {
          question: "Is a second charge cheaper than paying an early repayment charge?",
          answer:
            "It can be when your current mortgage rate is low and the early repayment charge is large, because a second charge only costs the higher rate on the smaller extra amount while your cheap mortgage stays in place. When the early repayment charge is small, or your current rate is no lower than today's rates, remortgaging can win. Run your own numbers above.",
        },
        {
          question: "Should I ask my current lender for a further advance first?",
          answer:
            "Yes, it is worth asking. A further advance from your existing lender is often simpler and cheaper than a second charge, but lenders can say no or price it differently. A second charge is a separate loan from another lender that sits behind your mortgage.",
        },
        {
          question: "Does a second charge need my mortgage lender's permission?",
          answer:
            "Many first-charge lenders need to give consent, and some mortgages have terms about further charges. Check your mortgage terms and ask a broker which lenders will lend alongside yours.",
        },
        {
          question: "What does this calculator leave out?",
          answer:
            "It assumes constant rates, repayment loans and the figures you type in. It does not model tax, a change of rate when your current deal ends, the chance of a second charge early repayment charge, or whether you would be accepted. It is an illustration, not a quote.",
        },
      ]}
    />
  );
}
