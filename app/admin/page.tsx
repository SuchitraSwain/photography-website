import Link from "next/link";

const LINKS = [
  {
    href: "/admin/media",
    label: "Media library",
    description: "Upload and manage gallery images in Vercel Blob.",
  },
  {
    href: "/admin/bookings",
    label: "Bookings",
    description: "Review requests and reply via Gmail.",
  },
] as const;

export default function AdminHomePage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16 lg:px-8">
      <p className="type-label">Studio control</p>
      <h1 className="type-title mt-3">Admin</h1>
      <p className="type-lead">
        Upload gallery media, manage booking requests, and reply via Gmail.
      </p>

      <ul className="mt-12 grid gap-4 sm:grid-cols-2">
        {LINKS.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="surface-card group block p-6 transition-colors hover:border-[rgba(148,176,224,0.28)]"
            >
              <p className="font-display text-[clamp(1.35rem,2vw,1.75rem)] text-foreground">
                {item.label}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>
              <span className="font-mono-nav mt-6 inline-flex text-[0.68rem] tracking-[0.14em] text-accent uppercase transition-transform group-hover:translate-x-1">
                Open →
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
