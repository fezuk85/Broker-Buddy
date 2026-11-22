import type { Metadata } from "next";
import { GuidePage, type GuideData } from "@/components/GuidePage";

export const metadata: Metadata = {
  title: "Keep Your Old House and Rent It Out When You Move",
  description: "Moving but keeping your old house as a rental? See how consent to let, buy-to-let and let to buy work, how rent is assessed, the extra property tax and the risks.",
  alternates: { canonical: "/moving-home-keeping-old-house-to-rent" },
};

const data: GuideData = {
  "slug": "moving-home-keeping-old-house-to-rent",
  "h1": "Moving home but keeping your old house to rent out: your options",
  "intro": "Many people moving home choose to keep the old property and rent it out rather than sell. This is sometimes called becoming an accidental landlord. It can be done, but it changes your mortgage, your tax position and your legal duties. This page explains in general terms how it tends to work in the UK, including for readers in Cardiff and the rest of Wales. It is information only. Lenders set their own rules, and none can promise to approve a request or an application.",
  "sections": [
    {
      "heading": "Can I keep my old house and rent it out when I move?",
      "paragraphs": [
        "Often yes, but not without permission. GOV.UK says that if you have a mortgage on the property, you must get permission from your mortgage lender before renting it out. Letting without it can breach your mortgage terms, and one broker guide says the lender may then apply a penalty, ask for the balance to be repaid or, in the worst cases, repossess the home.",
        "There are two broad routes for the old property: stay with your current lender on a temporary permission, or move the old property onto a buy-to-let mortgage. Both are explained below. Remember that a mortgage is secured on your home, so your home may be at risk if you do not keep up repayments."
      ]
    },
    {
      "heading": "What is consent to let and what might the lender ask for?",
      "paragraphs": [
        "Consent to let is temporary written permission from your existing lender to rent the property while your residential mortgage stays in place. Brokers describe it as granted at the lender's discretion, not as a right, and usually for a fixed period that has to be renewed.",
        "The lender may attach conditions. Examples reported by brokers include an admin fee or a percentage of the loan, a higher interest rate while the property is let, a limit on how long you can let, a requirement that the mortgage is up to date, no further borrowing (a further advance) during the letting, and a standard assured shorthold tenancy. When the permission ends, the terms are said to return to normal. Rules differ between lenders, so ask yours directly."
      ]
    },
    {
      "heading": "What is a let to buy mortgage?",
      "paragraphs": [
        "Let to buy is the term for keeping your current home as a rental while buying another one. In its fuller form, you move the old property onto a buy-to-let mortgage, often with a new lender, and take a separate residential mortgage on the new home. The change can bring arrangement and legal costs, and possibly an early repayment charge on your existing deal.",
        "Some lenders may not lend on the new home while a consent to let is in place, so it is worth asking about this before you apply. A second charge, which is a separate loan secured against a property you already own, is another way some people raise money, but it is a different product from either route above."
      ]
    },
    {
      "heading": "How do lenders treat rental income?",
      "paragraphs": [
        "Buy-to-let lenders usually look at whether the expected rent covers the mortgage interest by a set margin. This is often called a rental coverage test or interest coverage ratio. The test is commonly run at a notional interest rate higher than the one you will actually pay, to check the rent would still cover the interest if rates rose. A lender may also look at your equity in the property and your personal income.",
        "How rent is counted when you apply for the new home differs between lenders. Some may count projected rent, some may count only part of it, and some may rely mainly on your earnings. Because policies vary, the same figures can get different answers from different lenders."
      ]
    },
    {
      "heading": "What about stamp duty and Land Transaction Tax?",
      "paragraphs": [
        "Keeping the old home usually means you own more than one residential property when you buy the new one. In England and Northern Ireland, GOV.UK says higher Stamp Duty Land Tax rates apply when buying a residential property worth £40,000 or more if you will own another and have not sold or given away your previous main home. If you then sell your previous main home within 3 years of buying, you can apply for a refund of the higher-rate part. You cannot get it if you still own part of the old home.",
        "In Wales, Land Transaction Tax has its own higher residential rates. The Welsh Government says that if you are replacing your main residence the higher rates may not apply. Its guidance sets out a 3 year window around a sale, and a refund route if you buy first and sell the old home within 3 years. If you keep the old house to rent it out, you are not selling it, so the higher rates are likely to apply. Check the Welsh Revenue Authority guidance for your own purchase."
      ]
    },
    {
      "heading": "Landlord duties, tax and the risks",
      "paragraphs": [
        "Landlords have legal duties. GOV.UK lists keeping the property safe, making sure gas and electrical equipment is safely installed, providing an Energy Performance Certificate, protecting the tenant's deposit in an approved scheme, fitting smoke and carbon monoxide alarms and, in England, checking the right to rent. Wales has its own landlord rules, so check them.",
        "Rental profit is taxable. GOV.UK says your taxable profit is rent minus allowable expenses, and that for individual landlords Income Tax relief on residential finance costs is limited to the basic rate. Keep records, and speak to HMRC or a tax adviser about your case.",
        "The main risks are empty periods with no rent, repairs, tenants who do not pay, higher borrowing costs when a fixed rate ends, and the pressure of paying two mortgages at once. If rent stops, you still owe both loans, and both are secured on property."
      ]
    }
  ],
  "faqs": [
    {
      "q": "Do I have to tell my mortgage lender if I want to rent out my old house?",
      "a": "Yes. GOV.UK says you must get permission from your mortgage lender before renting out a property that has a mortgage. A lender can refuse, and renting without permission may breach your mortgage terms."
    },
    {
      "q": "How long does consent to let last?",
      "a": "Broker guides describe periods of around 6, 12 or 24 months, set by the lender and sometimes renewable. It is not a legal right, so the lender can decline to renew."
    },
    {
      "q": "What is the difference between consent to let and let to buy?",
      "a": "Consent to let keeps your current mortgage with temporary lender permission. Let to buy usually means moving the old property to a buy-to-let mortgage while taking a residential mortgage on the new home."
    },
    {
      "q": "Will the rent I expect help me get a mortgage on the new home?",
      "a": "It may, but lenders differ. Some count part of the expected rent, some rely mainly on your own income, and buy-to-let lenders test whether rent covers interest at a stressed rate. Nothing is guaranteed."
    },
    {
      "q": "Will I pay higher stamp duty or Land Transaction Tax if I keep my old house?",
      "a": "Probably. Higher rates apply in England, Northern Ireland and Wales when you buy a home while still owning another. The refund routes depend on selling your previous main home within 3 years, which you would not be doing if you keep it to let."
    },
    {
      "q": "Is rental income taxed?",
      "a": "Yes. GOV.UK says tax is due on rental profit after allowable expenses. For individual landlords, relief on mortgage interest is limited to the basic rate of Income Tax."
    }
  ],
  "related": [
    "/btl-icr-calculator",
    "/rental-yield-calculator",
    "/stamp-duty-calculator",
    "/mortgage-affordability-calculator",
    "/second-charge-vs-further-advance",
    "/bridging-interest-calculator"
  ],
  "sources": [
    {
      "title": "Renting out a property: Landlord responsibilities",
      "url": "https://www.gov.uk/renting-out-a-property/landlord-responsibilities",
      "publisher": "GOV.UK"
    },
    {
      "title": "Stamp Duty Land Tax: buying an additional residential property",
      "url": "https://www.gov.uk/guidance/stamp-duty-land-tax-buying-an-additional-residential-property",
      "publisher": "GOV.UK / HMRC"
    },
    {
      "title": "Land Transaction Tax rates and bands",
      "url": "https://gov.wales/land-transaction-tax-rates-and-bands",
      "publisher": "Welsh Government"
    },
    {
      "title": "Higher rates for purchases of residential property: technical guidance",
      "url": "https://www.gov.wales/higher-rates-purchases-residential-property-technical-guidance",
      "publisher": "Welsh Government / Welsh Revenue Authority"
    },
    {
      "title": "Income Tax when you rent out a property: working out your rental income",
      "url": "https://www.gov.uk/guidance/income-tax-when-you-rent-out-a-property-working-out-your-rental-income",
      "publisher": "GOV.UK / HMRC"
    },
    {
      "title": "Tax when you rent out property (paying tax)",
      "url": "https://www.gov.uk/renting-out-a-property/paying-tax",
      "publisher": "GOV.UK"
    },
    {
      "title": "Changing a residential mortgage to buy to let: consent to let and let to buy explained",
      "url": "https://heronfinancial.co.uk/blog/residential-to-buy-to-let-mortgage/",
      "publisher": "Heron Financial (mortgage broker)"
    },
    {
      "title": "Consent to let mortgage",
      "url": "https://www.mortgageable.co.uk/buy-to-let/consent-to-let/",
      "publisher": "Mortgageable (mortgage broker)"
    }
  ]
};

export default function Page() {
  return <GuidePage data={data} />;
}
