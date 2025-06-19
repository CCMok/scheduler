import { z } from "zod";
import { idSchema } from "../../_general/models/id";

export const saveArrangementRequestSchema = z.object({
  postId: idSchema,
  workerId: idSchema.nullish(),
})

export type SaveArrangementRequest = z.infer<typeof saveArrangementRequestSchema>;

export const saveScheduleRequestSchema = z.object({
  day: z.number(),
  arrangements: saveArrangementRequestSchema.array(),
})

export type SaveScheduleRequest = z.infer<typeof saveScheduleRequestSchema>;

export const saveRosterRequestSchema = z.object({
  departmentId: idSchema,
  schedules: saveScheduleRequestSchema.array(),
})

export type SaveRosterRequest = z.infer<typeof saveRosterRequestSchema>;