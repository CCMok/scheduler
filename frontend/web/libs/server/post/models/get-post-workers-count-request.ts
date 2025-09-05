import { z } from "zod";
import { idSchema } from "../../_general/models/id";
import { createGetRequestWhere } from "../../_general/models/get-request";

const whereSchema = z.object({
  id: idSchema.optional(),
  name: z.string().optional(),
  departmentId: idSchema.optional(),
  isDeleted: z.boolean().optional(),
  workerId: idSchema.optional(),
})

export const getPostWorkersCountRequestSchema = createGetRequestWhere(whereSchema)
.merge(z.object({
  worker: z.object({
    id: idSchema.optional(),
    isDeleted: z.boolean().optional(),
  }).optional(),
}))

export type GetPostWorkersCountRequest = z.infer<typeof getPostWorkersCountRequestSchema>;