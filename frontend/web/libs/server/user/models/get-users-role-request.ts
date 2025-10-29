import { z } from "zod";
import { idSchema } from "../../_general/models/id";
import { createGetRequestOrderBy, createGetRequestOrderByArray, createGetRequestRelate, createGetRequestWhere } from "../../_general/models/get-request";
import { User } from "@/external/prisma-generated";

const whereSchema = z.object({
  id: idSchema.optional(),
  email: z.string().optional(),
  name: z.string().optional(),
  roleId: idSchema.optional(),
})

const orderByFieldSchema = z.enum([
  'id',
  'email',
  'name',
  'roleId',
] as const satisfies (keyof User)[])

const orderBySchema = createGetRequestOrderBy(z.undefined(), orderByFieldSchema)

export const getUsersRequestSchema = createGetRequestWhere(whereSchema)
  .merge(createGetRequestOrderByArray(orderBySchema))

export type GetUsersRequest = z.infer<typeof getUsersRequestSchema>;