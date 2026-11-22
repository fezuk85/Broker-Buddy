// Broker-facing "cases other lenders decline" library. Written in general terms on purpose: no lender is
// named and no lender's internal criteria are copied. Source facts come from the site owner's own experience as
// a mortgage broker; the owner confirmed them for publication on 22 Nov 2026. Keep it general: never name a lender
// or copy a lender's internal criteria or exclusive rates.

export interface BrokerCase {
  slug: string;
  title: string;
  h1: string;
  description: string;
  /** What brokers commonly assume. */
  assumption: string;
  /** What can still work. */
  whatCanWork: string[];
  /** Evidence to send with the case. */
  evidence: string[];
  /** What usually stops it. */
  whatStopsIt: string[];
  faqs: { question: string; answer: string }[];
  /** Optional public source links backing a general statement. */
  sources?: { label: string; url: string }[];
}

export const BROKER_CASES: BrokerCase[] = [
  {
    slug: "sole-trader-to-limited-company",
    title: "Second Charge for a Newly Limited Company That Was a Sole Trader",
    h1: "Client has just gone from sole trader to limited company? Some second charge lenders still look at the trade, not the company",
    description:
      "A sole trader who has recently incorporated is often told they need 12 months as a limited company. Some second charge lenders will proceed where it is a continuation of the same business and an accountant confirms it.",
    assumption:
      "Many brokers assume a company that has traded for only a few weeks or months cannot be assessed, because some lenders ask for a full 12 months' trading as the new entity.",
    whatCanWork: [
      "Some lenders will consider the case as a continuation of the existing business where the company has taken over the same trade as the sole trader.",
      "The company does not need to show a full year of its own accounts in that situation, provided the evidence below supports the continuation.",
      "Lenders that take this view usually want the accountant to confirm the continuation and to provide a projection for the following year.",
    ],
    evidence: [
      "A letter from the accountant confirming the company is a continuation of the existing sole trader business.",
      "The accountant's projection of the company's income for the following year.",
      "Previous SA302s and tax year overviews covering the sole trader years.",
      "The date the company was incorporated and the date trading moved across.",
      "Business and personal bank statements, and any early company accounts.",
    ],
    whatStopsIt: [
      "The company is carrying out a different trade, or the trade has changed materially.",
      "A projection that is not supported by the trading history.",
      "Credit history outside the lender's criteria.",
      "The first-charge lender's consent to a second charge is not available.",
    ],
    faqs: [
      {
        question: "Does a newly limited company always need 12 months of accounts?",
        answer:
          "Not with every lender. Some lenders ask for 12 months as the new entity, while others will treat a clear continuation of the same trade differently. It depends on the lender, so check before you submit.",
      },
      {
        question: "What does the accountant need to say?",
        answer:
          "That the company is a continuation of the existing business, and a projection of income for the next year. The exact wording a lender needs varies.",
      },
    ],
  },
  {
    slug: "gross-rental-income-low-sa302",
    title: "Second Charge for a Landlord With Little Taxable Income on the SA302",
    h1: "Tax-efficient SA302 showing little income from property? Some lenders can use gross rental income",
    description:
      "A self-employed landlord whose SA302 shows limited income from land and property may still be assessed on the gross rent from their tenancy agreements with some second charge lenders, with the mortgage still counted in affordability.",
    assumption:
      "Many brokers assume that low net property income on the SA302 means the case will not pass affordability.",
    whatCanWork: [
      "Where the SA302 shows limited income from land and property, some lenders will allow the gross rental income to be used instead.",
      "The gross rent is typically evidenced by an assured shorthold tenancy agreement (AST).",
      "The existing mortgage on the property still has to be included in the affordability calculation.",
      "Used this way, it can open up cases that look weak on a net-profit basis.",
    ],
    evidence: [
      "The current AST for each rented property.",
      "The SA302 and tax year overview showing the land and property income.",
      "Mortgage statements for the properties concerned.",
      "Proof of the client's other income, where relevant.",
    ],
    whatStopsIt: [
      "No signed tenancy agreement, or rent that is not evidenced.",
      "Mortgage payments that are too high against the gross rent.",
      "Property types or tenancy structures the lender does not accept.",
      "The lender treating the borrower's income differently from how the case was packaged.",
    ],
    faqs: [
      {
        question: "Does using gross rent mean the mortgage is ignored?",
        answer:
          "No. Where gross rental income is used, the mortgage on the property still goes into the affordability calculation.",
      },
      {
        question: "Do all second charge lenders do this?",
        answer:
          "No. It is a lender-specific approach, so confirm the lender and the evidence it wants before you submit.",
      },
    ],
  },
  {
    slug: "right-to-buy-pre-emption-period",
    title: "Second Charge on a Right to Buy Property Within the Pre-Emption Period",
    h1: "Right to Buy property still inside the pre-emption period? Some lenders will lend without penalising it",
    description:
      "Many lenders are cautious about Right to Buy properties in the early years. Some second charge lenders will lend within the pre-emption period and do not penalise the Right to Buy status.",
    assumption:
      "Many brokers assume a Right to Buy property is off limits while the pre-emption period is still running, or that the original discount will cut the available equity.",
    whatCanWork: [
      "Some lenders will lend within the pre-emption period and do not penalise the Right to Buy status.",
      "Appetite differs a lot: trade press reports lenders that take the Right to Buy discount into account when assessing equity, and others that look past it or ignore it after a set time.",
    ],
    evidence: [
      "Details of the Right to Buy purchase, including the date and the discount.",
      "The terms of any pre-emption and discount repayment obligations.",
      "The first-charge lender's consent to a second charge.",
      "Valuation and the usual income evidence.",
    ],
    whatStopsIt: [
      "Lenders that count the Right to Buy discount against the equity or exclude these properties.",
      "No consent from the first-charge lender.",
      "Anything in the transfer terms that restricts further charges.",
    ],
    faqs: [
      {
        question: "What is the pre-emption period?",
        answer:
          "It is a period after a Right to Buy sale during which the former landlord has a right to buy the property back before it is sold on the open market. Check the transfer terms for the exact period and conditions.",
      },
    ],
    sources: [
      { label: "Trade press: why second charges are helping Right to Buy borrowers", url: "https://mortgagesoup.co.uk/why-second-charges-are-helping-right-to-buy-borrowers-do-more-with-their-home/" },
      { label: "Trade press: a lender adds Right to Buy second charge deals", url: "https://www.mortgagesolutions.co.uk/mortgage-news/2024/07/17/west-one-loans-adds-right-to-buy-and-shared-ownership-deals-and-ups-second-charge-loan-limit/" },
    ],
  },
];

export function getBrokerCase(slug: string): BrokerCase | undefined {
  return BROKER_CASES.find((c) => c.slug === slug);
}
