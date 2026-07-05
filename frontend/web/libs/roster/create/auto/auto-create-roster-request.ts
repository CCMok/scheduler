import { z } from "zod";
import { offPerWorkerSchema, timeslotSchema } from "../../roster";

export const autoCreateRosterRequestSchema = z.object({
  teamId: z.number(),
  timeslots: timeslotSchema.array(),
  offs: offPerWorkerSchema.array(),
})

export type AutoCreateRosterRequest = z.infer<typeof autoCreateRosterRequestSchema>;