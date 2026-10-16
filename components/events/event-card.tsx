import Link from "next/link";
import { getTranslations } from "next-intl/server";

import { AddToCalendarButton } from "@/components/events/add-to-calendar-button";
import { SafeImage } from "@/components/media/safe-image";
import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";
import { formatEventDateRange } from "@/lib/datetime";
import { intlLocale, resolveLocale } from "@/lib/i18n/locale";
import type { EventItem } from "@/lib/types/content";

type EventCardProps = {
  event: EventItem;
  locale?: string;
};

export async function EventCard({ event, locale }: EventCardProps) {
  const resolved = resolveLocale(locale);
  const t = await getTranslations({ locale: resolved, namespace: "events" });

  return (
    <RevealOnScroll>
      <article className="grid gap-8 border-b border-border pb-12 last:border-b-0 last:pb-0 md:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] md:items-start md:gap-12">
        <div className="order-2 md:order-1">
          <time dateTime={event.start} className="type-label">
            {formatEventDateRange(
              event.start,
              event.end,
              undefined,
              intlLocale(resolved),
            )}
          </time>
          <h2 className="type-title mt-3">{event.title}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{event.location}</p>
          <p className="type-body mt-6 max-w-prose text-foreground/90">
            {event.description}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            {event.ticketUrl ? (
              <Link
                href={event.ticketUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="pill-cta-accent inline-flex justify-center"
              >
                {event.ticketLabel ?? t("getTickets")}
              </Link>
            ) : null}
            <AddToCalendarButton event={event} label={t("addToCalendar")} />
          </div>
        </div>

        {event.imageSrc ? (
          <div className="relative order-1 aspect-[4/5] overflow-hidden bg-secondary sm:aspect-[4/3] md:order-2">
            <SafeImage
              src={event.imageSrc}
              alt={event.imageAlt ?? event.title}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover object-center"
              priority
            />
          </div>
        ) : null}
      </article>
    </RevealOnScroll>
  );
}
