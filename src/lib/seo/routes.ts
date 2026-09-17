// Single source of truth for every public, indexable route — used by sitemap.ts.
// Keep in sync with the pages under src/app/.
export const PUBLIC_ROUTES: { path: string; priority: number }[] = [
  { path: "/", priority: 1 },
  { path: "/mortgage-case-calculator", priority: 0.9 },
  { path: "/ltv-calculator", priority: 0.8 },
  { path: "/mortgage-repayment-calculator", priority: 0.8 },
  { path: "/mortgage-term-age-calculator", priority: 0.8 },
  { path: "/loan-to-income-calculator", priority: 0.8 },
  { path: "/btl-icr-calculator", priority: 0.8 },
  { path: "/rental-yield-calculator", priority: 0.8 },
  { path: "/bridging-interest-calculator", priority: 0.8 },
  { path: "/second-charge-calculator", priority: 0.8 },
  { path: "/salary-calculator", priority: 0.8 },
  { path: "/dividend-calculator", priority: 0.8 },
  { path: "/data-sources", priority: 0.5 },
  { path: "/about-us", priority: 0.4 },
  { path: "/contact-us", priority: 0.4 },
  { path: "/privacy-policy", priority: 0.3 },
];

export const SITE_URL = "https://lendingcalculator.co.uk";
