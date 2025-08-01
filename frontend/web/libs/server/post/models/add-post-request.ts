import { z } from "zod";
import { idSchema } from "../../_general/models/id";

export const addPostRequestSchema = z.object({
  departmentId: idSchema,
  postName: z.string().min(1),
});

export type AddPostRequest = z.infer<typeof addPostRequestSchema>;