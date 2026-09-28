import type { Metadata } from "next";

import { ContactForm } from "@/components/contact/contact-form";
import { getSiteSettings } from "@/lib/sanity/fetch";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Reach ATELIER for collaborations, press, and general questions — studio location and social links.",
};

export default async function ContactPage() {
  const { contactEmail, location, socialLinks } = await getSiteSettings();

  return (
    <main className="px-4 py-16 md:px-8">
      <div className="mx-auto max-w-5xl">
        <p className="text-xs font-medium tracking-[0.24em] text-muted-foreground uppercase">
          Reach out
        </p>
        <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl font-medium tracking-tight md:text-6xl">
          Contact
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground">
          Questions, collaborations, or press—use the form shape below. Until
          messaging goes live, email is the fastest way to reach us.
        </p>

        <div className="mt-12">
          <ContactForm
            contactEmail={contactEmail}
            location={location}
            socialLinks={socialLinks}
          />
        </div>
      </div>
    </main>
  );
}
