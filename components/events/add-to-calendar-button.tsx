"use client";

import { CalendarPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { buildIcsEvent, slugifyForFilename } from "@/lib/ics";
import type { EventItem } from "@/lib/types/content";

type AddToCalendarButtonProps = {
  event: EventItem;
};

/** Safari needs the object URL to outlive the click before it is released. */
const OBJECT_URL_TTL_MS = 10_000;

export function AddToCalendarButton({ event }: AddToCalendarButtonProps) {
  if (!event.addToCalendar) {
    return null;
  }

  function handleClick() {
    const slug = event.slug || slugifyForFilename(event.title);
    const ics = buildIcsEvent({
      title: event.title,
      description: event.description,
      location: event.location,
      start: event.start,
      end: event.end,
      uid: `${slug}-${event._id}`,
    });
    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${slug}.ics`;
    anchor.rel = "noopener";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), OBJECT_URL_TTL_MS);
  }

  return (
    <Button type="button" variant="outline" size="sm" onClick={handleClick}>
      <CalendarPlus className="size-4" aria-hidden />
      Add to calendar
    </Button>
  );
}
