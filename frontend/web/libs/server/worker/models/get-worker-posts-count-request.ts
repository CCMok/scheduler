import { z } from "zod";
import { idSchema } from "../../_general/models/id";
import { createGetRequestWhere } from "../../_general/models/get-request";

const whereSchema = z.object({
  id: idSchema.optional(),
  name: z.string().optional(),
  departmentId: idSchema.optional(),
  isDeleted: z.boolean().optional(),
})

export const getWorkerPostsCountRequestSchema = createGetRequestWhere(whereSchema)
  .merge(z.object({
    post: z.object({
      id: idSchema.optional(),
      isDeleted: z.boolean().optional(),
    }).optional(),
  }))

export type GetWorkerPostsCountRequest = z.infer<typeof getWorkerPostsCountRequestSchema>;