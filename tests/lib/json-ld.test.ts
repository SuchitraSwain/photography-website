import { describe, expect, it } from "vitest";

import { serializeJsonLd } from "@/lib/seo/json-ld";

describe("serializeJsonLd", () => {
  it("escapes angle brackets so a script tag cannot break out", () => {
    const serialized = serializeJsonLd({
      name: "ATELIER</script><script>alert(1)</script>",
    });

    expect(serialized).not.toContain("</script>");
    expect(serialized).not.toContain("<");
    expect(serialized).toContain("\\u003c/script>");
  });

  it("stays valid JSON after escaping", () => {
    const serialized = serializeJsonLd({ name: "a < b" });
    expect(JSON.parse(serialized)).toEqual({ name: "a < b" });
  });
});
