import { google } from "googleapis";

import { prisma } from "@/lib/db";
import { getAdminEmails } from "@/lib/booking/config";

export async function getPhotographerGoogleAuth() {
  const adminEmails = getAdminEmails();
  if (adminEmails.length === 0) {
    throw new Error("ADMIN_EMAILS is not configured");
  }

  const user = await prisma.user.findFirst({
    where: { email: { in: adminEmails, mode: "insensitive" } },
    include: {
      accounts: {
        where: { provider: "google" },
        take: 1,
      },
    },
  });

  const account = user?.accounts[0];
  if (!account?.refresh_token && !account?.access_token) {
    throw new Error(
      "Photographer Google account is not connected. Sign in at /admin/sign-in.",
    );
  }

  const oauth2 = new google.auth.OAuth2(
    process.env.AUTH_GOOGLE_ID,
    process.env.AUTH_GOOGLE_SECRET,
  );

  oauth2.setCredentials({
    access_token: account.access_token ?? undefined,
    refresh_token: account.refresh_token ?? undefined,
    expiry_date: account.expires_at ? account.expires_at * 1000 : undefined,
  });

  oauth2.on("tokens", async (tokens) => {
    await prisma.account.update({
      where: { id: account.id },
      data: {
        access_token: tokens.access_token ?? account.access_token,
        expires_at: tokens.expiry_date
          ? Math.floor(tokens.expiry_date / 1000)
          : account.expires_at,
        refresh_token: tokens.refresh_token ?? account.refresh_token,
      },
    });
  });

  return oauth2;
}
