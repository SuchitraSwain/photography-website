import { timingSafeEqual } from "node:crypto";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function secretMatches(provided: string | null, expected: string): boolean {
  if (!provided) {
    return false;
  }

  const providedBytes = Buffer.from(provided);
  const expectedBytes = Buffer.from(expected);

  if (providedBytes.length !== expectedBytes.length) {
    return false;
  }

  return timingSafeEqual(providedBytes, expectedBytes);
}

/**
 * Manual / webhook revalidation. POST with shared secret in
 * `x-revalidate-secret` header or `?secret=` query parameter.
 */
export async function POST(request: Request): Promise<NextResponse> {
  const expected =
    process.env.REVALIDATE_SECRET ?? process.env.SANITY_REVALIDATE_SECRET;

  if (!expected) {
    return NextResponse.json(
      { revalidated: false, reason: "REVALIDATE_SECRET is not set" },
      { status: 501 },
    );
  }

  const provided =
    request.headers.get("x-revalidate-secret") ??
    new URL(request.url).searchParams.get("secret");

  if (!secretMatches(provided, expected)) {
    return NextResponse.json({ revalidated: false }, { status: 401 });
  }

  revalidatePath("/", "layout");
  revalidatePath("/gallery");

  return NextResponse.json({ revalidated: true, now: Date.now() });
}
