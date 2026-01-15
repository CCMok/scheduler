import { z } from "zod";

export const createRosterRequestSchema = z.object({
  teamId: z.number(),
  posts: z.object({
    postId: z.number(),
    assignments: z.object({
      timeslot: z.string(),
      workerId: z.number().optional(),
    }).array(),
  }).array(),
})

export type CreateRosterRequest = z.infer<typeof createRosterRequestSchema>;