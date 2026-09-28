import { describe, expect, it } from "vitest";
import { buildIcsEvent } from "@/lib/ics";

describe("buildIcsEvent", () => {
  it("includes SUMMARY and DTSTART", () => {
    const ics = buildIcsEvent({
      title: "Pop-up Portrait Night",
      description: "Walk-in portraits",
      location: "Berlin",
      start: "2026-11-01T17:00:00.000Z",
      end: "2026-11-01T20:00:00.000Z",
    });
    expect(ics).toContain("BEGIN:VCALENDAR");
    expect(ics).toContain("SUMMARY:Pop-up Portrait Night");
    expect(ics).toContain("DTSTART:");
    expect(ics).toContain("END:VCALENDAR");
  });
});
