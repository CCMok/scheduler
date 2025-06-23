import { z } from "zod";
import { idSchema } from "../../_general/models/id";

export const getMaxHistoryCountRequestSchema = z.object({
  departmentId: idSchema,
})

export type GetMaxHistoryCountRequest = z.infer<typeof getMaxHistoryCountRequestSchema>