"use client";

import { siteConfig } from "@/lib/site-config";

type CalEmbedProps = {
  calUrl?: string;
};

export function CalEmbed({ calUrl = siteConfig.calUrl }: CalEmbedProps) {
  return (
    <div className="space-y-6">
      <div className="overflow-hidden border border-border bg-secondary/20">
        <iframe
          title="Book a session"
          src={calUrl}
          className="h-[min(720px,80vh)] w-full border-0"
          loading="lazy"
          allow="camera; microphone; fullscreen"
        />
      </div>
      <p className="text-sm text-muted-foreground">
        Prefer email? Reach out at{" "}
        <span className="text-foreground">{siteConfig.contactEmail}</span> and
        we’ll confirm availability within 24–48 hours.
      </p>
      {calUrl.includes("your-username") ? (
        <p className="rounded-md border border-border bg-secondary/40 px-4 py-3 text-sm text-muted-foreground">
          Set{" "}
          <code className="text-foreground">NEXT_PUBLIC_CAL_URL</code> to your
          Cal.com or Calendly booking link to replace this placeholder embed.
        </p>
      ) : null}
    </div>
  );
}
