import { z } from "zod";

export const rosterItemSchema = z.object({
  postId: z.number(),
  assignments: z.object({
    id: z.number(),
    timeslotId: z.number(),
    workerId: z.number().optional(),
  }).array(),
})

export type RosterItem = z.infer<typeof rosterItemSchema>;

export const timeslotSchema = z.object({
  id: z.number(),
  name: z.string(),
})

export type Timeslot = z.infer<typeof timeslotSchema>;

export const offSchema = z.object({
  workerId: z.number(),
  timeslotIds: z.number().array(),
})

export type Off = z.infer<typeof offSchema>;