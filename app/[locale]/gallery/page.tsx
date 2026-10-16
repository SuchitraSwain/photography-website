import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { GalleryView } from "@/components/gallery/gallery-view";
import { getCategories, getGalleryImages } from "@/lib/content/fetch";

/** Refresh CMS-backed content every 5 minutes (see CONTENT_REVALIDATE_SECONDS). */
export const revalidate = 300;

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "gallery" });
  return {
    title: t("title"),
    description: t("metaDescription"),
  };
}

export default async function GalleryPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("gallery");
  const [categories, images] = await Promise.all([
    getCategories(locale),
    getGalleryImages(),
  ]);

  return (
    <main className="px-4 py-16 md:px-8">
      <div className="mx-auto max-w-7xl">
        <p className="type-label">{t("eyebrow")}</p>
        <h1 className="type-title mt-3">{t("title")}</h1>
        <GalleryView categories={categories} images={images} />
      </div>
    </main>
  );
}
