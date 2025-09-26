import { z } from "zod";
import { idSchema } from "../../_general/models/id";

export const deleteWorkerConstraintRequestSchema = z.object({
  id: idSchema,
});

export type DeleteWorkerConstraintRequest = z.infer<typeof deleteWorkerConstraintRequestSchema>;