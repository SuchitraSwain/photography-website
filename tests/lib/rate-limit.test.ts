import { afterEach, describe, expect, it } from "vitest";

import { rateLimit, resetRateLimitBuckets } from "@/lib/booking/rate-limit";

describe("rateLimit", () => {
  afterEach(() => {
    resetRateLimitBuckets();
  });

  it("allows requests under the limit", () => {
    expect(
      rateLimit({ key: "t", limit: 2, windowMs: 60_000 }).ok,
    ).toBe(true);
    expect(
      rateLimit({ key: "t", limit: 2, windowMs: 60_000 }).ok,
    ).toBe(true);
  });

  it("blocks when the limit is exceeded", () => {
    rateLimit({ key: "t2", limit: 1, windowMs: 60_000 });
    const blocked = rateLimit({ key: "t2", limit: 1, windowMs: 60_000 });
    expect(blocked.ok).toBe(false);
    if (!blocked.ok) {
      expect(blocked.retryAfterSec).toBeGreaterThan(0);
    }
  });
});
