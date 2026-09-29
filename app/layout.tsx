import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/site-shell";
import { SmoothScrollProvider } from "@/components/motion/smooth-scroll";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { getSiteSettings } from "@/lib/content/fetch";
import { IBM_Plex_Mono, Inter, Inter_Tight } from "next/font/google";
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
  const { brandName, seo } = await getSiteSettings();

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: brandName,
      template: seo.titleTemplate,
    },
    description: seo.description,
    openGraph: {
      type: "website",
      locale: "en_US",
      siteName: brandName,
      title: brandName,
      description: seo.description,
    },
    twitter: {
      card: "summary_large_image",
      title: brandName,
      description: seo.description,
    },
  };
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning className="dark h-full">
      <body
        suppressHydrationWarning
        className={`${display.variable} ${body.variable} ${mono.variable} flex min-h-full flex-col font-sans antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <SmoothScrollProvider>
            <SiteShell>{children}</SiteShell>
          </SmoothScrollProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
