import { z } from "zod";
import { idSchema } from "../../_general/models/id";
import { createGetRequestWhere } from "../../_general/models/get-request";

const whereSchema = z.object({
  rosterHistoryId: idSchema.optional(),
})

export const getRosterHistorySchedulesRequestSchema = createGetRequestWhere(whereSchema)

export type GetRosterHistorySchedulesRequest = z.infer<typeof getRosterHistorySchedulesRequestSchema>;