import { z } from "zod";
import { createGetRequestWhere } from "../../_general/models/get-request";
import { getDepartmentsRequestSchema, whereSchema as departmentsWhereSchema } from "./get-departments-request";

const whereSchema = departmentsWhereSchema.merge(z.object({
  isDeleted: z.boolean().optional(),
}))

export const getDepartmentChildrenCountRequestSchema = getDepartmentsRequestSchema
  .merge(createGetRequestWhere(whereSchema))

export type GetDepartmentChildrenCountRequest = z.infer<typeof getDepartmentChildrenCountRequestSchema>;