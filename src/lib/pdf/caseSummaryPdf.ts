/**
 * Builds a client-presentable PDF summary of a mortgage case — the same figures shown across the
 * Mortgage Case Calculator's tabs, laid out as a single printable document a broker can hand to
 * (or email) a client. Generated entirely client-side with jsPDF's vector text/line drawing APIs
 * (no html2canvas/screenshot step), so the output has real, selectable text rather than a rasterised
 * image of the page.
 *
 * Deliberately mirrors the app's own "never fabricate" rule: a section whose underlying data hasn't
 * loaded yet or is unavailable (e.g. affordability, council tax, indicative valuation) says so
 * plainly rather than being silently omitted or showing a stale/zero figure.
 */
import { jsPDF } from "jspdf";
import { CaseState } from "@/lib/case/types";
import { useCaseCalculations } from "@/lib/case/useCaseCalculations";
import { formatGbp, formatPercent, formatMultiple } from "@/lib/format";

type Calc = ReturnType<typeof useCaseCalculations>;

const PAGE_WIDTH = 210;
const PAGE_HEIGHT = 297;
const MARGIN_X = 18;
const MARGIN_TOP = 20;
const MARGIN_BOTTOM = 22;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN_X * 2;

const PRIMARY = [37, 99, 235] as const; // matches the site's --bb-primary blue
const MUTED = [107, 114, 128] as const;
const INK = [17, 24, 39] as const;

class PdfCursor {
  doc: jsPDF;
  y = MARGIN_TOP;

  constructor(doc: jsPDF) {
    this.doc = doc;
  }

  private ensureSpace(height: number) {
    if (this.y + height > PAGE_HEIGHT - MARGIN_BOTTOM) {
      this.doc.addPage();
      this.y = MARGIN_TOP;
    }
  }

  title(text: string) {
    this.ensureSpace(10);
    this.doc.setFont("helvetica", "bold");
    this.doc.setFontSize(18);
    this.doc.setTextColor(...INK);
    this.doc.text(text, MARGIN_X, this.y);
    this.y += 7;
  }

  subtitle(text: string) {
    this.ensureSpace(6);
    this.doc.setFont("helvetica", "normal");
    this.doc.setFontSize(10);
    this.doc.setTextColor(...MUTED);
    this.doc.text(text, MARGIN_X, this.y);
    this.y += 8;
  }

  sectionHeading(text: string) {
    this.ensureSpace(12);
    this.y += 2;
    this.doc.setFont("helvetica", "bold");
    this.doc.setFontSize(12.5);
    this.doc.setTextColor(...PRIMARY);
    this.doc.text(text, MARGIN_X, this.y);
    this.doc.setDrawColor(...PRIMARY);
    this.doc.setLineWidth(0.4);
    this.doc.line(MARGIN_X, this.y + 1.5, PAGE_WIDTH - MARGIN_X, this.y + 1.5);
    this.y += 7;
  }

  /** Two-column label/value row, label left in muted grey, value right-aligned in ink. */
  row(label: string, value: string) {
    this.ensureSpace(6);
    this.doc.setFont("helvetica", "normal");
    this.doc.setFontSize(10);
    this.doc.setTextColor(...MUTED);
    this.doc.text(label, MARGIN_X, this.y);
    this.doc.setFont("helvetica", "bold");
    this.doc.setTextColor(...INK);
    this.doc.text(value, PAGE_WIDTH - MARGIN_X, this.y, { align: "right" });
    this.y += 5.6;
  }

  /** Wrapped paragraph text, e.g. notes/disclaimers. */
  paragraph(text: string, options?: { size?: number; color?: readonly [number, number, number]; italic?: boolean }) {
    const size = options?.size ?? 8.5;
    const color = options?.color ?? MUTED;
    this.doc.setFont("helvetica", options?.italic ? "italic" : "normal");
    this.doc.setFontSize(size);
    this.doc.setTextColor(...color);
    const lines = this.doc.splitTextToSize(text, CONTENT_WIDTH) as string[];
    for (const line of lines) {
      this.ensureSpace(4.6);
      this.doc.text(line, MARGIN_X, this.y);
      this.y += 4.6;
    }
  }

  /** Simple table: header row + data rows, columns proportioned by `widths` (fractions summing to 1). */
  table(headers: string[], rows: string[][], widths: number[]) {
    const colX: number[] = [];
    let acc = MARGIN_X;
    for (const w of widths) {
      colX.push(acc);
      acc += w * CONTENT_WIDTH;
    }

    this.ensureSpace(7);
    this.doc.setFont("helvetica", "bold");
    this.doc.setFontSize(9);
    this.doc.setTextColor(...MUTED);
    headers.forEach((h, i) => this.doc.text(h, colX[i], this.y));
    this.y += 1.5;
    this.doc.setDrawColor(...MUTED);
    this.doc.setLineWidth(0.2);
    this.doc.line(MARGIN_X, this.y, PAGE_WIDTH - MARGIN_X, this.y);
    this.y += 4.5;

    this.doc.setFont("helvetica", "normal");
    this.doc.setFontSize(9.5);
    this.doc.setTextColor(...INK);
    for (const r of rows) {
      this.ensureSpace(5.4);
      r.forEach((cell, i) => this.doc.text(cell, colX[i], this.y));
      this.y += 5.4;
    }
    this.y += 2;
  }

  gap(amount = 3) {
    this.y += amount;
  }
}

function applicantAgeLabel(age: { years: number; months: number } | null): string {
  if (!age) return "—";
  return `${age.years}y ${age.months}m`;
}

export function generateCaseSummaryPdf(caseState: CaseState, calc: Calc): jsPDF {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const c = new PdfCursor(doc);

  c.title("Lending Calculator — Mortgage Case Summary");
  const generatedOn = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  c.subtitle(
    `Generated ${generatedOn}${caseState.property.postcode ? ` · ${caseState.property.postcode}` : ""}${
      caseState.property.addressLine1 ? ` · ${caseState.property.addressLine1}` : ""
    }`
  );

  // --- Property ---
  c.sectionHeading("Property");
  c.row("Property value entered", formatGbp(caseState.property.value));
  c.row("Postcode", caseState.property.postcode || "Not entered");

  const v = calc.valuation;
  if (v.insufficientData) {
    c.gap(1);
    c.paragraph("Lending Calculator Indicative Property Estimate: insufficient public data for this property to offer an estimate.");
  } else {
    c.gap(1);
    c.paragraph(
      `Lending Calculator indicative estimate: ${formatGbp(v.combinedEstimate)} (range ${formatGbp(v.rangeLow)} – ${formatGbp(
        v.rangeHigh
      )}, confidence: ${v.confidence ?? "—"}).`,
      { color: INK, size: 9.5 }
    );
    for (const m of v.methods) {
      c.paragraph(`• ${m.label}: ${formatGbp(m.estimate)} — ${m.detail}`);
    }
    c.paragraph("Indicative estimate only. Not a formal valuation and should not be relied upon for lending, purchase or sale decisions.", {
      italic: true,
    });
  }

  // --- Mortgage & LTV ---
  c.sectionHeading("Mortgage & Loan-to-Value");
  c.row("Current mortgage balance", formatGbp(caseState.mortgage.currentBalance));
  c.row("Additional borrowing required", formatGbp(caseState.mortgage.additionalBorrowing));
  c.row("Total proposed borrowing", formatGbp(calc.ltv.totalProposedBorrowing));
  c.row("Current LTV", formatPercent(calc.ltv.currentLtvPercent));
  c.row("Proposed LTV", formatPercent(calc.ltv.proposedLtvPercent));
  c.row("Equity (current)", formatGbp(calc.ltv.equity));
  c.row("Equity (after proposed borrowing)", formatGbp(calc.ltv.equityAfterProposedBorrowing));
  c.gap(2);
  c.row("Interest rate", formatPercent(caseState.mortgage.interestRatePercent));
  c.row("Repayment type", caseState.mortgage.repaymentType === "repayment" ? "Repayment (capital & interest)" : "Interest-only");
  c.row("Term", `${caseState.mortgage.termYears} years`);
  c.row("Monthly payment", formatGbp(calc.monthlyMortgagePayment));
  if (calc.repayment) {
    c.row("Total interest over term", formatGbp(calc.repayment.totalInterest));
    c.row("Total repaid over term", formatGbp(calc.repayment.totalRepaid));
  }

  if (calc.rateComparison.length > 0) {
    c.gap(2);
    c.table(
      ["Rate scenario", "Rate", "Monthly payment"],
      calc.rateComparison.map((r) => [r.label, formatPercent(r.ratePercent), formatGbp(r.monthlyPayment)]),
      [0.5, 0.25, 0.25]
    );
  }

  // --- Borrowing power ---
  c.sectionHeading("Borrowing Power (illustrative)");
  c.row("Total household gross income", formatGbp(calc.totalIncome));
  c.row("Loan-to-income multiple", formatMultiple(calc.lti));
  if (calc.incomeMultiples.length > 0) {
    c.gap(1);
    c.table(
      ["Income multiple", "Max borrowing"],
      calc.incomeMultiples.map((m) => [formatMultiple(m.multiple), formatGbp(m.maxBorrowing)]),
      [0.5, 0.5]
    );
  }
  c.paragraph("Illustrative only — actual maximum borrowing depends on the individual lender's own affordability assessment and criteria.");

  // --- Applicants & Affordability ---
  c.sectionHeading("Applicants & Affordability");
  c.row("Applicant 1 age", applicantAgeLabel(calc.applicant1Age));
  c.row("Applicant 1 gross annual income", formatGbp(caseState.applicants.applicant1.grossIncome));
  if (caseState.applicants.applicant2) {
    c.row("Applicant 2 age", applicantAgeLabel(calc.applicant2Age));
    c.row("Applicant 2 gross annual income", formatGbp(caseState.applicants.applicant2.grossIncome));
  }
  c.row("Age at end of term", applicantAgeLabel(calc.ageAtEndOfTerm));

  c.gap(2);
  if (calc.affordability) {
    const a = calc.affordability;
    c.row("Net monthly income", formatGbp(a.netMonthlyIncome));
    c.row("ONS benchmark expenditure (monthly)", formatGbp(a.monthlyExpenditure));
    c.row("Council tax (monthly)", formatGbp(a.monthlyCouncilTax));
    c.row("Mortgage payment (monthly)", formatGbp(a.mortgagePayment));
    c.row("Credit commitments (monthly)", formatGbp(a.credit));
    c.row("Total monthly outgoings", formatGbp(a.totalOutgoings));
    c.row(
      "Remaining after outgoings",
      `${formatGbp(a.remainingAfterOutgoings)}${
        a.outgoingsPercentOfNetIncome != null ? ` (${formatPercent(a.outgoingsPercentOfNetIncome)} of net income)` : ""
      }`
    );
    c.paragraph(
      "Illustrative household cash-flow snapshot only — not a lender affordability assessment. Lenders apply their own stress rates, expenditure assumptions and policy rules."
    );
  } else {
    c.paragraph("Affordability snapshot not available (benchmark expenditure data still loading or unavailable when this PDF was generated).");
  }

  // --- Rental / BTL ---
  if (caseState.rental.monthlyRent > 0) {
    c.sectionHeading("Rental & Buy-to-Let");
    c.row("Monthly rent", formatGbp(caseState.rental.monthlyRent));
    c.row("Annual rent", formatGbp(calc.rentalYield.annualRent));
    c.row("Gross yield", formatPercent(calc.rentalYield.grossYieldPercent));
    c.row("Max loan supportable from rent", formatGbp(calc.maxLoanFromRent));
    if (calc.icrExamples.length > 0) {
      c.gap(1);
      c.table(
        ["ICR target", "Required rent", "Actual rent", "Coverage", "Passes?"],
        calc.icrExamples.map((e) => [
          formatPercent(e.icrPercent, 0),
          formatGbp(e.requiredMonthlyRent),
          e.actualMonthlyRent != null ? formatGbp(e.actualMonthlyRent) : "—",
          formatPercent(e.rentalCoveragePercent),
          e.passes == null ? "—" : e.passes ? "Yes" : "No",
        ]),
        [0.2, 0.25, 0.2, 0.2, 0.15]
      );
    }
  }

  // --- Footer disclaimer on every page ---
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(...MUTED);
    const footer = doc.splitTextToSize(
      "Lending Calculator provides calculations and indicative information only. It does not provide mortgage advice, lending decisions or property valuations. Always check figures with a qualified mortgage adviser and the lender's own criteria before making decisions.",
      CONTENT_WIDTH
    ) as string[];
    let fy = PAGE_HEIGHT - MARGIN_BOTTOM + 6;
    for (const line of footer) {
      doc.text(line, MARGIN_X, fy);
      fy += 3.6;
    }
    doc.text(`Page ${i} of ${pageCount}`, PAGE_WIDTH - MARGIN_X, PAGE_HEIGHT - 8, { align: "right" });
  }

  return doc;
}

/** Builds and triggers a browser download of the case summary PDF. Client-only (uses jsPDF's save()). */
export function downloadCaseSummaryPdf(caseState: CaseState, calc: Calc): void {
  const doc = generateCaseSummaryPdf(caseState, calc);
  const postcodePart = caseState.property.postcode ? `-${caseState.property.postcode.replace(/\s+/g, "")}` : "";
  const datePart = new Date().toISOString().slice(0, 10);
  doc.save(`Lending-Calculator-Case-Summary${postcodePart}-${datePart}.pdf`);
}
