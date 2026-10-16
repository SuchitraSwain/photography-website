import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

/**
 * Locale routing for public pages + lightweight Edge admin session gate.
 * Full admin email checks happen in server components via `requireAdmin()`.
 */
export default function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  if (path.startsWith("/api") || path.startsWith("/admin")) {
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

  return intlMiddleware(req);
}

export const config = {
  matcher: ["/", "/(de|en)/:path*", "/admin/:path*", "/((?!api|_next|_vercel|.*\\..*).*)"],
};
