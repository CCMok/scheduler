import { z } from "zod";

export const updateTeamMaxAssignRequestSchema = z.object({
  id: z.number(),
  /** null = unlimited (no per-roster cap in sch) */
  maxWorkerAssignPerRoster: z.number().int().positive().nullable(),
})

export type UpdateTeamMaxAssignRequest = z.infer<typeof updateTeamMaxAssignRequestSchema>;
