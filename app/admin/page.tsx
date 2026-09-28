import Link from "next/link";

export default function AdminHomePage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-16">
      <h1 className="font-[family-name:var(--font-display)] text-4xl">Admin</h1>
      <p className="mt-4 max-w-xl text-muted-foreground">
        Manage booking requests, sync Google Calendar, and reply via Gmail.
      </p>
      <Link
        href="/admin/bookings"
        className="mt-8 inline-block underline underline-offset-4"
      >
        View bookings →
      </Link>
    </main>
  );
}
