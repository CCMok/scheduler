import { z } from "zod";
import { idSchema } from "../../_general/models/id";

export const updatePostConstraintRequestSchema = z.object({
  id: idSchema,
  departmentId: idSchema,
  postConstraintTypeId: idSchema,
  weighting: z.number(),
  postIds: idSchema.array(),
})

export type UpdatePostConstraintRequest = z.infer<typeof updatePostConstraintRequestSchema>;