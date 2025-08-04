import { z } from "zod";
import { UiMessageContent } from "../../../share/_general/enums/ui-message";

export const updatePostFormInputSchema = z.object({
  postName: z.string().min(1, UiMessageContent.REQUIRED),
})

export type UpdatePostFormInput = z.infer<typeof updatePostFormInputSchema>