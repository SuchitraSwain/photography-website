import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { ServicesView } from "@/components/services/services-view";
import { getServicePackages } from "@/lib/content/fetch";
import type { ServicePackage } from "@/lib/types/content";

/** Refresh CMS-backed content every 5 minutes (see CONTENT_REVALIDATE_SECONDS). */
export const revalidate = 300;

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "services" });
  const nav = await getTranslations({ locale, namespace: "nav" });
  return {
    title: nav("services"),
    description: t("metaDescription"),
  };
}

function sortPackages(packages: ServicePackage[]): ServicePackage[] {
  return [...packages].sort((a, b) => a.order - b.order);
}

export default async function ServicesPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const packages = sortPackages(await getServicePackages(locale));

  return (
    <main className="relative px-6 py-20 sm:px-10 sm:py-28 lg:px-16">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(ellipse_at_top_right,hsl(var(--accent)/0.12),transparent_55%)]"
      />
      <div className="relative mx-auto max-w-[100rem]">
        <ServicesView packages={packages} />
      </div>
    </main>
  );
}
