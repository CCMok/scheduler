import { z } from "zod";

export const createTeamRequestSchema = z.object({
  name: z.string().trim().min(1),
  posts: z.array(z.object({
    name: z.string().trim().min(1),
  })),
  workers: z.array(z.object({
    name: z.string().trim().min(1),
    posts: z.array(z.number().int().nonnegative()).transform(val => [...new Set(val)]),
  })),
})

export type CreateTeamRequest = z.infer<typeof createTeamRequestSchema>;