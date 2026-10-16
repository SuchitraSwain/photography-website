import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { EventCard } from "@/components/events/event-card";
import { getEvents } from "@/lib/content/fetch";
import type { EventItem } from "@/lib/types/content";

/** Refresh CMS-backed content every 5 minutes (see CONTENT_REVALIDATE_SECONDS). */
export const revalidate = 300;

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "events" });
  return {
    title: t("title"),
    description: t("metaDescription"),
  };
}

function upcomingEvents(events: EventItem[]): EventItem[] {
  const now = Date.now();
  return events
    .filter((event) => new Date(event.end).getTime() >= now)
    .sort(
      (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime(),
    );
}

export default async function EventsPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("events");
  const events = upcomingEvents(await getEvents(locale));

  return (
    <main className="px-4 py-16 md:px-8">
      <div className="mx-auto max-w-5xl">
        <p className="type-label">{t("eyebrow")}</p>
        <h1 className="type-title mt-3">{t("title")}</h1>

        {events.length === 0 ? (
          <p className="mt-16 text-center text-muted-foreground">
            {t("empty")}
          </p>
        ) : (
          <div className="mt-16 flex flex-col gap-12">
            {events.map((event) => (
              <EventCard key={event._id} event={event} locale={locale} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
