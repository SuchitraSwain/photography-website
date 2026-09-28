import { mockContent } from "@/lib/mock/content";
import { sanityClient } from "@/lib/sanity/client";
import { isSanityConfigured } from "@/lib/sanity/env";
import { urlFor } from "@/lib/sanity/image";
import {
  categoriesQuery,
  eventsQuery,
  featuredGalleryImagesQuery,
  galleryImagesQuery,
  pageAboutQuery,
  servicePackagesQuery,
  siteSettingsQuery,
} from "@/lib/sanity/queries";
import type {
  Category,
  EventItem,
  GalleryImage,
  PageAbout,
  ServicePackage,
  SiteSettings,
} from "@/lib/types/content";

type ImageSource = Parameters<typeof urlFor>[0];

type RawSiteSettings = Omit<SiteSettings, "heroImages" | "seo"> & {
  heroImages: Array<{
    alt: string;
    image: ImageSource;
    lqip?: string;
  }>;
  seoDefaults: SiteSettings["seo"];
};

type RawGalleryImage = Omit<GalleryImage, "src"> & {
  image: ImageSource;
};

type RawEvent = Omit<EventItem, "imageSrc"> & {
  image?: ImageSource;
};

type PortableTextBlock = {
  children?: Array<{ text?: string }>;
};

type RawPageAbout = Omit<PageAbout, "bio" | "portraitSrc"> & {
  bio: PortableTextBlock[];
  portrait: ImageSource;
};

async function fetchContent<TData, TResult>(
  query: string,
  fallback: TResult,
  map: (data: TData) => TResult,
): Promise<TResult> {
  if (!isSanityConfigured()) {
    return fallback;
  }

  try {
    const data = await sanityClient.fetch<TData | null>(query);
    return data === null ? fallback : map(data);
  } catch {
    return fallback;
  }
}

const identity = <T>(value: T): T => value;

export function getSiteSettings(): Promise<SiteSettings> {
  return fetchContent(
    siteSettingsQuery,
    mockContent.siteSettings,
    ({ heroImages, seoDefaults, ...settings }: RawSiteSettings) => ({
      ...settings,
      heroImages: heroImages.map(({ alt, image, lqip }) => ({
        src: urlFor(image),
        alt,
        lqip,
      })),
      seo: seoDefaults,
    }),
  );
}

export function getCategories(): Promise<Category[]> {
  return fetchContent(
    categoriesQuery,
    mockContent.categories,
    identity<Category[]>,
  );
}

function mapGalleryImages(images: RawGalleryImage[]): GalleryImage[] {
  return images.map(({ image, ...galleryImage }) => ({
    ...galleryImage,
    src: urlFor(image),
  }));
}

export function getGalleryImages(): Promise<GalleryImage[]> {
  return fetchContent(
    galleryImagesQuery,
    mockContent.galleryImages,
    mapGalleryImages,
  );
}

export function getFeaturedGalleryImages(): Promise<GalleryImage[]> {
  return fetchContent(
    featuredGalleryImagesQuery,
    mockContent.galleryImages.filter((image) => image.featured),
    mapGalleryImages,
  );
}

export function getEvents(): Promise<EventItem[]> {
  return fetchContent(eventsQuery, mockContent.events, (events: RawEvent[]) =>
    events.map(({ image, ...event }) => ({
      ...event,
      imageSrc: image ? urlFor(image) : undefined,
    })),
  );
}

export function getServicePackages(): Promise<ServicePackage[]> {
  return fetchContent(
    servicePackagesQuery,
    mockContent.packages,
    identity<ServicePackage[]>,
  );
}

export function getPageAbout(): Promise<PageAbout> {
  return fetchContent(
    pageAboutQuery,
    mockContent.about,
    ({ bio, portrait, ...about }: RawPageAbout) => ({
      ...about,
      bio: bio
        .map((block) =>
          (block.children ?? []).map((span) => span.text ?? "").join(""),
        )
        .join("\n\n"),
      portraitSrc: urlFor(portrait),
    }),
  );
}
