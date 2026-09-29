"use client";

import { siteConfig } from "@/lib/site-config";

type CalEmbedProps = {
  calUrl?: string;
};

export function CalEmbed({ calUrl = siteConfig.calUrl }: CalEmbedProps) {
  if (!calUrl) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-[14px] border border-[rgba(148,176,224,0.14)] bg-[#0b101a]/50">
        <iframe
          title="Book a session"
          src={calUrl}
          className="h-[min(720px,80vh)] w-full border-0"
          loading="lazy"
          allow="camera; microphone; fullscreen"
        />
      </div>
      {siteConfig.contactEmail.includes("@") &&
      !siteConfig.contactEmail.startsWith("[") ? (
        <p className="text-sm text-muted-foreground">
          Prefer email? Reach out at{" "}
          <a
            className="text-foreground underline underline-offset-4 hover:text-accent"
            href={`mailto:${siteConfig.contactEmail}`}
          >
            {siteConfig.contactEmail}
          </a>{" "}
          and we’ll confirm availability within 24–48 hours.
        </p>
      ) : null}
    </div>
  );
}
