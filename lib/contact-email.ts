import { getAdminEmails } from "@/lib/booking/config";
import { siteConfig } from "@/lib/site-config";

/**
 * Prefer public contact email, then the admin Gmail allowlist.
 * Safe for server components / route handlers only.
 */
export function getContactEmail(): string {
  const publicEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim();
  if (publicEmail) return publicEmail;

  const admin = getAdminEmails()[0];
  if (admin) return admin;

  return siteConfig.contactEmail;
}

export function isContactEmailReady(email: string = getContactEmail()): boolean {
  return Boolean(email) && email.includes("@") && !email.startsWith("[");
}
