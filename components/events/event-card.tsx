import Image from "next/image";

import { AddToCalendarButton } from "@/components/events/add-to-calendar-button";
import { formatEventDateRange } from "@/lib/datetime";
import type { EventItem } from "@/lib/types/content";

type EventCardProps = {
  event: EventItem;
};

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
