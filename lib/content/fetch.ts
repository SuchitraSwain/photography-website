import type { AppLocale } from "@/i18n/routing";
import { resolveLocale } from "@/lib/i18n/locale";
import { mockContent } from "@/lib/mock/content";
import {
  mockAboutDe,
  mockCategoriesDe,
  mockEventsDe,
  mockPackagesDe,
  mockSiteSettingsDe,
} from "@/lib/mock/content-de";
import { isDatabaseConfigured, prisma } from "@/lib/db";
import type {
  Category,
  EventItem,
  GalleryImage,
  PageAbout,
  ServicePackage,
  SiteSettings,
} from "@/lib/types/content";

/** Keep in sync with `export const revalidate` on content routes. */
export const CONTENT_REVALIDATE_SECONDS = 300;

function mapDbGalleryImage(row: {
  id: string;
  title: string;
  alt: string;
  url: string;
  width: number;
  height: number;
  categorySlug: string;
  featured: boolean;
  sortOrder: number;
}): GalleryImage {
  return {
    _id: row.id,
    title: row.title,
    alt: row.alt || row.title,
    src: row.url,
    width: row.width,
    height: row.height,
    categorySlug: row.categorySlug,
    featured: row.featured,
    order: row.sortOrder,
  };
}

async function loadPublishedGalleryImages(): Promise<GalleryImage[] | null> {
  if (!isDatabaseConfigured()) {
    return null;
  }

  try {
    const rows = await prisma.galleryImage.findMany({
      where: { published: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });
    if (rows.length === 0) {
      return null;
    }
    return rows.map(mapDbGalleryImage);
  } catch (error) {
    console.error("[content] Gallery fetch failed; serving mocks.", error);
    return null;
  }
}

/** Wide hero plates prepared for full-bleed framing. */
const HERO_WIDE_PLATES = [
  {
    src: "/images/hero/hero-01.jpg",
    alt: "Guest in traditional attire at a celebration",
    width: 3712,
    height: 2088,
  },
  {
    src: "/images/hero/hero-02.jpg",
    alt: "Live performance moment from an event",
    width: 3712,
    height: 2088,
  },
  {
    src: "/images/hero/hero-03.jpg",
    alt: "Vocalist performing on stage",
    width: 3712,
    height: 2088,
  },
  {
    src: "/images/hero/hero-04.jpg",
    alt: "Celebration crowd energy",
    width: 3712,
    height: 2088,
  },
  {
    src: "/images/hero/hero-05.jpg",
    alt: "DJ performing behind the decks",
    width: 3840,
    height: 2560,
  },
  {
    src: "/images/hero/hero-06.jpg",
    alt: "Party atmosphere on the dance floor",
    width: 3840,
    height: 2885,
  },
  {
    src: "/images/hero/hero-07.jpg",
    alt: "DJ set under club lights",
    width: 3840,
    height: 2560,
  },
  {
    src: "/images/hero/hero-08.jpg",
    alt: "Night event atmosphere",
    width: 3840,
    height: 2560,
  },
] as const;

function isLandscape(width: number, height: number) {
  return width > 0 && height > 0 && width / height >= 1.25;
}

function localizedSiteSettings(locale: AppLocale): SiteSettings {
  return locale === "de" ? mockSiteSettingsDe : mockContent.siteSettings;
}

export async function getSiteSettings(
  locale?: string | null,
): Promise<SiteSettings> {
  const resolved = resolveLocale(locale);
  const { getContactEmail } = await import("@/lib/contact-email");
  const contactEmail = getContactEmail();
  const settings = localizedSiteSettings(resolved);
  const gallery = await getGalleryImages();

  // Hero carousel: landscape only, skip the portraits category (events/parties/djs/etc. stay).
  const landscapeGallery = gallery
    .filter(
      (image) =>
        image.categorySlug !== "portraits" &&
        isLandscape(image.width, image.height),
    )
    .map((image) => ({
      src: image.src,
      alt: image.alt,
      lqip: image.lqip,
      width: image.width,
      height: image.height,
    }));

  const plateSrc = new Set<string>(HERO_WIDE_PLATES.map((plate) => plate.src));
  const heroImages = [
    ...HERO_WIDE_PLATES.map((plate) => ({ ...plate })),
    ...landscapeGallery.filter((image) => !plateSrc.has(image.src)),
  ];

  return {
    ...settings,
    heroImages:
      heroImages.length > 0
        ? heroImages
        : HERO_WIDE_PLATES.map((plate) => ({ ...plate })),
    contactEmail,
    socialLinks: settings.socialLinks.map((link) =>
      ["email", "e-mail"].includes(link.label.toLowerCase())
        ? { ...link, url: `mailto:${contactEmail}` }
        : link,
    ),
  };
}

export async function getCategories(
  locale?: string | null,
): Promise<Category[]> {
  return resolveLocale(locale) === "de"
    ? mockCategoriesDe
    : mockContent.categories;
}

export async function getGalleryImages(): Promise<GalleryImage[]> {
  const fromDb = await loadPublishedGalleryImages();
  return fromDb ?? mockContent.galleryImages;
}

/** Full published gallery pool for the homepage Featured Work shuffle. */
export async function getFeaturedGalleryImages(): Promise<GalleryImage[]> {
  return getGalleryImages();
}

export async function getEvents(locale?: string | null): Promise<EventItem[]> {
  return resolveLocale(locale) === "de" ? mockEventsDe : mockContent.events;
}

export async function getServicePackages(
  locale?: string | null,
): Promise<ServicePackage[]> {
  return resolveLocale(locale) === "de"
    ? mockPackagesDe
    : mockContent.packages;
}

export async function getPageAbout(
  locale?: string | null,
): Promise<PageAbout> {
  return resolveLocale(locale) === "de" ? mockAboutDe : mockContent.about;
}

export const GALLERY_CATEGORY_SLUGS = mockContent.categories.map((c) => c.slug);
