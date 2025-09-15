import { z } from "zod";
import { idSchema } from "../../_general/models/id";
import { createGetRequestWhere } from "../../_general/models/get-request";

const whereSchema = z.object({
  id: idSchema.optional(),
  name: z.string().optional(),
  enum: z.number().optional(),
})

export const getPostConstraintTypesRequestSchema = createGetRequestWhere(whereSchema)

export type GetPostConstraintTypesRequest = z.infer<typeof getPostConstraintTypesRequestSchema>;

