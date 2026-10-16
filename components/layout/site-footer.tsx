import Image from "next/image";
import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { foundersCredit } from "@/lib/site-config";
import type { SiteSettings } from "@/lib/types/content";

type SiteFooterProps = {
  settings: Pick<SiteSettings, "brandName" | "socialLinks" | "location">;
};

export async function SiteFooter({ settings }: SiteFooterProps) {
  const { brandName, socialLinks, location } = settings;
  const year = new Date().getFullYear();
  const founders = foundersCredit();
  const t = await getTranslations("footer");

  return (
    <footer className="mt-auto border-t border-border/70 bg-surface/40">
      <div className="mx-auto flex max-w-[100rem] flex-col gap-10 px-6 py-16 sm:flex-row sm:items-end sm:justify-between lg:px-10">
        <div className="space-y-4">
          <Image
            src="/images/brand/krishyam-logo-white.png"
            alt={brandName}
            width={180}
            height={180}
            className="h-16 w-auto object-contain"
          />
          <p className="font-mono-nav text-[0.95rem] font-medium tracking-[0.12em] text-foreground/90 uppercase">
            {founders}
          </p>
          {location ? (
            <p className="max-w-sm text-[1.05rem] leading-relaxed text-muted-foreground">
              {location}
            </p>
          ) : null}
          <p className="pt-2 text-[0.95rem] font-medium tracking-[0.04em] text-foreground/80">
            © {year} {brandName} · {founders}
          </p>
        </div>

        <div className="flex flex-col items-start gap-6 sm:items-end">
          <ul className="flex flex-wrap gap-x-8 gap-y-3 sm:justify-end">
            {socialLinks.map(({ label, url }) => (
              <li key={url}>
                <a
                  href={url}
                  className="font-mono-nav text-[0.95rem] font-semibold tracking-[0.12em] text-foreground uppercase transition-colors hover:text-accent"
                  {...(url.startsWith("http")
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
          <Link
            href="/privacy"
            className="font-mono-nav text-[0.85rem] font-semibold tracking-[0.12em] text-muted-foreground uppercase transition-colors hover:text-accent"
          >
            {t("privacy")}
          </Link>
        </div>
      </div>
    </footer>
  );
}
