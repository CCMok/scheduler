import { z } from "zod";
import { idSchema } from "../../_general/models/id";
import { createGetRequestWhere } from "../../_general/models/get-request";

const whereSchema = z.object({
  id: idSchema.optional(),
  name: z.string().optional(),
  organizationId: idSchema.optional(),
})

export const getDepartmentChildrenCountsRequestSchema = createGetRequestWhere(whereSchema)

export type GetDepartmentChildrenCountsRequest = z.infer<typeof getDepartmentChildrenCountsRequestSchema>;