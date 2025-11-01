import { z } from "zod";
import { createGetRequestOrderBy, createGetRequestOrderByArray } from "../../_general/models/get-request";
import { getOrganizationsRequestSchema } from "./get-organizations-request";
import { Department } from "@/external/prisma-generated";

export const departmentOrderByFieldSchema = z.enum([
  'id',
  'name',
  'organizationId',
] as const satisfies (keyof Department)[])

const orderBySchema = createGetRequestOrderBy(
  z.undefined(),
  departmentOrderByFieldSchema,
)

export const getOrganizationsDeparmentRequestSchema = getOrganizationsRequestSchema.merge(z.object({
  department: createGetRequestOrderByArray(orderBySchema)
}))

export type GetOrganizationsDeparmentRequest = z.infer<typeof getOrganizationsDeparmentRequestSchema>;