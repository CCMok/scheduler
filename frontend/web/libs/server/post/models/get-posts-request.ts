import { z } from "zod";
import { idSchema } from "../../_general/models/id";

export const getPostsRequestSchema = z.object({
  departmentId: idSchema,
});

export type GetPostsRequest = z.infer<typeof getPostsRequestSchema>;