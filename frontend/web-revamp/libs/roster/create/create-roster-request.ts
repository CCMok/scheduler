import { z } from "zod";
import { rosterDtoSchema } from "../roster";

export const createRosterRequestSchema = z.object({
  teamId: z.number(),
  name: z.string(),
  rosterDto: rosterDtoSchema,
  offs: z.object({
    workerId: z.number(),
    timeslots: z.string().array(),
  }).array(),
})

export type CreateRosterRequest = z.infer<typeof createRosterRequestSchema>;