import { z } from "zod";

export const createWorkerRequestSchema = z.object({
  teamId: z.number(),
  name: z.string().min(1),
  posts: z.array(z.number()).transform(val => [...new Set(val)]),
})

export type CreateWorkerRequest = z.infer<typeof createWorkerRequestSchema>;
