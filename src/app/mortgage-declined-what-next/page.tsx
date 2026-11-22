import type { Metadata } from "next";
import { GuidePage, type GuideData } from "@/components/GuidePage";

export const metadata: Metadata = {
  title: "Mortgage Declined? Reasons and What to Do Next",
  description: "A mortgage or remortgage turned down is not always the end. See common reasons for a decline, what to check, what to avoid and the options that may be open.",
  alternates: { canonical: "/mortgage-declined-what-next" },
};

const data: GuideData = {
  "slug": "mortgage-declined-what-next",
  "h1": "Mortgage or remortgage declined: what happens next",
  "intro": "Having a mortgage or remortgage application turned down is stressful, but the reason matters more than the result. Lenders decline for different reasons and use different rules, so a decline from one lender does not always mean the same answer elsewhere. This page explains the common causes, the usual first steps and the mistakes that can make things harder. It is general information about how things tend to work, and no lender is guaranteed to approve any application.",
  "sections": [
    {
      "heading": "Common reasons an application is declined",
      "paragraphs": [
        "Most declines come down to either the applicant or the property, and lenders often give only a short, general reason such as affordability.",
        "Lenders also differ in what they will accept, so one may refuse an application that another would approve."
      ],
      "bullets": [
        "Credit file: recent missed payments, defaults or county court judgments, and a large number of credit applications in a short period can all count against you. Defaults and judgments are generally considered over the last six years.",
        "Affordability: lenders test whether you could still manage repayments if interest rates rose, and they look at income, living costs, dependants and existing debts. Even small commitments, such as buy-now-pay-later balances, can reduce what a lender will offer.",
        "Income evidence: income that is new, variable or hard to prove may be discounted or averaged. Self-employed income is often looked at over two or three years, so limited trading history can restrict choice.",
        "Valuation: if the lender values the property below the agreed price, the loan as a share of the value goes up, and the lender may reduce what it will lend.",
        "Property type: short leases, non-standard construction or structural concerns can lead to a decline, and some lenders are more flexible than others.",
        "Application errors: mistakes on the form, or an address that does not match your credit report, can cause problems.",
        "Lender policy: sometimes you simply fall outside what a particular lender aims to lend on."
      ]
    },
    {
      "heading": "First steps after a decline",
      "paragraphs": [
        "Start by asking the lender or your broker why. The lender may not give much detail, but it is worth asking, and an agreement in principle decline can have different causes from a decline at full application.",
        "Next, look at your credit information. The main UK credit reference agencies are Equifax, Experian and TransUnion. Lenders choose which one they use, and each may hold slightly different information, so checking all three gives the fullest picture. You can ask each agency for a free statutory report online, in writing or by phone, and you should not need a paid subscription to get it. The agency has a month to reply, and in some cases it can take longer if it tells you why.",
        "If something is wrong, tell the agency that provided the report. The lender that supplied the data can usually correct its own entry, so you may need to contact them as well. You can also ask for a note of correction to be added to explain your side of an entry. If an obvious error is not fixed, you can complain to the Information Commissioner's Office, although it does not decide financial disputes."
      ]
    },
    {
      "heading": "Why repeated applications can backfire",
      "paragraphs": [
        "A decline in itself does not usually harm your score, because your report shows that you applied rather than the outcome. However, each full application normally leaves a hard search on your file. Several close together can lower your score and reduce your chances with the next lender.",
        "For that reason, applying to lender after lender without understanding the cause is risky. Spacing applications out is often sensible unless the problem was specific to one lender or one property. Experian says it is also worth making sure your details match your credit report before you apply again."
      ]
    },
    {
      "heading": "Other routes people explore",
      "paragraphs": [
        "Which route fits depends on the reason for the decline. These are the options that are generally discussed, not recommendations.",
        "A mortgage broker can look at your finances and credit information and look for lenders whose criteria may suit your situation. Brokers may charge fees and some do not cover the whole market, so ask how a broker is paid and which lenders they can use.",
        "Waiting and improving the position is another route. Paying bills on time, reducing short-term debts, avoiding new credit, keeping bank account conduct tidy and building a bigger deposit can all help over time. If affordability is the issue, borrowing less or over a longer term changes the numbers, though a longer term usually means more interest overall. If the valuation came in low, some people negotiate the price, add to the deposit or look at another lender.",
        "A second charge is a separate loan from a different lender that lets homeowners borrow against the equity in their home without changing their existing mortgage. The Financial Conduct Authority says these loans generally carry higher interest rates than first charge mortgages. Fees can also be added to the loan, which makes them hard to compare. It is secured on your home, so your home is at risk if you cannot keep up repayments, and it will still be assessed on affordability. The FCA has also said that anyone already struggling with debt should consider whether negotiating with creditors is a better first step."
      ]
    },
    {
      "heading": "What not to do",
      "bullets": [
        "Do not apply to several lenders at once in the hope that one says yes.",
        "Do not guess or round figures on an application. Errors are a known cause of declines.",
        "Do not take on new credit while you work out what went wrong.",
        "Do not pay for a credit report through a subscription you do not need when a free statutory report is available.",
        "Do not borrow more than you need, or treat secured borrowing as a quick fix for debts, without looking at the full cost and the effect on your home."
      ]
    }
  ],
  "faqs": [
    {
      "q": "Does a declined mortgage show on my credit file?",
      "a": "Experian says being refused does not in itself hurt your score, because your report shows that you applied, not the outcome. The application does leave a hard search, and several in a short time can lower your score."
    },
    {
      "q": "Should I apply to another lender straight away?",
      "a": "Usually it is better to find out why you were declined first. Each application adds a hard search, and if the cause is something that applies to every lender, a second decline is likely. If the problem was specific to one lender or one property, a different lender may be reasonable."
    },
    {
      "q": "Do I need to check all three credit reference agencies?",
      "a": "Lenders choose which agency they use and each can hold different information, so checking Equifax, Experian and TransUnion gives the fullest picture. You can ask each for a free statutory report."
    },
    {
      "q": "Can I challenge a decline?",
      "a": "Sometimes. An appeal is more likely to work if the decision rested on a factual error, wrong credit data or new evidence. It is less likely to succeed if the lender simply applied its policy."
    },
    {
      "q": "Is a second charge a way round a mortgage decline?",
      "a": "It is a separate loan from a different lender with its own criteria, so it can be considered in some cases. It still involves affordability checks, usually costs more than a first mortgage and is secured on your home, which is at risk if repayments are missed. It is worth getting regulated advice before deciding."
    }
  ],
  "related": [
    "/second-charge-calculator",
    "/second-charge-vs-early-repayment-charge",
    "/second-charge-self-employed",
    "/ltv-calculator",
    "/mortgage-affordability-calculator",
    "/loan-to-income-calculator"
  ],
  "sources": [
    {
      "title": "Top reasons for being declined a mortgage",
      "url": "https://www.moneysupermarket.com/mortgages/guides/top-reasons-for-being-declined-a-mortgage/",
      "publisher": "MoneySuperMarket"
    },
    {
      "title": "What to do if you are declined a mortgage",
      "url": "https://www.experian.co.uk/consumer/mortgages/guides/refused-mortgage.html",
      "publisher": "Experian UK"
    },
    {
      "title": "Credit reports (for the public)",
      "url": "https://ico.org.uk/for-the-public/credit/",
      "publisher": "Information Commissioner's Office"
    },
    {
      "title": "Second charge mortgage firms told to raise standards for consumers",
      "url": "https://www.fca.org.uk/news/press-releases/second-charge-mortgage-firms-told-raise-standards-consumers",
      "publisher": "Financial Conduct Authority"
    },
    {
      "title": "Second charge mortgages: improving outcomes for consumers",
      "url": "https://www.fca.org.uk/publications/good-and-poor-practice/second-charge-mortgages-improving-outcomes-consumers",
      "publisher": "Financial Conduct Authority"
    }
  ]
};

export default function Page() {
  return <GuidePage data={data} />;
}
