import { z } from "zod";
import { idSchema } from "../../_general/models/id";

export const createPostWorkerRequestSchema = z.object({
  postId: idSchema,
  workerId: idSchema,
});

export type CreatePostWorkerRequest = z.infer<typeof createPostWorkerRequestSchema>;