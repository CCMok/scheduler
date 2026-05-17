import { z } from "zod";

export const updatePostWorkersRequestSchema = z.object({
  id: z.number(),
  workers: z.number().array(),
})

export type UpdatePostWorkersRequest = z.infer<typeof updatePostWorkersRequestSchema>;
