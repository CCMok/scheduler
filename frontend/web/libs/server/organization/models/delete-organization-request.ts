import { z } from "zod";
import { idSchema } from "../../_general/models/id";

export const deleteOrganizationRequestSchema = z.object({
  id: idSchema,
});

export type DeleteOrganizationRequest = z.infer<typeof deleteOrganizationRequestSchema>;