import Link from "next/link";
import { Home } from "lucide-react";
import { AllCalculatorsMenu } from "@/components/AllCalculatorsMenu";
import { TalkButton } from "@/components/TalkButton";

const NAV = [
  { href: "/guides", label: "Guides", always: true },
  { href: "/for-brokers", label: "For brokers", always: false },
  { href: "/about-us", label: "About", always: false },
];

export function SiteHeader() {
  return (
    <header className="border-b border-[var(--bb-border)] bg-white/80 backdrop-blur sticky top-0 z-20">
      <div className="mx-auto max-w-6xl px-3 sm:px-6 h-16 flex items-center justify-between gap-2 sm:gap-3">
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <span
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-white shrink-0"
            style={{ background: "var(--bb-primary)" }}
          >
            <Home size={18} strokeWidth={2.25} />
          </span>
          <span className="leading-tight">
            <span className="block font-semibold text-sm sm:text-[15px] tracking-tight">
              Lending<span style={{ color: "var(--bb-primary)" }}> Calculator</span>
            </span>
            <span className="hidden sm:block text-xs font-medium uppercase tracking-wider text-[var(--bb-muted)]">
              Smarter lending decisions
            </span>
          </span>
        </Link>
        <nav aria-label="Main" className="flex items-center gap-1 sm:gap-2 min-w-0">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={`${n.always ? "inline-block" : "hidden md:inline-block"} rounded-lg px-2 sm:px-2.5 py-1.5 text-sm font-medium text-[var(--bb-foreground)] hover:text-[var(--bb-primary)]`}
            >
              {n.label}
            </Link>
          ))}
          <AllCalculatorsMenu />
          <TalkButton topic="Header">
            <span className="sm:hidden">Talk</span>
            <span className="hidden sm:inline">Talk to us</span>
          </TalkButton>
        </nav>
      </div>
    </header>
  );
}
