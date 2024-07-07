import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { eq } from "drizzle-orm"
import NextAuth, { type NextAuthConfig } from "next-auth"
import DiscordProvider from "next-auth/providers/discord"
import { db } from "./db"
import { users } from "./db/schema"

if (process.env.DISCORD_CLIENT_ID == null)
  throw new Error("DISCORD_CLIENT_ID is not set")
if (process.env.DISCORD_CLIENT_SECRET == null)
  throw new Error("DISCORD_CLIENT_SECRET is not set")

export const nextAuthConfig: NextAuthConfig = {
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
    newUser: "/auth/onboarding",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.AUTH_SECRET,
  adapter: DrizzleAdapter(db),
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async session({ session }) {
      if (session == null) return session

      const [myUser] = await db
        .select()
        .from(users)
        .where(eq(users.email, session.user.email))
        .limit(1)

      return {
        ...session,
        user: {
          ...session.user,
          ...myUser,
          name: myUser.displayName ?? session.user.name,
          originalName: session.user.name,
        },
      }
    },
  },
  debug: true,
}

export const { handlers, signIn, signOut, auth } = NextAuth(nextAuthConfig)
