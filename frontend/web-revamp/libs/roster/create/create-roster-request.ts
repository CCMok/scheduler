import { z } from "zod";

export const timeslotRequestSchema = z.object({
  name: z.string(),
  assignments: z.object({
    postId: z.number(),
    workerId: z.number().optional(),
  }).array(),
  offWorkerIds: z.number().array(),
})

export type TimeslotRequest = z.infer<typeof timeslotRequestSchema>;

export const createRosterRequestSchema = z.object({
  teamId: z.number(),
  name: z.string(),
  timeslots: timeslotRequestSchema.array(),
})

export type CreateRosterRequest = z.infer<typeof createRosterRequestSchema>;