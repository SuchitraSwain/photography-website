import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { PrivacyPolicyView } from "@/components/legal/privacy-policy-view";
import { getContactEmail } from "@/lib/contact-email";

export const revalidate = 300;

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "privacy" });
  return {
    title: t("title"),
    description: t("metaDescription"),
  };
}

export default async function PrivacyPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const email = getContactEmail();
  const websiteUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "https://krishyam-production.de";

  return (
    <main className="px-6 py-16 sm:px-10 sm:py-20 lg:px-16">
      <PrivacyPolicyView
        businessName="Krishyam Production"
        email={email}
        websiteUrl={websiteUrl}
      />
    </main>
  );
}
