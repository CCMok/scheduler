import { z } from "zod";

export const arrangeRosterResponse = z.object({
  day: z.number().int(),
  arrangement: z.record(z.string()),
}).array()

export type ArrangeRosterResponse = z.infer<typeof arrangeRosterResponse>