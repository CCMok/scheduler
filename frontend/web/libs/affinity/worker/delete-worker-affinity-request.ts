import { z } from "zod";

export const deleteWorkerAffinityRequestSchema = z.object({
  id: z.number(),
})

export type DeleteWorkerAffinityRequest = z.infer<typeof deleteWorkerAffinityRequestSchema>;
