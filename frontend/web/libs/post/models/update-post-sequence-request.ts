import { z } from "zod";
import { idSchema } from "../../_general/models/id";

export const updatePostSequenceRequestSchema = z.object({
  postIds: idSchema.array(),
});

export type UpdatePostSequenceRequest = z.infer<typeof updatePostSequenceRequestSchema>;