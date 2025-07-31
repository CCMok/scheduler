import { z } from "zod";
import { idSchema } from "../../_general/models/id";

export const getWorkersRequestSchema = z.object({
  departmentId: idSchema,
});

export type GetWorkersRequest = z.infer<typeof getWorkersRequestSchema>;