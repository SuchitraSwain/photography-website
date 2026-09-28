import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { isAdminEmail } from "@/lib/booking/config";

export default auth((req) => {
  const path = req.nextUrl.pathname;

  if (!path.startsWith("/admin") || path.startsWith("/admin/sign-in")) {
    return NextResponse.next();
  }

  const email = req.auth?.user?.email;
  if (!email || !isAdminEmail(email)) {
    const url = new URL("/admin/sign-in", req.nextUrl.origin);
    url.searchParams.set("callbackUrl", path);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*"],
};
