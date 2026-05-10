import { z } from "zod";
import { WorkerStatus } from "../../worker-status";

export const updateWorkerStatusRequestSchema = z.object({
  id: z.number(),
  status: z.enum(WorkerStatus),
})

export type UpdateWorkerStatusRequest = z.infer<typeof updateWorkerStatusRequestSchema>;
