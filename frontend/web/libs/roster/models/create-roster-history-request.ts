import { z } from "zod";
import { idSchema } from "../../_general/models/id";

export const createArrangementRequestSchema = z.object({
  postId: idSchema,
  workerId: idSchema.nullish(),
})

export type CreateArrangementRequest = z.infer<typeof createArrangementRequestSchema>;

export const createScheduleRequestSchema = z.object({
  day: z.date(),
  arrangements: createArrangementRequestSchema.array(),
})

export type CreateScheduleRequest = z.infer<typeof createScheduleRequestSchema>;

export const offRequestSchema = z.object({
  workerId: idSchema,
  days: z.date().array(),
})

export const createRosterHistoryRequestSchema = z.object({
  departmentId: idSchema,
  schedules: createScheduleRequestSchema.array(),
  offs: offRequestSchema.array(),
})

export type CreateRosterHistoryRequest = z.infer<typeof createRosterHistoryRequestSchema>;