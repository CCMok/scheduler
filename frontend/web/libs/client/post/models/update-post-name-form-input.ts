import { z } from "zod";
import { UiMessageContent } from "../../../share/_general/enums/ui-message";

export const updatePostNameFormInputSchema = z.object({
  name: z.string().min(1, UiMessageContent.REQUIRED),
})

export type UpdatePostNameFormInput = z.infer<typeof updatePostNameFormInputSchema>