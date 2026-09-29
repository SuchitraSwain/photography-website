import type { Metadata } from "next";

import { AboutView } from "@/components/about/about-view";
import { FoundersSection } from "@/components/about/founders-section";
import { getPageAbout } from "@/lib/content/fetch";

/** Refresh CMS-backed content every 5 minutes (see CONTENT_REVALIDATE_SECONDS). */
export const revalidate = 300;

export const metadata: Metadata = {
  title: "About",
  description:
    "Meet Sagar Zinzala and Suchitra Swain — engineers turned photographers behind ATELIER.",
};

export default async function AboutPage() {
  const about = await getPageAbout();

  return (
    <main className="px-4 py-16 md:px-8">
      <div className="mx-auto max-w-5xl">
        <p className="text-xs font-medium tracking-[0.24em] text-muted-foreground uppercase">
          The studio
        </p>
        <div className="mt-3">
          <AboutView about={about} />
        </div>
        <FoundersSection />
      </div>
    </main>
  );
}
