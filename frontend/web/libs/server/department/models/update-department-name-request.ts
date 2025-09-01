import { z } from "zod";
import { idSchema } from "../../_general/models/id";

export const updateDepartmentNameRequestSchema = z.object({
  id: idSchema,
  name: z.string().min(1),
})

export type UpdateDepartmentNameRequest = z.infer<typeof updateDepartmentNameRequestSchema>;