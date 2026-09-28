import Image from "next/image";

import { AddToCalendarButton } from "@/components/events/add-to-calendar-button";
import type { EventItem } from "@/lib/types/content";

type EventCardProps = {
  event: EventItem;
};

function formatEventDateRange(startIso: string, endIso: string): string {
  const start = new Date(startIso);
  const end = new Date(endIso);
  const dateFormatter = new Intl.DateTimeFormat(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const timeFormatter = new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
  const sameDay =
    start.getFullYear() === end.getFullYear() &&
    start.getMonth() === end.getMonth() &&
    start.getDate() === end.getDate();

  if (sameDay) {
    return `${dateFormatter.format(start)} · ${timeFormatter.format(start)} – ${timeFormatter.format(end)}`;
  }

  return `${dateFormatter.format(start)} – ${dateFormatter.format(end)}`;
}

export function EventCard({ event }: EventCardProps) {
  return (
    <article className="grid gap-8 border-b border-border pb-12 last:border-b-0 last:pb-0 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] md:items-start">
      <div className="order-2 md:order-1">
        <time
          dateTime={event.start}
          className="text-xs font-medium tracking-[0.2em] text-muted-foreground uppercase"
        >
          {formatEventDateRange(event.start, event.end)}
        </time>
        <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-medium tracking-tight md:text-4xl">
          {event.title}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">{event.location}</p>
        <p className="mt-6 max-w-prose text-base leading-relaxed text-foreground/90">
          {event.description}
        </p>
        <div className="mt-8">
          <AddToCalendarButton event={event} />
        </div>
      </div>

      {event.imageSrc ? (
        <div className="relative order-1 aspect-[4/3] overflow-hidden bg-secondary md:order-2">
          <Image
            src={event.imageSrc}
            alt={event.imageAlt ?? event.title}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      ) : null}
    </article>
  );
}
