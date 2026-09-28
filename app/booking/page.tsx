import type { Metadata } from "next";

import { CalEmbed } from "@/components/booking/cal-embed";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Booking",
  description:
    "Schedule a wedding, portrait, or event session with ATELIER — pick a time that works for you.",
};

export default function BookingPage() {
  return (
    <main className="px-4 py-16 md:px-8">
      <div className="mx-auto max-w-3xl">
        <p className="text-xs font-medium tracking-[0.24em] text-muted-foreground uppercase">
          Inquire
        </p>
        <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl font-medium tracking-tight md:text-6xl">
          Booking
        </h1>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground">
          Choose a time that works for you. Confirmations are handled through
          the scheduling calendar — no account setup required on your end.
        </p>

        <div className="mt-12">
          <CalEmbed calUrl={siteConfig.calUrl} />
        </div>
      </div>
    </main>
  );
}
