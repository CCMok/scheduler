import { z } from "zod";
import { idSchema } from "../../_general/models/id";

export const addWorkerRequestSchema = z.object({
  departmentId: idSchema,
  workerName: z.string().min(1),
});

export type AddWorkerRequest = z.infer<typeof addWorkerRequestSchema>;