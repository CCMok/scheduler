import { z } from "zod";
import { idSchema } from "../../_general/models/id";
import { createGetRequestWhere } from "../../_general/models/get-request";

const whereSchema = z.object({
  deptId: idSchema.optional(),
  orgId: idSchema.optional(),
})

export const getPostsDeptOrgRequestSchema = createGetRequestWhere(whereSchema)

export type GetPostsDeptOrgRequest = z.infer<typeof getPostsDeptOrgRequestSchema>;

