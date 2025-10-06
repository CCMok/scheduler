import { z } from "zod";
import { idSchema } from "../../_general/models/id";
import { createGetRequestOrderBy, createGetRequestOrderByArray, createGetRequestRelate, createGetRequestWhere } from "../../_general/models/get-request";
import { Organization } from "@/external/prisma-generated";

const whereSchema = z.object({
  id: idSchema.optional(),
  name: z.string().optional(),
  maxHistoryCount: z.number().optional(),
  userId: idSchema.optional(),
})

export const organizationOrderByFieldSchema = z.enum([
  'id',
  'name',
  'maxHistoryCount',
] as const satisfies (keyof Organization)[])

export enum OrganizationRelate {
  DEPARTMENT = 'department',
}

export const orderBySchema = createGetRequestOrderBy(
  z.undefined(),
  organizationOrderByFieldSchema,
)

export const getOrganizationsRequestSchema = createGetRequestWhere(whereSchema)
  .merge(createGetRequestRelate(z.nativeEnum(OrganizationRelate)))
  .merge(createGetRequestOrderByArray(orderBySchema))

export type GetOrganizationsRequest = z.infer<typeof getOrganizationsRequestSchema>;