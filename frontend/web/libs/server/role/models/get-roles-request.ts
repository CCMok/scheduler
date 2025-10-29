import { z } from "zod";
import { idSchema } from "../../_general/models/id";
import { createGetRequestOrderBy, createGetRequestOrderByArray, createGetRequestWhere } from "../../_general/models/get-request";
import { Role } from "@/external/prisma-generated";

const whereSchema = z.object({
  id: idSchema.optional(),
  name: z.string().optional(),
  enum: z.number().optional(),
})

const orderByFieldSchema = z.enum([
  'id',
  'name',
  'enum',
] as const satisfies (keyof Role)[])

const orderBySchema = createGetRequestOrderBy(z.undefined(), orderByFieldSchema)

export const getRolesRequestSchema = createGetRequestWhere(whereSchema)
  .merge(createGetRequestOrderByArray(orderBySchema))

export type GetRolesRequest = z.infer<typeof getRolesRequestSchema>;