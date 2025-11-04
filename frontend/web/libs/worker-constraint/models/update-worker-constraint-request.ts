import { z } from "zod";
import { idSchema } from "../../_general/models/id";

export const updateWorkerConstraintRequestSchema = z.object({
  id: idSchema,
  workerConstraintTypeId: idSchema,
  weighting: z.number(),
  workerIds: idSchema.array(),
})

export type UpdateWorkerConstraintRequest = z.infer<typeof updateWorkerConstraintRequestSchema>;