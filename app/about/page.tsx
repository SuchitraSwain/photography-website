import type { Metadata } from "next";

import { AboutView } from "@/components/about/about-view";
import { getPageAbout } from "@/lib/sanity/fetch";

/** Refresh CMS-backed content every 5 minutes (see CONTENT_REVALIDATE_SECONDS). */
export const revalidate = 300;

export const metadata: Metadata = {
  title: "About",
  description:
    "Meet Sagar Zinzala and Suchitra Swain — the two friends behind ATELIER, a photography practice for weddings, portraits, and editorial work.",
};

export default async function AboutPage() {
  const about = await getPageAbout();

  return (
    <main className="px-4 py-16 md:px-8">
      <div className="mx-auto max-w-5xl">
        <p className="text-xs font-medium tracking-[0.24em] text-muted-foreground uppercase">
          The studio
        </p>
        <AboutView about={about} />
      </div>
    </main>
  );
}
