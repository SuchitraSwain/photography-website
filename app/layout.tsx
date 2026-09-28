import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
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

export const metadata: Metadata = {
  title: {
    default: "ATELIER",
    template: "%s · ATELIER",
  },
  description:
    "ATELIER is a photography studio specializing in weddings, portraits, events, and editorial work.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning className="dark h-full">
      <body
        className={`${display.variable} ${GeistSans.variable} flex min-h-full flex-col font-sans antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <SiteHeader brandName={mockSiteSettings.brandName} />
          {children}
          <SiteFooter
            brandName={mockSiteSettings.brandName}
            socialLinks={mockSiteSettings.socialLinks}
            location={mockSiteSettings.location}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
