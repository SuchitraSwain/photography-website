import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { AboutView } from "@/components/about/about-view";
import { FoundersSection } from "@/components/about/founders-section";
import { getPageAbout } from "@/lib/content/fetch";

/** Refresh CMS-backed content every 5 minutes (see CONTENT_REVALIDATE_SECONDS). */
export const revalidate = 300;

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  const nav = await getTranslations({ locale, namespace: "nav" });
  return {
    title: nav("about"),
    description: t("metaDescription"),
  };
}

export default async function AboutPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const about = await getPageAbout(locale);

  return (
    <main className="px-4 py-16 md:px-8 md:py-20">
      <div className="mx-auto max-w-6xl">
        <AboutView about={about} />
        <FoundersSection />
      </div>
    </main>
  );
}
