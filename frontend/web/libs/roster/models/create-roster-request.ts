import { z } from "zod";
import { idSchema } from "../../_general/models/id";

export const offRequestSchema = z.object({
  workerId: idSchema,
  days: z.date().array(),
})

export type OffRequest = z.infer<typeof offRequestSchema>;

export const createRosterRequestSchema = z.object({
  departmentId: idSchema,
  days: z.date().array(),
  offs: offRequestSchema.array(),
})

export type CreateRosterRequest = z.infer<typeof createRosterRequestSchema>;