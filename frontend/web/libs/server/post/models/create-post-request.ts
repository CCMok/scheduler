import { z } from "zod";
import { idSchema } from "../../_general/models/id";

export const createPostRequestSchema = z.object({
  departmentId: idSchema,
  postName: z.string().min(1),
});

export type CreatePostRequest = z.infer<typeof createPostRequestSchema>;