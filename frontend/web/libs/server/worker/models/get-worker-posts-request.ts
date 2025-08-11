import { z } from "zod";
import { idSchema } from "../../_general/models/id";

export const getWorkerPostsRequestSchema = z.object({
  id: idSchema,
})

export type GetWorkerPostsRequest = z.infer<typeof getWorkerPostsRequestSchema>;

