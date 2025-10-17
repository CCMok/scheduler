import { z } from "zod";
import { idSchema } from "../../_general/models/id";
import { createGetRequestWhere } from "../../_general/models/get-request";

const whereSchema = z.object({
  id: idSchema.optional(),
  organizationId: idSchema.optional(),
  departmentId: idSchema.optional(),
  createdDateFrom: z.date().optional(),
  createdDateTo: z.date().optional(),
})

export const getRostersRequestSchema = createGetRequestWhere(whereSchema)

export type GetRostersRequest = z.infer<typeof getRostersRequestSchema>;