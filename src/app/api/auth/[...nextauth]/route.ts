import NextAuth from "next-auth"
import DiscordProvider from "next-auth/providers/discord"

if (process.env.DISCORD_CLIENT_ID == null)
  throw new Error("DISCORD_CLIENT_ID is not set")
if (process.env.DISCORD_CLIENT_SECRET == null)
  throw new Error("DISCORD_CLIENT_SECRET is not set")

const handler = NextAuth({
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn() {
      // Send properties to the client, like an access_token from a provider.
      // Conditional to check if the user is allowed to sign in here.

      return true
    },
  },
})

export { handler as GET, handler as POST }
