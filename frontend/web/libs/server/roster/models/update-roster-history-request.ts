import { z } from "zod";
import { idSchema } from "../../_general/models/id";
import { createScheduleRequestSchema } from "./create-roster-history-request";

export const createOffWorkerRequestSchema = z.object({
  workerId: z.number(),
  days: z.date().array(),
})

export type CreateOffWorkerRequest = z.infer<typeof createOffWorkerRequestSchema>;

export const updateRosterHistoryRequestSchema = z.object({
  id: idSchema,
  schedules: createScheduleRequestSchema.array(),
  offWorkers: createOffWorkerRequestSchema.array().optional(),
})

export type UpdateRosterHistoryRequest = z.infer<typeof updateRosterHistoryRequestSchema>;