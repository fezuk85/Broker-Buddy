import type { Metadata } from "next";
import { GuidePage, type GuideData } from "@/components/GuidePage";

export const metadata: Metadata = {
  title: "Early Repayment Charge Options When You Need to Borrow",
  description: "What an early repayment charge is, how to find yours, how it is worked out, and the options if you need to borrow during a fixed or tracker deal.",
  alternates: { canonical: "/early-repayment-charge-options" },
};

const data: GuideData = {
  "slug": "early-repayment-charge-options",
  "h1": "Early repayment charges: your options if you need to borrow during a fixed or tracker deal",
  "intro": "An early repayment charge, or ERC, is a fee some lenders apply if you pay off part or all of your mortgage before the agreed deal ends. It matters most when you want to borrow more or remortgage during a fixed or tracker period. This page explains how ERCs generally work and the routes people look at. Lenders set their own terms, so your mortgage paperwork is what counts.",
  "sections": [
    {
      "heading": "What an early repayment charge is",
      "paragraphs": [
        "An ERC is a fee for repaying some or all of your mortgage before the agreed term ends. It usually applies to fixed and other deals with an initial period, but not to a lender's standard variable rate.",
        "It can be triggered in more than one way. Repaying the whole balance early, for example by remortgaging to another lender, can trigger it. So can overpaying by more than your lender allows in a year."
      ]
    },
    {
      "heading": "How to find out what yours is",
      "bullets": [
        "Read your mortgage documents. The terms say when a charge applies and how much it is.",
        "Check your online account with your lender, or call the mortgage team.",
        "Ask for a mortgage redemption statement. This shows the exact ERC and any other exit fees, and is typically valid for about four weeks."
      ]
    },
    {
      "heading": "How an ERC is worked out and the overpayment allowance",
      "paragraphs": [
        "Charges differ by lender and product. Guides describe a typical range of 1% to 5% of the amount you owe, depending on the lender, the balance and how long is left on the deal. The percentage often falls the later you repay, and a few lenders charge a flat amount or a minimum throughout.",
        "Most lenders let you overpay up to a set share of the balance each year without a charge, commonly 10%. Go above it and the charge usually applies to the extra amount you repay. Lenders differ, so check the exact allowance in your own terms, and whether it is measured on the balance at the start of the year or another date."
      ]
    },
    {
      "heading": "Options if you need to borrow during the deal",
      "paragraphs": [
        "There is no single right route. Which one fits depends on your deal, how much you need, and the costs involved. These are the usual options.",
        "Waiting. If the deal ends soon, borrowing or remortgaging after it ends avoids the charge altogether. Choosing a deal with no ERC is another route, although such deals are usually variable and can carry higher interest.",
        "Overpaying within the allowance. This only helps if you want to reduce the balance, not borrow more, but it avoids a charge as long as you stay inside the limit.",
        "Porting. If you are moving home, some mortgages can be taken to the new property with the same rate and terms. Not all can, and if you borrow less at the new property you may still pay an ERC on the part you do not port.",
        "Further advance. This is extra borrowing from your current lender, at that lender's own rate. Your main mortgage stays in place, so one comparison site notes it can avoid an ERC. You must pass fresh affordability checks and have enough equity.",
        "Second charge. This is a separate loan from a different lender, secured behind your first mortgage. It can come up when a lender will not offer a further advance or the ERC on a full remortgage is high. Second charge rates are generally higher than first mortgage rates. Regulated second charges on a home you live in have been covered by FCA mortgage rules since 21 March 2016, and you have a period of at least seven days to consider an offer. Check your first mortgage terms, and ask whether your first lender needs to be told.",
        "Remortgaging is the other main route. It replaces your whole mortgage, usually triggers the ERC, and reprices the whole balance at current rates. If you add the ERC to the new loan, you pay interest on it too.",
        "Every option here is secured on your home. Your home may be repossessed if you do not keep up repayments on a mortgage or any other debt secured on it."
      ]
    },
    {
      "heading": "What the Financial Ombudsman looks at",
      "paragraphs": [
        "If you think an ERC was applied unfairly, you must complain to the lender first. If you are unhappy with its final answer, you can take the complaint to the Financial Ombudsman Service. It covers most lending secured on residential property, and lists early repayment charges as a complaint topic.",
        "On ERC complaints it looks at whether the lender followed the FCA's mortgage rules, what your contract says about when the charge applies, whether the charge was clearly explained before you took the mortgage, how it was applied to your circumstances, and how the figure was calculated. It may ask the lender to show that calculation. Each case turns on its own facts, so a charge that was clearly disclosed and correctly applied is not automatically unfair."
      ]
    }
  ],
  "faqs": [
    {
      "q": "What is an early repayment charge?",
      "a": "It is a fee some lenders apply if you repay part or all of your mortgage before the agreed deal ends, for example by remortgaging or overpaying beyond the yearly allowance."
    },
    {
      "q": "How do I find out how much my early repayment charge is?",
      "a": "Check your mortgage documents or online account, or call your lender. A mortgage redemption statement shows the exact figure and is typically valid for about four weeks."
    },
    {
      "q": "Can I overpay without paying an early repayment charge?",
      "a": "Most lenders allow overpayments up to a set share of the balance each year, commonly 10%. The exact limit and how it is measured are in your own terms."
    },
    {
      "q": "Does a second charge trigger an early repayment charge on my first mortgage?",
      "a": "The sources we reviewed do not say. A second charge is a separate loan behind your first mortgage, so check your first mortgage terms and ask your lender or a broker. It is secured on your home, which may be repossessed if you do not keep up repayments."
    },
    {
      "q": "Can the Financial Ombudsman help with an early repayment charge?",
      "a": "It can look at complaints about them once you have complained to the lender and are unhappy with its final response. It considers how clearly the charge was explained, what the contract says, and how the charge was applied and calculated."
    }
  ],
  "related": [
    "/second-charge-calculator",
    "/second-charge-vs-early-repayment-charge",
    "/second-charge-self-employed",
    "/ltv-calculator",
    "/mortgage-repayment-calculator"
  ],
  "sources": [
    {
      "title": "Mortgages complaints",
      "url": "https://www.financial-ombudsman.org.uk/consumers/complaints-can-help/mortgages",
      "publisher": "Financial Ombudsman Service"
    },
    {
      "title": "Early repayment charges (mortgage complaints)",
      "url": "https://www.financial-ombudsman.org.uk/consumers/complaints-can-help/mortgages/early-repayment-charges",
      "publisher": "Financial Ombudsman Service"
    },
    {
      "title": "What's an early repayment charge?",
      "url": "https://www.principality.co.uk/home/mortgages/mortgage-guides/early-repayment-charges",
      "publisher": "Principality Building Society"
    },
    {
      "title": "Early Repayment Charges (ERC): How Much Do They Cost?",
      "url": "https://moneyfactscompare.co.uk/mortgages/guides/early-repayment-charges-explained/",
      "publisher": "Moneyfacts"
    },
    {
      "title": "What is an early repayment charge and how does it work?",
      "url": "https://www.comparethemarket.com/mortgages/content/early-repayment-charges-explained/",
      "publisher": "Compare the Market"
    },
    {
      "title": "Early repayment charges explained",
      "url": "https://www.martinco.com/guides/mortgages/early-repayment-charges-explained/",
      "publisher": "Martin & Co"
    },
    {
      "title": "Remortgage, further advance or second charge",
      "url": "https://www.movingcompared.co.uk/advice-and-guides/mortgages/remortgage-further-advance-second-charge-home-improvements",
      "publisher": "Moving Compared"
    },
    {
      "title": "What Is a Second Charge on a Property?",
      "url": "https://www.respectmortgages.co.uk/what-is-a-second-charge-on-a-property/",
      "publisher": "Respect Mortgages"
    }
  ]
};

export default function Page() {
  return <GuidePage data={data} />;
}
