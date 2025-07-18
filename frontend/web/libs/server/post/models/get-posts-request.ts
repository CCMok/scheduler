import { z } from "zod";
import { idSchema } from "../../_general/models/id";

export const getPostsRequestSchema = z.object({
  organizationId: idSchema.optional(),
  departmentId: idSchema.optional(),
});

export type GetPostsRequest = z.infer<typeof getPostsRequestSchema>; 