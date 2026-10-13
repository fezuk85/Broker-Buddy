"use client";

import { useState } from "react";
import { Field, SelectInput } from "@/components/Field";
import {
  CREDIT_PROFILE_OPTIONS,
  PRODUCT_OPTIONS,
  PRODUCT_ERC,
  RATE_CARD_SOURCE,
  CreditProfile,
  SecondChargeProduct,
  findSecondChargeRate,
  getFullRateGrid,
} from "@/lib/rates/secondChargeRateCard";

/**
 * Lets a broker pick a credit profile + product and apply the matching indicative rate for the
 * case's current combined LTV directly into the "Annual interest rate" field — rather than having
 * to look one up by hand. The figures are a real lender's published pricing at a point in time
 * (see secondChargeRateCard.ts), shown generically as an example rather than attributed to that
 * lender, so it's labelled as indicative rather than as a live or market-average rate.
 */
export function SecondChargeRateFinder({
  combinedLtvPercent,
  onApplyRate,
  onApplyErc,
}: {
  combinedLtvPercent: number;
  onApplyRate: (ratePercent: number) => void;
  onApplyErc?: (erc: string) => void;
}) {
  const [creditProfile, setCreditProfile] = useState<CreditProfile>("prime");
  const [product, setProduct] = useState<SecondChargeProduct>("2yr-fix");
  const [showFullGrid, setShowFullGrid] = useState(false);

  const match = findSecondChargeRate(creditProfile, product, combinedLtvPercent);
  const grid = getFullRateGrid(creditProfile);
  const effectiveDateLabel = new Date(RATE_CARD_SOURCE.effectiveDate).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="rounded-lg border border-[var(--bb-border)] p-3">
      <p className="text-sm font-medium text-[var(--bb-foreground)]">Find a rate by LTV</p>
      <p className="mt-1 text-xs text-[var(--bb-muted)]">
        {RATE_CARD_SOURCE.label}, illustrative as of {effectiveDateLabel}. Gives a sense of how pricing
        typically varies by credit profile, product and LTV — not a live quote from a specific lender or a
        market average, and it will go stale over time.
      </p>

      <div className="mt-3 grid grid-cols-2 gap-3">
        <Field label="Credit profile">
          <SelectInput value={creditProfile} onChange={setCreditProfile} options={CREDIT_PROFILE_OPTIONS} />
        </Field>
        <Field label="Product">
          <SelectInput value={product} onChange={setProduct} options={PRODUCT_OPTIONS} />
        </Field>
      </div>

      <div className="mt-3 flex items-center justify-between gap-3 rounded-lg bg-[var(--bb-bg)] px-3 py-2">
        {match ? (
          product === "boe-tracker" ? (
            <p className="text-sm">
              At {formatLtvLabel(combinedLtvPercent, match.maxLtvBand)}: <strong>BBR +{match.trackerMarginPercent?.toFixed(2)}%</strong> —
              variable, add the current Bank of England base rate yourself before applying.
            </p>
          ) : (
            <>
              <p className="text-sm">
                At {formatLtvLabel(combinedLtvPercent, match.maxLtvBand)}: <strong>{match.ratePercent?.toFixed(2)}%</strong>
              </p>
              <button
                type="button"
                onClick={() => {
                  onApplyRate(match.ratePercent!);
                  onApplyErc?.(PRODUCT_ERC[product]);
                }}
                className="bb-tap-target shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium text-white"
                style={{ background: "var(--bb-primary)" }}
              >
                Use this rate
              </button>
            </>
          )
        ) : (
          <p className="text-sm text-[var(--bb-muted)]">
            Not offered at {formatPercent(combinedLtvPercent)} combined LTV for this credit profile on this
            lender&apos;s card.
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={() => setShowFullGrid((v) => !v)}
        className="mt-3 text-xs font-medium underline"
        style={{ color: "var(--bb-primary)" }}
      >
        {showFullGrid ? "Hide" : "Show"} full {CREDIT_PROFILE_OPTIONS.find((o) => o.value === creditProfile)?.label} rate table
      </button>

      {showFullGrid && (
        <div className="mt-2 overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-left text-[var(--bb-muted)]">
                <th className="font-medium py-1 pr-3">Product</th>
                {grid.maxLtvBands.map((b) => (
                  <th key={b} className="font-medium py-1 pr-3">
                    {b}%
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {grid.rows.map((row) => (
                <tr key={row.product} className="border-t border-[var(--bb-border)]">
                  <td className="py-1 pr-3">{row.label}</td>
                  {row.values.map((v, i) => (
                    <td key={i} className="py-1 pr-3">
                      {v ?? "—"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

function formatLtvLabel(actualLtv: number, band: number): string {
  return `${formatPercent(actualLtv)} LTV (up to ${band}% band)`;
}
