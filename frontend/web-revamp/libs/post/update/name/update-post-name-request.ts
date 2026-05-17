import { z } from "zod";

export const updatePostNameRequestSchema = z.object({
  id: z.number(),
  name: z.string().min(1),
})

export type UpdatePostNameRequest = z.infer<typeof updatePostNameRequestSchema>;
