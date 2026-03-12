import { z } from "zod";
import { rosterDisplaySchema } from "../roster";

export const createRosterRequestSchema = z.object({
  teamId: z.number(),
  name: z.string(),
  roster: rosterDisplaySchema,
  offs: z.object({
    workerId: z.number(),
    timeslots: z.string().array(),
  }).array(),
})

export type CreateRosterRequest = z.infer<typeof createRosterRequestSchema>;