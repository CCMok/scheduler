import { z } from "zod";
import { UiMessageContent } from "../../../share/_general/enums/ui-message";

export const workerSettingFormInputSchema = z.object({
  organizationId: z.string().min(1, UiMessageContent.REQUIRED),
  departmentId: z.string().min(1, UiMessageContent.REQUIRED),
})

export type WorkerSettingFormInput = z.infer<typeof workerSettingFormInputSchema>