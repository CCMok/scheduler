import { z } from "zod";
import { MessageContent } from "@/libs/server/_general/enums/message";

export const createPostFormInputSchema = z.object({
  postName: z.string().min(1, MessageContent.REQUIRED),
})

export type CreatePostFormInput = z.infer<typeof createPostFormInputSchema>