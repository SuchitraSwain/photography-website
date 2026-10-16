export type SocialLink = {
  label: string;
  url: string;
};

export type SiteSettings = {
  brandName: string;
  tagline: string;
  heroImages: Array<{
    src: string;
    alt: string;
    lqip?: string;
    width?: number;
    height?: number;
  }>;
  socialLinks: SocialLink[];
  location: string;
  contactEmail: string;
  seo: {
    titleTemplate: string;
    description: string;
    ogImage?: string;
  };
};

export type Category = {
  _id: string;
  title: string;
  slug: string;
  order: number;
};

export type GalleryImage = {
  _id: string;
  title: string;
  alt: string;
  src: string;
  lqip?: string;
  width: number;
  height: number;
  categorySlug: string;
  featured: boolean;
  shootDate?: string;
  order: number;
};

export type EventItem = {
  _id: string;
  title: string;
  slug: string;
  start: string; // ISO
  end: string; // ISO
  location: string;
  description: string;
  imageSrc?: string;
  imageAlt?: string;
  /** External tickets / details page */
  ticketUrl?: string;
  ticketLabel?: string;
  addToCalendar: boolean;
};

export type ServicePackage = {
  _id: string;
  name: string;
  priceLabel: string;
  description: string;
  includes: string[];
  addOns: string[];
  featured: boolean;
  order: number;
};

export type PressItem = {
  title: string;
  outlet: string;
  url: string;
  year: string;
};

export type AboutBelief = {
  title: string;
  body: string;
};

export type PageAbout = {
  eyebrow: string;
  headline: string;
  subhead: string;
  /** Paragraphs separated by blank lines */
  bio: string;
  storyHeadline: string;
  storyBody: string;
  philosophyHeadline: string;
  philosophyIntro: string;
  beliefs: AboutBelief[];
  whatWeCreate: string;
  ctaHeadline: string;
  ctaBody: string;
  portraitSrc: string;
  portraitAlt: string;
  press: PressItem[];
};
