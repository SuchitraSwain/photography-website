import { describe, expect, it } from "vitest";

import {
  buildOpenSlots,
  type BusyInterval,
} from "@/lib/booking/availability";

describe("buildOpenSlots", () => {
  it("returns weekday slots and skips busy intervals", () => {
    // Monday 2026-10-05 UTC
    const from = new Date("2026-10-05T00:00:00.000Z");
    const to = new Date("2026-10-06T00:00:00.000Z");
    const busy: BusyInterval[] = [
      {
        start: new Date("2026-10-05T10:00:00.000Z"),
        end: new Date("2026-10-05T11:00:00.000Z"),
      },
    ];

    const slots = buildOpenSlots({
      from,
      to,
      busy,
      timeZone: "UTC",
      workingHours: {
        days: [1],
        startHour: 10,
        endHour: 12,
        slotMinutes: 60,
      },
    });

    expect(slots.map((s) => s.start)).toEqual([
      "2026-10-05T11:00:00.000Z",
    ]);
  });

  it("skips weekends when configured for weekdays only", () => {
    const from = new Date("2026-10-03T00:00:00.000Z"); // Saturday
    const to = new Date("2026-10-05T00:00:00.000Z"); // Monday
    const slots = buildOpenSlots({
      from,
      to,
      busy: [],
      timeZone: "UTC",
    });
    expect(slots.every((s) => new Date(s.start).getUTCDay() !== 0)).toBe(true);
    expect(slots.every((s) => new Date(s.start).getUTCDay() !== 6)).toBe(true);
  });
});
