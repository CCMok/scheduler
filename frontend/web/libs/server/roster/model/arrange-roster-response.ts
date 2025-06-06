import { z } from "zod";
import { coerceIdSchema, idSchema } from "../../_general/models/id";

export const arrangeRosterResponseSchema = z.object({
  day: idSchema,
  arrangement: z.record(coerceIdSchema, idSchema.nullish()),
}).array()

export type ArrangeRosterResponse = z.infer<typeof arrangeRosterResponseSchema>