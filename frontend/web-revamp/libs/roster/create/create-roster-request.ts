import { z } from "zod";
import { offSchema, rosterItemSchema, timeslotSchema } from "../roster";

export const createRosterRequestSchema = z.object({
  teamId: z.number(),
  name: z.string(),
  timeslots: timeslotSchema.array(),
  roster: rosterItemSchema.array(),
  offs: offSchema.array(),
})

export type CreateRosterRequest = z.infer<typeof createRosterRequestSchema>;