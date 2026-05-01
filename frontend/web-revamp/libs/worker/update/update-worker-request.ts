import { z } from "zod";

export const updateWorkerRequestSchema = z.object({
  id: z.number(),
  name: z.string().min(1),
})

export type UpdateWorkerRequest = z.infer<typeof updateWorkerRequestSchema>;
