/**
 * Builds a client-presentable PDF quotation for a Second & Third Charge Loan Calculator case —
 * combined LTV across all charges, new charge cost (including fees), and rental coverage when
 * applicable. Shares layout/typography with the Mortgage Case Calculator's PDF summary via
 * pdfCursor.ts. Optionally personalised with a client reference and quotation date, both of which
 * appear in the document header when provided.
 */
import { jsPDF } from "jspdf";
import {
  CombinedChargeResult,
  SecuredLoanCostResult,
  CombinedDscrResult,
  ExistingCharge,
} from "@/lib/calc";
import { formatGbp, formatPercent } from "@/lib/format";
import { PdfCursor, renderFooterOnEveryPage } from "./pdfCursor";

export interface SecondChargeQuotationInputs {
  clientReference: string;
  quotationDate: string; // yyyy-mm-dd, "" if not set
  propertyValue: number;
  charges: ExistingCharge[];
  newChargeAmount: number;
  annualRatePercent: number;
  termMonths: number;
  repaymentType: "repayment" | "interest-only";
  lenderFee: number;
  brokerFee: number;
  valuationFee: number;
  otherFees: number;
  combined: CombinedChargeResult;
  cost: SecuredLoanCostResult | null;
  isRental: boolean;
  firstChargePayment: number;
  monthlyRent: number;
  requiredIcrPercent: number;
  combinedDscr: CombinedDscrResult;
  maxSecondChargeLoanFromRent: number | null;
}

function formatQuotationDate(isoDate: string): string {
  if (!isoDate) return new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  const d = new Date(isoDate);
  if (Number.isNaN(d.getTime())) return isoDate;
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

export function generateSecondChargeQuotationPdf(inputs: SecondChargeQuotationInputs): jsPDF {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const c = new PdfCursor(doc);

  c.title("Lending Calculator — Second & Third Charge Loan Quotation");
  const subtitleParts = [`Date: ${formatQuotationDate(inputs.quotationDate)}`];
  if (inputs.clientReference.trim()) subtitleParts.push(`Client: ${inputs.clientReference.trim()}`);
  c.subtitle(subtitleParts.join(" · "));

  // --- Property & existing charges ---
  c.sectionHeading("Property & Existing Charges");
  c.row("Property value", formatGbp(inputs.propertyValue));
  c.gap(1);
  if (inputs.combined.existingCharges.length > 0) {
    c.table(
      ["Charge", "Balance", "Cumulative", "Cumulative LTV"],
      inputs.combined.existingCharges.map((row) => [
        row.label,
        formatGbp(row.balance),
        formatGbp(row.cumulativeBalance),
        formatPercent(row.cumulativeLtvPercent),
      ]),
      [0.35, 0.25, 0.2, 0.2]
    );
  }

  // --- Combined LTV ---
  c.sectionHeading("Combined Loan-to-Value");
  c.row("New charge requested", formatGbp(inputs.newChargeAmount));
  c.row("Current combined LTV", formatPercent(inputs.combined.currentCombinedLtvPercent));
  c.row("Proposed combined LTV", formatPercent(inputs.combined.proposedCombinedLtvPercent));
  c.row("Equity now", formatGbp(inputs.combined.equity));
  c.row("Equity after new charge", formatGbp(inputs.combined.equityAfterNewCharge));

  // --- New charge details ---
  c.sectionHeading("New Charge Details");
  c.row("Loan amount", formatGbp(inputs.newChargeAmount));
  c.row("Annual interest rate", formatPercent(inputs.annualRatePercent, 2));
  c.row("Term", `${inputs.termMonths} months`);
  c.row("Repayment type", inputs.repaymentType === "repayment" ? "Repayment (capital & interest)" : "Interest-only");
  if (inputs.cost) {
    c.row("Monthly payment", formatGbp(inputs.cost.monthlyPayment));
    c.row("Total interest over term", formatGbp(inputs.cost.totalInterest));
  }
  c.gap(2);
  c.row("Lender fee", formatGbp(inputs.lenderFee));
  c.row("Broker fee", formatGbp(inputs.brokerFee));
  c.row("Valuation fee", formatGbp(inputs.valuationFee));
  if (inputs.otherFees > 0) c.row("Other fees", formatGbp(inputs.otherFees));
  if (inputs.cost) {
    c.row("Total fees", formatGbp(inputs.cost.totalFees));
    c.row("Total cost of borrowing", formatGbp(inputs.cost.totalCostOfBorrowing));
  }
  c.paragraph(
    "Total cost of borrowing is a total-cost illustration (interest + fees over the term), not a mandatory APRC calculation — quote the lender's own APRC for regulatory disclosure."
  );

  // --- Rental coverage ---
  if (inputs.isRental) {
    c.sectionHeading("Rental Coverage (Buy-to-Let)");
    c.row("Existing 1st charge payment", formatGbp(inputs.firstChargePayment));
    c.row("Monthly rent", formatGbp(inputs.monthlyRent));
    c.row("Required ICR", formatPercent(inputs.requiredIcrPercent, 0));
    c.row("Combined monthly payment (1st + 2nd charge)", formatGbp(inputs.combinedDscr.monthlyPayment));
    c.row("DSCR", formatPercent(inputs.combinedDscr.dscrPercent));
    c.row(
      "Coverage",
      inputs.combinedDscr.passes == null
        ? "—"
        : inputs.combinedDscr.passes
          ? `Passes (£${Math.round(inputs.combinedDscr.surplusOrShortfall).toLocaleString("en-GB")}/mo to spare)`
          : `Does not pass (short by £${Math.round(-inputs.combinedDscr.surplusOrShortfall).toLocaleString("en-GB")}/mo)`
    );
    if (inputs.maxSecondChargeLoanFromRent != null) {
      c.row("Max 2nd charge loan this rent supports", formatGbp(inputs.maxSecondChargeLoanFromRent));
    }
  }

  renderFooterOnEveryPage(
    doc,
    "Generic maths only — not specific to any lender's criteria, product or APRC. Second/third charge lending criteria (maximum combined LTV, consent from the prior charge holder, etc.) vary by lender. Always confirm with the lender's own illustration."
  );

  return doc;
}

/** Builds and triggers a browser download of the quotation PDF. Client-only (uses jsPDF's save()). */
export function downloadSecondChargeQuotationPdf(inputs: SecondChargeQuotationInputs): void {
  const doc = generateSecondChargeQuotationPdf(inputs);
  const refPart = inputs.clientReference.trim() ? `-${inputs.clientReference.trim().replace(/\s+/g, "-")}` : "";
  const datePart = inputs.quotationDate || new Date().toISOString().slice(0, 10);
  doc.save(`Second-Charge-Quotation${refPart}-${datePart}.pdf`);
}
