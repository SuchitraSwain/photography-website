import { afterEach, describe, expect, it, vi } from "vitest";

import { formatEventDateRange, getSiteTimeZone } from "@/lib/datetime";

describe("getSiteTimeZone", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("defaults to UTC when no timezone is configured", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_TIMEZONE", "");
    expect(getSiteTimeZone()).toBe("UTC");
  });

  it("uses a valid configured timezone", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_TIMEZONE", "America/New_York");
    expect(getSiteTimeZone()).toBe("America/New_York");
  });

  it("falls back to UTC and logs when the timezone is invalid", () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.stubEnv("NEXT_PUBLIC_SITE_TIMEZONE", "Not/AZone");

    expect(getSiteTimeZone()).toBe("UTC");
    expect(errorSpy).toHaveBeenCalled();
  });
});

describe("formatEventDateRange", () => {
  it("renders same-day events with a time range and zone abbreviation", () => {
    const formatted = formatEventDateRange(
      "2026-11-14T18:00:00.000Z",
      "2026-11-14T21:00:00.000Z",
      "UTC",
    );

    expect(formatted).toBe(
      "Saturday, November 14, 2026 · 6:00 PM – 9:00 PM UTC",
    );
  });

  it("renders the range in the requested timezone, not the host timezone", () => {
    const formatted = formatEventDateRange(
      "2026-11-14T18:00:00.000Z",
      "2026-11-14T21:00:00.000Z",
      "America/New_York",
    );

    expect(formatted).toBe(
      "Saturday, November 14, 2026 · 1:00 PM – 4:00 PM EST",
    );
  });

  it("renders multi-day events as a date range with the zone", () => {
    const formatted = formatEventDateRange(
      "2026-11-14T18:00:00.000Z",
      "2026-11-16T02:00:00.000Z",
      "UTC",
    );

    expect(formatted).toBe(
      "Saturday, November 14, 2026 – Monday, November 16, 2026 (UTC)",
    );
  });
});
