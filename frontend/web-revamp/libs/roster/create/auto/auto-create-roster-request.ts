import { z } from "zod";
import { offSchema, timeslotSchema } from "../../roster";

export const autoCreateRosterRequestSchema = z.object({
  teamId: z.number(),
  timeslots: timeslotSchema.array(),
  offs: offSchema.array(),
})

export type AutoCreateRosterRequest = z.infer<typeof autoCreateRosterRequestSchema>;