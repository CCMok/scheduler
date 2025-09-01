import { z } from "zod";
import { UiMessageContent } from "../../../share/_general/enums/ui-message";

export const updateNameFormInputSchema = z.object({
  name: z.string().min(1, UiMessageContent.REQUIRED),
})

export type UpdateNameFormInput = z.infer<typeof updateNameFormInputSchema>