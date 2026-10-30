import { z } from "zod";

export const deletePostAffinityRequestSchema = z.object({
  id: z.number(),
})

export type DeletePostAffinityRequest = z.infer<typeof deletePostAffinityRequestSchema>;
