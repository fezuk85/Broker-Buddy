export function Section({
  title,
  children,
  className = "",
}: {
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`bb-card p-5 sm:p-6 ${className}`}>
      {title && <h2 className="text-base font-semibold mb-4">{title}</h2>}
      {children}
    </section>
  );
}
