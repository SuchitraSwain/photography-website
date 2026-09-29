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
        <p className="type-label">Inquire</p>
        <h1 className="type-title mt-3">Booking</h1>
        <p className="type-lead">
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
