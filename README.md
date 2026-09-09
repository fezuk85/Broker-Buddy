# Broker Buddy

A free UK mortgage & property-finance calculation hub — LTV, repayments, loan-to-income,
age/term limits, BTL ICR, rental yield and bridging costs, plus a combined "Mortgage Case
Calculator" so you only enter your details once.

Broker Buddy provides calculations and indicative information only. It does not provide
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
    ltv-calculator/             Standalone LTV calculator (and 6 more like it)
    data-sources/                What's real data vs. placeholder
  components/                   Shared UI building blocks (cards, inputs, stat tiles...)
  lib/
    calc/                       Pure calculation functions + their tests (the maths)
    providers/                  Interfaces for property/EPC/council-tax/ONS/rental data,
                                 with manual-entry or "not yet connected" implementations
    valuation/                  The layered indicative property valuation model
    case/                       The shared "case" (your entered details), saved to your
                                 browser's local storage — no account needed
```

## What's live vs. placeholder (Phase 1)

- **All calculators (LTV, repayments, LTI, age/term, BTL ICR, rental yield, bridging)** are
  fully live — real maths, running against whatever you type in.
- **HM Land Registry sale history, EPC data** — architecture is in place (see
  `src/lib/providers/`) but not yet connected to a live data source. The site shows
  "insufficient data" rather than making anything up.
- **ONS household expenditure benchmark, Council Tax, rent** — Phase 1 uses manual entry / a
  clearly-labelled simplified model, not live datasets.

See `/data-sources` on the running site for the full, current picture.
