import { z } from "zod";

export const createPostRequestSchema = z.object({
  teamId: z.number(),
  name: z.string().min(1),
  workers: z.array(z.number()).transform(val => [...new Set(val)]),
})

export type CreatePostRequest = z.infer<typeof createPostRequestSchema>;
