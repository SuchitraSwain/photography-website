"use client";

import { CalendarPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { buildIcsEvent } from "@/lib/ics";
import type { EventItem } from "@/lib/types/content";

type AddToCalendarButtonProps = {
  event: EventItem;
};

export function AddToCalendarButton({ event }: AddToCalendarButtonProps) {
  if (!event.addToCalendar) {
    return null;
  }

  function handleClick() {
    const ics = buildIcsEvent({
      title: event.title,
      description: event.description,
      location: event.location,
      start: event.start,
      end: event.end,
    });
    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "event.ics";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <Button type="button" variant="outline" size="sm" onClick={handleClick}>
      <CalendarPlus className="size-4" aria-hidden />
      Add to calendar
    </Button>
  );
}
