export type BusyInterval = {
  start: Date;
  end: Date;
};

export type OpenSlot = {
  start: string;
  end: string;
};

export type WorkingHours = {
  /** 0 = Sunday … 6 = Saturday */
  days: number[];
  startHour: number;
  endHour: number;
  slotMinutes: number;
};

export const DEFAULT_WORKING_HOURS: WorkingHours = {
  days: [1, 2, 3, 4, 5],
  startHour: 10,
  endHour: 18,
  slotMinutes: 60,
};

function overlaps(aStart: Date, aEnd: Date, bStart: Date, bEnd: Date): boolean {
  return aStart < bEnd && bStart < aEnd;
}

/**
 * Build open slots between `from` and `to` by subtracting busy intervals
 * from working-hour windows. Times are interpreted in the given IANA timezone
 * for hour-of-day checks; stored slot bounds are UTC ISO strings.
 */
export function buildOpenSlots(options: {
  from: Date;
  to: Date;
  busy: BusyInterval[];
  workingHours?: WorkingHours;
  timeZone: string;
}): OpenSlot[] {
  const workingHours = options.workingHours ?? DEFAULT_WORKING_HOURS;
  const slots: OpenSlot[] = [];
  const cursor = new Date(options.from);

  // Walk day by day in UTC midnight steps, then evaluate local hours via formatter
  const dayMs = 24 * 60 * 60 * 1000;
  for (
    let day = new Date(
      Date.UTC(
        cursor.getUTCFullYear(),
        cursor.getUTCMonth(),
        cursor.getUTCDate(),
      ),
    );
    day < options.to;
    day = new Date(day.getTime() + dayMs)
  ) {
    const weekday = weekdayInTimeZone(day, options.timeZone);
    if (!workingHours.days.includes(weekday)) continue;

    for (
      let hour = workingHours.startHour;
      hour < workingHours.endHour;
      hour += workingHours.slotMinutes / 60
    ) {
      const start = zonedDateTimeToUtc(
        day,
        Math.floor(hour),
        (hour % 1) * 60,
        options.timeZone,
      );
      const end = new Date(
        start.getTime() + workingHours.slotMinutes * 60 * 1000,
      );

      if (end > options.to || start < options.from) continue;

      const conflict = options.busy.some((b) =>
        overlaps(start, end, b.start, b.end),
      );
      if (!conflict) {
        slots.push({ start: start.toISOString(), end: end.toISOString() });
      }
    }
  }

  return slots;
}

function weekdayInTimeZone(date: Date, timeZone: string): number {
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone,
    weekday: "short",
  });
  const day = fmt.format(date);
  const map: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };
  return map[day] ?? 0;
}

/**
 * Approximate: take the UTC calendar date of `day`, apply hour/minute as if
 * in `timeZone` using a formatter offset probe.
 */
function zonedDateTimeToUtc(
  day: Date,
  hour: number,
  minute: number,
  timeZone: string,
): Date {
  const y = day.getUTCFullYear();
  const m = day.getUTCMonth();
  const d = day.getUTCDate();
  // Construct a UTC guess then adjust by the timezone offset at that instant
  const guess = new Date(Date.UTC(y, m, d, hour, minute, 0));
  const offsetMinutes = getTimeZoneOffsetMinutes(guess, timeZone);
  return new Date(guess.getTime() - offsetMinutes * 60 * 1000);
}

function getTimeZoneOffsetMinutes(date: Date, timeZone: string): number {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone,
    timeZoneName: "shortOffset",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const parts = dtf.formatToParts(date);
  const tz =
    parts.find((p) => p.type === "timeZoneName")?.value ?? "GMT";
  // Examples: "GMT", "GMT+2", "GMT-5", "GMT+5:30"
  const match = tz.match(/GMT([+-])(\d{1,2})(?::(\d{2}))?/);
  if (!match) return 0;
  const sign = match[1] === "-" ? -1 : 1;
  const hours = Number(match[2] ?? 0);
  const mins = Number(match[3] ?? 0);
  return sign * (hours * 60 + mins);
}
