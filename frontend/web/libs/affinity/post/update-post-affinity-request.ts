import { z } from "zod";

export const updatePostAffinityRequestSchema = z.object({
  id: z.number(),
  postIds: z.array(z.number()).min(2, "至少選擇兩個職位"),
})

export type UpdatePostAffinityRequest = z.infer<typeof updatePostAffinityRequestSchema>;
