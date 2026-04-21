import { z } from "zod";

export const updateTeamNameRequestSchema = z.object({
  id: z.number(),
  name: z.string().min(1),
})

export type UpdateTeamNameRequest = z.infer<typeof updateTeamNameRequestSchema>;
