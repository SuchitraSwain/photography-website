import { FeaturedStrip } from "@/components/home/featured-strip";
import { Hero } from "@/components/home/hero";
import { IntroSection } from "@/components/home/intro-section";
import {
  getFeaturedGalleryImages,
  getSiteSettings,
} from "@/lib/sanity/fetch";

export default async function HomePage() {
  const [settings, featured] = await Promise.all([
    getSiteSettings(),
    getFeaturedGalleryImages(),
  ]);

  return (
    <main>
      <Hero
        brandName={settings.brandName}
        tagline={settings.tagline}
        images={settings.heroImages}
      />
      <IntroSection tagline={settings.tagline} />
      <FeaturedStrip images={featured} />
    </main>
  );
}
