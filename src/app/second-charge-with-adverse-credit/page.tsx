import type { Metadata } from "next";
import { GuidePage, type GuideData } from "@/components/GuidePage";

export const metadata: Metadata = {
  title: "Second Charge Mortgage with Adverse Credit",
  description: "How second charge lenders can view missed payments, defaults and CCJs, what affects your options, what it can cost, and the risk of securing more debt on your home.",
  alternates: { canonical: "/second-charge-with-adverse-credit" },
};

const data: GuideData = {
  "slug": "second-charge-with-adverse-credit",
  "h1": "Second charge mortgage with adverse credit: how lenders generally look at it",
  "intro": "A poor credit history does not automatically rule out a second charge loan, but it can change which lenders are open to you and what the loan costs. Each lender sets its own criteria, so there is no single rule. This page explains in general terms how adverse credit tends to be viewed, what the regulator has found in this market, and why borrowing against your home carries real risk.",
  "sections": [
    {
      "heading": "What counts as adverse credit",
      "paragraphs": [
        "Adverse credit is a general term for past problems repaying borrowing. It usually means missed payments, defaults or county court judgments (CCJs). A default is recorded when a lender closes an account after missed payments, which usually follows several months of arrears. A CCJ is a court order to repay a debt.",
        "These entries stay on your credit file for a set time. Defaults and CCJs are generally shown for six years, counted from the date of the default or the judgment, and paying the debt does not normally remove them early. The three main credit reference agencies, Experian, Equifax and TransUnion, each hold their own file, and the details may differ between them."
      ]
    },
    {
      "heading": "How second charge lenders can approach it",
      "paragraphs": [
        "A second charge is a separate loan secured on your home behind your existing mortgage. Because it comes from a different lender, it is assessed on that lender's own rules. Lenders usually combine your credit report with their own records and a scoring system, so adverse entries are one input among several rather than a simple yes or no.",
        "Applicants should expect credit checks and a test of whether they can afford the repayments. The FCA has said lenders should not simply accept a borrower's declared figures when there is reason to doubt them."
      ]
    },
    {
      "heading": "What tends to affect your options",
      "bullets": [
        "Recency: more recent problems are generally treated as a bigger concern than older ones.",
        "Type: missed payments, defaults, CCJs and arrears on a secured loan are different kinds of event and may be viewed differently.",
        "Size: a small entry may be seen differently from a large one.",
        "Whether it is satisfied: a CCJ marked as satisfied can look better to lenders than an unpaid one, although it can still affect your ability to get credit.",
        "Affordability: the FCA found that many applicants already carry high levels of debt, so spending and existing commitments are examined closely."
      ],
      "paragraphs": [
        "Lenders differ on all of these, so the same history can lead to different outcomes with different lenders. If you are refused, you can ask which credit reference agency was used and whether its information was the reason."
      ]
    },
    {
      "heading": "Costs and higher rates",
      "paragraphs": [
        "Second charge loans usually carry higher interest rates than first charge mortgages. Where there is adverse credit, a lender may price the loan above its standard rates, and the final rate depends on your circumstances.",
        "Fees matter too. The FCA found that intermediary fees were materially higher than on first charge mortgages, typically more than 10% of the loan value, and hard to compare because firms do not routinely publish them. Fees are often added to the loan, which means you pay interest on them. Citizens Advice also notes that secured loans can come with legal, administration and valuation fees."
      ]
    },
    {
      "heading": "What the FCA found in the second charge market",
      "paragraphs": [
        "In March 2026 the FCA published a review of second charge mortgages. It said the market is small, typically less than 4% of regulated mortgage sales, and that borrowers are often heavily indebted with limited financial buffers. It found some expenditure checks relied on unrealistic assumptions, some advisers recommended debt consolidation without clear evidence it was appropriate or affordable, and alternatives such as negotiating with existing creditors were not always considered. It also noted that weak checks can lead to arrears and hardship, which can damage a credit file."
      ]
    },
    {
      "heading": "The risk to your home",
      "paragraphs": [
        "A second charge is secured on your property. Secured loans give the lender rights to repossess your home if you miss repayments. If the home is sold, the money goes to secured lenders in the order the loans were made, so the first mortgage is paid first.",
        "Which? describes these loans as highly risky because they add further debt to your home. Moving unsecured debts such as credit cards into a secured loan turns them into debt your home stands behind. Before taking one on, it is worth understanding every cost and what happens if your income falls."
      ]
    }
  ],
  "faqs": [
    {
      "q": "Can I get a second charge mortgage with a CCJ or default?",
      "a": "It depends on the lender and on details such as how recent the entry is, how large it is and whether it has been satisfied. Some lenders consider adverse credit and others do not, and nothing is guaranteed."
    },
    {
      "q": "How long do defaults and CCJs stay on my credit file?",
      "a": "Generally six years, counted from the date of the default or the judgment. Paying the debt does not normally remove the entry, though a satisfied CCJ can look better to lenders than an unpaid one."
    },
    {
      "q": "Will a second charge cost more if I have bad credit?",
      "a": "Second charge loans usually cost more than first mortgages, and a lender may price adverse credit above its standard rates. Fees can also be high and are often added to the loan."
    },
    {
      "q": "Can I lose my home if I cannot repay a second charge?",
      "a": "Yes. The loan is secured on your property, so the lender can seek repossession if you miss repayments. Sale proceeds go to secured lenders in the order the loans were given."
    },
    {
      "q": "Is a second charge a good way to clear debts?",
      "a": "That depends on your circumstances. The FCA found that alternatives such as negotiating with existing creditors were not always considered, and consolidating unsecured debt into a secured loan puts your home behind that debt."
    }
  ],
  "related": [
    "/second-charge-calculator",
    "/second-charge-vs-early-repayment-charge",
    "/second-charge-self-employed",
    "/ltv-calculator",
    "/loan-to-income-calculator"
  ],
  "sources": [
    {
      "title": "Second charge mortgages: improving outcomes for consumers",
      "url": "https://www.fca.org.uk/publications/good-and-poor-practice/second-charge-mortgages-improving-outcomes-consumers",
      "publisher": "FCA"
    },
    {
      "title": "Second charge mortgage firms told to raise standards for consumers",
      "url": "https://www.fca.org.uk/news/press-releases/second-charge-mortgage-firms-told-raise-standards-consumers",
      "publisher": "FCA"
    },
    {
      "title": "CCJs and your credit score",
      "url": "https://experian.co.uk/consumer/guides/ccjs.html",
      "publisher": "Experian"
    },
    {
      "title": "Dealing with defaults on your credit report",
      "url": "https://www.experian.co.uk/consumer/questions/credit-and-debt.html",
      "publisher": "Experian"
    },
    {
      "title": "Credit reference agencies",
      "url": "https://www.nationaldebtline.org/fact-sheet-library/credit-reference-agencies-ew/",
      "publisher": "National Debtline"
    },
    {
      "title": "How long does a CCJ last",
      "url": "https://www.stepchange.org/debt-info/ccj/how-long-does-a-ccj-last.aspx",
      "publisher": "StepChange"
    },
    {
      "title": "Second charge mortgages on the rise but is remortgaging a better option",
      "url": "https://www.which.co.uk/news/2019/03/second-charge-mortgages-on-the-rise-but-is-remortgaging-a-better-option",
      "publisher": "Which?"
    },
    {
      "title": "Mortgages and secured loans",
      "url": "https://www.citizensadvice.org.uk/debt-and-money/borrowing-money/types-of-borrowing/mortgages-and-secured-loans/",
      "publisher": "Citizens Advice"
    },
    {
      "title": "Adverse credit secured loans",
      "url": "https://togethermoney.com/loans/secured-homeowner-loans/adverse-credit",
      "publisher": "Together (lender public page)"
    }
  ]
};

export default function Page() {
  return <GuidePage data={data} />;
}
