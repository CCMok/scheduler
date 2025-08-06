import { z } from "zod";
import { UiMessageContent } from "../../../share/_general/enums/ui-message";

export const updateWorkerFormInputSchema = z.object({
  workerName: z.string().min(1, UiMessageContent.REQUIRED),
})

export type UpdateWorkerFormInput = z.infer<typeof updateWorkerFormInputSchema>