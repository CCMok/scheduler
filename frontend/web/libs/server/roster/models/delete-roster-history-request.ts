import { z } from "zod";
import { idSchema } from "../../_general/models/id";

export const deleteRosterHistoryRequestSchema = z.object({
  id: idSchema,
});

export type DeleteRosterHistoryRequest = z.infer<typeof deleteRosterHistoryRequestSchema>;