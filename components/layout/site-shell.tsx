import { CustomCursor } from "@/components/effects/custom-cursor";
import { ScrollProgress } from "@/components/effects/scroll-progress";
import { SiteAtmosphere } from "@/components/layout/site-atmosphere";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { getSiteSettings } from "@/lib/content/fetch";

export async function SiteShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();

  return (
    <>
      <SiteAtmosphere />
      <ScrollProgress />
      <CustomCursor />
      <div className="site-content flex min-h-full flex-1 flex-col">
        <SiteHeader brandName={settings.brandName} />
        {children}
        <SiteFooter settings={settings} />
      </div>
    </>
  );
}
