import { z } from "zod";
import { idSchema } from "../../_general/models/id";

export const updatePostRequestSchema = z.object({
  postId: idSchema,
  postName: z.string().min(1),
});

export type UpdatePostRequest = z.infer<typeof updatePostRequestSchema>;