import { z } from "zod";
import { idSchema } from "../../_general/models/id";

export const createWorkerConstraintRequestSchema = z.object({
  departmentId: idSchema,
  workerConstraintTypeId: idSchema,
  weighting: z.number(),
  workerIds: idSchema.array(),
})

export type CreateWorkerConstraintRequest = z.infer<typeof createWorkerConstraintRequestSchema>;