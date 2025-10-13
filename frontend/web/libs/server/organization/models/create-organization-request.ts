import { z } from "zod";
import { relatedRequestSchema } from "../../department/models/create-department-request";

export const createOrganizationRequestSchema = z.object({
  name: z.string().min(1),
  departmentName: z.string().min(1),
}).merge(relatedRequestSchema)

export type CreateOrganizationRequest = z.infer<typeof createOrganizationRequestSchema>