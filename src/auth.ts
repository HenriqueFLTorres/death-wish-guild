import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { eq } from "drizzle-orm"
import NextAuth, { type NextAuthConfig } from "next-auth"
import DiscordProvider from "next-auth/providers/discord"
import { db } from "./db"
import { user } from "@/../supabase/migrations/schema"

if (process.env.DISCORD_CLIENT_ID == null)
  throw new Error("DISCORD_CLIENT_ID is not set")
if (process.env.DISCORD_CLIENT_SECRET == null)
  throw new Error("DISCORD_CLIENT_SECRET is not set")

export const nextAuthConfig: NextAuthConfig = {
  pages: {
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
    async signIn({ user: signInUser, profile }) {
      if (signInUser.id == null) return false

      const [targetUser] = await db
        .select()
        .from(user)
        .where(eq(user.id, signInUser.id))
        .limit(1)

      if (targetUser?.discord_id == null) {
        await db
          .update(user)
          .set({
            username: String(profile?.username),
            discord_id: profile?.id,
          })
          .where(eq(user.id, signInUser.id))
      }
      return true
    },
    async session({ session }) {
      if (session == null) return session
      // console.log(session)

      const [myUser] = await db
        .select()
        .from(user)
        .where(eq(user.email, session.user.email))
        .limit(1)

      return {
        ...session,
        user: {
          ...session.user,
          ...myUser,
          name: myUser.name ?? session.user.name,
          originalName: session.user.name,
        },
      }
    },
  },
}

export const { handlers, signIn, signOut, auth } = NextAuth(nextAuthConfig)
