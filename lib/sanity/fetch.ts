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
  PressItem,
  ServicePackage,
  SiteSettings,
  SocialLink,
} from "@/lib/types/content";

/**
 * Seconds before cached CMS responses are refreshed. Route segments declare the
 * same window with `export const revalidate = 300`; keep the two in sync.
 */
export const CONTENT_REVALIDATE_SECONDS = 300;

type ImageSource = Parameters<typeof urlFor>[0];

type Maybe<T> = T | null | undefined;

/** Sanity returns null for any unpopulated field, so every raw shape is optional. */
type RawSiteSettings = {
  brandName?: Maybe<string>;
  tagline?: Maybe<string>;
  heroImages?: Maybe<
    Array<
      Maybe<{
        alt?: Maybe<string>;
        image?: Maybe<ImageSource>;
        lqip?: Maybe<string>;
      }>
    >
  >;
  socialLinks?: Maybe<Array<Maybe<{ label?: Maybe<string>; url?: Maybe<string> }>>>;
  location?: Maybe<string>;
  contactEmail?: Maybe<string>;
  seoDefaults?: Maybe<{
    titleTemplate?: Maybe<string>;
    description?: Maybe<string>;
    ogImage?: Maybe<string>;
  }>;
};

type RawCategory = {
  _id?: Maybe<string>;
  title?: Maybe<string>;
  slug?: Maybe<string>;
  order?: Maybe<number>;
};

type RawGalleryImage = {
  _id?: Maybe<string>;
  title?: Maybe<string>;
  alt?: Maybe<string>;
  image?: Maybe<ImageSource>;
  lqip?: Maybe<string>;
  width?: Maybe<number>;
  height?: Maybe<number>;
  categorySlug?: Maybe<string>;
  featured?: Maybe<boolean>;
  shootDate?: Maybe<string>;
  order?: Maybe<number>;
};

type RawEvent = {
  _id?: Maybe<string>;
  title?: Maybe<string>;
  slug?: Maybe<string>;
  start?: Maybe<string>;
  end?: Maybe<string>;
  location?: Maybe<string>;
  description?: Maybe<string>;
  image?: Maybe<ImageSource>;
  imageAlt?: Maybe<string>;
  addToCalendar?: Maybe<boolean>;
};

type RawServicePackage = {
  _id?: Maybe<string>;
  name?: Maybe<string>;
  priceLabel?: Maybe<string>;
  description?: Maybe<string>;
  includes?: Maybe<Array<Maybe<string>>>;
  addOns?: Maybe<Array<Maybe<string>>>;
  featured?: Maybe<boolean>;
  order?: Maybe<number>;
};

type PortableTextBlock = {
  children?: Maybe<Array<Maybe<{ text?: Maybe<string> }>>>;
};

type RawPageAbout = {
  headline?: Maybe<string>;
  bio?: Maybe<Array<Maybe<PortableTextBlock>>>;
  philosophy?: Maybe<string>;
  portrait?: Maybe<ImageSource>;
  portraitAlt?: Maybe<string>;
  press?: Maybe<
    Array<
      Maybe<{
        title?: Maybe<string>;
        outlet?: Maybe<string>;
        url?: Maybe<string>;
        year?: Maybe<string>;
      }>
    >
  >;
};

/** Drops null entries that GROQ projections can leave inside arrays. */
function compact<T>(values: Maybe<Array<Maybe<T>>>): T[] {
  return (values ?? []).filter((value): value is T => value != null);
}

async function fetchContent<TData, TResult>(
  query: string,
  fallback: TResult,
  map: (data: TData) => TResult,
): Promise<TResult> {
  if (!isSanityConfigured()) {
    return fallback;
  }

  try {
    const data = await sanityClient.fetch<TData | null>(
      query,
      {},
      { next: { revalidate: CONTENT_REVALIDATE_SECONDS } },
    );
    return data == null ? fallback : map(data);
  } catch (error) {
    console.error(
      "[sanity] Content fetch failed; serving fallback content.",
      { query },
      error,
    );
    return fallback;
  }
}

function mapSiteSettings(raw: RawSiteSettings): SiteSettings {
  const fallback = mockContent.siteSettings;

  const heroImages = compact(raw.heroImages).flatMap((hero) =>
    hero.image
      ? [
          {
            src: urlFor(hero.image, { width: 2400 }),
            alt: hero.alt ?? "",
            ...(hero.lqip ? { lqip: hero.lqip } : {}),
          },
        ]
      : [],
  );

  const socialLinks: SocialLink[] = compact(raw.socialLinks).flatMap((link) =>
    link.url ? [{ label: link.label ?? link.url, url: link.url }] : [],
  );

  return {
    brandName: raw.brandName ?? fallback.brandName,
    tagline: raw.tagline ?? "",
    heroImages,
    socialLinks,
    location: raw.location ?? "",
    contactEmail: raw.contactEmail ?? fallback.contactEmail,
    seo: {
      titleTemplate: raw.seoDefaults?.titleTemplate ?? fallback.seo.titleTemplate,
      description: raw.seoDefaults?.description ?? fallback.seo.description,
      ...(raw.seoDefaults?.ogImage ? { ogImage: raw.seoDefaults.ogImage } : {}),
    },
  };
}

export function getSiteSettings(): Promise<SiteSettings> {
  return fetchContent(siteSettingsQuery, mockContent.siteSettings, mapSiteSettings);
}

export function getCategories(): Promise<Category[]> {
  return fetchContent(
    categoriesQuery,
    mockContent.categories,
    (categories: Maybe<RawCategory[]>) =>
      compact(categories).flatMap((category, index) =>
        category.slug
          ? [
              {
                _id: category._id ?? category.slug,
                title: category.title ?? category.slug,
                slug: category.slug,
                order: category.order ?? index,
              },
            ]
          : [],
      ),
  );
}

function mapGalleryImages(images: Maybe<RawGalleryImage[]>): GalleryImage[] {
  return compact(images).flatMap((image, index) => {
    if (!image.image || !image.categorySlug) {
      return [];
    }

    return [
      {
        _id: image._id ?? `gallery-${index}`,
        title: image.title ?? "",
        alt: image.alt ?? image.title ?? "",
        src: urlFor(image.image, { width: 1600 }),
        ...(image.lqip ? { lqip: image.lqip } : {}),
        width: image.width ?? 1600,
        height: image.height ?? 1200,
        categorySlug: image.categorySlug,
        featured: image.featured ?? false,
        ...(image.shootDate ? { shootDate: image.shootDate } : {}),
        order: image.order ?? index,
      },
    ];
  });
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
  return fetchContent(
    eventsQuery,
    mockContent.events,
    (events: Maybe<RawEvent[]>) =>
      compact(events).flatMap((event, index) => {
        // An event without a start instant cannot be rendered or exported.
        if (!event.start) {
          return [];
        }

        return [
          {
            _id: event._id ?? `event-${index}`,
            title: event.title ?? "",
            slug: event.slug ?? "",
            start: event.start,
            end: event.end ?? event.start,
            location: event.location ?? "",
            description: event.description ?? "",
            ...(event.image
              ? { imageSrc: urlFor(event.image, { width: 1200 }) }
              : {}),
            ...(event.imageAlt ? { imageAlt: event.imageAlt } : {}),
            addToCalendar: event.addToCalendar ?? false,
          },
        ];
      }),
  );
}

export function getServicePackages(): Promise<ServicePackage[]> {
  return fetchContent(
    servicePackagesQuery,
    mockContent.packages,
    (packages: Maybe<RawServicePackage[]>) =>
      compact(packages).map((pkg, index) => ({
        _id: pkg._id ?? `package-${index}`,
        name: pkg.name ?? "",
        priceLabel: pkg.priceLabel ?? "",
        description: pkg.description ?? "",
        includes: compact(pkg.includes),
        addOns: compact(pkg.addOns),
        featured: pkg.featured ?? false,
        order: pkg.order ?? index,
      })),
  );
}

export function getPageAbout(): Promise<PageAbout> {
  return fetchContent(pageAboutQuery, mockContent.about, (raw: RawPageAbout) => {
    const fallback = mockContent.about;
    const press: PressItem[] = compact(raw.press).flatMap((item) =>
      item.url
        ? [
            {
              title: item.title ?? item.url,
              outlet: item.outlet ?? "",
              url: item.url,
              year: item.year ?? "",
            },
          ]
        : [],
    );

    return {
      headline: raw.headline ?? fallback.headline,
      bio: compact(raw.bio)
        .map((block) =>
          compact(block.children)
            .map((span) => span.text ?? "")
            .join(""),
        )
        .filter(Boolean)
        .join("\n\n"),
      philosophy: raw.philosophy ?? "",
      portraitSrc: raw.portrait
        ? urlFor(raw.portrait, { width: 1200 })
        : fallback.portraitSrc,
      portraitAlt: raw.portraitAlt ?? "",
      press,
    };
  });
}
