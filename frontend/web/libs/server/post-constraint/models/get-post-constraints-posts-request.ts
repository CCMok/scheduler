import { z } from "zod";
import { idSchema } from "../../_general/models/id";
import { createGetRequestWhere } from "../../_general/models/get-request";

const whereSchema = z.object({
  id: idSchema.optional(),
  departmentId: idSchema.optional(),
  postConstraintTypeId: idSchema.optional(),
  weighting: z.number().optional(),
})

export const getPostConstraintPostsRequestSchema = createGetRequestWhere(whereSchema)

export type GetPostConstraintPostsRequest = z.infer<typeof getPostConstraintPostsRequestSchema>;

