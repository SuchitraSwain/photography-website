import type { Metadata } from "next";

import { PackageCard } from "@/components/services/package-card";
import { getServicePackages } from "@/lib/sanity/fetch";
import type { ServicePackage } from "@/lib/types/content";

/** Refresh CMS-backed content every 5 minutes (see CONTENT_REVALIDATE_SECONDS). */
export const revalidate = 300;

export const metadata: Metadata = {
  title: "Services",
  description:
    "Portrait, wedding, and event photography packages — what's included, optional add-ons, and transparent pricing.",
};

function sortPackages(packages: ServicePackage[]): ServicePackage[] {
  return [...packages].sort((a, b) => a.order - b.order);
}

export default async function ServicesPage() {
  const packages = sortPackages(await getServicePackages());

  return (
    <main className="px-4 py-16 md:px-8">
      <div className="mx-auto max-w-5xl">
        <p className="text-xs font-medium tracking-[0.24em] text-muted-foreground uppercase">
          Packages
        </p>
        <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl font-medium tracking-tight md:text-6xl">
          Services
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground">
          Clear offerings for portraits, full wedding days, and brand events.
          Every package can be tailored—reach out when you are ready to plan.
        </p>

        <div className="mt-16 flex flex-col gap-8">
          {packages.map((pkg) => (
            <PackageCard key={pkg._id} pkg={pkg} />
          ))}
        </div>
      </div>
    </main>
  );
}
