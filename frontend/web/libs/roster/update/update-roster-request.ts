import { z } from "zod";
import { timeslotRequestSchema } from "../create/create-roster-request";

/** Same timeslot payload as create — Save replaces all timeslots for the roster. */
export const updateRosterRequestSchema = z.object({
  id: z.number(),
  name: z.string(),
  timeslots: timeslotRequestSchema.array(),
});

export type UpdateRosterRequest = z.infer<typeof updateRosterRequestSchema>;
