export type IcsEventInput = {
  title: string;
  description: string;
  location: string;
  start: string;
  end: string;
  /** Stable identifier so re-importing updates the event instead of duplicating it. */
  uid?: string;
  /** Overridable for deterministic tests; defaults to the current instant. */
  dtstamp?: string;
};

function escapeIcsText(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

function formatIcsUtc(iso: string): string {
  const date = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    `${date.getUTCFullYear()}` +
    `${pad(date.getUTCMonth() + 1)}` +
    `${pad(date.getUTCDate())}T` +
    `${pad(date.getUTCHours())}` +
    `${pad(date.getUTCMinutes())}` +
    `${pad(date.getUTCSeconds())}Z`
  );
}

export function slugifyForFilename(value: string): string {
  return (
    value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "event"
  );
}

function uidDomain(): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  if (!siteUrl) {
    return "atelier.local";
  }

  try {
    return new URL(siteUrl).hostname;
  } catch {
    return "atelier.local";
  }
}

export function buildIcsEvent({
  title,
  description,
  location,
  start,
  end,
  uid,
  dtstamp,
}: IcsEventInput): string {
  const uidLocalPart = uid ?? `${slugifyForFilename(title)}-${formatIcsUtc(start)}`;
  const eventUid = uidLocalPart.includes("@")
    ? uidLocalPart
    : `${uidLocalPart}@${uidDomain()}`;

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Photography Portfolio//Events//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${escapeIcsText(eventUid)}`,
    `DTSTAMP:${formatIcsUtc(dtstamp ?? new Date().toISOString())}`,
    `DTSTART:${formatIcsUtc(start)}`,
    `DTEND:${formatIcsUtc(end)}`,
    `SUMMARY:${escapeIcsText(title)}`,
    `DESCRIPTION:${escapeIcsText(description)}`,
    `LOCATION:${escapeIcsText(location)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return lines.join("\r\n");
}
