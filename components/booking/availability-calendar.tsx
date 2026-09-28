"use client";

import { useEffect, useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Slot = { start: string; end: string };

type AvailabilityCalendarProps = {
  enabled: boolean;
  selectedStart: string | null;
  onSelect: (slot: Slot) => void;
};

export function AvailabilityCalendar({
  enabled,
  selectedStart,
  onSelect,
}: AvailabilityCalendarProps) {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    if (!enabled) return;

    startTransition(async () => {
      setError(null);
      try {
        const from = new Date();
        const to = new Date(from.getTime() + 14 * 24 * 60 * 60 * 1000);
        const res = await fetch(
          `/api/availability?from=${encodeURIComponent(from.toISOString())}&to=${encodeURIComponent(to.toISOString())}`,
        );
        const data = (await res.json()) as { slots?: Slot[]; error?: string };
        if (!res.ok) {
          setError(data.error ?? "Could not load availability");
          setSlots([]);
          return;
        }
        setSlots(data.slots ?? []);
      } catch {
        setError("Could not load availability");
        setSlots([]);
      }
    });
  }, [enabled]);

  if (!enabled) {
    return (
      <p className="text-sm text-muted-foreground">
        Availability calendar unlocks after Google Calendar is connected.
      </p>
    );
  }

  if (pending && slots.length === 0 && !error) {
    return <p className="text-sm text-muted-foreground">Loading open times…</p>;
  }

  if (error) {
    return <p className="text-sm text-destructive">{error}</p>;
  }

  if (slots.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No open slots in the next two weeks.
      </p>
    );
  }

  return (
    <div className="space-y-3" role="listbox" aria-label="Available time slots">
      <p className="text-sm text-muted-foreground">
        Select an open time (next 14 days, weekdays 10:00–18:00).
      </p>
      <div className="grid max-h-64 gap-2 overflow-y-auto sm:grid-cols-2">
        {slots.map((slot) => {
          const label = new Date(slot.start).toLocaleString(undefined, {
            weekday: "short",
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
          });
          const selected = selectedStart === slot.start;
          return (
            <Button
              key={slot.start}
              type="button"
              role="option"
              aria-selected={selected}
              variant={selected ? "default" : "outline"}
              className={cn("justify-start font-normal", selected && "ring-1 ring-accent")}
              onClick={() => onSelect(slot)}
            >
              {label}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
