import Link from "next/link";

const sections = [
  {
    title: "Product",
    links: [
      { href: "/#features", label: "Features" },
      { href: "/pricing", label: "Pricing" },
      { href: "/#faq", label: "FAQ" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "mailto:hello@atelier.app", label: "Contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/about", label: "Privacy" },
      { href: "/about", label: "Terms" },
    ],
  },
];

export function MarketingFooter() {
  return (
    <footer className="border-t mt-24 sm:mt-32" style={{ borderColor: "var(--border-soft)" }}>
      <div className="max-w-6xl mx-auto px-6 py-12 sm:py-16 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="col-span-2 md:col-span-1">
          <Link href="/" className="font-display text-2xl italic" style={{ color: "var(--fg)" }}>
            Atelier
          </Link>
          <p className="mt-3 text-sm font-serif italic leading-relaxed max-w-xs" style={{ color: "var(--fg-soft)" }}>
            A daily practice, repeated faithfully. Built quietly, for people who would rather build than hustle.
          </p>
        </div>

        {sections.map((section) => (
          <div key={section.title}>
            <h4
              className="font-serif text-[10px] uppercase tracking-[0.3em] mb-3"
              style={{ color: "var(--accent)" }}
            >
              {section.title}
            </h4>
            <ul className="space-y-2">
              {section.links.map((l) => (
                <li key={l.href + l.label}>
                  <Link
                    href={l.href}
                    className="text-sm transition-colors hover:text-[var(--accent)]"
                    style={{ color: "var(--fg-soft)" }}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t" style={{ borderColor: "var(--border-soft)" }}>
        <div
          className="max-w-6xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs"
          style={{ color: "var(--fg-muted)" }}
        >
          <p className="font-serif">© {new Date().getFullYear()} Atelier. Crafted quietly.</p>
          <p className="font-serif italic">&ldquo;Discipline equals freedom.&rdquo;</p>
        </div>
      </div>
    </footer>
  );
}
