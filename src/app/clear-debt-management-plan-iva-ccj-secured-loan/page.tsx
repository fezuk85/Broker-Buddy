import type { Metadata } from "next";
import { GuidePage, type GuideData } from "@/components/GuidePage";

export const metadata: Metadata = {
  title: "Clearing a DMP, IVA or CCJ with a Secured Loan: What to Know",
  description: "Some homeowners use a second charge to clear a DMP, IVA or CCJ. See how each shows on a credit file, the free advice available and the risks to your home.",
  alternates: { canonical: "/clear-debt-management-plan-iva-ccj-secured-loan" },
};

const data: GuideData = {
  "slug": "clear-debt-management-plan-iva-ccj-secured-loan",
  "h1": "Can I clear a debt management plan, IVA or CCJ with a secured loan?",
  "intro": "Some homeowners look at borrowing secured on their home to clear a debt management plan (DMP), an individual voluntary arrangement (IVA) or a county court judgment (CCJ), hoping to move back towards mainstream lending sooner. This page explains in general terms what each of these is, how long it shows on a credit file, what free advice exists and what the financial regulator has said about turning unsecured debt into debt secured on your home. It is information only. Whether any lender will lend, and on what terms, depends on the lender and your circumstances.",
  "sections": [
    {
      "heading": "What are a DMP, an IVA and a CCJ?",
      "paragraphs": [
        "A debt management plan is a way of making affordable payments towards your debts. You usually make one monthly payment to a provider, often a debt charity or a debt management company, and the provider passes it on to your creditors. StepChange says it offers DMPs for free, while most debt management companies charge.",
        "An IVA is an agreement with your creditors to pay all or part of your debts. An insolvency practitioner sets it up. Once creditors holding 75% of the debt agree, it applies to all your creditors, including any who disagreed. Fees usually include a set-up fee and a handling fee on each payment.",
        "A CCJ is a court judgment recorded on a public register after a creditor has taken court action over a debt. Banks and loan companies use that register when they decide whether to lend."
      ]
    },
    {
      "heading": "How long do they stay on my credit file?",
      "paragraphs": [
        "A CCJ stays on the Register of Judgments, Orders and Fines for six years. If you pay in full within one month you can ask the court to have it removed. If you pay later, it is marked as satisfied but still stays for six years, according to gov.uk and Citizens Advice.",
        "Experian says a DMP is not listed as its own entry. Instead, creditors should add a DMP flag to your accounts, and the debts stay on your report for six years from the date they are paid off or defaulted. A DMP will usually lower your credit score, and a longer repayment can mean a longer effect.",
        "Experian says an IVA appears on your report for six years from the date it was approved. If you finish early, the record is not removed but is marked as complete."
      ]
    },
    {
      "heading": "Can I clear a DMP, IVA or CCJ with a second charge or further advance?",
      "paragraphs": [
        "Some people do use borrowing secured on their home for this. A second charge is a separate loan secured on your property alongside your existing mortgage. A further advance is extra borrowing from your current mortgage lender. Terms such as let to buy and consent to let relate to other situations and are not covered here.",
        "The details differ for each type of debt. Citizens Advice says an IVA is a formal arrangement approved by the court, so creditors must stick to it, and that any windfall received during it is usually paid to creditors. Gov.uk says missed payments can lead to an IVA being cancelled. Anyone thinking about settling an IVA or DMP early should first ask the provider or practitioner what that means for the agreement and the credit file.",
        "With a CCJ, paying it off lets you apply for a certificate of satisfaction, which StepChange says can make credit easier to get before the six years are up. Lenders still decide for themselves, and no lender is guaranteed to approve an application."
      ]
    },
    {
      "heading": "Should I get free debt advice first?",
      "paragraphs": [
        "Yes, it is worth doing before taking on any debt secured on your home. National Debtline describes its service as free, independent and confidential, and offers help by phone and webchat. StepChange and Citizens Advice also give free debt advice. Gov.uk points people to MoneyHelper for free debt advice before they commit to an IVA.",
        "An adviser can explain which debt solutions fit your situation, including ones that do not put your home at risk."
      ]
    },
    {
      "heading": "What does the FCA say about consolidating debt onto your home?",
      "paragraphs": [
        "The Financial Conduct Authority reviewed the second charge market and found that advisers sometimes recommended debt consolidation when it was not clear it was appropriate or affordable. It also said that where payment difficulties are known, firms must consider whether the customer should negotiate an arrangement with their creditors instead of taking out a second charge.",
        "The FCA warned that weaknesses could put borrowers, particularly those consolidating debt, at increased risk of financial harm. It also says second charge mortgages have higher interest rates than first charge mortgages."
      ]
    },
    {
      "heading": "What are the costs and risks?",
      "bullets": [
        "Your home is at risk: a second charge is borrowing against the equity in your home, so if you cannot keep up repayments you could face serious consequences, including possibly losing it.",
        "Higher total cost: the FCA found advisers focusing on lower monthly payments without making the increased total cost clear.",
        "Fees: the FCA flagged unclear fees, often added to the loan, which make comparison difficult. Adding fees to the loan means you pay interest on them.",
        "Unsecured debt becomes secured: debts that could not previously be claimed against your home would then be tied to it.",
        "Some debts are not simply swapped: Citizens Advice says you usually cannot include mortgages or secured loans in an IVA.",
        "Credit files recover slowly: Which? says your score rises as time passes after an IVA is settled, but it may not have fully recovered even after the six years, and a thin file can leave lenders little payment history to judge."
      ]
    }
  ],
  "faqs": [
    {
      "q": "Can I get rid of a CCJ by paying it off?",
      "a": "Only in one case. Gov.uk says that if you pay in full within one month you can ask the court to remove it. After that it is marked as satisfied and stays on the register for six years."
    },
    {
      "q": "How long does an IVA stay on my credit file?",
      "a": "Experian says six years from the date it was approved. Finishing early does not remove the record, but it is marked as complete."
    },
    {
      "q": "Does a debt management plan show on my credit report?",
      "a": "Experian says a DMP is not recorded as a separate entry. Creditors should add a DMP flag to the accounts included, and the debts stay for six years from the date they are paid off or defaulted."
    },
    {
      "q": "Where can I get free advice about debts?",
      "a": "National Debtline, StepChange and Citizens Advice all provide free debt advice. National Debtline says its service is free, independent and confidential."
    },
    {
      "q": "Is a second charge safer than leaving the debts unsecured?",
      "a": "It is not safer in the sense of risk to you. A second charge is secured on your home, so your home is at risk if you cannot keep up repayments. The FCA has said consolidation should not be recommended without clear evidence it is appropriate and affordable."
    },
    {
      "q": "Will paying off a DMP, IVA or CCJ mean a mainstream lender will accept me?",
      "a": "No. Each lender sets its own approach and none can be guaranteed. Which? says your score rises as time passes after settlement, but it may not be fully recovered after six years."
    }
  ],
  "related": [
    "/second-charge-calculator",
    "/second-charge-vs-further-advance",
    "/second-charge-vs-early-repayment-charge",
    "/mortgage-declined-what-next",
    "/borrow-against-your-house-without-remortgaging",
    "/loan-to-income-calculator",
    "/mortgage-affordability-calculator",
    "/ltv-calculator"
  ],
  "sources": [
    {
      "title": "Debt management plan",
      "url": "https://www.stepchange.org/debt-info/debt-management-plan.aspx",
      "publisher": "StepChange"
    },
    {
      "title": "Options for dealing with your debts: Individual Voluntary Arrangements",
      "url": "https://www.gov.uk/options-for-paying-off-your-debts/individual-voluntary-arrangements",
      "publisher": "GOV.UK"
    },
    {
      "title": "CCJs and your credit rating",
      "url": "https://gov.uk/county-court-judgments-ccj-for-debt/ccjs-and-your-credit-rating",
      "publisher": "GOV.UK"
    },
    {
      "title": "County court judgments and your credit rating",
      "url": "https://www.citizensadvice.org.uk/debt-and-money/borrowing-money/county-court-judgments-and-your-credit-rating/",
      "publisher": "Citizens Advice"
    },
    {
      "title": "What is an individual voluntary arrangement",
      "url": "https://www.citizensadvice.org.uk/debt-and-money/debt-solutions/individual-voluntary-arrangements/individual-voluntary-arrangements-explained/what-is-an-individual-voluntary-arrangement/",
      "publisher": "Citizens Advice"
    },
    {
      "title": "Debt management plans (DMPs) and your credit score",
      "url": "https://www.experian.co.uk/consumer/guides/debt-management-plan.html",
      "publisher": "Experian"
    },
    {
      "title": "Clearing your debt with an IVA",
      "url": "https://www.experian.co.uk/consumer/guides/individual-voluntary-arrangement.html",
      "publisher": "Experian"
    },
    {
      "title": "How long does a CCJ last",
      "url": "https://www.stepchange.org/debt-info/ccj/how-long-does-a-ccj-last.aspx",
      "publisher": "StepChange"
    },
    {
      "title": "National Debtline",
      "url": "https://nationaldebtline.org/",
      "publisher": "National Debtline"
    },
    {
      "title": "Second charge mortgages: improving outcomes for consumers",
      "url": "https://www.fca.org.uk/publications/good-and-poor-practice/second-charge-mortgages-improving-outcomes-consumers",
      "publisher": "Financial Conduct Authority"
    },
    {
      "title": "Second charge mortgage firms told to raise standards for consumers",
      "url": "https://www.fca.org.uk/news/press-releases/second-charge-mortgage-firms-told-raise-standards-consumers",
      "publisher": "Financial Conduct Authority"
    },
    {
      "title": "How to get a mortgage after an IVA",
      "url": "https://www.which.co.uk/money/mortgages-and-property/mortgages/getting-a-mortgage-with-poor-credit/how-to-get-a-mortgage-after-an-iva-aNJNW0Z2kx4q",
      "publisher": "Which?"
    }
  ]
};

export default function Page() {
  return <GuidePage data={data} />;
}
