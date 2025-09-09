import { z } from "zod";
import { createGetRequestOrderBy, createGetRequestOrderByArray } from "../../_general/models/get-request";
import { departmentOrderByFieldSchema } from "../../department/models/get-departments-request";
import { getOrganizationsRequestSchema } from "./get-organizations-request";

const orderBySchema = createGetRequestOrderBy(
  z.undefined(),
  departmentOrderByFieldSchema,
)

export const getOrganizationsDeparmentRequestSchema = getOrganizationsRequestSchema.merge(z.object({
  department: createGetRequestOrderByArray(orderBySchema)
}))

export type GetOrganizationsDeparmentRequest = z.infer<typeof getOrganizationsDeparmentRequestSchema>;