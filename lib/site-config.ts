/**
 * Client-safe site config — edit these values without touching layout code.
 * Formspree & Cal.com are free embeddable services (no custom backend).
 */
export const siteConfig = {
  /** Studio founders — shown on About, footer, and SEO copy. */
  founders: ["Sagar Zinzala", "Suchitra Swain"] as const,

  /** Replace with your real inbox — shown on Contact and used as Formspree `_replyto` hint. */
  contactEmail: "[MY_REAL_EMAIL]",

  /**
   * Formspree form ID from https://formspree.io (e.g. "xyzabcde").
   * Leave empty to show a mailto fallback after submit attempt messaging.
   */
  formspreeId: process.env.NEXT_PUBLIC_FORMSPREE_ID?.trim() || "",

  /**
   * Cal.com booking page URL (e.g. "https://cal.com/your-username/30min").
   * Used as an iframe embed on /booking — no OAuth or API keys required.
   */
  calUrl:
    process.env.NEXT_PUBLIC_CAL_URL?.trim() ||
    "https://cal.com/your-username/30min",
} as const;

export function foundersCredit(): string {
  const [first, second] = siteConfig.founders;
  return `${first} & ${second}`;
}

export function getFormspreeEndpoint(): string | null {
  if (!siteConfig.formspreeId) return null;
  return `https://formspree.io/f/${siteConfig.formspreeId}`;
}
