import { z } from "zod";

export const arrangeRosterResponseSchema = z.object({
  day: z.number().int(),
  arrangement: z.record(z.string()),
}).array()

export type ArrangeRosterResponse = z.infer<typeof arrangeRosterResponseSchema>