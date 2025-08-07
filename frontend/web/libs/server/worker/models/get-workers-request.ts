import { z } from "zod";
import { idSchema } from "../../_general/models/id";
import { createGetRequestOrderBy, createGetRequestWhere } from "../../_general/models/get-request";
import { Worker } from "@/external/prisma-generated";

const whereSchema = z.object({
  id: idSchema.optional(),
  departmentId: idSchema.optional(),
  name: z.string().optional(),
})

const orderByFieldSchema = z.enum([
  'id',
  'name',
  'departmentId',
] as const satisfies (keyof Worker)[])

export const getWorkersRequestSchema = createGetRequestWhere(whereSchema)
  .and(createGetRequestOrderBy(
    z.undefined(),
    orderByFieldSchema,
  ))

export type GetWorkersRequest = z.infer<typeof getWorkersRequestSchema>;