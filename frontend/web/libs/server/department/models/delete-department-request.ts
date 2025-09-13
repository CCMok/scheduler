import { z } from "zod";
import { idSchema } from "../../_general/models/id";

export const deleteDepartmentRequestSchema = z.object({
  id: idSchema,
});

export type DeleteDepartmentRequest = z.infer<typeof deleteDepartmentRequestSchema>;