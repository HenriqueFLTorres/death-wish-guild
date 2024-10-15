import { z } from "zod"

export const classesEnum = z.enum(["DPS", "RANGED_DPS", "TANK", "SUPPORT"])
