import { z } from "zod";
import { idSchema } from "../../_general/models/id";

export const getPostNameRequestSchema = z.object({
  id: idSchema,
})

export type GetPostNameRequest = z.infer<typeof getPostNameRequestSchema>;

