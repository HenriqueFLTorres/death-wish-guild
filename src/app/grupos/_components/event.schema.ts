import { z } from "zod"

const eventSchema = z.object({
  name: z.string(),
  location: z.string(),
  type: z.enum(["GUILD", "PVP", "PVE", "DOMINION_EVENT", "OTHER"]),
  startDate: z.date(),
  startTime: z.object({ hour: z.number(), minute: z.number() }),
})

export { eventSchema }
