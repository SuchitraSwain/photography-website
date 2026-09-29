import { foundersCredit } from "@/lib/site-config";
import type { SiteSettings } from "@/lib/types/content";

type SiteFooterProps = {
  settings: Pick<SiteSettings, "brandName" | "socialLinks" | "location">;
};

export function SiteFooter({ settings }: SiteFooterProps) {
  const { brandName, socialLinks, location } = settings;
  const year = new Date().getFullYear();
  const founders = foundersCredit();

  return (
    <footer className="mt-auto border-t border-border/60">
      <div className="mx-auto flex max-w-[100rem] flex-col gap-10 px-6 py-14 sm:flex-row sm:items-end sm:justify-between lg:px-10">
        <div className="space-y-4">
          <p className="font-mono-nav flex items-center gap-2.5 text-[0.82rem] font-medium tracking-[0.08em] uppercase text-foreground">
            <span
              aria-hidden
              className="inline-block size-[9px] rounded-[2px] bg-accent shadow-[0_0_12px_rgba(108,155,242,0.8)]"
            />
            {brandName}
          </p>
          <p className="type-label">{founders}</p>
          {location ? (
            <p className="type-lead mt-0 max-w-sm text-[0.95rem]">
              {location}
            </p>
          ) : null}
          <p className="type-label text-[0.65rem]">
            © {year} {brandName} · {founders}
          </p>
        </div>

        <ul className="flex flex-wrap gap-x-8 gap-y-3">
          {socialLinks.map(({ label, url }) => (
            <li key={url}>
              <a
                href={url}
                className="type-link hover:text-accent"
                {...(url.startsWith("http")
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
