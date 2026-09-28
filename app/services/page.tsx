import type { Metadata } from "next";

import { ServicesView } from "@/components/services/services-view";
import { getServicePackages } from "@/lib/sanity/fetch";
import type { ServicePackage } from "@/lib/types/content";

/** Refresh CMS-backed content every 5 minutes (see CONTENT_REVALIDATE_SECONDS). */
export const revalidate = 300;

export const metadata: Metadata = {
  title: "Services",
  description:
    "ATELIER photography packages for portraits, full wedding days, and brand events — inclusions, add-ons, and pricing.",
};

function sortPackages(packages: ServicePackage[]): ServicePackage[] {
  return [...packages].sort((a, b) => a.order - b.order);
}

export default async function ServicesPage() {
  const packages = sortPackages(await getServicePackages());

  return (
    <main className="px-4 py-16 md:px-8">
      <div className="mx-auto max-w-5xl">
        <ServicesView packages={packages} />
      </div>
    </main>
  );
}
