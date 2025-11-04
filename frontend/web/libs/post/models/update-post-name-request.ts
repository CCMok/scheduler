import { z } from "zod";
import { idSchema } from "../../_general/models/id";

export const updatePostNameRequestSchema = z.object({
  id: idSchema,
  name: z.string().min(1),
});

export type UpdatePostNameRequest = z.infer<typeof updatePostNameRequestSchema>;