import { z } from "zod";
import { UiMessageContent } from "../../../share/_general/enums/ui-message";

export const addPostFormInputSchema = z.object({
  postName: z.string().min(1, UiMessageContent.REQUIRED),
})

export type AddPostFormInput = z.infer<typeof addPostFormInputSchema>