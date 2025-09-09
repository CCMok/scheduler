import { z } from "zod";
import { idSchema } from "../../_general/models/id";
import { createGetRequestOrderBy, createGetRequestOrderByArray, createGetRequestWhere } from "../../_general/models/get-request";
import { Post } from "@/external/prisma-generated";

const whereSchema = z.object({
  id: idSchema.optional(),
  departmentId: idSchema.optional(),
  name: z.string().optional(),
  isDeleted: z.boolean().optional(),
})

const orderByFieldSchema = z.enum([
  'id',
  'name',
  'departmentId',
  'displayPosition',
] as const satisfies (keyof Post)[])

const orderBySchema = createGetRequestOrderBy(z.undefined(), orderByFieldSchema)

export const getPostsRequestSchema = createGetRequestWhere(whereSchema)
  .merge(createGetRequestOrderByArray(orderBySchema))

export type GetPostsRequest = z.infer<typeof getPostsRequestSchema>;

