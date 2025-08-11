import { z } from "zod";
import { idSchema } from "../../_general/models/id";

export const updateWorkerNameRequestSchema = z.object({
  id: idSchema,
  name: z.string().min(1),
});

export type UpdateWorkerNameRequest = z.infer<typeof updateWorkerNameRequestSchema>;