import type { Metadata } from "next";

import { BookingForm } from "@/components/booking/booking-form";
import { getSiteSettings } from "@/lib/sanity/fetch";

/** Refresh CMS-backed content every 5 minutes (see CONTENT_REVALIDATE_SECONDS). */
export const revalidate = 300;

export const metadata: Metadata = {
  title: "Booking",
  description:
    "Request a wedding, portrait, or event session — share your date, location, and vision with ATELIER.",
};

export default async function BookingPage() {
  const { contactEmail } = await getSiteSettings();

  return (
    <main className="px-4 py-16 md:px-8">
      <div className="mx-auto max-w-2xl">
        <p className="text-xs font-medium tracking-[0.24em] text-muted-foreground uppercase">
          Inquire
        </p>
        <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl font-medium tracking-tight md:text-6xl">
          Booking
        </h1>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground">
          Share the details of your session. Fields match our upcoming online
          booking flow—submit stays off until launch.
        </p>

        <div className="mt-12">
          <BookingForm contactEmail={contactEmail} />
        </div>
      </div>
    </main>
  );
}
