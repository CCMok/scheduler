import { z } from "zod";
import { idSchema } from "../../_general/models/id";

export const deleteWorkerRequestSchema = z.object({
  workerId: idSchema,
});

export type DeleteWorkerRequest = z.infer<typeof deleteWorkerRequestSchema>;