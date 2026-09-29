import type { Metadata } from "next";

import { ContactForm } from "@/components/contact/contact-form";
import { getSiteSettings } from "@/lib/content/fetch";
import { siteConfig } from "@/lib/site-config";

/** Refresh CMS-backed content every 5 minutes (see CONTENT_REVALIDATE_SECONDS). */
export const revalidate = 300;

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Write to ATELIER for collaborations, press, and general questions — we reply by email.",
};

export default async function ContactPage() {
  const { location, socialLinks } = await getSiteSettings();

  return (
    <main className="px-4 py-16 md:px-8">
      <div className="mx-auto max-w-5xl">
        <p className="type-label">Reach out</p>
        <h1 className="type-title mt-3">Contact</h1>
        <p className="type-lead">
          Questions, collaborations, or press — send a message and we&apos;ll
          reply by email.
        </p>

        <div className="mt-12">
          <ContactForm
            contactEmail={siteConfig.contactEmail}
            location={location}
            socialLinks={socialLinks}
          />
        </div>
      </div>
    </main>
  );
}
