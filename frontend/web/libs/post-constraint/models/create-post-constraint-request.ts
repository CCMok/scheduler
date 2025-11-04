import { z } from "zod";
import { idSchema } from "../../_general/models/id";

export const createPostConstraintRequestSchema = z.object({
  departmentId: idSchema,
  postConstraintTypeId: idSchema,
  weighting: z.number(),
  postIds: idSchema.array(),
})

export type CreatePostConstraintRequest = z.infer<typeof createPostConstraintRequestSchema>;