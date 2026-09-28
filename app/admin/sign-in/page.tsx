import { auth, signIn } from "@/lib/auth";
import { isGoogleOAuthConfigured } from "@/lib/booking/config";
import { Button } from "@/components/ui/button";

export default async function AdminSignInPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const session = await auth();
  const params = await searchParams;

  if (session?.user) {
    return (
      <main className="mx-auto flex min-h-[50vh] max-w-md flex-col justify-center gap-4 px-4 py-16">
        <h1 className="font-[family-name:var(--font-display)] text-3xl">
          Signed in
        </h1>
        <p className="text-sm text-muted-foreground">{session.user.email}</p>
        <a className="underline underline-offset-4" href="/admin/bookings">
          Go to bookings
        </a>
      </main>
    );
  }

  if (!isGoogleOAuthConfigured()) {
    return (
      <main className="mx-auto max-w-md px-4 py-16">
        <h1 className="font-[family-name:var(--font-display)] text-3xl">
          Admin sign-in
        </h1>
        <p className="mt-4 text-sm text-muted-foreground">
          Google OAuth is not configured. Add AUTH_GOOGLE_ID, AUTH_GOOGLE_SECRET,
          AUTH_SECRET, DATABASE_URL, and ADMIN_EMAILS to .env.local.
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-[50vh] max-w-md flex-col justify-center gap-6 px-4 py-16">
      <h1 className="font-[family-name:var(--font-display)] text-3xl">
        Admin sign-in
      </h1>
      <p className="text-sm text-muted-foreground">
        Connect the photographer Google account to sync Calendar availability and
        send Gmail notifications.
      </p>
      <form
        action={async () => {
          "use server";
          await signIn("google", {
            redirectTo: params.callbackUrl || "/admin/bookings",
          });
        }}
      >
        <Button type="submit">Continue with Google</Button>
      </form>
    </main>
  );
}
