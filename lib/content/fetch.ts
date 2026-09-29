import { mockContent } from "@/lib/mock/content";
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

export async function getSiteSettings(): Promise<SiteSettings> {
  const { getContactEmail } = await import("@/lib/contact-email");
  const contactEmail = getContactEmail();
  const settings = mockContent.siteSettings;

  return {
    ...settings,
    contactEmail,
    socialLinks: settings.socialLinks.map((link) =>
      link.label.toLowerCase() === "email"
        ? { ...link, url: `mailto:${contactEmail}` }
        : link,
    ),
  };
}

export async function getCategories(): Promise<Category[]> {
  return mockContent.categories;
}

export async function getGalleryImages(): Promise<GalleryImage[]> {
  const fromDb = await loadPublishedGalleryImages();
  return fromDb ?? mockContent.galleryImages;
}

export async function getFeaturedGalleryImages(): Promise<GalleryImage[]> {
  const fromDb = await loadPublishedGalleryImages();
  if (fromDb) {
    const featured = fromDb.filter((image) => image.featured);
    return featured.length > 0 ? featured : fromDb.slice(0, 6);
  }
  return mockContent.galleryImages.filter((image) => image.featured);
}

export async function getEvents(): Promise<EventItem[]> {
  return mockContent.events;
}

export async function getServicePackages(): Promise<ServicePackage[]> {
  return mockContent.packages;
}

export async function getPageAbout(): Promise<PageAbout> {
  return mockContent.about;
}

export const GALLERY_CATEGORY_SLUGS = mockContent.categories.map((c) => c.slug);
