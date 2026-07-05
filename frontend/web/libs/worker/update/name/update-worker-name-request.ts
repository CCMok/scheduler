import { z } from "zod";

export const updateWorkerNameRequestSchema = z.object({
  id: z.number(),
  name: z.string().min(1),
})

export type UpdateWorkerNameRequest = z.infer<typeof updateWorkerNameRequestSchema>;
