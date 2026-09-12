/**
 * Builds a client-presentable PDF quotation for a Bridging Loan Calculator case — loan details,
 * cost breakdown and total effective cost. Shares layout/typography with the other calculators'
 * PDF exports via pdfCursor.ts. Optionally personalised with a client reference and quotation
 * date, both of which appear in the document header when provided.
 */
import { jsPDF } from "jspdf";
import { BridgingInterestType, BridgingResult } from "@/lib/calc";
import { formatGbp, formatPercent } from "@/lib/format";
import { PdfCursor, renderFooterOnEveryPage } from "./pdfCursor";

export interface BridgingQuotationInputs {
  clientReference: string;
  quotationDate: string; // yyyy-mm-dd, "" if not set
  netLoan: number;
  monthlyRate: number;
  termMonths: number;
  interestType: BridgingInterestType;
  arrangementFeePercent: number;
  brokerFee: number;
  valuationFee: number;
  otherFees: number;
  result: BridgingResult | null;
}

function formatQuotationDate(isoDate: string): string {
  if (!isoDate) return new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  const d = new Date(isoDate);
  if (Number.isNaN(d.getTime())) return isoDate;
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

export function generateBridgingQuotationPdf(inputs: BridgingQuotationInputs): jsPDF {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const c = new PdfCursor(doc);

  c.title("Lending Calculator — Bridging Loan Quotation");
  const subtitleParts = [`Date: ${formatQuotationDate(inputs.quotationDate)}`];
  if (inputs.clientReference.trim()) subtitleParts.push(`Client: ${inputs.clientReference.trim()}`);
  c.subtitle(subtitleParts.join(" · "));

  c.sectionHeading("Loan Details");
  c.row("Net loan required", formatGbp(inputs.netLoan));
  c.row("Monthly interest rate", formatPercent(inputs.monthlyRate, 2));
  c.row("Term", `${inputs.termMonths} months`);
  c.row("Interest type", inputs.interestType === "retained" ? "Retained (deducted from advance)" : "Serviced (paid monthly)");

  c.sectionHeading("Fees");
  c.row("Arrangement fee", formatPercent(inputs.arrangementFeePercent, 2));
  c.row("Broker fee", formatGbp(inputs.brokerFee));
  c.row("Valuation fee", formatGbp(inputs.valuationFee));
  if (inputs.otherFees > 0) c.row("Other fees", formatGbp(inputs.otherFees));

  if (inputs.result) {
    c.sectionHeading("Cost");
    c.row("Gross loan", formatGbp(inputs.result.grossLoan));
    c.row("Total interest", formatGbp(inputs.result.totalInterest));
    c.row("Arrangement fee (amount)", formatGbp(inputs.result.arrangementFee));
    c.row("Total fees", formatGbp(inputs.result.totalFees));
    c.row("Total repayment", formatGbp(inputs.result.totalRepayment));
    c.row("Effective cost", formatGbp(inputs.result.effectiveCost));
  } else {
    c.sectionHeading("Cost");
    c.paragraph(
      "This combination of rate, term and fees isn't fundable with retained interest — try a shorter term, lower rate, or switch to serviced interest."
    );
  }

  renderFooterOnEveryPage(
    doc,
    "Generic maths only — not specific to any lender's product. Always confirm exact terms, fees and interest calculation method with the lender."
  );

  return doc;
}

/** Builds and triggers a browser download of the quotation PDF. Client-only (uses jsPDF's save()). */
export function downloadBridgingQuotationPdf(inputs: BridgingQuotationInputs): void {
  const doc = generateBridgingQuotationPdf(inputs);
  const refPart = inputs.clientReference.trim() ? `-${inputs.clientReference.trim().replace(/\s+/g, "-")}` : "";
  const datePart = inputs.quotationDate || new Date().toISOString().slice(0, 10);
  doc.save(`Bridging-Quotation${refPart}-${datePart}.pdf`);
}
