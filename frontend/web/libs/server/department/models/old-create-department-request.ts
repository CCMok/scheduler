import { z } from "zod";
import { idSchema } from "../../_general/models/id";

export const createDepartmentRequestSchema = z.object({
  organizationId: idSchema,
  name: z.string().min(1),
});

export type CreateDepartmentRequest = z.infer<typeof createDepartmentRequestSchema>;