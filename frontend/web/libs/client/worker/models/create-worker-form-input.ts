import { z } from "zod";
import { UiMessageContent } from "../../../share/_general/enums/ui-message";

export const createWorkerFormInputSchema = z.object({
  name: z.string().min(1, UiMessageContent.REQUIRED),
})

export type CreateWorkerFormInput = z.infer<typeof createWorkerFormInputSchema>