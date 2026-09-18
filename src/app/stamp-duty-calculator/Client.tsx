"use client";

import { useMemo, useState } from "react";
import { calculateStampDuty, type BuyerType } from "@/lib/calc";
import { formatGbp, formatPercent } from "@/lib/format";
import { CalculatorPage } from "@/components/CalculatorPage";
import { CheckboxInput, Field, NumberInput, SelectInput } from "@/components/Field";
import { Section } from "@/components/Section";
import { StatTile } from "@/components/StatTile";
import { StampDutyGuide } from "@/content/guides/stampDuty";

export default function StampDutyCalculatorClient() {
  const [price, setPrice] = useState(350_000);
  const [buyerType, setBuyerType] = useState<BuyerType>("standard");
  const [nonUkResident, setNonUkResident] = useState(false);

  const result = useMemo(() => calculateStampDuty({ price, buyerType, nonUkResident }), [price, buyerType, nonUkResident]);

  return (
    <CalculatorPage
      slug="stamp-duty-calculator"
      h1="Stamp Duty Calculator (England & Northern Ireland)"
      intro="Work out the Stamp Duty Land Tax (SDLT) on a residential purchase — standard rates, first-time buyer relief, or an additional property such as a buy-to-let or second home."
      disclaimer="Illustrative only, for England & Northern Ireland. Wales (LTT) and Scotland (LBTT) have different rates. Rates checked against GOV.UK in September 2026 — confirm the exact figure with your conveyancer."
      inputs={
        <Section title="The purchase">
          <div className="grid grid-cols-1 gap-3">
            <Field label="Purchase price">
              <NumberInput value={price} onChange={setPrice} />
            </Field>
            <Field label="Who is buying?">
              <SelectInput
                value={buyerType}
                onChange={setBuyerType}
                options={[
                  { value: "standard", label: "Home mover (buying my main home)" },
                  { value: "first-time", label: "First-time buyer" },
                  { value: "additional", label: "Additional property (buy-to-let / second home)" },
                ]}
              />
            </Field>
            <CheckboxInput
              checked={nonUkResident}
              onChange={setNonUkResident}
              label="Buyer is not UK resident (2% surcharge)"
            />
          </div>
        </Section>
      }
      results={
        <>
          <Section title="Stamp duty to pay">
            <div className="grid grid-cols-2 gap-3">
              <StatTile label="Total SDLT" value={formatGbp(result.totalTax)} accent="primary" />
              <StatTile
                label="Effective rate"
                value={result.effectiveRatePercent === null ? "—" : formatPercent(result.effectiveRatePercent, 2)}
                subValue="of the purchase price"
              />
            </div>
            {result.firstTimeBuyerReliefApplied && (
              <p className="mt-3 text-sm text-[var(--bb-muted)]">First-time buyer relief applied.</p>
            )}
            {result.firstTimeBuyerReliefNote && (
              <p className="mt-3 text-sm" style={{ color: "var(--bb-warning-text)" }}>
                {result.firstTimeBuyerReliefNote}
              </p>
            )}
          </Section>

          <Section title="Band-by-band breakdown">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[var(--bb-muted)]">
                  <th className="font-medium py-1 pr-3">Band</th>
                  <th className="font-medium py-1 pr-3">Rate</th>
                  <th className="font-medium py-1 pr-3">Taxable</th>
                  <th className="font-medium py-1 text-right">Tax</th>
                </tr>
              </thead>
              <tbody>
                {result.bands.map((b) => (
                  <tr key={b.label} className="border-t border-[var(--bb-border)]">
                    <td className="py-1.5 pr-3">{b.label}</td>
                    <td className="py-1.5 pr-3">{b.ratePercent}%</td>
                    <td className="py-1.5 pr-3">{formatGbp(b.amountInBand)}</td>
                    <td className="py-1.5 text-right">{formatGbp(b.taxDue)}</td>
                  </tr>
                ))}
                {result.additionalPropertySurcharge > 0 && (
                  <tr className="border-t border-[var(--bb-border)]">
                    <td className="py-1.5 pr-3" colSpan={3}>Additional property surcharge (5% of price)</td>
                    <td className="py-1.5 text-right">{formatGbp(result.additionalPropertySurcharge)}</td>
                  </tr>
                )}
                {result.nonResidentSurcharge > 0 && (
                  <tr className="border-t border-[var(--bb-border)]">
                    <td className="py-1.5 pr-3" colSpan={3}>Non-UK resident surcharge (2% of price)</td>
                    <td className="py-1.5 text-right">{formatGbp(result.nonResidentSurcharge)}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </Section>
        </>
      }
      explanation={
        <p>
          SDLT is charged in slices: each portion of the price is taxed at the rate for its own band. First-time
          buyers get a higher zero-rate band (up to £300,000) but lose the relief entirely above £500,000.
          Additional-property purchases add a 5% surcharge on the whole price, and non-UK residents pay a further 2%.
        </p>
      }
      guide={<StampDutyGuide />}
      faqs={[
        {
          question: "How much stamp duty will I pay on a £300,000 house?",
          answer:
            "A home mover pays £5,000 (2% of £125,000 plus 5% of £50,000). A first-time buyer pays nothing. Someone buying an additional property pays £20,000 (£5,000 plus the 5% surcharge on £300,000).",
        },
        {
          question: "Do first-time buyers pay stamp duty?",
          answer:
            "First-time buyers pay no SDLT up to £300,000 and 5% on the portion from £300,001 to £500,000. Above £500,000 there is no relief at all and standard rates apply to the whole price.",
        },
        {
          question: "When do I have to pay stamp duty?",
          answer:
            "Normally within 14 days of completion. Your solicitor or conveyancer usually files the return and pays it for you from the money you send them.",
        },
        {
          question: "Does this cover Scotland and Wales?",
          answer:
            "No. Scotland uses Land and Buildings Transaction Tax (LBTT) and Wales uses Land Transaction Tax (LTT), each with different rates and reliefs. This calculator covers England and Northern Ireland only.",
        },
      ]}
    />
  );
}
