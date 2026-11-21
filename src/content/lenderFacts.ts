// Headline second charge facts compiled from PUBLIC sources only: lender websites and trade press. No
// intermediary-only criteria, rate cards or internal documents are used. Every fact carries a source and a
// date so it can be re-checked. Wording is our own summary, not copied. Confirm current criteria with the
// lender before relying on any figure.

export const LENDER_FACTS_CHECKED = "21 November 2026";

export interface LenderFact {
  text: string;
  source: string;
  /** Where the fact comes from. */
  sourceType: "Lender website" | "Trade press";
  /** When the source was published or, for a lender web page, when we read it. */
  date: string;
}

export interface LenderProfile {
  slug: string;
  name: string;
  summary: string;
  facts: LenderFact[];
  /** Things we could not confirm from public sources. */
  notConfirmed: string[];
}

export const LENDER_PROFILES: LenderProfile[] = [
  {
    slug: "utb",
    name: "United Trust Bank (UTB)",
    summary: "Intermediary-only lender with published headline criteria and public criteria guides.",
    facts: [
      { text: "Loans from £10,000 to £1,000,000.", source: "https://www.utbank.co.uk/second-charge-mortgages/", sourceType: "Lender website", date: "Read 21 Nov 2026" },
      { text: "Lends up to 85% LTV, with income up to 6 times at that level, and a maximum age of 85.", source: "https://www.utbank.co.uk/second-charge-mortgages/", sourceType: "Lender website", date: "Read 21 Nov 2026" },
      { text: "No-early-repayment-charge options and unlimited overpayments (outside any ERC period).", source: "https://www.utbank.co.uk/second-charge-mortgages/", sourceType: "Lender website", date: "Read 21 Nov 2026" },
      { text: "Says it covers complex income including self-employed and contractors, and borrowers with imperfect credit.", source: "https://www.utbank.co.uk/second-charge-mortgages/", sourceType: "Lender website", date: "Read 21 Nov 2026" },
    ],
    notConfirmed: ["Rates (not published), and detailed income and credit thresholds beyond its published criteria guides."],
  },
  {
    slug: "together",
    name: "Together",
    summary: "Specialist lender working through intermediaries, with a short trading record requirement for the self-employed.",
    facts: [
      { text: "Loans from £30,000 to £750,000, up to 75% LTV, terms up to 30 years, with rates shown from 8.99%.", source: "https://togethermoney.com/intermediaries/regulated-second-charge-mortgage", sourceType: "Lender website", date: "Read 21 Nov 2026" },
      { text: "Lends in England, Wales and Scotland.", source: "https://togethermoney.com/intermediaries/regulated-second-charge-mortgage", sourceType: "Lender website", date: "Read 21 Nov 2026" },
      { text: "Self-employed borrowers need one year's trading record, and each tax calculation must cover two full business years; an accountant's certificate is asked for if trading for under two years.", source: "https://togethermoney.com/self-employed/self-employed-lending-explained", sourceType: "Lender website", date: "Read 21 Nov 2026" },
      { text: "For limited company directors it can look at salary, dividends or, sometimes, retained profits.", source: "https://togethermoney.com/self-employed/self-employed-lending-explained", sourceType: "Lender website", date: "Read 21 Nov 2026" },
      { text: "Says it can offer in the meantime if first-charge lender consent has not yet been given.", source: "https://togethermoney.com/intermediaries/regulated-second-charge-mortgage", sourceType: "Lender website", date: "Read 21 Nov 2026" },
    ],
    notConfirmed: ["How projections, Right to Buy or buy-to-let cases are treated: not stated on the public pages we read."],
  },
  {
    slug: "pepper-money",
    name: "Pepper Money",
    summary: "Second charge lender with a wide range of loan sizes. Check current availability with Pepper.",
    facts: [
      { text: "Broker page describes loans from £15,000 to £1,000,000 over 3 to 30 years.", source: "https://www.pepper.money/broker/second-charge-mortgages/second-charge-mortgage-criteria/", sourceType: "Lender website", date: "Found 21 Nov 2026" },
      { text: "Reported to have brought back a 100% LTV second charge option and an ERC-free option.", source: "https://www.mortgagesolutions.co.uk/specialist-lending/second-charge-lending/2025/05/08/pepper-money-brings-back-100-ltv-second-charge-and-adds-erc-free-option/", sourceType: "Trade press", date: "8 May 2025" },
      { text: "Lends in mainland Scotland and some islands, but not in Northern Ireland.", source: "https://www.pepper.money/faq/do-you-lend-second-charge-mortgage-products-in-scotland-or-northern-ireland/", sourceType: "Lender website", date: "Read 21 Nov 2026" },
    ],
    notConfirmed: [
      "Current maximum LTV for intermediary cases: sources give different figures, so check its current criteria.",
      "One Pepper page we saw says its second charge broker panel is currently closed; confirm whether it is taking new brokers.",
    ],
  },
  {
    slug: "selina",
    name: "Selina Finance",
    summary: "High-LTV second charge lender whose limits have changed several times.",
    facts: [
      { text: "Lends up to 85% LTV across its homeowner range.", source: "https://www.mortgagesolutions.co.uk/specialist-lending/2025/01/28/selina-finance-ups-ltv-to-85-across-homeowner-offering/", sourceType: "Trade press", date: "28 Jan 2025" },
      { text: "Reported minimum loan of £5,000 and a £300,000 maximum on products between 75% and 85% LTV, plus a five-year fixed product with no early repayment charges above 85% LTV.", source: "https://www.mortgagesolutions.co.uk/specialist-lending/second-charge-lending/2026/03/17/london-credit-boosts-refurb-range-selina-finance-overhauls-criteria-round-up/", sourceType: "Trade press", date: "17 Mar 2026" },
      { text: "Offers pre-consent funding on eligible loans, reported at up to £100,000.", source: "https://www.mortgagesolutions.co.uk/specialist-lending/2024/06/17/selina-finance-doubles-max-loan-size-and-add-pre-consent-funding/", sourceType: "Trade press", date: "17 Jun 2024" },
    ],
    notConfirmed: ["Its own current criteria document: we only found trade-press reports, so treat the figures as indicative."],
  },
  {
    slug: "interbridge",
    name: "Interbridge Mortgages",
    summary: "Newer second charge lender that works through specialist broker partners.",
    facts: [
      { text: "Entered the second charge market in May 2024, lending in England, Scotland and Wales through broker partners.", source: "https://www.mortgagesolutions.co.uk/specialist-lending/2024/05/16/interbridge-launches-into-second-charge-mortgages/", sourceType: "Trade press", date: "16 May 2024" },
    ],
    notConfirmed: ["Maximum LTV, loan size and self-employed rules: no public criteria found in the sources we checked."],
  },
  {
    slug: "step-one",
    name: "Step One Finance",
    summary: "Second charge lender with buy-to-let second charge lending.",
    facts: [
      { text: "Buy-to-let second charge reported at up to 85% LTV, with a reported move to 90% for automated valuations from January 2026.", source: "https://www.mortgagesolutions.co.uk/specialist-lending/second-charge-lending/2026/01/22/step-one-finance-improves-criteria-and-introduces-zero-ercs", sourceType: "Trade press", date: "22 Jan 2026" },
      { text: "Reported to offer decisions on second charge loans ahead of first-charge consent with most major first-charge lenders.", source: "https://mortgagesoup.co.uk/step-one-finance-improves-second-charge-ltvs/", sourceType: "Trade press", date: "Undated in our sources" },
    ],
    notConfirmed: ["Its own current criteria guide: sources disagree on the exact limits, so check before relying on them."],
  },
  {
    slug: "central-trust",
    name: "Central Trust",
    summary: "Lender with buy-to-let second charge and family-let products. Our sources are older.",
    facts: [
      { text: "Added a second charge buy-to-let plan (first and second charges) at up to 70% LTV in 2022.", source: "https://www.financialreporter.co.uk/specialist-lending/central-trust-launches-second-charge-btl-product.html", sourceType: "Trade press", date: "2022" },
      { text: "Has a Family Let product where the tenant is a close relative (defined as a parent, step-parent, sibling, step-sibling, child or step-child), reported at up to 80% LTV.", source: "https://propertyreporter.co.uk/finance/central-trust-expands-range-with-launch-of-new-family-let-and-let-to-buy-products.html", sourceType: "Trade press", date: "Older report" },
    ],
    notConfirmed: ["Current limits: the reports we found are from 2022 to 2023 and the lender has changed criteria since."],
  },
  {
    slug: "shawbrook",
    name: "Shawbrook",
    summary: "No longer offers second charge mortgages.",
    facts: [
      { text: "Its website states that it no longer offers second charge mortgages. Existing customers can still deal with it on settlements and subsequent charges.", source: "https://www.shawbrook.co.uk/property-finance/help/second-charge-mortgages/", sourceType: "Lender website", date: "Read 21 Nov 2026" },
    ],
    notConfirmed: [],
  },
];
