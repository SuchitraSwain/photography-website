import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { ClientLogos } from "@/components/home/client-logos";
import { CtaBand } from "@/components/home/cta-band";
import { FeaturedStrip } from "@/components/home/featured-strip";
import { Hero } from "@/components/home/hero";
import { IntroSection } from "@/components/home/intro-section";
import { Testimonials } from "@/components/home/testimonials";
import { LocalBusinessJsonLd } from "@/components/seo/json-ld";
import {
  getFeaturedGalleryImages,
  getSiteSettings,
} from "@/lib/content/fetch";

/** Refresh CMS-backed content every 5 minutes (see CONTENT_REVALIDATE_SECONDS). */
export const revalidate = 300;

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });
  const settings = await getSiteSettings(locale);
  return {
    title: {
      absolute: `${settings.brandName} · ${t("metaTitle")}`,
    },
    description: t("metaDescription"),
    openGraph: {
      title: settings.brandName,
      description: settings.seo.description,
    },
    twitter: {
      card: "summary_large_image",
      title: settings.brandName,
      description: settings.seo.description,
    },
  };
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [settings, featured] = await Promise.all([
    getSiteSettings(locale),
    getFeaturedGalleryImages(),
  ]);

  return (
    <main>
      <LocalBusinessJsonLd
        name={settings.brandName}
        description={settings.seo.description}
        email={settings.contactEmail}
        location={settings.location}
      />
      <Hero
        brandName={settings.brandName}
        tagline={settings.tagline}
        images={settings.heroImages}
      />
      <IntroSection tagline={settings.tagline} />
      <Testimonials />
      <FeaturedStrip images={featured} />
      <ClientLogos />
      <CtaBand />
    </main>
  );
}
