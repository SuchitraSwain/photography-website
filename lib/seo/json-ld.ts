/**
 * `<` is the only character that can terminate a script element early, so it is
 * escaped to its JSON unicode form before the payload is inlined into the page.
 */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
