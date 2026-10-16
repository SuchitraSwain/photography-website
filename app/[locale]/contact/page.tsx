import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { ContactForm } from "@/components/contact/contact-form";
import { getSiteSettings } from "@/lib/content/fetch";
import { getContactEmail } from "@/lib/contact-email";

/** Refresh CMS-backed content every 5 minutes (see CONTENT_REVALIDATE_SECONDS). */
export const revalidate = 300;

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });
  return {
    title: t("title"),
    description: t("metaDescription"),
  };
}

export default async function ContactPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contact");
  const { location, socialLinks } = await getSiteSettings(locale);
  const contactEmail = getContactEmail();

  return (
    <main className="px-4 py-16 md:px-8">
      <div className="mx-auto max-w-5xl">
        <p className="type-label">{t("eyebrow")}</p>
        <h1 className="type-title mt-3">{t("title")}</h1>
        <p className="type-lead">{t("lead")}</p>

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
