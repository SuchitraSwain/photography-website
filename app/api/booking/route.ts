import { NextResponse } from "next/server";
import { z } from "zod";

import { isGoogleBookingConfigured } from "@/lib/booking/config";
import { rateLimit } from "@/lib/booking/rate-limit";
import { prisma } from "@/lib/db";
import {
  bookingClientConfirmation,
  bookingPhotographerNotify,
} from "@/lib/email/templates";
import { createTentativeEvent } from "@/lib/google/calendar";
import { sendGmail } from "@/lib/google/gmail";
import { formatEventDateRange } from "@/lib/datetime";
import { getAdminEmails } from "@/lib/booking/config";

export const runtime = "nodejs";

const bookingSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(200),
  eventType: z.string().trim().min(1).max(80),
  date: z.string().datetime(),
  endDate: z.string().datetime().optional(),
  location: z.string().trim().min(1).max(200),
  budget: z.string().trim().max(80).optional(),
  message: z.string().trim().min(1).max(5000),
});

export async function POST(request: Request) {
  if (!isGoogleBookingConfigured()) {
    return NextResponse.json(
      { error: "Booking is not configured yet." },
      { status: 503 },
    );
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "anon";
  const limited = rateLimit({
    key: `booking:${ip}`,
    limit: 5,
    windowMs: 15 * 60_000,
  });
  if (!limited.ok) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      {
        status: 429,
        headers: { "Retry-After": String(limited.retryAfterSec) },
      },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = bookingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid booking details", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const data = parsed.data;
  const start = new Date(data.date);
  const end = data.endDate
    ? new Date(data.endDate)
    : new Date(start.getTime() + 60 * 60 * 1000);
  const dateLabel = formatEventDateRange(
    start.toISOString(),
    end.toISOString(),
  );

  try {
    const booking = await prisma.bookingRequest.create({
      data: {
        name: data.name,
        email: data.email,
        eventType: data.eventType,
        date: start,
        endDate: end,
        location: data.location,
        budget: data.budget || null,
        message: data.message,
      },
    });

    let googleEventId: string | null = null;
    try {
      googleEventId = await createTentativeEvent({
        summary: `[Pending] ${data.eventType} — ${data.name}`,
        description: [
          `Booking ID: ${booking.id}`,
          `Email: ${data.email}`,
          `Location: ${data.location}`,
          `Budget: ${data.budget || "—"}`,
          "",
          data.message,
        ].join("\n"),
        start,
        end,
        attendeeEmail: data.email,
      });

      await prisma.bookingRequest.update({
        where: { id: booking.id },
        data: { googleEventId },
      });
    } catch (calendarError) {
      console.error("[booking] calendar", calendarError);
    }

    const clientMail = bookingClientConfirmation({
      name: data.name,
      eventType: data.eventType,
      dateLabel,
    });
    const photographerMail = bookingPhotographerNotify({
      name: data.name,
      email: data.email,
      eventType: data.eventType,
      dateLabel,
      location: data.location,
      budget: data.budget,
      message: data.message,
    });

    try {
      await sendGmail({
        to: data.email,
        subject: clientMail.subject,
        text: clientMail.text,
      });
      const admin = getAdminEmails()[0];
      if (admin) {
        await sendGmail({
          to: admin,
          subject: photographerMail.subject,
          text: photographerMail.text,
        });
      }
    } catch (mailError) {
      console.error("[booking] gmail", mailError);
    }

    return NextResponse.json({
      ok: true,
      id: booking.id,
      googleEventId,
    });
  } catch (error) {
    console.error("[booking]", error);
    return NextResponse.json(
      { error: "Could not save booking request" },
      { status: 500 },
    );
  }
}
