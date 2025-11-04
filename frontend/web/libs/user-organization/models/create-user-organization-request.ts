import { z } from "zod";
import { idSchema } from "../../_general/models/id";

export const createUserOrganizationRequestSchema = z.object({
  userId: idSchema,
  organizationId: idSchema,
});

export type CreateUserOrganizationRequest = z.infer<typeof createUserOrganizationRequestSchema>;