import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";

import { isAdminEmail, isGoogleOAuthConfigured } from "@/lib/booking/config";
import { isDatabaseConfigured, prisma } from "@/lib/db";

const googleScopes = [
  "openid",
  "email",
  "profile",
  "https://www.googleapis.com/auth/calendar.events",
  "https://www.googleapis.com/auth/calendar.freebusy",
  "https://www.googleapis.com/auth/gmail.send",
].join(" ");

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...(isDatabaseConfigured() ? { adapter: PrismaAdapter(prisma) } : {}),
  providers: isGoogleOAuthConfigured()
    ? [
        Google({
          clientId: process.env.AUTH_GOOGLE_ID!,
          clientSecret: process.env.AUTH_GOOGLE_SECRET!,
          authorization: {
            params: {
              scope: googleScopes,
              access_type: "offline",
              prompt: "consent",
              response_type: "code",
            },
          },
        }),
      ]
    : [],
  session: {
    strategy: isDatabaseConfigured() ? "database" : "jwt",
  },
  callbacks: {
    async session({ session, user, token }) {
      if (session.user) {
        session.user.id = user?.id ?? token?.sub ?? "";
        session.user.isAdmin = isAdminEmail(
          session.user.email ?? user?.email ?? undefined,
        );
      }
      return session;
    },
  },
  pages: {
    signIn: "/admin/sign-in",
  },
  trustHost: true,
});
