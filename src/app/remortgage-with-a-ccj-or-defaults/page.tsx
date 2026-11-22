import type { Metadata } from "next";
import { GuidePage, type GuideData } from "@/components/GuidePage";

export const metadata: Metadata = {
  title: "Remortgage with a CCJ or Defaults: How It Works in the UK",
  description: "How CCJs and defaults can affect a remortgage: how long they last, why age, size and satisfied status matter, how specialist lenders differ, and where a second charge may fit.",
  alternates: { canonical: "/remortgage-with-a-ccj-or-defaults" },
};

const data: GuideData = {
  "slug": "remortgage-with-a-ccj-or-defaults",
  "h1": "Remortgaging with a CCJ or defaults on your credit file",
  "intro": "A county court judgment (CCJ) or a default on your credit file does not automatically stop you remortgaging, but it usually changes which lenders will consider you and on what terms. This page explains in general terms how these markers work, what tends to matter, and how to check and improve your file. It is information only, and every lender sets its own rules.",
  "sections": [
    {
      "heading": "What a CCJ and a default are",
      "paragraphs": [
        "A CCJ is a court judgment recorded when someone is ordered to repay a debt and has not done so. A default is different: it happens when a lender closes an account after payments have been missed, often following several months of arrears, though the timing varies by lender.",
        "Both are visible to lenders on your credit file. Lenders see them as a sign that repaying credit has been a struggle, and mortgages come with strict affordability checks, so approval can be harder."
      ]
    },
    {
      "heading": "How long they stay and what satisfied means",
      "paragraphs": [
        "Both a CCJ and a default generally stay on your credit file for six years, counted from the date of the judgment or the default, even if you repay the debt in the meantime. They should then drop off, and a default that has been removed cannot be re-registered by the lender.",
        "Settling the debt changes the marker to satisfied. That generally looks better to lenders than an outstanding one, but it does not shorten the six years. A CCJ paid in full within one calendar month of the judgment is not recorded on the public register, so it should not appear on your file at all. Defaults generally cannot be removed early unless they were recorded in error."
      ]
    },
    {
      "heading": "Age, size and status: what lenders weigh",
      "paragraphs": [
        "There is no single rule. Lenders tend to look at how old the marker is, how large it was, whether it is satisfied, and how many there are. Older, smaller, satisfied markers are generally easier to place than recent, larger or unpaid ones. The effect of a default also tends to lessen as it ages.",
        "A recent clean track record counts for a great deal. Time and conduct since the marker often matter more than any single step you can take."
      ]
    },
    {
      "heading": "Mainstream and specialist lenders",
      "paragraphs": [
        "High street lenders often have less room for adverse credit, so people with CCJs or defaults are commonly looked at by specialist lenders instead. Specialist lenders usually price higher than the high street, although one broker article notes the gap has narrowed in recent years.",
        "Where a case is seen as higher risk, a lender may ask for a bigger deposit or more equity. One broker guide gives a rough range of 15 to 25 per cent for higher-risk cases, depending on how severe and recent the problem is. Treat that as an illustration, not a promise. Many borrowers take a specialist deal, keep every payment on time, and later move to a mainstream rate when their file has improved."
      ]
    },
    {
      "heading": "Checking and improving your credit file",
      "bullets": [
        "Check your own credit report. Looking at your own file is a soft search, so lenders cannot see it and it does not harm your score.",
        "Look for errors, such as a wrong address, and ask the provider to correct them or raise a dispute through the credit reference agency.",
        "Register on the electoral roll at your current address.",
        "Pay on time every time, and keep use of available credit low.",
        "Avoid lots of applications in a short period, because each formal application leaves a mark that lenders can see."
      ]
    },
    {
      "heading": "Where a second charge may come in",
      "paragraphs": [
        "A second charge is a separate loan secured on your home alongside your existing mortgage. It lets homeowners borrow against their equity without changing the main mortgage, and typically carries a higher interest rate than a first mortgage. Because it is a different lender with its own criteria, it can sometimes be considered when changing the whole mortgage is not practical.",
        "The risks are real. Your home is at risk if you cannot keep up repayments on any loan secured on it, and missed payments can damage your credit file further. Using one to consolidate debts can mean turning unsecured borrowing into secured borrowing, stretching repayments out and paying more overall. The regulator expects firms to consider other options, which can include talking to your existing creditors. A regulated broker can explain what applies to your circumstances."
      ]
    }
  ],
  "faqs": [
    {
      "q": "Can I remortgage with a CCJ?",
      "a": "Often it is still possible, but your options may be narrower. Lenders look at how old the CCJ is, how large, and whether it is satisfied. Specialist lenders are the usual route, and no lender can be guaranteed to accept an application."
    },
    {
      "q": "How long does a CCJ or default stay on my credit file?",
      "a": "Generally six years from the date of the judgment or the default, even if you repay it. A CCJ paid in full within one calendar month of the judgment is not recorded on the register."
    },
    {
      "q": "Does paying off a CCJ or default remove it?",
      "a": "No. Settling it marks it as satisfied, which generally looks better to lenders, but it stays for the full six years. A default can usually only be removed early if it was recorded by mistake."
    },
    {
      "q": "Will I need a bigger deposit or more equity?",
      "a": "Sometimes. Where a lender sees a case as higher risk it may ask for more. One broker guide gives roughly 15 to 25 per cent for higher-risk cases, but this varies with how severe and recent the problem is."
    },
    {
      "q": "Will checking my own credit report harm my score?",
      "a": "No. Checking your own report is a soft search that lenders cannot see. Formal applications for credit are different, so avoid making several in a short time."
    },
    {
      "q": "Is a second charge a way round a CCJ?",
      "a": "It may be considered in some cases because it uses a different lender's criteria, but it is secured on your home, usually costs more than a first mortgage, and puts your home at further risk if you cannot keep up repayments."
    }
  ],
  "related": [
    "/second-charge-calculator",
    "/second-charge-vs-early-repayment-charge",
    "/ltv-calculator",
    "/mortgage-affordability-calculator",
    "/mortgage-repayment-calculator"
  ],
  "sources": [
    {
      "title": "CCJs and your credit report",
      "url": "https://www.experian.co.uk/consumer/guides/ccjs.html",
      "publisher": "Experian"
    },
    {
      "title": "Defaults and your credit report",
      "url": "https://www.experian.co.uk/consumer/guides/defaults.html",
      "publisher": "Experian"
    },
    {
      "title": "How to improve your credit score",
      "url": "https://www.experian.co.uk/consumer/guides/improve-credit-score.html",
      "publisher": "Experian"
    },
    {
      "title": "Second charge mortgages: improving outcomes for consumers",
      "url": "https://www.fca.org.uk/publications/good-and-poor-practice/second-charge-mortgages-improving-outcomes-consumers",
      "publisher": "Financial Conduct Authority"
    },
    {
      "title": "Getting a mortgage with adverse credit",
      "url": "https://www.drakemortgages.co.uk/knowledge-articles/getting-a-mortgage-with-adverse-credit/",
      "publisher": "Drake Mortgages (broker)"
    }
  ]
};

export default function Page() {
  return <GuidePage data={data} />;
}
