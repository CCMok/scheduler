import { z } from "zod";
import { idSchema } from "../../_general/models/id";

export const updateOrganizationNameRequestSchema = z.object({
  id: idSchema,
  name: z.string().min(1),
})

export type UpdateOrganizationNameRequest = z.infer<typeof updateOrganizationNameRequestSchema>;