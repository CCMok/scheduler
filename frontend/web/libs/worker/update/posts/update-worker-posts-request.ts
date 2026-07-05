import { z } from "zod";

export const updateWorkerPostsRequestSchema = z.object({
  id: z.number(),
  posts: z.number().array(),
})

export type UpdateWorkerPostsRequest = z.infer<typeof updateWorkerPostsRequestSchema>;
