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
          <p className="font-mono-nav flex items-center gap-2.5 text-sm tracking-[0.1em] uppercase">
            <span
              aria-hidden
              className="inline-block size-2 rounded-[2px] bg-accent"
            />
            {brandName}
          </p>
          <p className="font-mono-nav text-[0.7rem] tracking-[0.14em] text-muted-foreground uppercase">
            {founders}
          </p>
          {location ? (
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
              {location}
            </p>
          ) : null}
          <p className="font-mono-nav text-[0.65rem] tracking-[0.12em] text-muted-foreground uppercase">
            © {year} {brandName} · {founders}
          </p>
        </div>

        <ul className="flex flex-wrap gap-x-8 gap-y-3">
          {socialLinks.map(({ label, url }) => (
            <li key={url}>
              <a
                href={url}
                className="font-mono-nav text-[0.7rem] tracking-[0.14em] text-muted-foreground uppercase transition-colors hover:text-accent"
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
