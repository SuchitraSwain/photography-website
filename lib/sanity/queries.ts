import { defineQuery } from "next-sanity";

export const siteSettingsQuery = defineQuery(`
  *[_type == "siteSettings"][0] {
    brandName,
    tagline,
    heroImages[] {
      alt,
      "image": @,
      "lqip": asset->metadata.lqip
    },
    socialLinks[] { label, url },
    location,
    contactEmail,
    seo {
      titleTemplate,
      description,
      "ogImage": ogImage.asset->url
    }
  }
`);

export const categoriesQuery = defineQuery(`
  *[_type == "category"] | order(order asc) {
    _id,
    title,
    "slug": slug.current,
    order
  }
`);

export const galleryImagesQuery = defineQuery(`
  *[_type == "galleryImage"] | order(order asc) {
    _id,
    title,
    alt,
    image,
    "lqip": image.asset->metadata.lqip,
    "width": image.asset->metadata.dimensions.width,
    "height": image.asset->metadata.dimensions.height,
    "categorySlug": category->slug.current,
    featured,
    order
  }
`);

export const featuredGalleryImagesQuery = defineQuery(`
  *[_type == "galleryImage" && featured == true] | order(order asc) {
    _id,
    title,
    alt,
    image,
    "lqip": image.asset->metadata.lqip,
    "width": image.asset->metadata.dimensions.width,
    "height": image.asset->metadata.dimensions.height,
    "categorySlug": category->slug.current,
    featured,
    order
  }
`);

export const eventsQuery = defineQuery(`
  *[_type == "event"] | order(start asc) {
    _id,
    title,
    "slug": slug.current,
    start,
    end,
    location,
    description,
    image,
    imageAlt,
    addToCalendar
  }
`);

export const servicePackagesQuery = defineQuery(`
  *[_type == "servicePackage"] | order(order asc) {
    _id,
    name,
    priceLabel,
    description,
    includes,
    addOns,
    featured,
    order
  }
`);

export const pageAboutQuery = defineQuery(`
  *[_type == "pageAbout"][0] {
    headline,
    bio,
    philosophy,
    portrait,
    portraitAlt,
    press[] { title, outlet, url, year }
  }
`);
