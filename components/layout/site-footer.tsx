import type { SiteSettings } from "@/lib/types/content";

type SiteFooterProps = {
  settings: Pick<SiteSettings, "brandName" | "socialLinks" | "location">;
};

export function SiteFooter({ settings }: SiteFooterProps) {
  const { brandName, socialLinks, location } = settings;
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">{location}</p>
          <p className="text-sm text-muted-foreground">
            © {year} {brandName}
          </p>
        </div>

        <ul className="flex flex-wrap gap-x-6 gap-y-2">
          {socialLinks.map(({ label, url }) => (
            <li key={url}>
              <a
                href={url}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
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
