import { z } from "zod";

export const schArrangeRosterResponseSchema = z.object({
  postId: z.number(),
  timeslots: z.object({
    timeslot: z.string(),
    workerId: z.number().nullish(),
  }).array(),
}).array()

export type SchArrangeRosterResponse = z.infer<typeof schArrangeRosterResponseSchema>