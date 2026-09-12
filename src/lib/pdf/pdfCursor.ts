/**
 * Shared layout primitives for building client-presentable PDFs with jsPDF's vector text/line
 * drawing APIs directly (no html2canvas/screenshot step) — real, selectable text rather than a
 * rasterised image. Used by both the Mortgage Case Calculator's PDF summary and the Second &
 * Third Charge Calculator's PDF quotation, so page layout/typography stays consistent between them.
 */
import { jsPDF } from "jspdf";

export const PAGE_WIDTH = 210;
export const PAGE_HEIGHT = 297;
export const MARGIN_X = 18;
export const MARGIN_TOP = 20;
export const MARGIN_BOTTOM = 22;
export const CONTENT_WIDTH = PAGE_WIDTH - MARGIN_X * 2;

export const PRIMARY = [37, 99, 235] as const; // matches the site's --bb-primary blue
export const MUTED = [107, 114, 128] as const;
export const INK = [17, 24, 39] as const;

export class PdfCursor {
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

/** Renders `disclaimerText` plus a page number at the bottom of every page already in `doc`. */
export function renderFooterOnEveryPage(doc: jsPDF, disclaimerText: string) {
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(...MUTED);
    const footer = doc.splitTextToSize(disclaimerText, CONTENT_WIDTH) as string[];
    let fy = PAGE_HEIGHT - MARGIN_BOTTOM + 6;
    for (const line of footer) {
      doc.text(line, MARGIN_X, fy);
      fy += 3.6;
    }
    doc.text(`Page ${i} of ${pageCount}`, PAGE_WIDTH - MARGIN_X, PAGE_HEIGHT - 8, { align: "right" });
  }
}
