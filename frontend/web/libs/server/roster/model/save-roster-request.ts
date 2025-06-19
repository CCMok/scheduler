import { z } from "zod";
import { idSchema } from "../../_general/models/id";

export const saveArrangementRequestSchema = z.object({
  postId: idSchema,
  workerId: idSchema,
})

export type SaveArrangementRequest = z.infer<typeof saveArrangementRequestSchema>;

export const saveScheduleRequestSchema = z.object({
  day: z.string().min(1),
  arrangements: saveArrangementRequestSchema.array(),
})

export type SaveScheduleRequest = z.infer<typeof saveScheduleRequestSchema>;

export const saveRosterRequestSchema = z.object({
  departmentId: z.number(),
  schedules: saveScheduleRequestSchema.array(),
})

export type SaveRosterRequest = z.infer<typeof saveRosterRequestSchema>;