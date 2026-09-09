export function Disclaimer({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="rounded-xl px-4 py-3 text-sm"
      style={{
        background: "var(--bb-warning-bg)",
        border: "1px solid var(--bb-warning-border)",
        color: "var(--bb-warning-text)",
      }}
    >
      {children}
    </div>
  );
}
