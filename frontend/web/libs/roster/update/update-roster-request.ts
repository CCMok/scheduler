import { z } from "zod";

export const timeslotRequestSchema = z.object({
  id: z.number(),
  assignments: z.object({
    postId: z.number(),
    workerId: z.number().optional(),
  }).array(),
  offWorkerIds: z.number().array(),
})

export type TimeslotRequest = z.infer<typeof timeslotRequestSchema>;

export const updateRosterRequestSchema = z.object({
  id: z.number(),
  name: z.string(),
  timeslots: timeslotRequestSchema.array(),
})

export type UpdateRosterRequest = z.infer<typeof updateRosterRequestSchema>;