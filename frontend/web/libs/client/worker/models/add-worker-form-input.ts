import { z } from "zod";
import { UiMessageContent } from "../../../share/_general/enums/ui-message";

export const addWorkerFormInputSchema = z.object({
  workerName: z.string().min(1, UiMessageContent.REQUIRED),
})

export type AddWorkerFormInput = z.infer<typeof addWorkerFormInputSchema>