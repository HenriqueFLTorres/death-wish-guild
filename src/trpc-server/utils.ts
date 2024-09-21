import { logs, user_logs } from "../../supabase/migrations/schema"
import { db } from "@/db"
import { InsertLog } from "@/db/schema"

const createLog = async (createLogProps: InsertLog) => {
  const [createdLog] = await db
    .insert(logs)
    .values(createLogProps)
    .returning({ id: logs.id })
  await db
    .insert(user_logs)
    .values({ log_id: createdLog.id, user_id: createLogProps.triggered_by })
}

export { createLog }
