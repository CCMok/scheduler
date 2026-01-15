import { z } from "zod";

export const autoCreateRosterRequestSchema = z.object({
  teamId: z.number(),
  timeslots: z.string().array(),
  offs: z.object({
    workerId: z.number(),
    timeslots: z.string().array(),
  }).array(),
})

export type AutoCreateRosterRequest = z.infer<typeof autoCreateRosterRequestSchema>;