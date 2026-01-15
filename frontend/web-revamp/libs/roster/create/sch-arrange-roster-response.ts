import { z } from "zod";

export const schArrangeRosterResponseSchema = z.object({
  timeslot: z.string(),
  assignments: z.object({
    postId: z.number(),
    workerId: z.number().nullish(),
  }).array(),
}).array()

export type SchArrangeRosterResponse = z.infer<typeof schArrangeRosterResponseSchema>