/**
 * Client-safe site config — edit these values without touching layout code.
 * Formspree & Cal.com are free embeddable services (no custom backend).
 */
export const siteConfig = {
  /** Studio founders — shown on About, footer, and SEO copy. */
  founders: ["Sagar Zinzala", "Suchitra Swain"] as const,

  /** Public contact inbox — prefer NEXT_PUBLIC_CONTACT_EMAIL; server pages also fall back to ADMIN_EMAILS. */
  contactEmail:
    process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || "[MY_REAL_EMAIL]",

  /**
   * Formspree form ID from https://formspree.io (e.g. "xyzabcde").
   * Leave empty to show a mailto fallback after submit attempt messaging.
   */
  formspreeId: process.env.NEXT_PUBLIC_FORMSPREE_ID?.trim() || "",

  /**
   * Optional Cal.com / Calendly URL. When unset, /booking uses the Google booking form.
   */
  calUrl: process.env.NEXT_PUBLIC_CAL_URL?.trim() || "",
} as const;

export function foundersCredit(): string {
  const [first, second] = siteConfig.founders;
  return `${first} & ${second}`;
}

export function getFormspreeEndpoint(): string | null {
  if (!siteConfig.formspreeId) return null;
  return `https://formspree.io/f/${siteConfig.formspreeId}`;
}
