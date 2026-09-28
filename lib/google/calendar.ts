import { google } from "googleapis";

import {
  buildOpenSlots,
  type BusyInterval,
  type OpenSlot,
} from "@/lib/booking/availability";
import { getSiteTimeZone } from "@/lib/datetime";
import { getPhotographerGoogleAuth } from "@/lib/google/tokens";

export async function fetchOpenSlots(from: Date, to: Date): Promise<OpenSlot[]> {
  const auth = await getPhotographerGoogleAuth();
  const calendar = google.calendar({ version: "v3", auth });

  const freeBusy = await calendar.freebusy.query({
    requestBody: {
      timeMin: from.toISOString(),
      timeMax: to.toISOString(),
      items: [{ id: "primary" }],
    },
  });

  const busyRaw = freeBusy.data.calendars?.primary?.busy ?? [];
  const busy: BusyInterval[] = busyRaw
    .filter((b) => b.start && b.end)
    .map((b) => ({
      start: new Date(b.start as string),
      end: new Date(b.end as string),
    }));

  return buildOpenSlots({
    from,
    to,
    busy,
    timeZone: getSiteTimeZone(),
  });
}

export async function createTentativeEvent(input: {
  summary: string;
  description: string;
  start: Date;
  end: Date;
  attendeeEmail: string;
}): Promise<string> {
  const auth = await getPhotographerGoogleAuth();
  const calendar = google.calendar({ version: "v3", auth });

  const event = await calendar.events.insert({
    calendarId: "primary",
    requestBody: {
      summary: input.summary,
      description: input.description,
      start: { dateTime: input.start.toISOString() },
      end: { dateTime: input.end.toISOString() },
      attendees: [{ email: input.attendeeEmail }],
      status: "tentative",
    },
  });

  const id = event.data.id;
  if (!id) {
    throw new Error("Google Calendar did not return an event id");
  }
  return id;
}

export async function updateEventStatus(
  eventId: string,
  status: "confirmed" | "cancelled",
): Promise<void> {
  const auth = await getPhotographerGoogleAuth();
  const calendar = google.calendar({ version: "v3", auth });

  if (status === "cancelled") {
    await calendar.events.delete({ calendarId: "primary", eventId });
    return;
  }

  await calendar.events.patch({
    calendarId: "primary",
    eventId,
    requestBody: { status: "confirmed" },
  });
}

export async function rescheduleEvent(
  eventId: string,
  start: Date,
  end: Date,
): Promise<void> {
  const auth = await getPhotographerGoogleAuth();
  const calendar = google.calendar({ version: "v3", auth });

  await calendar.events.patch({
    calendarId: "primary",
    eventId,
    requestBody: {
      start: { dateTime: start.toISOString() },
      end: { dateTime: end.toISOString() },
      status: "confirmed",
    },
  });
}
