import { z } from "zod";
import { idSchema } from "../../_general/models/id";

export const schArrangeRosterResponseSchema = z.object({
  day: idSchema,
  arrangements: z.object({
    postId: idSchema,
    workerId: idSchema.nullish(),
  }).array(),
}).array()

export type SchArrangeRosterResponse = z.infer<typeof schArrangeRosterResponseSchema>