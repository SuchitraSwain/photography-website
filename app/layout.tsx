import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { IBM_Plex_Mono, Inter, Inter_Tight } from "next/font/google";

import { SmoothScrollProvider } from "@/components/motion/smooth-scroll";
import { getSiteSettings } from "@/lib/content/fetch";
import { openGraphLocale, resolveLocale } from "@/lib/i18n/locale";
import "./globals.css";

const display = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700", "800"],
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "600"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

/** Refresh CMS-backed content every 5 minutes (see CONTENT_REVALIDATE_SECONDS). */
export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  let locale = "en";
  try {
    locale = await getLocale();
  } catch {
    locale = "en";
  }
  const resolved = resolveLocale(locale);
  const { brandName, seo } = await getSiteSettings(resolved);

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: brandName,
      template: seo.titleTemplate,
    },
    description: seo.description,
    openGraph: {
      type: "website",
      locale: openGraphLocale(resolved),
      siteName: brandName,
      title: brandName,
      description: seo.description,
    },
    twitter: {
      card: "summary_large_image",
      title: brandName,
      description: seo.description,
    },
    alternates: {
      languages: {
        en: "/",
        de: "/de",
      },
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let locale = "en";
  try {
    locale = await getLocale();
  } catch {
    locale = "en";
  }

  return (
    <html lang={locale} suppressHydrationWarning className="dark h-full">
      <body
        suppressHydrationWarning
        className={`${display.variable} ${body.variable} ${mono.variable} flex min-h-full flex-col font-sans antialiased`}
      >
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  );
}
