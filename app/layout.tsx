import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/site-shell";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { mockSiteSettings } from "@/lib/mock/content";
import { GeistSans } from "geist/font/sans";
import { Cormorant_Garamond } from "next/font/google";
import "./globals.css";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: mockSiteSettings.brandName,
    template: mockSiteSettings.seo.titleTemplate,
  },
  description: mockSiteSettings.seo.description,
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: mockSiteSettings.brandName,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning className="dark h-full">
      <body
        className={`${display.variable} ${GeistSans.variable} flex min-h-full flex-col font-sans antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <SiteShell>{children}</SiteShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
