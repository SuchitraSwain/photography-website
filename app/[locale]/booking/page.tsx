import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { BookingForm } from "@/components/booking/booking-form";
import { CalEmbed } from "@/components/booking/cal-embed";
import { isGoogleBookingConfigured } from "@/lib/booking/config";
import { getContactEmail } from "@/lib/contact-email";
import { siteConfig } from "@/lib/site-config";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "booking" });
  return {
    title: t("title"),
    description: t("metaDescription"),
  };
}

export default async function BookingPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("booking");
  const contactEmail = getContactEmail();
  const bookingEnabled = isGoogleBookingConfigured();
  const useCalEmbed = Boolean(siteConfig.calUrl);

  return (
    <main className="px-4 py-16 md:px-8">
      <div className="mx-auto max-w-3xl">
        <p className="type-label">{t("eyebrow")}</p>
        <h1 className="type-title mt-3">{t("title")}</h1>
        <p className="type-lead">
          {useCalEmbed ? t("calTitle") : t("details")}
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
