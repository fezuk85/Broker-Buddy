/**
 * "Lending Calculator Indicative Property Estimate" — a layered, rule-based combination of up to
 * three signals. This is explicitly NOT a formal valuation or lender AVM (see disclaimers).
 *
 * It never invents a number: if there isn't enough evidence for a given method, that method
 * is simply omitted, and if no methods produce a result the engine reports "insufficient data"
 * rather than guessing.
 */

export interface ComparableSaleInput {
  pricePaid: number;
  saleDate: string; // ISO date
  floorAreaSqm?: number;
  propertyType?: string;
  distanceMiles?: number;
}

export interface ValuationInputs {
  lastKnownSale?: { price: number; date: string } | null;
  /** Cumulative % price movement for the area/property type since the last known sale date. */
  indexMovementPercent?: number | null;
  comparableSales?: ComparableSaleInput[];
  subjectFloorAreaSqm?: number | null;
  subjectPropertyType?: string | null;
  /** ISO date treated as "now" for recency filtering. Defaults to the real current date — only
   * exposed so tests can use a fixed date instead of the real clock. */
  asOfDate?: string;
}

export type ValuationConfidence = "LOW" | "MEDIUM" | "HIGH";

export interface MethodEstimate {
  method: "historic-sale-indexation" | "comparable-sales" | "floor-area-comparison";
  label: string;
  estimate: number;
  detail: string;
}

export interface ValuationResult {
  methods: MethodEstimate[];
  combinedEstimate: number | null;
  rangeLow: number | null;
  rangeHigh: number | null;
  confidence: ValuationConfidence | null;
  insufficientData: boolean;
  notes: string[];
}

function median(values: number[]): number | null {
  if (values.length === 0) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

export function calculateIndicativeValuation(inputs: ValuationInputs): ValuationResult {
  const methods: MethodEstimate[] = [];
  const notes: string[] = [];

  // Method 1: historic sale x index movement
  if (inputs.lastKnownSale && inputs.indexMovementPercent != null) {
    const estimate = inputs.lastKnownSale.price * (1 + inputs.indexMovementPercent / 100);
    if (estimate > 0) {
      methods.push({
        method: "historic-sale-indexation",
        label: "Indexed estimate",
        estimate,
        detail: `Last sale £${inputs.lastKnownSale.price.toLocaleString(
          "en-GB"
        )} (${inputs.lastKnownSale.date}) indexed by ${inputs.indexMovementPercent.toFixed(1)}%`,
      });
    }
  }

  const comparables = (inputs.comparableSales ?? []).filter((c) => c.pricePaid > 0);

  /**
   * Sale prices from years ago are nominal, not adjusted for house-price growth since — blending
   * them unfiltered into a median badly understates current value in a market with any real
   * appreciation (e.g. 30 years of sales for one street dragging a ~£370k current value down to a
   * £190k median). Prefer sales within the last 24 months; only fall back to the full unfiltered
   * history (with an honest note) when there aren't enough recent sales to form a median.
   */
  const RECENCY_WINDOW_MONTHS = 24;
  const asOf = inputs.asOfDate ? new Date(inputs.asOfDate) : new Date();
  const cutoff = new Date(asOf);
  cutoff.setMonth(cutoff.getMonth() - RECENCY_WINDOW_MONTHS);
  const cutoffIso = cutoff.toISOString().slice(0, 10);

  const recentComparables = comparables.filter((c) => c.saleDate >= cutoffIso);
  const usedRecentOnly = recentComparables.length >= 3;
  const comparablesForMedian = usedRecentOnly ? recentComparables : comparables;

  // Method 2: median of recent comparable sale prices
  if (comparablesForMedian.length >= 3) {
    const med = median(comparablesForMedian.map((c) => c.pricePaid));
    if (med != null) {
      methods.push({
        method: "comparable-sales",
        label: "Comparable-sales estimate",
        estimate: med,
        detail: usedRecentOnly
          ? `Median of ${comparablesForMedian.length} comparable sale(s) in the last ${RECENCY_WINDOW_MONTHS} months`
          : `Median of ${comparablesForMedian.length} comparable sale(s) — fewer than 3 in the last ${RECENCY_WINDOW_MONTHS} months, so older sales are included and this estimate may lag the current market`,
      });
    }
  } else if (comparablesForMedian.length > 0) {
    notes.push(
      `Only ${comparablesForMedian.length} comparable sale(s) found — too few for a comparable-sales estimate (minimum 3).`
    );
  }

  // Method 3: subject floor area x comparable median £/m²
  const comparablesWithArea = comparablesForMedian.filter((c) => c.floorAreaSqm && c.floorAreaSqm > 0);
  if (inputs.subjectFloorAreaSqm && inputs.subjectFloorAreaSqm > 0 && comparablesWithArea.length >= 3) {
    const pricePerSqm = comparablesWithArea.map((c) => c.pricePaid / c.floorAreaSqm!);
    const medianPricePerSqm = median(pricePerSqm);
    if (medianPricePerSqm != null) {
      methods.push({
        method: "floor-area-comparison",
        label: "Floor-area estimate",
        estimate: medianPricePerSqm * inputs.subjectFloorAreaSqm,
        detail: `${inputs.subjectFloorAreaSqm}m² x median £${Math.round(medianPricePerSqm).toLocaleString("en-GB")}/m²`,
      });
    }
  }

  if (methods.length === 0) {
    return {
      methods: [],
      combinedEstimate: null,
      rangeLow: null,
      rangeHigh: null,
      confidence: null,
      insufficientData: true,
      notes: [...notes, "Insufficient data for a reliable indicative estimate."],
    };
  }

  /**
   * historic-sale-indexation is anchored to the subject property's own real, recent transaction —
   * just carried forward by real market movement since — which is categorically stronger evidence
   * than comparable-sales or floor-area-comparison, both based on *other* properties nearby.
   * Blending it with those (even weighted) could still pull the combined figure below a price the
   * property itself achieved months earlier, which misrepresents what we actually know. So when
   * the indexed estimate is available, it *is* the combined estimate; comparable-sales/floor-area
   * are still shown as separate method rows for context, but don't drag the headline figure down.
   * Without an indexed estimate (no address entered, or no matching sale), there's no single
   * property to anchor to, so the combined estimate falls back to an average across whatever
   * comparable-based methods are available — that's the best a postcode-wide estimate can do.
   */
  const indexedMethod = methods.find((m) => m.method === "historic-sale-indexation");
  const estimates = methods.map((m) => m.estimate);
  const combinedEstimate = indexedMethod
    ? indexedMethod.estimate
    : estimates.reduce((sum, v) => sum + v, 0) / estimates.length;

  // Spread between methods (relative to the combined estimate) drives the indicative range.
  const maxEstimate = Math.max(...estimates);
  const minEstimate = Math.min(...estimates);
  const relativeSpread = combinedEstimate > 0 ? (maxEstimate - minEstimate) / combinedEstimate : 0;
  const rangeWidth = Math.max(0.03, Math.min(0.15, relativeSpread / 2 + 0.03));

  const confidence = scoreConfidence({
    methodCount: methods.length,
    comparableCount: comparablesForMedian.length,
    hasFloorArea: !!inputs.subjectFloorAreaSqm,
    relativeSpread,
  });

  return {
    methods,
    combinedEstimate,
    rangeLow: combinedEstimate * (1 - rangeWidth),
    rangeHigh: combinedEstimate * (1 + rangeWidth),
    confidence,
    insufficientData: false,
    notes,
  };
}

function scoreConfidence(args: {
  methodCount: number;
  comparableCount: number;
  hasFloorArea: boolean;
  relativeSpread: number;
}): ValuationConfidence {
  let score = 0;
  if (args.methodCount >= 3) score += 2;
  else if (args.methodCount === 2) score += 1;

  if (args.comparableCount >= 8) score += 2;
  else if (args.comparableCount >= 3) score += 1;

  if (args.hasFloorArea) score += 1;
  if (args.relativeSpread < 0.05) score += 1;
  else if (args.relativeSpread > 0.2) score -= 1;

  if (score >= 4) return "HIGH";
  if (score >= 2) return "MEDIUM";
  return "LOW";
}
