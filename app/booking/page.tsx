import type { Metadata } from "next";

import { BookingForm } from "@/components/booking/booking-form";
import { CalEmbed } from "@/components/booking/cal-embed";
import { isGoogleBookingConfigured } from "@/lib/booking/config";
import { getContactEmail } from "@/lib/contact-email";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Booking",
  description:
    "Schedule a wedding, portrait, or event session with ATELIER — pick a time that works for you.",
};

export default function BookingPage() {
  const contactEmail = getContactEmail();
  const bookingEnabled = isGoogleBookingConfigured();
  const useCalEmbed = Boolean(siteConfig.calUrl);

  return (
    <main className="px-4 py-16 md:px-8">
      <div className="mx-auto max-w-3xl">
        <p className="type-label">Inquire</p>
        <h1 className="type-title mt-3">Booking</h1>
        <p className="type-lead">
          {useCalEmbed
            ? "Choose a time that works for you. Confirmations are handled through the scheduling calendar — no account setup required on your end."
            : "Pick an open time or send a request — we’ll confirm by email within 24–48 hours."}
        </p>

        <div className="mt-12">
          {useCalEmbed ? (
            <CalEmbed calUrl={siteConfig.calUrl} />
          ) : (
            <BookingForm
              contactEmail={contactEmail}
              bookingEnabled={bookingEnabled}
            />
          )}
        </div>
      </div>
    </main>
  );
}
