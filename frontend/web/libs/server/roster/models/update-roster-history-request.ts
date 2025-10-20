import { z } from "zod";
import { idSchema } from "../../_general/models/id";
import { createScheduleRequestSchema } from "./create-roster-history-request";

export const updateRosterHistoryRequestSchema = z.object({
  id: idSchema,
  schedules: createScheduleRequestSchema.array(),
})

export type UpdateRosterHistoryRequest = z.infer<typeof updateRosterHistoryRequestSchema>;