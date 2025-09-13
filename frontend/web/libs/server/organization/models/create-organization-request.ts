import { z } from "zod";

export const createOrganizationRequestSchema = z.object({
  name: z.string().min(1),
});

export type CreateOrganizationRequest = z.infer<typeof createOrganizationRequestSchema>;