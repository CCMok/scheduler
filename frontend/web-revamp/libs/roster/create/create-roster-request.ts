import { z } from "zod";
import { rosterDtoSchema } from "../roster";

export const createRosterRequestSchema = z.object({
  teamId: z.number(),
  name: z.string(),
  rosterDto: rosterDtoSchema,
})

export type CreateRosterRequest = z.infer<typeof createRosterRequestSchema>;