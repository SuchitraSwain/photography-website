import Link from "next/link";

export default function AdminHomePage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-16">
      <h1 className="font-[family-name:var(--font-display)] text-4xl">Admin</h1>
      <p className="mt-4 max-w-xl text-muted-foreground">
        Upload gallery media, manage booking requests, and reply via Gmail.
      </p>
      <div className="mt-8 flex flex-col gap-3">
        <Link href="/admin/media" className="underline underline-offset-4">
          Media library →
        </Link>
        <Link href="/admin/bookings" className="underline underline-offset-4">
          View bookings →
        </Link>
      </div>
    </main>
  );
}
