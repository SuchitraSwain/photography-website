import { NextResponse } from "next/server";
import { z } from "zod";

import { getAdminEmails, isGoogleBookingConfigured } from "@/lib/booking/config";
import { rateLimit } from "@/lib/booking/rate-limit";
import { prisma } from "@/lib/db";
import {
  inquiryClientConfirmation,
  inquiryPhotographerNotify,
} from "@/lib/email/templates";
import { sendGmail } from "@/lib/google/gmail";

export const runtime = "nodejs";

const inquirySchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(200),
  subject: z.string().trim().min(1).max(200),
  message: z.string().trim().min(1).max(5000),
});

export async function POST(request: Request) {
  if (!isGoogleBookingConfigured()) {
    return NextResponse.json(
      { error: "Contact form is not configured yet." },
      { status: 503 },
    );
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "anon";
  const limited = rateLimit({
    key: `contact:${ip}`,
    limit: 8,
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

  const parsed = inquirySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid inquiry", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const data = parsed.data;

  try {
    const inquiry = await prisma.inquiry.create({ data });

    const clientMail = inquiryClientConfirmation({
      name: data.name,
      subject: data.subject,
    });
    const photographerMail = inquiryPhotographerNotify(data);

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
      console.error("[contact] gmail", mailError);
    }

    return NextResponse.json({ ok: true, id: inquiry.id });
  } catch (error) {
    console.error("[contact]", error);
    return NextResponse.json(
      { error: "Could not save inquiry" },
      { status: 500 },
    );
  }
}
