import { z } from "zod";
import { idSchema } from "../../_general/models/id";

export const updateDepartmentConstraintRequestSchema = z.object({
  id: idSchema,
  maxWorkerPostPerRoster: z.number().min(0).optional(),
})

export type UpdateDepartmentConstraintRequest = z.infer<typeof updateDepartmentConstraintRequestSchema>;