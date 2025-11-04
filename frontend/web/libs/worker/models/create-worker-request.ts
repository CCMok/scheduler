import { z } from "zod";
import { idSchema } from "../../_general/models/id";

export const createWorkerRequestSchema = z.object({
  departmentId: idSchema,
  workerName: z.string().min(1),
});

export type CreateWorkerRequest = z.infer<typeof createWorkerRequestSchema>;