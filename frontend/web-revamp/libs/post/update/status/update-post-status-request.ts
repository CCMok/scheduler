import { z } from "zod";
import { PostStatus } from "../../post-status";

export const updatePostStatusRequestSchema = z.object({
  id: z.number(),
  status: z.enum(PostStatus),
})

export type UpdatePostStatusRequest = z.infer<typeof updatePostStatusRequestSchema>;
