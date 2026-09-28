import { CustomCursor } from "@/components/effects/custom-cursor";
import { FilmGrain } from "@/components/effects/film-grain";
import { ScrollProgress } from "@/components/effects/scroll-progress";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { getSiteSettings } from "@/lib/sanity/fetch";

export async function SiteShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();

  return (
    <>
      <ScrollProgress />
      <FilmGrain />
      <CustomCursor />
      <SiteHeader brandName={settings.brandName} />
      {children}
      <SiteFooter settings={settings} />
    </>
  );
}
