import { z } from "zod";
import { idSchema } from "../../_general/models/id";
import { createGetRequestWhere } from "../../_general/models/get-request";

const whereSchema = z.object({
  id: idSchema.optional(),
  departmentId: idSchema.optional(),
  workerConstraintTypeId: idSchema.optional(),
  weighting: z.number().optional(),
})

export const getWorkerConstraintWorkersRequestSchema = createGetRequestWhere(whereSchema)

export type GetWorkerConstraintWorkersRequest = z.infer<typeof getWorkerConstraintWorkersRequestSchema>;

