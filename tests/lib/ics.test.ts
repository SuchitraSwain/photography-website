import { describe, expect, it } from "vitest";
import { buildIcsEvent, slugifyForFilename } from "@/lib/ics";

const baseEvent = {
  title: "Pop-up Portrait Night",
  description: "Walk-in portraits",
  location: "Berlin",
  start: "2026-11-01T17:00:00.000Z",
  end: "2026-11-01T20:00:00.000Z",
};

describe("buildIcsEvent", () => {
  it("includes SUMMARY and DTSTART", () => {
    const ics = buildIcsEvent(baseEvent);
    expect(ics).toContain("BEGIN:VCALENDAR");
    expect(ics).toContain("SUMMARY:Pop-up Portrait Night");
    expect(ics).toContain("DTSTART:");
    expect(ics).toContain("END:VCALENDAR");
  });

  it("emits a UID and DTSTAMP required by RFC 5545", () => {
    const ics = buildIcsEvent({
      ...baseEvent,
      dtstamp: "2026-10-01T09:30:00.000Z",
    });

    expect(ics).toContain("UID:pop-up-portrait-night-20261101T170000Z@");
    expect(ics).toContain("DTSTAMP:20261001T093000Z");
  });

  it("qualifies a caller-supplied UID with a domain", () => {
    const ics = buildIcsEvent({ ...baseEvent, uid: "open-studio-evt-001" });
    expect(ics).toMatch(/UID:open-studio-evt-001@[\w.-]+/);
  });

  it("keeps a caller-supplied UID that already has a domain", () => {
    const ics = buildIcsEvent({ ...baseEvent, uid: "evt-001@studio.example" });
    expect(ics).toContain("UID:evt-001@studio.example");
  });
});

describe("slugifyForFilename", () => {
  it("builds a filesystem-safe slug", () => {
    expect(slugifyForFilename("Spring Pop-Up Gallery!")).toBe(
      "spring-pop-up-gallery",
    );
  });

  it("falls back to a generic name when nothing survives", () => {
    expect(slugifyForFilename("***")).toBe("event");
  });
});
