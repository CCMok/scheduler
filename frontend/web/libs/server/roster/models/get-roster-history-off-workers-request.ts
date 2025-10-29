import { z } from "zod";
import { idSchema } from "../../_general/models/id";
import { createGetRequestWhere } from "../../_general/models/get-request";

const whereSchema = z.object({
  rosterHistoryId: idSchema.optional(),
})

export const getRosterHistoryOffWorkersRequestSchema = createGetRequestWhere(whereSchema)

export type GetRosterHistoryOffWorkersRequest = z.infer<typeof getRosterHistoryOffWorkersRequestSchema>;