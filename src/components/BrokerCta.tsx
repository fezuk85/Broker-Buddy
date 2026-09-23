/**
 * Optional "speak to a broker" referral card. Renders nothing unless NEXT_PUBLIC_BROKER_REFERRAL_URL
 * is set (see .env.example), so no placeholder link ever ships. The link is marked rel="sponsored"
 * and labelled as an advert, as required for paid/affiliate placements.
 */
export function BrokerCta() {
  const url = process.env.NEXT_PUBLIC_BROKER_REFERRAL_URL;
  if (!url) return null;

  return (
    <aside className="bb-card p-5 sm:p-6" aria-label="Sponsored: speak to a mortgage broker">
      <p className="text-xs font-semibold uppercase tracking-widest text-[var(--bb-muted)]">Advertisement</p>
      <h2 className="mt-1 text-base font-semibold">Want a broker to check these numbers?</h2>
      <p className="mt-1 text-sm text-[var(--bb-muted)]">
        A whole-of-market mortgage broker can compare lenders, confirm what you can really borrow and manage the
        application for you. This is a paid referral link — it costs you nothing to use.
      </p>
      <a
        href={url}
        target="_blank"
        rel="sponsored noopener noreferrer"
        className="bb-tap-target mt-3 inline-flex items-center rounded-lg px-4 py-2 text-sm font-medium text-white"
        style={{ background: "var(--bb-primary)" }}
      >
        Speak to a broker
      </a>
    </aside>
  );
}
