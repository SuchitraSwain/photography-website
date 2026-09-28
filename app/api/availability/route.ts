import { NextResponse } from "next/server";

import { rateLimit } from "@/lib/booking/rate-limit";
import { isGoogleBookingConfigured } from "@/lib/booking/config";
import { fetchOpenSlots } from "@/lib/google/calendar";

export const runtime = "nodejs";

export async function GET(request: Request) {
  if (!isGoogleBookingConfigured()) {
    return NextResponse.json(
      { error: "Booking is not configured yet." },
      { status: 503 },
    );
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "anon";
  const limited = rateLimit({
    key: `availability:${ip}`,
    limit: 60,
    windowMs: 60_000,
  });
  if (!limited.ok) {
    return NextResponse.json(
      { error: "Too many requests" },
      {
        status: 429,
        headers: { "Retry-After": String(limited.retryAfterSec) },
      },
    );
  }

  const { searchParams } = new URL(request.url);
  const fromParam = searchParams.get("from");
  const toParam = searchParams.get("to");

  const from = fromParam ? new Date(fromParam) : new Date();
  const to = toParam
    ? new Date(toParam)
    : new Date(from.getTime() + 14 * 24 * 60 * 60 * 1000);

  if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime()) || to <= from) {
    return NextResponse.json({ error: "Invalid from/to" }, { status: 400 });
  }

  try {
    const slots = await fetchOpenSlots(from, to);
    return NextResponse.json({ slots });
  } catch (error) {
    console.error("[availability]", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Could not load availability",
      },
      { status: 502 },
    );
  }
}
