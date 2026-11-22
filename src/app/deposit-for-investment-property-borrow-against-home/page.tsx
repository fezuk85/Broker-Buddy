import type { Metadata } from "next";
import { GuidePage, type GuideData } from "@/components/GuidePage";

export const metadata: Metadata = {
  title: "Borrow Against Your Home for a Buy-to-Let Deposit",
  description: "How UK homeowners use equity for a buy-to-let deposit: second charge, further advance or remortgage, lender views on borrowed deposits, extra tax and the risks.",
  alternates: { canonical: "/deposit-for-investment-property-borrow-against-home" },
};

const data: GuideData = {
  "slug": "deposit-for-investment-property-borrow-against-home",
  "h1": "Can I borrow against my home for a deposit on a buy-to-let?",
  "intro": "Some homeowners use the equity in their own home to raise the deposit for an investment property. That means the debt behind the deposit is secured on the home you live in, which changes the risk. This page explains in general terms how the routes work, how buy-to-let lenders tend to view the source of a deposit, and the extra costs and risks to weigh up. It is general information, lenders differ, and nothing here promises that any application will be approved.",
  "sections": [
    {
      "heading": "How do people use home equity to fund a buy-to-let deposit?",
      "paragraphs": [
        "Equity is the value of your home minus what you owe on it. There are three common ways to release some of it. A remortgage with extra borrowing replaces your current mortgage with a bigger one, and you take the difference as cash. This can bring early repayment charges and possibly a higher rate on the whole loan. A second charge is a separate loan secured on the same home, so you keep your existing mortgage deal but make two sets of payments. A further advance is extra borrowing from your existing lender, usually on that lender's own terms.",
        "The Financial Conduct Authority says second charge loans tend to carry higher interest rates than first charge mortgages. Fees can be added to the loan, which makes the true cost harder to see. These loans are secured on your home, so it may be at risk if repayments are missed."
      ]
    },
    {
      "heading": "Will a buy-to-let lender accept a borrowed deposit?",
      "paragraphs": [
        "This depends on the lender, so it is worth checking before you borrow. Lenders want to know where your money has come from, and clear, traceable funds help. Broker guides list home equity as a source some lenders accept, including a remortgage of your own home or switching a residence to rent, often called let to buy.",
        "Unsecured borrowing, such as personal loans or credit cards, is usually not accepted. One broker guide says some lenders allow a personal loan for only a small part of the deposit, with the rest coming from your own money. Sources do not agree on every detail, which is why lender policy, and not a general rule, decides the answer."
      ]
    },
    {
      "heading": "How much deposit and what loan-to-value apply?",
      "paragraphs": [
        "Most buy-to-let lenders cap the loan at about 75% of the property's value, which points to a deposit of around 25%, sometimes less and sometimes more. A flat above a shop, a house in multiple occupation or a purchase through a limited company may need a bigger deposit.",
        "There is a second loan-to-value to think about, on your own home. Lenders set their own limits on total borrowing against it, so your existing mortgage has to be low enough to leave room for the extra loan. Your existing lender may also need to agree to a second charge being placed behind it."
      ]
    },
    {
      "heading": "How do lenders test the rent?",
      "paragraphs": [
        "Buy-to-let lending is mostly based on the rent the property is expected to earn, not only your pay. A common test asks for rent to cover at least 125% of the monthly interest, and some lenders look at their own stressed interest rate. Some lenders will also let you use other income to cover a shortfall. Lenders vary, and the test can be tougher if you pay higher-rate tax. The calculators on this site can show the effect of different figures."
      ]
    },
    {
      "heading": "What extra costs come with an investment property?",
      "paragraphs": [
        "In England and Northern Ireland, buying an additional residential property usually means paying higher rates of Stamp Duty Land Tax, which gov.uk describes as an extra 5% on top of the standard rates. The current higher rates started on 1 April 2025. In Wales the equivalent is Land Transaction Tax at higher residential rates, in bands starting at 5% on the first £180,000 for transactions on or after 11 December 2024. If you replace your main home and sell the old one within 36 months, the extra may be refundable.",
        "Other costs include arrangement and broker fees, valuation and legal fees, and letting agent fees. If you borrow the deposit, interest on that loan is a cost too."
      ]
    },
    {
      "heading": "How is rental profit taxed?",
      "paragraphs": [
        "Income tax is charged on rental profit, which is rent minus allowable expenses such as repairs, insurance and letting fees. Tax rates depend on your total income for the year. HMRC says relief on residential finance costs is limited to the basic rate of Income Tax for individual landlords, and only interest and related fees count, not full mortgage payments. Some landlords therefore pay more tax than they expect. A tax adviser or accountant can explain your own position."
      ]
    },
    {
      "heading": "What are the risks of securing more debt on my home?",
      "paragraphs": [
        "You are putting your home behind an investment. If rent stops, because the property is empty or a tenant does not pay, you still owe the mortgage on the investment property and the loan secured on your home. Buy-to-let rates are often higher than residential ones, and payments can rise when a fixed deal ends. If property values fall, an interest-only loan can leave you owing more than the property is worth. Missed payments on any loan secured on your home could put the home at risk of repossession."
      ]
    }
  ],
  "faqs": [
    {
      "q": "Can I use a second charge on my home as the deposit for a buy-to-let?",
      "a": "Some people do. A specialist second charge guide says the money can be used for any legal purpose, including a deposit, but not on a property you live in. Whether the buy-to-let lender then accepts those funds is its own decision, so it is worth checking first. The loan is secured on your home."
    },
    {
      "q": "Do buy-to-let lenders accept a deposit that came from a loan?",
      "a": "It varies. Broker guides say unsecured loans and credit cards are usually refused, and that some lenders allow a personal loan for a small share only. Some accept equity from your own home. Lenders also check where the money came from, and the source must be described honestly."
    },
    {
      "q": "What is the difference between a further advance and a second charge?",
      "a": "A further advance is extra borrowing from your existing mortgage lender. A second charge is a separate loan, often from a different lender, secured on the same home behind your first mortgage."
    },
    {
      "q": "Can I keep my old house and rent it out when I move?",
      "a": "There are two usual routes. Consent to let is a temporary permission from your lender, often for up to 12 months. Let to buy means switching the existing mortgage to a buy-to-let one, which is generally used for longer-term renting."
    },
    {
      "q": "Do I pay higher stamp duty on a buy-to-let?",
      "a": "Usually yes if you will own more than one residential property after completion. England and Northern Ireland charge higher Stamp Duty Land Tax rates and Wales charges higher Land Transaction Tax rates. Check the current figures on gov.uk or the Welsh Revenue Authority."
    },
    {
      "q": "Is the interest on my borrowing tax deductible against rent?",
      "a": "For individuals, HMRC says relief on residential finance costs is restricted to the basic rate of Income Tax. Whether interest on money raised against your own home counts as a letting cost depends on how it was used, so ask a tax professional."
    }
  ],
  "related": [
    "/second-charge-calculator",
    "/second-charge-vs-further-advance",
    "/ltv-calculator",
    "/btl-icr-calculator",
    "/stamp-duty-calculator",
    "/rental-yield-calculator",
    "/borrow-against-your-house-without-remortgaging"
  ],
  "sources": [
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
      "title": "Income Tax when you rent out a property: working out your rental income",
      "url": "https://www.gov.uk/guidance/income-tax-when-you-rent-out-a-property-working-out-your-rental-income",
      "publisher": "GOV.UK (HMRC)"
    },
    {
      "title": "Second charge mortgages: improving outcomes for consumers",
      "url": "https://www.fca.org.uk/publications/good-and-poor-practice/second-charge-mortgages-improving-outcomes-consumers",
      "publisher": "Financial Conduct Authority"
    },
    {
      "title": "Borrowing against your home to buy property",
      "url": "https://www.habito.com/mortgages-explained/borrowing-against-your-home-to-buy-property",
      "publisher": "Habito"
    },
    {
      "title": "How to fund a buy to let deposit",
      "url": "https://www.selinafinance.co.uk/resources/blog/how-to-fund-buy-to-let-deposits",
      "publisher": "Selina Finance"
    },
    {
      "title": "Land Transaction Tax: changes to technical guidance",
      "url": "https://www.gov.wales/land-transaction-tax-changes-technical-guidance",
      "publisher": "Welsh Government"
    },
    {
      "title": "Second charge buy to let mortgages",
      "url": "https://www.commercialtrust.co.uk/second-charge-buy-to-let-mortgages/",
      "publisher": "Commercial Trust"
    },
    {
      "title": "Stamp Duty Land Tax residential property rates",
      "url": "https://www.gov.uk/stamp-duty-land-tax/residential-property-rates",
      "publisher": "GOV.UK"
    },
    {
      "title": "Buy-to-Let Mortgage Deposit: How Much Is It?",
      "url": "https://www.charcol.co.uk/guides/buy-to-let-mortgage-deposit-how-much-is-it/",
      "publisher": "Charcol"
    },
    {
      "title": "How much deposit do you need for a buy to let mortgage?",
      "url": "https://www.pepper.money/blog/how-much-deposit-do-you-need-for-a-buy-to-let-mortgage/",
      "publisher": "Pepper Money"
    },
    {
      "title": "Buy To Let Mortgages Explained",
      "url": "https://hoa.org.uk/advice/guides-for-homeowners/i-am-buying/buy-to-let-explained/",
      "publisher": "HomeOwners Alliance"
    }
  ]
};

export default function Page() {
  return <GuidePage data={data} />;
}
