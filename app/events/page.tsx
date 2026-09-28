import type { Metadata } from "next";

import { EventCard } from "@/components/events/event-card";
import { getEvents } from "@/lib/sanity/fetch";
import type { EventItem } from "@/lib/types/content";

/** Refresh CMS-backed content every 5 minutes (see CONTENT_REVALIDATE_SECONDS). */
export const revalidate = 300;

export const metadata: Metadata = {
  title: "Events",
  description:
    "Upcoming ATELIER open studios, portrait workshops, and seasonal pop-up gallery events.",
};

function upcomingEvents(events: EventItem[]): EventItem[] {
  const now = Date.now();
  return events
    .filter((event) => new Date(event.end).getTime() >= now)
    .sort(
      (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime(),
    );
}

export default async function EventsPage() {
  const events = upcomingEvents(await getEvents());

  return (
    <main className="px-4 py-16 md:px-8">
      <div className="mx-auto max-w-5xl">
        <p className="text-xs font-medium tracking-[0.24em] text-muted-foreground uppercase">
          On the calendar
        </p>
        <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl font-medium tracking-tight md:text-6xl">
          Events
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground">
          Join us for open studios, workshops, and seasonal pop-ups. Add any
          event to your calendar with one click.
        </p>

        {events.length === 0 ? (
          <p className="mt-16 text-center text-muted-foreground">
            No upcoming events scheduled. Check back soon or follow us for
            announcements.
          </p>
        ) : (
          <div className="mt-16 flex flex-col gap-12">
            {events.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
