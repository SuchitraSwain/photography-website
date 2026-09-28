import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Lightweight Edge guard only — full admin email checks happen in
 * server components via `requireAdmin()`. Avoid importing Auth.js / Prisma
 * here; that blew past the 1MB Edge Function size limit on Hobby.
 */
export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  if (!path.startsWith("/admin") || path.startsWith("/admin/sign-in")) {
    return NextResponse.next();
  }

  const hasSession =
    req.cookies.has("authjs.session-token") ||
    req.cookies.has("__Secure-authjs.session-token") ||
    req.cookies.has("next-auth.session-token") ||
    req.cookies.has("__Secure-next-auth.session-token");

  if (!hasSession) {
    const url = new URL("/admin/sign-in", req.nextUrl.origin);
    url.searchParams.set("callbackUrl", path);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
