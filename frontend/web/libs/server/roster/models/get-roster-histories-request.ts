import { z } from "zod";
import { idSchema } from "../../_general/models/id";
import { createGetRequestWhere } from "../../_general/models/get-request";

const whereSchema = z.object({
  id: idSchema.optional(),
})

export const getRosterHistoriesRequestSchema = createGetRequestWhere(whereSchema)

export type GetRosterHistoriesRequest = z.infer<typeof getRosterHistoriesRequestSchema>;