# Lending Calculator

A free UK mortgage & property-finance calculation hub — LTV, repayments, loan-to-income,
age/term limits, BTL ICR, rental yield and bridging costs, plus a combined "Mortgage Case
Calculator" so you only enter your details once.

Lending Calculator provides calculations and indicative information only. It does not provide
mortgage advice, lending decisions or property valuations. See `/data-sources` in the running
site for exactly which figures are real public data vs. manual entry vs. planned.

## How to run it (plain English)

You need [Node.js](https://nodejs.org) installed (version 20 or newer).

**To start the website:**

1. Open a terminal in this folder.
2. Run `npm install` (only needed the first time, or after pulling new code).
3. Run `npm run dev`.
4. Open **http://localhost:3000** in your browser.

**To stop it:** go back to the terminal and press `Ctrl+C`.

**To run the automated calculation tests:** `npm test`

**To build the production version:** `npm run build`, then `npm start`.

## Project structure

```
src/
  app/                          Pages (routes). Each folder under app/ is a URL.
    page.tsx                    Home page ("/")
    mortgage-case-calculator/   The main combined calculator
    ltv-calculator/             Standalone LTV calculator (and 12 more like it, incl. stamp duty,
                                 affordability and overpayments)
    data-sources/                What's real data vs. placeholder
  components/                   Shared UI building blocks (cards, inputs, stat tiles...)
  content/guides/               Long-form written guides shown under each calculator
  lib/
    calc/                       Pure calculation functions + their tests (the maths)
    providers/                  Interfaces for property/council-tax/ONS/rental data,
                                 with manual-entry or "not yet connected" implementations
    valuation/                  The layered indicative property valuation model
    case/                       The shared "case" (your entered details), saved to your
                                 browser's local storage — no account needed
```

## What's live vs. placeholder (Phase 1)

- **All calculators (LTV, repayments, overpayments, affordability, stamp duty, LTI, age/term, BTL ICR,
  rental yield, bridging, second charge, salary, dividends)** are
  fully live — real maths, running against whatever you type in.
- **HM Land Registry sale history, UK House Price Index** — live and connected (see
  `src/lib/providers/`). EPC data was tried and removed: MHCLG's API can only be matched by
  postcode, not address/UPRN, which too often surfaced a different property's certificate — see
  `/data-sources` for what's covered instead.
- **ONS household expenditure benchmark, Council Tax, rent** — Phase 1 uses manual entry / a
  clearly-labelled simplified model, not live datasets.

See `/data-sources` on the running site for the full, current picture.

## Adding a calculator

1. Put the maths in `src/lib/calc/<name>.ts` with a `.test.ts` beside it, and export it from `src/lib/calc/index.ts`.
2. Add `src/app/<slug>/page.tsx` (metadata + canonical) and `Client.tsx` (UI, using `CalculatorPage`).
3. Write its guide in `src/content/guides/` and pass it as `guide={...}`.
4. Register it in `src/lib/seo/calculators.ts` (homepage, footer, related links) and `src/lib/seo/routes.ts` (sitemap).

Tax rates (`src/lib/calc/tax.ts`, `benefits.ts`, `stampDuty.ts`) are tied to a tax year and must be re-verified
against GOV.UK each April and after each Budget.

## Optional configuration

`NEXT_PUBLIC_BROKER_REFERRAL_URL` — when set, a labelled "Advertisement" broker-referral card appears on every
calculator page. Leave unset to show nothing. See `.env.example`.
