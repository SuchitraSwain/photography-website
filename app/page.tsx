import type { Metadata } from "next";

import { CtaBand } from "@/components/home/cta-band";
import { FeaturedStrip } from "@/components/home/featured-strip";
import { Hero } from "@/components/home/hero";
import { IntroSection } from "@/components/home/intro-section";
import { StatsStrip } from "@/components/home/stats-strip";
import { Testimonials } from "@/components/home/testimonials";
import { LocalBusinessJsonLd } from "@/components/seo/json-ld";
import {
  getFeaturedGalleryImages,
  getSiteSettings,
} from "@/lib/sanity/fetch";

/** Refresh CMS-backed content every 5 minutes (see CONTENT_REVALIDATE_SECONDS). */
export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: {
      absolute: `${settings.brandName} · Wedding, Portrait & Editorial Photography`,
    },
    description:
      "Editorial photography for weddings, portraits, and events — composed with natural light and unhurried storytelling.",
    openGraph: {
      title: settings.brandName,
      description: settings.seo.description,
      ...(settings.seo.ogImage
        ? { images: [{ url: settings.seo.ogImage }] }
        : {}),
    },
  };
}

export default async function HomePage() {
  const [settings, featured] = await Promise.all([
    getSiteSettings(),
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
      <StatsStrip />
      <Testimonials />
      <FeaturedStrip images={featured} />
      <CtaBand />
    </main>
  );
}
