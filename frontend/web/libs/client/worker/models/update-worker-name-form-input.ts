import { z } from "zod";
import { UiMessageContent } from "../../../share/_general/enums/ui-message";

export const updateWorkerNameFormInputSchema = z.object({
  name: z.string().min(1, UiMessageContent.REQUIRED),
})

export type UpdateWorkerNameFormInput = z.infer<typeof updateWorkerNameFormInputSchema>