import { z } from "zod";
import { idSchema } from "../../_general/models/id";

export const updateWorkerRequestSchema = z.object({
  workerId: idSchema,
  workerName: z.string().min(1),
});

export type UpdateWorkerRequest = z.infer<typeof updateWorkerRequestSchema>;