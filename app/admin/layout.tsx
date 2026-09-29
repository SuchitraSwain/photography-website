import Link from "next/link";
import { redirect } from "next/navigation";

import { auth, signOut } from "@/lib/auth";
import { isAdminEmail } from "@/lib/booking/config";
import { Button } from "@/components/ui/button";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  // Sign-in page is under /admin/sign-in — allow without admin check via
  // separate layout would be cleaner; for now only enforce on authenticated routes
  // when a session exists but is not allowlisted.
  if (
    session?.user?.email &&
    !isAdminEmail(session.user.email)
  ) {
    redirect("/admin/sign-in");
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4">
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/admin" className="font-medium">
              Admin
            </Link>
            <Link
              href="/admin/media"
              className="text-muted-foreground hover:text-foreground"
            >
              Media
            </Link>
            <Link
              href="/admin/bookings"
              className="text-muted-foreground hover:text-foreground"
            >
              Bookings
            </Link>
            <Link
              href="/"
              className="text-muted-foreground hover:text-foreground"
            >
              Site
            </Link>
          </nav>
          {session?.user ? (
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
            >
              <Button type="submit" variant="outline" size="sm">
                Sign out
              </Button>
            </form>
          ) : null}
        </div>
      </header>
      {children}
    </div>
  );
}
