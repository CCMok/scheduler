import { z } from "zod";
import { idSchema } from "../../_general/models/id";
import { createGetRequestWhere } from "../../_general/models/get-request";

const whereSchema = z.object({
  id: idSchema.optional(),
  name: z.string().optional(),
  departmentId: idSchema.optional(),
  postId: idSchema.optional(),
  isDeleted: z.boolean().optional(),
})

export const getWorkersPostCountRequestSchema = createGetRequestWhere(whereSchema)

export type GetWorkersPostCountRequest = z.infer<typeof getWorkersPostCountRequestSchema>;