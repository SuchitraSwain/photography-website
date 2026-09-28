import { afterEach, describe, expect, it } from "vitest";
import { isSanityConfigured } from "@/lib/sanity/env";

describe("isSanityConfigured", () => {
  const original = { ...process.env };

  afterEach(() => {
    process.env = { ...original };
  });

  it("returns false when project id is missing", () => {
    delete process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
    process.env.NEXT_PUBLIC_SANITY_DATASET = "production";
    expect(isSanityConfigured()).toBe(false);
  });

  it("returns true when project id and dataset are set", () => {
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID = "abc123";
    process.env.NEXT_PUBLIC_SANITY_DATASET = "production";
    expect(isSanityConfigured()).toBe(true);
  });
});
