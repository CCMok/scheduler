import { z } from "zod";
import { idSchema } from "../../_general/models/id";
import { createGetRequestWhere } from "../../_general/models/get-request";

const whereSchema = z.object({
  id: idSchema.optional(),
  name: z.string().optional(),
  departmentId: idSchema.optional(),
  workerId: idSchema.optional(),
  isDeleted: z.boolean().optional(),
})

export const getPostWorkersCountRequestSchema = createGetRequestWhere(whereSchema)

export type GetPostWorkersCountRequest = z.infer<typeof getPostWorkersCountRequestSchema>;