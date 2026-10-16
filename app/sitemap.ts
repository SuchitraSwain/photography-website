import type { MetadataRoute } from "next";

import { routing } from "@/i18n/routing";

const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

function localePath(locale: string, path: string) {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (locale === routing.defaultLocale) {
    return normalized === "/" ? "" : normalized;
  }
  return `/${locale}${normalized === "/" ? "" : normalized}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "",
    "/gallery",
    "/events",
    "/about",
    "/services",
    "/booking",
    "/contact",
    "/privacy",
  ];

  return routing.locales.flatMap((locale) =>
    paths.map((path) => {
      const suffix = localePath(locale, path || "/");
      return {
        url: `${base}${suffix || "/"}`,
        lastModified: new Date(),
        alternates: {
          languages: Object.fromEntries(
            routing.locales.map((alt) => [
              alt,
              `${base}${localePath(alt, path || "/") || "/"}`,
            ]),
          ),
        },
      };
    }),
  );
}
