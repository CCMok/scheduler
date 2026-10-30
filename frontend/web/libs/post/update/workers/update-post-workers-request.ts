import { z } from "zod";

/** Ordered worker ids: index 0 = most preferred (highest priority). */
export const updatePostWorkersRequestSchema = z.object({
  id: z.number(),
  workers: z.number().array(),
})

export type UpdatePostWorkersRequest = z.infer<typeof updatePostWorkersRequestSchema>;
