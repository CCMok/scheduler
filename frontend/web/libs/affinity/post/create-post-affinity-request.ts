import { z } from "zod";

export const createPostAffinityRequestSchema = z.object({
  teamId: z.number(),
  postIds: z.array(z.number()).min(2, "至少選擇兩個職位"),
})

export type CreatePostAffinityRequest = z.infer<typeof createPostAffinityRequestSchema>;
