import { z } from "zod";
import { idSchema } from "../../_general/models/id";

export const deletePostConstraintRequestSchema = z.object({
  id: idSchema,
});

export type DeletePostConstraintRequest = z.infer<typeof deletePostConstraintRequestSchema>;