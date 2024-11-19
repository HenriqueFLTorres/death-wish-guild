import { eq } from "drizzle-orm"
import { z } from "zod"
import { adminProcedure, authenticatedProcedure, router } from ".."
import { guild } from "../../../supabase/migrations/schema"
import { db } from "@/db"

export const guildRouter = router({
  getMessageOfTheDay: authenticatedProcedure.query(async (opts) => {
    console.log({ opts })

    const [guildResult] = await db
      .select()
      .from(guild)
      .where(eq(guild.id, "870f7aed-c2c9-4d5c-88ff-dfdca94a38e4"))
      .limit(1)

    return guildResult.message_of_the_day
  }),
  updateMessageOfTheDay: adminProcedure
    .input(z.object({ message_of_the_day: z.string().nullish() }))
    .mutation(async (opts) => {
      const { input } = opts

      await db
        .update(guild)
        .set({ message_of_the_day: input.message_of_the_day })
        .where(eq(guild.id, "870f7aed-c2c9-4d5c-88ff-dfdca94a38e4"))
    }),
})
