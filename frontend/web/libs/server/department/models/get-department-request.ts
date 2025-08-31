import { Department } from "@/external/prisma-generated";
import { z } from "zod";
import { idSchema } from "../../_general/models/id";
import { createGetRequestOrderBy, createGetRequestOrderByArray, createGetRequestRelate, createGetRequestWhere } from "../../_general/models/get-request";

const whereSchema = z.object({
  id: idSchema.optional(),
  name: z.string().optional(),
  organizationId: idSchema.optional(),
})

export enum DepartmentRelate {
  ORGANIZATION = 'organization',
}

export const departmentOrderByFieldSchema = z.enum([
  'id',
  'name',
  'organizationId',
] as const satisfies (keyof Department)[])

const orderBySchema = createGetRequestOrderBy(
  z.undefined(),
  departmentOrderByFieldSchema,
)

export const getDepartmentsRequestSchema = createGetRequestWhere(whereSchema)
  .merge(createGetRequestRelate(z.nativeEnum(DepartmentRelate)))
  .merge(createGetRequestOrderByArray(orderBySchema))

export type GetDepartmentsRequest = z.infer<typeof getDepartmentsRequestSchema>;