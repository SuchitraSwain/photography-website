import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { SocialLink } from "@/lib/types/content";

/** Static OSM embed (no API key). Marker is illustrative; see location text for service area. */
const OSM_EMBED_SRC =
  "https://www.openstreetmap.org/export/embed.html?bbox=-0.15%2C51.48%2C0.05%2C51.54&layer=mapnik&marker=51.5074%2C-0.1278";

type ContactFormProps = {
  contactEmail: string;
  location: string;
  socialLinks: SocialLink[];
};

export function ContactForm({
  contactEmail,
  location,
  socialLinks,
}: ContactFormProps) {
  return (
    <div className="grid gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-16 lg:items-start">
      <form className="space-y-6" noValidate>
        <div className="space-y-2">
          <Label htmlFor="contact-name">Name</Label>
          <Input id="contact-name" name="name" autoComplete="name" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contact-email">Email</Label>
          <Input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="subject">Subject</Label>
          <Input id="subject" name="subject" autoComplete="off" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contact-message">Message</Label>
          <Textarea id="contact-message" name="message" rows={6} required />
        </div>

        <div className="space-y-3 border-t border-border pt-6">
          <Button type="submit" disabled className="w-full sm:w-auto">
            Send message
          </Button>
          <p className="text-sm text-muted-foreground">
            Online messaging launches soon — meanwhile email{" "}
            <a
              href={`mailto:${contactEmail}`}
              className="text-foreground underline-offset-4 hover:underline"
            >
              {contactEmail}
            </a>
            .
          </p>
        </div>
      </form>

      <aside className="space-y-8 lg:sticky lg:top-24">
        <div>
          <h2 className="text-xs font-medium tracking-[0.24em] text-muted-foreground uppercase">
            Studio
          </h2>
          <p className="mt-3 text-base leading-relaxed text-foreground/90">
            {location}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            <a
              href={`mailto:${contactEmail}`}
              className="transition-colors hover:text-foreground"
            >
              {contactEmail}
            </a>
          </p>
        </div>

        {socialLinks.length > 0 ? (
          <div>
            <h2 className="text-xs font-medium tracking-[0.24em] text-muted-foreground uppercase">
              Connect
            </h2>
            <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
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
        ) : null}

        <figure className="overflow-hidden border border-border bg-secondary">
          <iframe
            title="Studio location map"
            src={OSM_EMBED_SRC}
            className="aspect-[4/3] w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
          <figcaption className="border-t border-border px-4 py-3 text-xs text-muted-foreground">
            {location}
          </figcaption>
        </figure>
      </aside>
    </div>
  );
}
