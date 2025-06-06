import { z } from "zod";
import { coerceIdSchema, idSchema } from "../../_general/models/id";

export const schArrangeRosterResponseSchema = z.object({
  day: idSchema,
  arrangement: z.record(coerceIdSchema, idSchema.nullish()),
}).array()

export type SchArrangeRosterResponse = z.infer<typeof schArrangeRosterResponseSchema>