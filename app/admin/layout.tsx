import Link from "next/link";
import { redirect } from "next/navigation";

import { auth, signOut } from "@/lib/auth";
import { isAdminEmail } from "@/lib/booking/config";

const ADMIN_LINKS = [
  { href: "/admin", label: "Overview", exact: true },
  { href: "/admin/media", label: "Media" },
  { href: "/admin/bookings", label: "Bookings" },
  { href: "/", label: "Site" },
] as const;

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (session?.user?.email && !isAdminEmail(session.user.email)) {
    redirect("/admin/sign-in");
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-border/60 bg-background/70 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-6 py-4 lg:px-8">
          <nav className="flex flex-wrap items-center gap-6" aria-label="Admin">
            {ADMIN_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-mono-nav text-[0.72rem] font-medium tracking-[0.14em] text-muted-foreground uppercase transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          {session?.user ? (
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
            >
              <button type="submit" className="pill-cta py-2 text-[0.68rem]">
                Sign out
              </button>
            </form>
          ) : null}
        </div>
      </header>
      {children}
    </div>
  );
}
