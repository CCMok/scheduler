import { z } from "zod";

export const createWorkerAffinityRequestSchema = z.object({
  teamId: z.number(),
  workerIds: z.array(z.number()).min(2, "至少選擇兩位職員"),
})

export type CreateWorkerAffinityRequest = z.infer<typeof createWorkerAffinityRequestSchema>;
