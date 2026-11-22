import type { Metadata } from "next";
import { GuidePage, type GuideData } from "@/components/GuidePage";

export const metadata: Metadata = {
  title: "Let to Buy Mortgage Explained: How It Works in the UK",
  description: "What a let to buy mortgage is, how consent to let differs from buy-to-let, how lenders view rent, the main costs including stamp duty, and the risks to weigh up.",
  alternates: { canonical: "/let-to-buy-mortgage-explained" },
};

const data: GuideData = {
  "slug": "let-to-buy-mortgage-explained",
  "h1": "Let to buy mortgage explained: keeping your old home and renting it out",
  "intro": "Let to buy is what people call moving into a new home while renting out the one they leave. It usually means two mortgages at once, which is a bigger commitment than a normal move. This page explains in general terms how the arrangement works, how lenders tend to look at it, what it costs and where the risks sit. Lenders differ and none can promise to approve an application. Both mortgages are secured on property, so a home can be repossessed if repayments are not kept up.",
  "sections": [
    {
      "heading": "What is a let to buy mortgage?",
      "paragraphs": [
        "Let to buy means renting out your existing home and buying a new one to live in. Despite the name, it is not one single product. It is normally a buy-to-let mortgage on the old property, plus a residential mortgage on the new one, so you carry two loans at the same time.",
        "Some lenders will arrange both loans themselves. In other cases the two mortgages come from different lenders, which can make the timing of both purchases more complicated."
      ]
    },
    {
      "heading": "Can I keep my old house and rent it out when I move?",
      "paragraphs": [
        "Often yes, but you cannot simply start letting. Renting out a home that has a residential mortgage usually breaks the terms of that mortgage, so you need your lender's permission first. Letting without it can lead to penalties, a higher rate or a demand to repay in full.",
        "There are two usual routes. The first is consent to let, a temporary permission from your current lender. It is often limited in length, may carry an admin fee or a higher interest rate while you let, and lenders can refuse it. The second is switching the old home to a buy-to-let mortgage, either with your current lender or a new one, which suits longer-term letting."
      ]
    },
    {
      "heading": "How do lenders look at rent and affordability?",
      "paragraphs": [
        "For the buy-to-let part, lenders usually focus on the rent the property could earn rather than only your salary. They commonly test whether the rent comfortably exceeds the mortgage interest, often using a measure called the interest coverage ratio. Some also look at your own income, and they want to see that the loan could still be paid when the property is empty.",
        "The size of the loan is also limited by how much equity you have in the old home, because lenders usually want a cushion between the loan and the property's value. For the new residential mortgage, your own income and spending are assessed in the normal way, and the lender will take your other borrowing into account."
      ]
    },
    {
      "heading": "Who might let to buy suit?",
      "paragraphs": [
        "People tend to consider it when they want to keep the old home as a long-term investment and use its equity to move. Others use it when they need to move quickly and cannot wait for a sale, or when the property has been hard to sell. Some people plan to be away for a few years and return.",
        "It is not for everyone. Being a landlord brings legal duties, tax and day-to-day management, and rental profit is not guaranteed."
      ]
    },
    {
      "heading": "What does a let to buy cost?",
      "paragraphs": [
        "Buy-to-let arrangement fees are often higher than on residential deals and are sometimes charged as a percentage of the loan. Valuation and legal fees can add to the bill. If you leave a fixed or discounted deal early, an early repayment charge, usually a percentage of what you still owe, may apply, so check for exit fees too.",
        "Stamp duty is a major cost. In England, higher rates generally apply if you still own your old home when you complete on the new one, because the new purchase will not be your only residential property. If you sell the previous main home within three years, you may be able to claim back the higher-rate part. Wales and Scotland have their own property taxes and rates, so check the rules where the new home is. Letting costs such as agent fees, insurance, maintenance and tax on rental profit come on top."
      ]
    },
    {
      "heading": "What are the risks, and is the mortgage regulated?",
      "paragraphs": [
        "Empty months between tenants mean you may still have to pay both mortgages without rent coming in. Variable rates can rise, and a fixed rate ends at some point, so payments can go up. Many buy-to-let mortgages are interest-only, which means the full amount is still owed at the end and you need a plan to repay it. If property values fall, a sale may not clear the loan.",
        "Most buy-to-let mortgages are not regulated by the Financial Conduct Authority, so some borrower protections that apply to residential mortgages may not apply. A narrower category called consumer buy-to-let is regulated. It is aimed at so-called accidental landlords, such as someone letting out a former home who has no other rental properties. Which category applies depends on your circumstances and the lender. In every case the loans are secured on property, so your home may be at risk if you miss repayments."
      ]
    }
  ],
  "faqs": [
    {
      "q": "What is a let to buy mortgage?",
      "a": "It describes renting out your current home while buying a new one to live in. In practice it is usually a buy-to-let mortgage on the old property and a residential mortgage on the new one."
    },
    {
      "q": "Do I need consent to let or a buy-to-let mortgage?",
      "a": "You need your lender's permission to let a home that has a residential mortgage. Consent to let is a temporary option that lenders can refuse. For longer-term letting the old property generally needs a buy-to-let mortgage."
    },
    {
      "q": "How do lenders work out how much I can borrow on the rented home?",
      "a": "They usually look at the expected rent compared with the mortgage interest, and at how much equity you hold. Some also consider your income. Methods vary between lenders."
    },
    {
      "q": "Do I pay higher stamp duty if I keep my old house?",
      "a": "In England, higher rates generally apply if you still own your old home when you buy the new one. You may be able to claim part back if you sell the previous main home within three years. Wales and Scotland have their own taxes."
    },
    {
      "q": "Are let to buy mortgages regulated?",
      "a": "Most buy-to-let mortgages are not regulated by the FCA. Consumer buy-to-let, for accidental landlords letting a former home, is regulated. Which one applies depends on your situation."
    },
    {
      "q": "What happens if my old home sits empty or interest rates rise?",
      "a": "You would still owe both mortgages. Rent may stop during empty periods and payments may rise when a deal ends or a variable rate moves, so the arrangement carries real risk."
    },
    {
      "q": "Can I lose my home if I cannot pay?",
      "a": "Yes. Both mortgages are secured on property, so a property can be repossessed if repayments are not kept up."
    }
  ],
  "related": [
    "/stamp-duty-calculator",
    "/btl-icr-calculator",
    "/rental-yield-calculator",
    "/early-repayment-charge-options",
    "/mortgage-affordability-calculator",
    "/ltv-calculator",
    "/second-charge-vs-further-advance"
  ],
  "sources": [
    {
      "title": "Let-to-buy explained",
      "url": "https://www.which.co.uk/money/mortgages-and-property/home-movers/let-to-buy-explained-asToG0e5S0s7",
      "publisher": "Which?"
    },
    {
      "title": "Stamp Duty Land Tax: buying an additional residential property",
      "url": "https://www.gov.uk/guidance/stamp-duty-land-tax-buying-an-additional-residential-property",
      "publisher": "GOV.UK"
    },
    {
      "title": "Land Transaction Tax rates and bands",
      "url": "https://www.gov.wales/land-transaction-tax-rates-and-bands",
      "publisher": "Welsh Government"
    },
    {
      "title": "Buy-to-let mortgages",
      "url": "https://www.financial-ombudsman.org.uk/consumers/complaints-can-help/mortgages/buy-let-mortgages",
      "publisher": "Financial Ombudsman Service"
    },
    {
      "title": "Switching to a Buy to Let mortgage",
      "url": "https://hoa.org.uk/advice/guides-for-homeowners/for-owners/switching-to-a-buy-to-let-mortgage/",
      "publisher": "Homeowners Alliance"
    },
    {
      "title": "Letting your property",
      "url": "https://www.nationwide.co.uk/mortgages/existing-mortgage-members/letting-your-property",
      "publisher": "Nationwide Building Society"
    },
    {
      "title": "Buy-to-let mortgages",
      "url": "https://www.nationwide.co.uk/mortgages/buy-to-let/",
      "publisher": "Nationwide Building Society"
    },
    {
      "title": "What are consumer buy-to-let mortgages",
      "url": "https://www.uswitch.com/mortgages/guides/what-are-consumer-buy-to-let-mortgages",
      "publisher": "Uswitch"
    },
    {
      "title": "Consent to let",
      "url": "https://www.uswitch.com/mortgages/consent-to-let",
      "publisher": "Uswitch"
    },
    {
      "title": "Buy-to-let mortgages guide",
      "url": "https://www.uswitch.com/mortgages/guides/buy-to-let-mortgages",
      "publisher": "Uswitch"
    }
  ]
};

export default function Page() {
  return <GuidePage data={data} />;
}
