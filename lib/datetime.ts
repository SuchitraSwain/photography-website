const FALLBACK_TIME_ZONE = "UTC";

/**
 * Event times are rendered in one published studio timezone so that the server
 * render and every visitor agree on the displayed wall-clock time.
 */
export function getSiteTimeZone(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_TIMEZONE;

  if (!configured) {
    return FALLBACK_TIME_ZONE;
  }

  try {
    new Intl.DateTimeFormat("en-US", { timeZone: configured });
    return configured;
  } catch {
    console.error(
      `[datetime] Invalid NEXT_PUBLIC_SITE_TIMEZONE "${configured}"; falling back to ${FALLBACK_TIME_ZONE}.`,
    );
    return FALLBACK_TIME_ZONE;
  }
}

function timeZoneAbbreviation(
  date: Date,
  timeZone: string,
  locale: string = "en-US",
): string {
  const parts = new Intl.DateTimeFormat(locale, {
    timeZone,
    timeZoneName: "short",
  }).formatToParts(date);

  return parts.find((part) => part.type === "timeZoneName")?.value ?? timeZone;
}

export function formatEventDateRange(
  startIso: string,
  endIso: string,
  timeZone: string = getSiteTimeZone(),
  locale: string = "en-US",
): string {
  const start = new Date(startIso);
  const end = new Date(endIso);

  const dateFormatter = new Intl.DateTimeFormat(locale, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone,
  });
  const timeFormatter = new Intl.DateTimeFormat(locale, {
    hour: "numeric",
    minute: "2-digit",
    timeZone,
  });

  const startDate = dateFormatter.format(start);
  const endDate = dateFormatter.format(end);
  const zone = timeZoneAbbreviation(start, timeZone, locale);

  if (startDate === endDate) {
    return `${startDate} · ${timeFormatter.format(start)} – ${timeFormatter.format(end)} ${zone}`;
  }

  return `${startDate} – ${endDate} (${zone})`;
}
