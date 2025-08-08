import { z } from "zod";
import { idSchema } from "../../_general/models/id";

export const getPostWorkersRequestSchema = z.object({
  id: idSchema,
})

export type GetPostWorkersRequest = z.infer<typeof getPostWorkersRequestSchema>;

