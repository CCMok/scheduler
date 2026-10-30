import { z } from "zod";

export const updateWorkerAffinityRequestSchema = z.object({
  id: z.number(),
  workerIds: z.array(z.number()).min(2, "至少選擇兩位職員"),
})

export type UpdateWorkerAffinityRequest = z.infer<typeof updateWorkerAffinityRequestSchema>;
