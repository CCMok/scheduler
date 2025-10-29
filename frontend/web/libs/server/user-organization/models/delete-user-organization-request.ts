import { z } from "zod";
import { idSchema } from "../../_general/models/id";

export const deleteUserOrganizationRequestSchema = z.object({
  userId: idSchema,
  organizationId: idSchema,
});

export type DeleteUserOrganizationRequest = z.infer<typeof deleteUserOrganizationRequestSchema>;