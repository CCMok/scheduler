import { z } from "zod";
import { idSchema } from "../../_general/models/id";

export const deletePostRequestSchema = z.object({
  postId: idSchema,
});

export type DeletePostRequest = z.infer<typeof deletePostRequestSchema>;