import { z } from "zod";
import { offPerWorkerSchema } from "../../roster";

export const autoModifyRosterRequestSchema = z.object({
  rosterId: z.number(),
  offs: offPerWorkerSchema.array(),
})

export type AutoModifyRosterRequest = z.infer<typeof autoModifyRosterRequestSchema>;
