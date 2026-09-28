import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { PageTransition } from "@/components/motion/page-transition";
import { getSiteSettings } from "@/lib/sanity/fetch";

export async function SiteShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();

  return (
    <>
      <SiteHeader brandName={settings.brandName} />
      <PageTransition>{children}</PageTransition>
      <SiteFooter settings={settings} />
    </>
  );
}
