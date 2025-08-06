import { z } from "zod";
import { UiMessageContent } from "../../../share/_general/enums/ui-message";

export const createPostFormInputSchema = z.object({
  postName: z.string().min(1, UiMessageContent.REQUIRED),
})

export type CreatePostFormInput = z.infer<typeof createPostFormInputSchema>