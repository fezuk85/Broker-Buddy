export function Section({
  title,
  children,
  className = "",
  id,
}: {
  title?: string;
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={`bb-card p-5 sm:p-6 scroll-mt-24 ${className}`}>
      {title && <h2 className="text-base font-semibold mb-4">{title}</h2>}
      {children}
    </section>
  );
}
